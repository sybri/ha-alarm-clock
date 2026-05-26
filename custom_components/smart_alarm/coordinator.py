"""State and scheduling for a Smart Alarm config entry.

Phase 1: skeleton (storage load/save, properties, listeners).
Phase 2 will add async_track_time_change, next_trigger calculation,
start_script auto-stop detection, etc.
"""

from __future__ import annotations

from datetime import datetime
import logging
from typing import Any, Callable

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.storage import Store

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
    STATE_IDLE,
    STORAGE_KEY_PREFIX,
    STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)


class SmartAlarmCoordinator:
    """Coordinator for a single alarm config entry."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self._store: Store = Store(
            hass,
            STORAGE_VERSION,
            f"{STORAGE_KEY_PREFIX}.{entry.entry_id}",
        )
        self._listeners: list[CALLBACK_TYPE] = []

        # Runtime state (defaults; overwritten by async_load)
        self._state: str = STATE_IDLE
        self._next_trigger: datetime | None = None
        self._snooze_count: int = 0

    # ------------------------------------------------------------------
    # Public properties read by sensor.SmartAlarmEntity
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

    # Static config (from entry.data / entry.options)

    @property
    def name(self) -> str:
        return self.entry.data.get(CONF_NAME, self.entry.title)

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
        return int(self.entry.options.get(CONF_SNOOZE_DURATION, DEFAULT_SNOOZE_DURATION))

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    async def async_load(self) -> None:
        """Restore runtime state from storage."""
        data = await self._store.async_load() or {}
        self._state = data.get("state", STATE_IDLE)
        next_iso = data.get("next_trigger")
        self._next_trigger = datetime.fromisoformat(next_iso) if next_iso else None
        self._snooze_count = int(data.get("snooze_count", 0))

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
        """Clean up resources on entry unload."""
        for unsub in self._listeners:
            unsub()
        self._listeners.clear()

    # ------------------------------------------------------------------
    # Listener notification (sensor entity subscribes)
    # ------------------------------------------------------------------

    @callback
    def async_add_listener(self, update_callback: Callable[[], None]) -> CALLBACK_TYPE:
        """Register a callback for state updates."""

        def _unsub() -> None:
            try:
                self._listeners_callbacks.remove(update_callback)
            except (ValueError, AttributeError):
                pass

        if not hasattr(self, "_listeners_callbacks"):
            self._listeners_callbacks: list[Callable[[], None]] = []
        self._listeners_callbacks.append(update_callback)
        return _unsub

    @callback
    def async_update_listeners(self) -> None:
        """Notify all listeners."""
        for cb in getattr(self, "_listeners_callbacks", []):
            cb()

    # ------------------------------------------------------------------
    # Mutators (used by services in Phase 3 and Phase 2 scheduler).
    # ------------------------------------------------------------------

    async def async_set_state(self, new_state: str) -> None:
        """Update the runtime state, persist, and notify listeners."""
        if self._state == new_state:
            return
        self._state = new_state
        await self.async_save()
        self.async_update_listeners()

    async def async_set_next_trigger(self, dt: datetime | None) -> None:
        """Update next_trigger, persist, and notify."""
        self._next_trigger = dt
        await self.async_save()
        self.async_update_listeners()

    async def async_set_snooze_count(self, count: int) -> None:
        """Update snooze_count, persist, and notify."""
        self._snooze_count = count
        await self.async_save()
        self.async_update_listeners()

    # Config mutators (write through to ConfigEntry.data).

    async def async_update_data(self, **kwargs: Any) -> None:
        """Update entry.data fields (time, days_active, etc.)."""
        new_data = {**self.entry.data, **kwargs}
        self.hass.config_entries.async_update_entry(self.entry, data=new_data)
        self.async_update_listeners()
