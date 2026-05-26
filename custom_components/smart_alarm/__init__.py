"""The Smart Alarm integration."""

from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PLATFORMS
from .coordinator import SmartAlarmCoordinator
from .frontend import async_register_card
from .services import async_register_services, async_unregister_services

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Smart Alarm from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    # Serve the Lovelace card from this integration (no separate HACS plugin).
    await async_register_card(hass)

    coordinator = SmartAlarmCoordinator(hass, entry)
    await coordinator.async_load()

    hass.data[DOMAIN][entry.entry_id] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register services once (idempotent)
    if not hass.services.has_service(DOMAIN, "enable"):
        async_register_services(hass)

    # Reload entry when options change
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        coordinator: SmartAlarmCoordinator = hass.data[DOMAIN].pop(entry.entry_id)
        await coordinator.async_shutdown()

        # If no more coordinator entries left, unregister services.
        # (We keep the frontend static path and extra JS URL in place; HA has
        # no API to remove them and a future re-add should not re-mount.)
        if not any(
            isinstance(v, SmartAlarmCoordinator)
            for v in hass.data[DOMAIN].values()
        ):
            async_unregister_services(hass)

    return unload_ok


async def _async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload the entry when options change."""
    await hass.config_entries.async_reload(entry.entry_id)
