"""Auto-register the Smart Alarm Lovelace card with the HA frontend.

The bundled JS lives in ``frontend/smart-alarm-card.js`` next to this file.
On the first config entry setup, we:

1. Mount the folder as a static HTTP path (``/smart_alarm_assets``).
2. Tell the frontend to load the card module as an extra JS resource.

This makes the card available in the Lovelace card picker without the user
having to add the repo a second time in HACS (Frontend category).
"""

from __future__ import annotations

import json
import logging
import pathlib

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import DOMAIN, FRONTEND_FILENAME, FRONTEND_URL_PATH

_LOGGER = logging.getLogger(__name__)
_REGISTERED_FLAG = "_frontend_registered"


def _integration_version() -> str:
    """Read version from manifest.json for cache busting."""
    manifest_path = pathlib.Path(__file__).parent / "manifest.json"
    try:
        return json.loads(manifest_path.read_text())["version"]
    except Exception:  # noqa: BLE001 — best-effort
        return "0"


def _cache_buster(card_path: pathlib.Path) -> str:
    """Return ``<version>-<mtime>`` so dev rebuilds bypass the browser cache."""
    version = _integration_version()
    try:
        mtime = int(card_path.stat().st_mtime)
    except OSError:
        mtime = 0
    return f"{version}-{mtime}"


async def async_register_card(hass: HomeAssistant) -> None:
    """Register the static path and frontend JS URL.

    Idempotent: safe to call from every ``async_setup_entry``.
    """
    domain_data = hass.data.setdefault(DOMAIN, {})
    if domain_data.get(_REGISTERED_FLAG):
        return

    card_dir = pathlib.Path(__file__).parent / "frontend"
    card_path = card_dir / FRONTEND_FILENAME
    if not card_path.exists():
        _LOGGER.warning(
            "Smart Alarm bundled card missing at %s; "
            "card will not be available in Lovelace picker",
            card_path,
        )
        return

    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                FRONTEND_URL_PATH,
                str(card_dir),
                cache_headers=False,
            )
        ]
    )

    url = f"{FRONTEND_URL_PATH}/{FRONTEND_FILENAME}?v={_cache_buster(card_path)}"
    add_extra_js_url(hass, url)

    domain_data[_REGISTERED_FLAG] = True
    _LOGGER.info("Smart Alarm card registered at %s", url)
