"""Sensor entity for a Smart Alarm."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    ATTR_CONDITION_ENTITY,
    ATTR_NEXT_DAY,
    ATTR_NEXT_TRIGGER,
    ATTR_SCHEDULE,
    ATTR_SNOOZE_COUNT,
    ATTR_SNOOZE_DURATION,
    ATTR_START_SCRIPT,
    ATTR_STOP_SCRIPT,
    DOMAIN,
)
from .coordinator import SmartAlarmCoordinator


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the sensor platform from a config entry."""
    coordinator: SmartAlarmCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([SmartAlarmEntity(coordinator, entry)])


class SmartAlarmEntity(SensorEntity):
    """Representation of a Smart Alarm."""

    _attr_has_entity_name = False
    _attr_should_poll = False
    _attr_icon = "mdi:alarm"

    def __init__(
        self, coordinator: SmartAlarmCoordinator, entry: ConfigEntry
    ) -> None:
        """Initialize the entity."""
        self._coordinator = coordinator
        self._entry = entry
        self._attr_unique_id = entry.unique_id
        self._attr_name = entry.title
        # Domain `sensor` + suggested object id keeps entity_id stable
        self._attr_suggested_object_id = f"smart_alarm_{self._slug()}"

    def _slug(self) -> str:
        return (self._entry.unique_id or "").removeprefix(f"{DOMAIN}_") or "alarm"

    @property
    def native_value(self) -> str:
        """Return the current state value (disabled/idle/triggered/snoozed)."""
        return self._coordinator.state

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return entity attributes."""
        c = self._coordinator
        next_ts = c.next_trigger.isoformat() if c.next_trigger else None
        return {
            ATTR_SCHEDULE: c.schedule,
            ATTR_NEXT_TRIGGER: next_ts,
            ATTR_NEXT_DAY: c.next_day,
            ATTR_CONDITION_ENTITY: c.condition_entity,
            ATTR_START_SCRIPT: c.start_script,
            ATTR_STOP_SCRIPT: c.stop_script,
            ATTR_SNOOZE_DURATION: c.snooze_duration,
            ATTR_SNOOZE_COUNT: c.snooze_count,
        }

    async def async_added_to_hass(self) -> None:
        """Subscribe to coordinator updates."""
        self.async_on_remove(self._coordinator.async_add_listener(self._on_update))

    @callback
    def _on_update(self) -> None:
        """Handle coordinator state change."""
        self.async_write_ha_state()
