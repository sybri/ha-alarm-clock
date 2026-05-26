"""State machine and scheduling for a Smart Alarm config entry."""

from __future__ import annotations

from datetime import datetime, time, timedelta
import logging
from typing import Any, Callable

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import (
    CALLBACK_TYPE,
    Event,
    HomeAssistant,
    callback,
)
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_state_change_event,
    async_track_time_change,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    CONF_CONDITION_ENTITY,
    CONF_DAYS,
    CONF_NAME,
    CONF_SNOOZE_DURATION,
    CONF_START_SCRIPT,
    CONF_STOP_SCRIPT,
    CONF_TIME,
    DEFAULT_DAYS,
    DEFAULT_SNOOZE_DURATION,
    DEFAULT_TIME,
    DOMAIN,
    EVENT_DATA_ALARM_ID,
    EVENT_DATA_NAME,
    EVENT_DATA_NEXT_TRIGGER,
    EVENT_DATA_REASON,
    EVENT_DATA_SNOOZE_COUNT,
    EVENT_DATA_TIME,
    EVENT_SNOOZED,
    EVENT_STOPPED,
    EVENT_TRIGGERED,
    STATE_DISABLED,
    STATE_IDLE,
    STATE_SNOOZED,
    STATE_TRIGGERED,
    STOP_REASON_AUTO,
    STOP_REASON_MANUAL,
    STOP_REASON_SNOOZE,
    STORAGE_KEY_PREFIX,
    STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)


