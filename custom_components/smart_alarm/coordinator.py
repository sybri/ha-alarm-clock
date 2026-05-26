"""State machine and scheduling for a Smart Alarm config entry.

Model: per-day schedule. ``schedule`` is a dict mapping weekday (string "0"
= Monday .. "6" = Sunday) to "HH:MM", or None / missing when that day is off.

The scheduler uses a single one-shot ``async_track_point_in_time`` for the
next occurrence, re-armed after each fire / stop / snooze. This naturally
supports a different time per day.
"""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import Callable

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
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    CONF_CONDITION_ENTITY,
    CONF_DAYS,
    CONF_NAME,
    CONF_SCHEDULE,
    CONF_SNOOZE_DURATION,
    CONF_START_SCRIPT,
    CONF_STOP_SCRIPT,
    CONF_TIME,
    DEFAULT_SNOOZE_DURATION,
    DEFAULT_TIME,
    EVENT_DATA_ALARM_ID,
    EVENT_DATA_DAY,
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
    """State + per-day scheduler for a single alarm."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self._store: Store = Store(
            hass,
            STORAGE_VERSION,
            f"{STORAGE_KEY_PREFIX}.{entry.entry_id}",
        )

        self._listeners: list[Callable[[], None]] = []

        self._state: str = STATE_IDLE
        self._next_trigger: datetime | None = None
        self._next_day: int | None = None
        self._snooze_count: int = 0

        self._unsub_next: CALLBACK_TYPE | None = None
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
    def next_day(self) -> int | None:
        return self._next_day

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
    def schedule(self) -> dict[str, str | None]:
        """Return the per-day schedule {"0".."6": "HH:MM" | None}."""
        return dict(self.entry.data.get(CONF_SCHEDULE, {}))

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
        """Migrate legacy data, restore runtime state, arm scheduler."""
        await self._migrate_legacy_schedule()

        data = await self._store.async_load() or {}
        self._state = data.get("state", STATE_IDLE)
        next_iso = data.get("next_trigger")
        self._next_trigger = dt_util.parse_datetime(next_iso) if next_iso else None
        self._snooze_count = int(data.get("snooze_count", 0))

        # Never restore "triggered" after a restart (the script run was lost).
        if self._state == STATE_TRIGGERED:
            self._state = STATE_IDLE

        if self._state == STATE_DISABLED:
            self._next_trigger = None
            self._next_day = None
        elif self._state == STATE_SNOOZED and self._next_trigger:
            if self._next_trigger > dt_util.utcnow():
                self._arm_snooze_at(self._next_trigger)
            else:
                self._state = STATE_IDLE

        if self._state == STATE_IDLE:
            self._arm_next()

        await self.async_save()

    async def _migrate_legacy_schedule(self) -> None:
        """Convert legacy ``time`` + ``days_active`` into a ``schedule`` dict."""
        if CONF_SCHEDULE in self.entry.data:
            return
        legacy_time = self.entry.data.get(CONF_TIME, DEFAULT_TIME)
        legacy_days = self.entry.data.get(CONF_DAYS, [])
        schedule = {str(d): legacy_time for d in legacy_days}
        new_data = {**self.entry.data, CONF_SCHEDULE: schedule}
        new_data.pop(CONF_TIME, None)
        new_data.pop(CONF_DAYS, None)
        self.hass.config_entries.async_update_entry(self.entry, data=new_data)
        _LOGGER.info(
            "smart_alarm %s migrated legacy time/days_active to schedule %s",
            self.name,
            schedule,
        )

    async def async_save(self) -> None:
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
        self._cancel_next()
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
    # Public mutators
    # ------------------------------------------------------------------

    async def async_enable(self) -> None:
        if self._state == STATE_TRIGGERED:
            return
        self._state = STATE_IDLE
        self._snooze_count = 0
        self._cancel_snooze()
        self._arm_next()
        await self.async_save()
        self.async_update_listeners()

    async def async_disable(self) -> None:
        self._state = STATE_DISABLED
        self._next_trigger = None
        self._next_day = None
        self._snooze_count = 0
        self._cancel_next()
        self._cancel_snooze()
        self._cancel_script_off()
        await self.async_save()
        self.async_update_listeners()

    async def async_set_day_time(self, day: int, new_time: str) -> None:
        """Set (and enable) the alarm time for one weekday (0=Mon..6=Sun)."""
        schedule = self.schedule
        schedule[str(day)] = new_time
        await self._update_schedule(schedule)

    async def async_clear_day(self, day: int) -> None:
        """Disable the alarm for one weekday."""
        schedule = self.schedule
        schedule.pop(str(day), None)
        await self._update_schedule(schedule)

    async def async_trigger_now(self) -> None:
        await self._fire_trigger(force=True)

    async def async_snooze(self) -> None:
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
        if self._state not in (STATE_TRIGGERED, STATE_SNOOZED):
            return
        await self._stop_scripts(reason)
        self._snooze_count = 0
        self._cancel_snooze()
        self._cancel_script_off()
        self._state = STATE_IDLE
        self._arm_next()
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

    async def _update_schedule(self, schedule: dict[str, str | None]) -> None:
        # Drop None/empty entries to keep storage clean.
        clean = {k: v for k, v in schedule.items() if v}
        new_data = {**self.entry.data, CONF_SCHEDULE: clean}
        self.hass.config_entries.async_update_entry(self.entry, data=new_data)
        if self._state == STATE_IDLE:
            self._arm_next()
        self.async_update_listeners()

    @callback
    def _recompute_next_trigger(self) -> None:
        """Find the next datetime to fire across the 8 upcoming days."""
        self._next_trigger = None
        self._next_day = None
        if self._state in (STATE_DISABLED, STATE_TRIGGERED, STATE_SNOOZED):
            return

        schedule = self.schedule
        if not schedule:
            return

        now = dt_util.now()
        for offset in range(0, 8):
            d = now + timedelta(days=offset)
            wd = d.weekday()
            t_str = schedule.get(str(wd))
            if not t_str:
                continue
            try:
                hour, minute = (int(x) for x in t_str.split(":"))
            except ValueError:
                continue
            candidate = dt_util.as_local(
                datetime.combine(d.date(), datetime.min.time()).replace(
                    hour=hour, minute=minute, tzinfo=now.tzinfo
                )
            )
            if candidate > now:
                self._next_trigger = dt_util.as_utc(candidate)
                self._next_day = wd
                return

    # One-shot next-occurrence timer ------------------------------------

    @callback
    def _arm_next(self) -> None:
        self._cancel_next()
        self._recompute_next_trigger()
        if self._next_trigger is not None:
            self._unsub_next = async_track_point_in_time(
                self.hass, self._on_next_fire, self._next_trigger
            )

    @callback
    def _cancel_next(self) -> None:
        if self._unsub_next is not None:
            self._unsub_next()
            self._unsub_next = None

    async def _on_next_fire(self, _now: datetime) -> None:
        self._unsub_next = None
        if self._state != STATE_IDLE:
            return
        await self._fire_trigger(force=False)

    # Snooze one-shot ----------------------------------------------------

    @callback
    def _arm_snooze_at(self, when: datetime) -> None:
        self._cancel_snooze()
        self._unsub_snooze = async_track_point_in_time(
            self.hass, self._on_snooze_fire, when
        )

    @callback
    def _cancel_snooze(self) -> None:
        if self._unsub_snooze is not None:
            self._unsub_snooze()
            self._unsub_snooze = None

    async def _on_snooze_fire(self, _now: datetime) -> None:
        self._unsub_snooze = None
        if self._state != STATE_SNOOZED:
            return
        await self._fire_trigger(force=True)

    # Trigger ------------------------------------------------------------

    async def _fire_trigger(self, *, force: bool) -> None:
        if not force and not self._condition_ok():
            _LOGGER.info(
                "smart_alarm %s skipped (condition_entity %s not 'on')",
                self.name,
                self.condition_entity,
            )
            self._arm_next()
            await self.async_save()
            self.async_update_listeners()
            return

        if not self.start_script:
            _LOGGER.error("smart_alarm %s has no start_script configured", self.name)
            return

        fired_day = self._next_day
        self._state = STATE_TRIGGERED
        await self.async_save()
        self.async_update_listeners()

        self._arm_script_off_listener()

        self.hass.bus.async_fire(
            EVENT_TRIGGERED,
            {
                EVENT_DATA_ALARM_ID: self.alarm_id,
                EVENT_DATA_NAME: self.name,
                EVENT_DATA_DAY: fired_day,
                EVENT_DATA_TIME: (
                    self.schedule.get(str(fired_day))
                    if fired_day is not None
                    else None
                ),
            },
        )

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
            self._cancel_script_off()
            self._snooze_count = 0
            self._state = STATE_IDLE
            self._arm_next()
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

    async def _stop_scripts(self, _reason: str) -> None:
        self._cancel_script_off()
        if self.start_script:
            await self.hass.services.async_call(
                "script",
                "turn_off",
                {"entity_id": self.start_script},
                blocking=False,
            )
        if self.stop_script:
            await self.hass.services.async_call(
                "script",
                "turn_on",
                {"entity_id": self.stop_script},
                blocking=False,
            )
