"""Tests for the SmartAlarmCoordinator scheduler."""

from __future__ import annotations

from datetime import datetime, timedelta
from unittest.mock import MagicMock

import pytest
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.smart_alarm.const import (
    CONF_CONDITION_ENTITY,
    CONF_DAYS,
    CONF_NAME,
    CONF_SNOOZE_DURATION,
    CONF_START_SCRIPT,
    CONF_STOP_SCRIPT,
    CONF_TIME,
    DEFAULT_SNOOZE_DURATION,
    DOMAIN,
    STATE_DISABLED,
    STATE_IDLE,
    STATE_SNOOZED,
    STATE_TRIGGERED,
)
from custom_components.smart_alarm.coordinator import SmartAlarmCoordinator


def _make_entry(hass: HomeAssistant, *, time: str = "07:00", days=None) -> ConfigEntry:
    entry = MagicMock(spec=ConfigEntry)
    entry.entry_id = "test_entry_id"
    entry.unique_id = f"{DOMAIN}_test"
    entry.title = "Test alarm"
    entry.data = {
        CONF_NAME: "Test alarm",
        CONF_TIME: time,
        CONF_DAYS: list(range(7)) if days is None else days,
        CONF_START_SCRIPT: "script.fake_start",
        CONF_STOP_SCRIPT: None,
    }
    entry.options = {
        CONF_CONDITION_ENTITY: None,
        CONF_SNOOZE_DURATION: DEFAULT_SNOOZE_DURATION,
    }
    return entry


@pytest.fixture
def coordinator(hass: HomeAssistant) -> SmartAlarmCoordinator:
    entry = _make_entry(hass)
    return SmartAlarmCoordinator(hass, entry)


async def test_initial_state(coordinator: SmartAlarmCoordinator) -> None:
    """Newly created coordinator is idle with no trigger."""
    assert coordinator.state == STATE_IDLE
    assert coordinator.next_trigger is None
    assert coordinator.snooze_count == 0


async def test_load_restores_state(
    hass: HomeAssistant, coordinator: SmartAlarmCoordinator
) -> None:
    """async_load reads from Store and arms timers."""
    # First load: empty storage → idle + computed next_trigger
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


async def test_set_time_rearms(coordinator: SmartAlarmCoordinator) -> None:
    """Changing the time recomputes next_trigger to use the new time."""
    await coordinator.async_load()
    await coordinator.async_set_time("23:59")
    assert coordinator.time == "23:59"
    assert coordinator.next_trigger is not None


async def test_set_days_skips_inactive(
    hass: HomeAssistant,
) -> None:
    """Days not in days_active are skipped when computing next_trigger."""
    entry = _make_entry(hass, days=[0])  # Monday only
    coord = SmartAlarmCoordinator(hass, entry)
    await coord.async_load()
    # next_trigger must be a Monday
    assert coord.next_trigger is not None
    assert dt_util.as_local(coord.next_trigger).weekday() == 0


async def test_set_days_empty_no_trigger(hass: HomeAssistant) -> None:
    """Empty days_active produces no next_trigger."""
    entry = _make_entry(hass, days=[])
    coord = SmartAlarmCoordinator(hass, entry)
    await coord.async_load()
    assert coord.next_trigger is None


async def test_snooze_requires_active_state(
    coordinator: SmartAlarmCoordinator,
) -> None:
    """snooze() is a no-op unless we're triggered or already snoozed."""
    await coordinator.async_load()
    initial_count = coordinator.snooze_count
    await coordinator.async_snooze()
    assert coordinator.snooze_count == initial_count
    assert coordinator.state == STATE_IDLE


async def test_stop_requires_active_state(
    coordinator: SmartAlarmCoordinator,
) -> None:
    """stop() is a no-op unless we're triggered or snoozed."""
    await coordinator.async_load()
    await coordinator.async_stop()
    assert coordinator.state == STATE_IDLE