class SmartAlarmCoordinator:
    """State + scheduler for a single alarm."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self._store: Store = Store(
            hass,
            STORAGE_VERSION,
            f"{STORAGE_KEY_PREFIX}.{entry.entry_id}",
        )

        # Listeners notified on state updates (entity refresh).
        self._listeners: list[Callable[[], None]] = []

        # Runtime state (will be overwritten by async_load).
        self._state: str = STATE_IDLE
        self._next_trigger: datetime | None = None
        self._snooze_count: int = 0

        # Active timers / subscriptions.
        self._unsub_recurring: CALLBACK_TYPE | None = None
        self._unsub_snooze: CALLBACK_TYPE | None = None
        self._unsub_script_off: CALLBACK_TYPE | None = None

    # ------------------------------------------------------------------
    # Public properties
    # ------------------------------------------------------------------

    @property
    def state(self) -> str:
        return self._state

    @property
    def next_trigger(self) -> datetime | None:
        return self._next_trigger

    @property
    def snooze_count(self) -> int:
        return self._snooze_count

    @property
    def name(self) -> str:
        return self.entry.data.get(CONF_NAME, self.entry.title)

    @property
    def alarm_id(self) -> str:
        return self.entry.unique_id or self.entry.entry_id

    @property
    def time(self) -> str:
        return self.entry.data.get(CONF_TIME, DEFAULT_TIME)

    @property
    def days_active(self) -> list[int]:
        return list(self.entry.data.get(CONF_DAYS, DEFAULT_DAYS))

    @property
    def start_script(self) -> str:
        return self.entry.data.get(CONF_START_SCRIPT, "")

    @property
    def stop_script(self) -> str | None:
        return self.entry.data.get(CONF_STOP_SCRIPT) or None

    @property
    def condition_entity(self) -> str | None:
        return self.entry.options.get(CONF_CONDITION_ENTITY) or None

    @property
    def snooze_duration(self) -> int:
        return int(
            self.entry.options.get(CONF_SNOOZE_DURATION, DEFAULT_SNOOZE_DURATION)
        )

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    async def async_load(self) -> None:
        """Restore from storage and arm scheduler accordingly."""
        data = await self._store.async_load() or {}
        self._state = data.get("state", STATE_IDLE)
        next_iso = data.get("next_trigger")
        self._next_trigger = (
            dt_util.parse_datetime(next_iso) if next_iso else None
        )
        self._snooze_count = int(data.get("snooze_count", 0))

        # On restart, never restore "triggered" — the script run was lost.
        if self._state == STATE_TRIGGERED:
            self._state = STATE_IDLE

        # Re-arm based on restored state.
        if self._state == STATE_DISABLED:
            self._next_trigger = None
        elif self._state == STATE_SNOOZED and self._next_trigger:
            # Was snoozed and not yet fired — restore the one-shot.
            if self._next_trigger > dt_util.utcnow():
                self._arm_snooze_at(self._next_trigger)
            else:
                # Snooze time already passed during downtime → fire now logic.
                self._state = STATE_IDLE
                self._next_trigger = None
        if self._state == STATE_IDLE:
            self._arm_recurring()
            self._recompute_next_trigger()

        await self.async_save()

    async def async_save(self) -> None:
        """Persist runtime state."""
        await self._store.async_save(
            {
                "state": self._state,
                "next_trigger": (
                    self._next_trigger.isoformat() if self._next_trigger else None
                ),
                "snooze_count": self._snooze_count,
            }
        )

    async def async_shutdown(self) -> None:
        """Cancel all timers."""
        self._cancel_recurring()
        self._cancel_snooze()
        self._cancel_script_off()
        self._listeners.clear()

    # ------------------------------------------------------------------
    # Listener notification
    # ------------------------------------------------------------------

    @callback
    def async_add_listener(self, cb: Callable[[], None]) -> CALLBACK_TYPE:
        self._listeners.append(cb)

        def _unsub() -> None:
            if cb in self._listeners:
                self._listeners.remove(cb)

        return _unsub

    @callback
    def async_update_listeners(self) -> None:
        for cb in list(self._listeners):
            cb()

    # ------------------------------------------------------------------
    # Public mutators (used by services in Phase 3 and config update)
    # ------------------------------------------------------------------

    async def async_enable(self) -> None:
        """Enable the alarm."""
        if self._state == STATE_TRIGGERED:
            return
        self._state = STATE_IDLE
        self._snooze_count = 0
        self._cancel_snooze()
        self._arm_recurring()
        self._recompute_next_trigger()
        await self.async_save()
        self.async_update_listeners()

    async def async_disable(self) -> None:
        """Disable the alarm completely."""
        self._state = STATE_DISABLED
        self._next_trigger = None
        self._snooze_count = 0
        self._cancel_recurring()
        self._cancel_snooze()
        self._cancel_script_off()
        await self.async_save()
        self.async_update_listeners()

    async def async_set_time(self, new_time: str) -> None:
        """Update time and re-arm."""
        await self._update_data({CONF_TIME: new_time})
        self._rearm()

    async def async_set_days(self, days: list[int]) -> None:
        """Update active days and re-arm."""
        await self._update_data({CONF_DAYS: sorted(set(int(d) for d in days))})
        self._rearm()

    async def async_trigger_now(self) -> None:
        """Force immediate trigger (test button)."""
        await self._fire_trigger(force=True)

    async def async_snooze(self) -> None:
        """Snooze the active alarm."""
        if self._state not in (STATE_TRIGGERED, STATE_SNOOZED):
            return
        await self._stop_scripts(STOP_REASON_SNOOZE)
        self._snooze_count += 1
        snooze_until = dt_util.utcnow() + timedelta(seconds=self.snooze_duration)
        self._state = STATE_SNOOZED
        self._next_trigger = snooze_until
        self._cancel_snooze()
        self._arm_snooze_at(snooze_until)
        await self.async_save()
        self.async_update_listeners()
        self.hass.bus.async_fire(
            EVENT_SNOOZED,
            {
                EVENT_DATA_ALARM_ID: self.alarm_id,
                EVENT_DATA_NAME: self.name,
                EVENT_DATA_NEXT_TRIGGER: snooze_until.isoformat(),
                EVENT_DATA_SNOOZE_COUNT: self._snooze_count,
            },
        )

    async def async_stop(self, reason: str = STOP_REASON_MANUAL) -> None:
        """Stop the currently-firing alarm."""
        if self._state not in (STATE_TRIGGERED, STATE_SNOOZED):
            return
        await self._stop_scripts(reason)
        self._snooze_count = 0
        self._cancel_snooze()
        self._cancel_script_off()
        self._state = STATE_IDLE
        self._recompute_next_trigger()
        await self.async_save()
        self.async_update_listeners()
        self.hass.bus.async_fire(
            EVENT_STOPPED,
            {
                EVENT_DATA_ALARM_ID: self.alarm_id,
                EVENT_DATA_NAME: self.name,
                EVENT_DATA_REASON: reason,
            },
        )

    # ------------------------------------------------------------------
    # Internals
    # ------------------------------------------------------------------

    async def _update_data(self, fields: dict[str, Any]) -> None:
        new_data = {**self.entry.data, **fields}
        self.hass.config_entries.async_update_entry(self.entry, data=new_data)

    def _rearm(self) -> None:
        """Re-arm recurring + recompute next trigger after a config change."""
        if self._state == STATE_DISABLED:
            return
        self._cancel_recurring()
        self._arm_recurring()
        self._recompute_next_trigger()
        self.hass.async_create_task(self.async_save())
        self.async_update_listeners()

    def _parse_time(self) -> time:
        h, m = (int(x) for x in self.time.split(":"))
        return time(hour=h, minute=m)

    @callback
    def _recompute_next_trigger(self) -> None:
        """Compute the next datetime when this alarm should fire."""
        if self._state in (STATE_DISABLED, STATE_TRIGGERED, STATE_SNOOZED):
            return
        if not self.days_active:
            self._next_trigger = None
            return

        t = self._parse_time()
        now = dt_util.now()
        for offset in range(0, 8):
            candidate_date = (now + timedelta(days=offset)).date()
            # Python weekday(): Monday=0..Sunday=6 (matches our convention).
            day_index = candidate_date.weekday()
            if day_index not in self.days_active:
                continue
            candidate = dt_util.as_local(
                datetime.combine(candidate_date, t).replace(
                    tzinfo=now.tzinfo
                )
            )
            if candidate > now:
                self._next_trigger = dt_util.as_utc(candidate)
                return
        self._next_trigger = None

    # Recurring time_change ----------------------------------------------

    @callback
    def _arm_recurring(self) -> None:
        if self._unsub_recurring is not None:
            return
        t = self._parse_time()
        self._unsub_recurring = async_track_time_change(
            self.hass,
            self._on_recurring_fire,
            hour=t.hour,
            minute=t.minute,
            second=0,
        )

    @callback
    def _cancel_recurring(self) -> None:
        if self._unsub_recurring is not None:
            self._unsub_recurring()
            self._unsub_recurring = None

    async def _on_recurring_fire(self, now: datetime) -> None:
        """Recurring time fired."""
        if self._state != STATE_IDLE:
            return
        day_index = dt_util.as_local(now).weekday()
        if day_index not in self.days_active:
            return
        await self._fire_trigger(force=False)

    # Snooze one-shot ----------------------------------------------------

    @callback
    def _arm_snooze_at(self, dt: datetime) -> None:
        self._cancel_snooze()
        self._unsub_snooze = async_track_point_in_time(
            self.hass, self._on_snooze_fire, dt
        )

    @callback
    def _cancel_snooze(self) -> None:
        if self._unsub_snooze is not None:
            self._unsub_snooze()
            self._unsub_snooze = None

    async def _on_snooze_fire(self, now: datetime) -> None:
        """Snooze elapsed → re-fire trigger."""
        self._unsub_snooze = None
        if self._state != STATE_SNOOZED:
            return
        await self._fire_trigger(force=True)

    # Trigger ------------------------------------------------------------

    async def _fire_trigger(self, *, force: bool) -> None:
        """Transition into the `triggered` state and run start_script."""
        if not force and not self._condition_ok():
            _LOGGER.info(
                "smart_alarm %s skipped (condition_entity %s not 'on')",
                self.name,
                self.condition_entity,
            )
            self._recompute_next_trigger()
            await self.async_save()
            self.async_update_listeners()
            return

        if not self.start_script:
            _LOGGER.error("smart_alarm %s has no start_script configured", self.name)
            return

        self._state = STATE_TRIGGERED
        await self.async_save()
        self.async_update_listeners()

        # Listen for the script to finish (its state goes back to 'off').
        self._arm_script_off_listener()

        # Fire event.
        self.hass.bus.async_fire(
            EVENT_TRIGGERED,
            {
                EVENT_DATA_ALARM_ID: self.alarm_id,
                EVENT_DATA_NAME: self.name,
                EVENT_DATA_TIME: self.time,
            },
        )

        # Call the start_script.
        await self.hass.services.async_call(
            "script",
            "turn_on",
            {"entity_id": self.start_script},
            blocking=False,
        )

    def _condition_ok(self) -> bool:
        if not self.condition_entity:
            return True
        state = self.hass.states.get(self.condition_entity)
        if state is None:
            _LOGGER.warning(
                "Condition entity %s missing — skipping alarm %s",
                self.condition_entity,
                self.name,
            )
            return False
        return state.state == "on"

    # Auto-stop on script finish -----------------------------------------

    @callback
    def _arm_script_off_listener(self) -> None:
        self._cancel_script_off()
        if not self.start_script:
            return
        self._unsub_script_off = async_track_state_change_event(
            self.hass,
            [self.start_script],
            self._on_script_state_change,
        )

    @callback
    def _cancel_script_off(self) -> None:
        if self._unsub_script_off is not None:
            self._unsub_script_off()
            self._unsub_script_off = None

    async def _on_script_state_change(self, event: Event) -> None:
        new = event.data.get("new_state")
        old = event.data.get("old_state")
        if new is None or old is None:
            return
        if old.state == "on" and new.state == "off" and self._state == STATE_TRIGGERED:
            # Script ended naturally → auto-stop.
            self._cancel_script_off()
            self._snooze_count = 0
            self._state = STATE_IDLE
            self._recompute_next_trigger()
            await self.async_save()
            self.async_update_listeners()
            self.hass.bus.async_fire(
                EVENT_STOPPED,
                {
                    EVENT_DATA_ALARM_ID: self.alarm_id,
                    EVENT_DATA_NAME: self.name,
                    EVENT_DATA_REASON: STOP_REASON_AUTO,
                },
            )

    # Stop helpers -------------------------------------------------------

    async def _stop_scripts(self, reason: str) -> None:
        """Turn off start_script and optionally call stop_script."""
        self._cancel_script_off()
        if self.start_script:
            await self.hass.services.async_call(
                "script",
                "turn_off",
                {"entity_id": self.start_script},
                blocking=False,
            )
        if reason != STOP_REASON_SNOOZE:
            # When snoozing we don't call stop_script, only when truly stopping.
            # Spec decision: snooze == stop + restart, so it DOES call stop too.
            # We treat both the same.
            pass
        if self.stop_script:
            await self.hass.services.async_call(
                "script",
                "turn_on",
                {"entity_id": self.stop_script},
                blocking=False,
            )
