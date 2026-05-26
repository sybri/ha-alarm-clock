"""Config flow for Smart Alarm."""

from __future__ import annotations

import logging
import re
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers import selector

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
)

_LOGGER = logging.getLogger(__name__)

_SLUG_RE = re.compile(r"^[a-z0-9_]+$")
_TIME_RE = re.compile(r"^([01]\d|2[0-3]):([0-5]\d)$")


def _day_options() -> list[selector.SelectOptionDict]:
    """Return localized day options (Mon=0..Sun=6)."""
    return [
        selector.SelectOptionDict(value="0", label="Monday"),
        selector.SelectOptionDict(value="1", label="Tuesday"),
        selector.SelectOptionDict(value="2", label="Wednesday"),
        selector.SelectOptionDict(value="3", label="Thursday"),
        selector.SelectOptionDict(value="4", label="Friday"),
        selector.SelectOptionDict(value="5", label="Saturday"),
        selector.SelectOptionDict(value="6", label="Sunday"),
    ]


def _slugify_name(name: str) -> str:
    """Convert a display name into a unique_id slug."""
    s = name.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = s.strip("_")
    return s or "alarm"


def _optional_key(field: str, current_value: Any) -> vol.Optional:
    """Build an Optional key with `suggested_value` rather than a default.

    EntitySelector validates non-empty strings as entity IDs; passing
    `default=""` makes Voluptuous reject the form when the user leaves the
    field empty. Using `description={"suggested_value": ...}` lets us preset
    the current value without forcing validation.
    """
    if current_value:
        return vol.Optional(
            field, description={"suggested_value": current_value}
        )
    return vol.Optional(field)


def _user_schema(defaults: dict[str, Any] | None = None) -> vol.Schema:
    """Return the schema for the main user step."""
    d = defaults or {}
    return vol.Schema(
        {
            vol.Required(CONF_NAME, default=d.get(CONF_NAME, "")): str,
            vol.Required(CONF_TIME, default=d.get(CONF_TIME, DEFAULT_TIME)): str,
            vol.Required(
                CONF_DAYS, default=[str(x) for x in d.get(CONF_DAYS, DEFAULT_DAYS)]
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=_day_options(),
                    multiple=True,
                    mode=selector.SelectSelectorMode.LIST,
                )
            ),
            vol.Required(
                CONF_START_SCRIPT, default=d.get(CONF_START_SCRIPT, "")
            ): selector.EntitySelector(
                selector.EntitySelectorConfig(domain="script")
            ),
            _optional_key(CONF_STOP_SCRIPT, d.get(CONF_STOP_SCRIPT)): selector.EntitySelector(
                selector.EntitySelectorConfig(domain="script")
            ),
        }
    )


def _options_schema(defaults: dict[str, Any] | None = None) -> vol.Schema:
    """Return the schema for options (advanced settings)."""
    d = defaults or {}
    return vol.Schema(
        {
            _optional_key(
                CONF_CONDITION_ENTITY, d.get(CONF_CONDITION_ENTITY)
            ): selector.EntitySelector(
                selector.EntitySelectorConfig(domain="binary_sensor")
            ),
            vol.Required(
                CONF_SNOOZE_DURATION,
                default=d.get(CONF_SNOOZE_DURATION, DEFAULT_SNOOZE_DURATION),
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=30,
                    max=3600,
                    step=30,
                    unit_of_measurement="seconds",
                    mode=selector.NumberSelectorMode.BOX,
                )
            ),
        }
    )


def _validate_user_input(user_input: dict[str, Any]) -> dict[str, str]:
    """Validate the input and return a dict of errors (empty if OK)."""
    errors: dict[str, str] = {}

    if not user_input.get(CONF_NAME, "").strip():
        errors[CONF_NAME] = "name_required"

    time_str = user_input.get(CONF_TIME, "")
    if not _TIME_RE.match(time_str):
        errors[CONF_TIME] = "invalid_time"

    days = user_input.get(CONF_DAYS, [])
    if not days:
        errors[CONF_DAYS] = "days_required"

    if not user_input.get(CONF_START_SCRIPT):
        errors[CONF_START_SCRIPT] = "start_script_required"

    return errors


class SmartAlarmConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Smart Alarm."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            errors = _validate_user_input(user_input)

            if not errors:
                slug = _slugify_name(user_input[CONF_NAME])
                await self.async_set_unique_id(f"{DOMAIN}_{slug}")
                self._abort_if_unique_id_configured()

                # Normalize days: list[str] from selector -> list[int]
                days_int = sorted(int(d) for d in user_input[CONF_DAYS])

                data = {
                    CONF_NAME: user_input[CONF_NAME].strip(),
                    CONF_TIME: user_input[CONF_TIME],
                    CONF_DAYS: days_int,
                    CONF_START_SCRIPT: user_input[CONF_START_SCRIPT],
                    CONF_STOP_SCRIPT: user_input.get(CONF_STOP_SCRIPT) or None,
                }
                options = {
                    CONF_CONDITION_ENTITY: None,
                    CONF_SNOOZE_DURATION: DEFAULT_SNOOZE_DURATION,
                }
                return self.async_create_entry(
                    title=data[CONF_NAME], data=data, options=options
                )

        return self.async_show_form(
            step_id="user",
            data_schema=_user_schema(user_input),
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(entry: ConfigEntry) -> OptionsFlow:
        """Get the options flow."""
        return SmartAlarmOptionsFlow(entry)


class SmartAlarmOptionsFlow(OptionsFlow):
    """Handle an options flow."""

    def __init__(self, entry: ConfigEntry) -> None:
        self.entry = entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Manage options."""
        if user_input is not None:
            # Empty string -> None (no condition entity)
            cond = user_input.get(CONF_CONDITION_ENTITY) or None
            return self.async_create_entry(
                title="",
                data={
                    CONF_CONDITION_ENTITY: cond,
                    CONF_SNOOZE_DURATION: int(user_input[CONF_SNOOZE_DURATION]),
                },
            )

        return self.async_show_form(
            step_id="init",
            data_schema=_options_schema(self.entry.options),
        )
