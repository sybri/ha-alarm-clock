"""Tests for the Smart Alarm config flow."""

from __future__ import annotations

from unittest.mock import patch

import pytest
from homeassistant import config_entries
from homeassistant.core import HomeAssistant

from custom_components.smart_alarm.const import (
    CONF_DAYS,
    CONF_NAME,
    CONF_SNOOZE_DURATION,
    CONF_START_SCRIPT,
    CONF_STOP_SCRIPT,
    CONF_TIME,
    DEFAULT_SNOOZE_DURATION,
    DOMAIN,
)


async def test_user_flow_minimal(hass: HomeAssistant) -> None:
    """Happy path: create an alarm with only required fields."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] == "form"
    assert result["step_id"] == "user"

    with patch(
        "custom_components.smart_alarm.async_setup_entry", return_value=True
    ):
        result2 = await hass.config_entries.flow.async_configure(
            result["flow_id"],
            {
                CONF_NAME: "Réveil Noah",
                CONF_TIME: "07:00",
                CONF_DAYS: ["0", "1", "2", "3", "4"],
                CONF_START_SCRIPT: "script.reveil_noah_scenario",
            },
        )

    assert result2["type"] == "create_entry"
    assert result2["title"] == "Réveil Noah"
    assert result2["data"][CONF_TIME] == "07:00"
    assert result2["data"][CONF_DAYS] == [0, 1, 2, 3, 4]
    assert result2["data"][CONF_START_SCRIPT] == "script.reveil_noah_scenario"
    assert result2["data"][CONF_STOP_SCRIPT] is None
    assert result2["options"][CONF_SNOOZE_DURATION] == DEFAULT_SNOOZE_DURATION


@pytest.mark.parametrize(
    "field,value,error_key",
    [
        (CONF_NAME, "", "name_required"),
        (CONF_TIME, "25:99", "invalid_time"),
        (CONF_TIME, "7-00", "invalid_time"),
        (CONF_DAYS, [], "days_required"),
    ],
)
async def test_user_flow_validation_errors(
    hass: HomeAssistant, field: str, value, error_key: str
) -> None:
    """Each invalid input should surface its error key."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    base = {
        CONF_NAME: "Test",
        CONF_TIME: "07:00",
        CONF_DAYS: ["0", "1"],
        CONF_START_SCRIPT: "script.foo",
    }
    base[field] = value
    result2 = await hass.config_entries.flow.async_configure(result["flow_id"], base)
    assert result2["type"] == "form"
    assert result2["errors"].get(field) == error_key


async def test_user_flow_duplicate(hass: HomeAssistant) -> None:
    """Same slug should abort with already_configured."""
    with patch(
        "custom_components.smart_alarm.async_setup_entry", return_value=True
    ):
        # First entry
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": config_entries.SOURCE_USER}
        )
        await hass.config_entries.flow.async_configure(
            result["flow_id"],
            {
                CONF_NAME: "Noah",
                CONF_TIME: "07:00",
                CONF_DAYS: ["0", "1"],
                CONF_START_SCRIPT: "script.foo",
            },
        )

        # Same name → same slug → abort
        result2 = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": config_entries.SOURCE_USER}
        )
        out = await hass.config_entries.flow.async_configure(
            result2["flow_id"],
            {
                CONF_NAME: "Noah",
                CONF_TIME: "07:30",
                CONF_DAYS: ["0", "1"],
                CONF_START_SCRIPT: "script.bar",
            },
        )

    assert out["type"] == "abort"
    assert out["reason"] == "already_configured"
