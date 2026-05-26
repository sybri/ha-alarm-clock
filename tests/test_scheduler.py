"""Tests for the SmartAlarmCoordinator scheduler (per-day schedule model)."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.smart_alarm.const import (
    CONF_CONDITION_ENTITY,
    CONF_NAME,
    CONF_SCHEDULE,
    CONF_SNOOZE_DURATION,
    CONF_START_SCRIPT,
    CONF_STOP_SCRIPT,
    DEFAULT_SNOOZE_DURATION,
    DOMAIN,
    STATE_DISABLED,
    STATE_IDLE,
)
from custom_components.smart_alarm.coordinator import SmartAlarmCoordinator


def _make_entry(hass: HomeAssistant, *, schedule=None) -> ConfigEntry:
    """Build a mock ConfigEntry whose data is mutated by async_update_entry."""
    entry = MagicMock(spec=ConfigEntry)
    entry.entry_id = "test_entry_id"
    entry.unique_id = f"{DOMAIN}_test"
    entry.title = "Test alarm"
    entry.data = {
        CONF_NAME: "Test alarm",
        CONF_SCHEDULE: (
            {str(d): "07:00" for d in range(7)} if schedule is None else schedule
        ),
        CONF_START_SCRIPT: "script.fake_start",
        CONF_STOP_SCRIPT: None,
    }
    entry.options = {
        CONF_CONDITION_ENTITY: None,
        CONF_SNOOZE_DURATION: DEFAULT_SNOOZE_DURATION,
    }

    def _update(target, *, data=None, **_kw):
        if data is not None:
            target.data = data

    hass.config_entries.async_update_entry = MagicMock(side_effect=_update)
    return entry


@pytest.fixture
def coordinator(hass: HomeAssistant) -> SmartAlarmCoordinator:
    return SmartAlarmCoordinator(hass, _make_entry(hass))


async def test_initial_state(coordinator: SmartAlarmCoordinator) -> None:
    assert coordinator.state == STATE_IDLE
    assert coordinator.next_trigger is None
    assert coordinator.snooze_count == 0


async def test_load_computes_next_trigger(coordinator: SmartAlarmCoordinator) -> None:
    await coordinator.async_load()
    assert coordinator.state == STATE_IDLE
    assert coordinator.next_trigger is not None


async def test_disable_clears_next_trigger(
    coordinator: SmartAlarmCoordinator,
) -> None:
    await coordinator.async_load()
    await coordinator.async_disable()
    assert coordinator.state == STATE_DISABLED
    assert coordinator.next_trigger is None


async def test_enable_recomputes_next_trigger(
    coordinator: SmartAlarmCoordinator,
) -> None:
    await coordinator.async_load()
    await coordinator.async_disable()
    await coordinator.async_enable()
    assert coordinator.state == STATE_IDLE
    assert coordinator.next_trigger is not None
    assert coordinator.next_trigger > dt_util.utcnow()


async def test_set_day_time_rearms(coordinator: SmartAlarmCoordinator) -> None:
    await coordinator.async_load()
    await coordinator.async_set_day_time(0, "23:59")
    assert coordinator.schedule["0"] == "23:59"
    assert coordinator.next_trigger is not None


async def test_single_day_schedule(hass: HomeAssistant) -> None:
    """Only Monday set → next_trigger must land on a Monday."""
    coord = SmartAlarmCoordinator(hass, _make_entry(hass, schedule={"0": "07:00"}))
    await coord.async_load()
    assert coord.next_trigger is not None
    assert dt_util.as_local(coord.next_trigger).weekday() == 0
    assert coord.next_day == 0


async def test_empty_schedule_no_trigger(hass: HomeAssistant) -> None:
    coord = SmartAlarmCoordinator(hass, _make_entry(hass, schedule={}))
    await coord.async_load()
    assert coord.next_trigger is None


async def test_clear_day_disables_it(hass: HomeAssistant) -> None:
    coord = SmartAlarmCoordinator(
        hass, _make_entry(hass, schedule={"0": "07:00", "2": "08:00"})
    )
    await coord.async_load()
    await coord.async_clear_day(0)
    assert "0" not in coord.schedule
    assert coord.schedule["2"] == "08:00"


async def test_snooze_requires_active_state(
    coordinator: SmartAlarmCoordinator,
) -> None:
    await coordinator.async_load()
    initial = coordinator.snooze_count
    await coordinator.async_snooze()
    assert coordinator.snooze_count == initial
    assert coordinator.state == STATE_IDLE


async def test_stop_requires_active_state(
    coordinator: SmartAlarmCoordinator,
) -> None:
    await coordinator.async_load()
    await coordinator.async_stop()
    assert coordinator.state == STATE_IDLE


async def test_migration_from_legacy(hass: HomeAssistant) -> None:
    """Legacy time + days_active is migrated to a schedule dict."""
    entry = MagicMock(spec=ConfigEntry)
    entry.entry_id = "legacy"
    entry.unique_id = f"{DOMAIN}_legacy"
    entry.title = "Legacy"
    entry.data = {
        CONF_NAME: "Legacy",
        "time": "06:30",
        "days_active": [0, 1, 2],
        CONF_START_SCRIPT: "script.x",
        CONF_STOP_SCRIPT: None,
    }
    entry.options = {CONF_SNOOZE_DURATION: DEFAULT_SNOOZE_DURATION}

    def _update(target, *, data=None, **_kw):
        if data is not None:
            target.data = data

    hass.config_entries.async_update_entry = MagicMock(side_effect=_update)

    coord = SmartAlarmCoordinator(hass, entry)
    await coord.async_load()
    assert coord.schedule == {"0": "06:30", "1": "06:30", "2": "06:30"}
    assert "time" not in entry.data
    assert "days_active" not in entry.data
