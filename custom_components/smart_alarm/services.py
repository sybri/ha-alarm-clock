"""Service registration for Smart Alarm.

Phase 1: skeleton (registers handlers but most are no-ops).
Phase 3 will implement the real behaviour (enable, disable, set_time,
set_days, snooze, stop, trigger_now).
"""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant, ServiceCall, callback

from .const import (
    DOMAIN,
    SERVICE_DISABLE,
    SERVICE_ENABLE,
    SERVICE_SET_DAYS,
    SERVICE_SET_TIME,
    SERVICE_SNOOZE,
    SERVICE_STOP,
    SERVICE_TRIGGER_NOW,
)

_LOGGER = logging.getLogger(__name__)

_ALL_SERVICES = (
    SERVICE_ENABLE,
    SERVICE_DISABLE,
    SERVICE_SET_TIME,
    SERVICE_SET_DAYS,
    SERVICE_SNOOZE,
    SERVICE_STOP,
    SERVICE_TRIGGER_NOW,
)


@callback
def async_register_services(hass: HomeAssistant) -> None:
    """Register all Smart Alarm services."""

    async def _placeholder(call: ServiceCall) -> None:
        """Phase-1 placeholder. Will be wired up in Phase 3."""
        _LOGGER.warning(
            "Smart Alarm service %s called but not yet implemented (phase 1)",
            call.service,
        )

    for service_name in _ALL_SERVICES:
        hass.services.async_register(DOMAIN, service_name, _placeholder)


@callback
def async_unregister_services(hass: HomeAssistant) -> None:
    """Unregister all Smart Alarm services."""
    for service_name in _ALL_SERVICES:
        if hass.services.has_service(DOMAIN, service_name):
            hass.services.async_remove(DOMAIN, service_name)
