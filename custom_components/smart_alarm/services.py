"""Service registration for Smart Alarm."""

from __future__ import annotations

import logging
import re
from typing import Iterable

import voluptuous as vol
from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv, entity_registry as er

from .const import (
    DOMAIN,
    SERVICE_CLEAR_DAY,
    SERVICE_DISABLE,
    SERVICE_ENABLE,
    SERVICE_SET_DAY_TIME,
    SERVICE_SNOOZE,
    SERVICE_STOP,
    SERVICE_TRIGGER_NOW,
)
from .coordinator import SmartAlarmCoordinator

_LOGGER = logging.getLogger(__name__)

_TIME_RE = re.compile(r"^([01]\d|2[0-3]):([0-5]\d)$")

ATTR_TIME = "time"
ATTR_DAY = "day"

_BASE_SCHEMA = vol.Schema(
    {vol.Required(ATTR_ENTITY_ID): cv.entity_id},
    extra=vol.ALLOW_EXTRA,
)

_SET_DAY_TIME_SCHEMA = _BASE_SCHEMA.extend(
    {
        vol.Required(ATTR_DAY): vol.All(vol.Coerce(int), vol.Range(min=0, max=6)),
        vol.Required(ATTR_TIME): vol.All(str, vol.Match(_TIME_RE)),
    }
)

_CLEAR_DAY_SCHEMA = _BASE_SCHEMA.extend(
    {vol.Required(ATTR_DAY): vol.All(vol.Coerce(int), vol.Range(min=0, max=6))}
)


def _resolve_coordinator(
    hass: HomeAssistant, entity_id: str
) -> SmartAlarmCoordinator:
    """Find the coordinator whose sensor entity matches entity_id."""
    registry = er.async_get(hass)
    entry = registry.async_get(entity_id)
    if entry is None or entry.platform != DOMAIN:
        raise HomeAssistantError(f"{entity_id} is not a smart_alarm entity")
    coordinators: dict[str, SmartAlarmCoordinator] = hass.data.get(DOMAIN, {})
    coord = coordinators.get(entry.config_entry_id)
    if coord is None:
        raise HomeAssistantError(
            f"No active Smart Alarm coordinator for {entity_id}"
        )
    return coord


def _coordinators_for_call(
    hass: HomeAssistant, call: ServiceCall
) -> Iterable[SmartAlarmCoordinator]:
    ids = call.data.get(ATTR_ENTITY_ID)
    if isinstance(ids, str):
        ids = [ids]
    for entity_id in ids or []:
        yield _resolve_coordinator(hass, entity_id)


@callback
def async_register_services(hass: HomeAssistant) -> None:
    """Register all Smart Alarm services."""

    async def _enable(call: ServiceCall) -> None:
        for coord in _coordinators_for_call(hass, call):
            await coord.async_enable()

    async def _disable(call: ServiceCall) -> None:
        for coord in _coordinators_for_call(hass, call):
            await coord.async_disable()

    async def _set_day_time(call: ServiceCall) -> None:
        day = int(call.data[ATTR_DAY])
        time_value = call.data[ATTR_TIME]
        for coord in _coordinators_for_call(hass, call):
            await coord.async_set_day_time(day, time_value)

    async def _clear_day(call: ServiceCall) -> None:
        day = int(call.data[ATTR_DAY])
        for coord in _coordinators_for_call(hass, call):
            await coord.async_clear_day(day)

    async def _snooze(call: ServiceCall) -> None:
        for coord in _coordinators_for_call(hass, call):
            await coord.async_snooze()

    async def _stop(call: ServiceCall) -> None:
        for coord in _coordinators_for_call(hass, call):
            await coord.async_stop()

    async def _trigger_now(call: ServiceCall) -> None:
        for coord in _coordinators_for_call(hass, call):
            await coord.async_trigger_now()

    hass.services.async_register(DOMAIN, SERVICE_ENABLE, _enable, schema=_BASE_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_DISABLE, _disable, schema=_BASE_SCHEMA)
    hass.services.async_register(
        DOMAIN, SERVICE_SET_DAY_TIME, _set_day_time, schema=_SET_DAY_TIME_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_CLEAR_DAY, _clear_day, schema=_CLEAR_DAY_SCHEMA
    )
    hass.services.async_register(DOMAIN, SERVICE_SNOOZE, _snooze, schema=_BASE_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_STOP, _stop, schema=_BASE_SCHEMA)
    hass.services.async_register(
        DOMAIN, SERVICE_TRIGGER_NOW, _trigger_now, schema=_BASE_SCHEMA
    )


_ALL_SERVICES = (
    SERVICE_ENABLE,
    SERVICE_DISABLE,
    SERVICE_SET_DAY_TIME,
    SERVICE_CLEAR_DAY,
    SERVICE_SNOOZE,
    SERVICE_STOP,
    SERVICE_TRIGGER_NOW,
)


@callback
def async_unregister_services(hass: HomeAssistant) -> None:
    """Unregister all Smart Alarm services."""
    for name in _ALL_SERVICES:
        if hass.services.has_service(DOMAIN, name):
            hass.services.async_remove(DOMAIN, name)
