"""Tests that the integration emits the documented events."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant

from custom_components.smart_alarm.const import (
    CONF_CONDITION_ENTITY,
    CONF_NAME,
    CONF_SCHEDULE,
    CONF_SNOOZE_DURATION,
    CONF_START_SCRIPT,
    CONF_STOP_SCRIPT,
    DEFAULT_SNOOZE_DURATION,
    DOMAIN,
    EVENT_DATA_REASON,
    EVENT_SNOOZED,
    EVENT_STOPPED,
    EVENT_TRIGGERED,
    STATE_TRIGGERED,
    STOP_REASON_MANUAL,
)
from custom_components.smart_alarm.coordinator import SmartAlarmCoordinator


@pytest.fixture
def coord(hass: HomeAssistant) -> SmartAlarmCoordinator:
    entry = MagicMock()
    entry.entry_id = "ev_test"
    entry.unique_id = f"{DOMAIN}_ev"
    entry.title = "Ev test"
    entry.data = {
        CONF_NAME: "Ev test",
        CONF_SCHEDULE: {str(d): "07:00" for d in range(7)},
        CONF_START_SCRIPT: "script.noop",
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
    return SmartAlarmCoordinator(hass, entry)


async def test_trigger_now_emits_event(
    hass: HomeAssistant, coord: SmartAlarmCoordinator
) -> None:
    """trigger_now() fires smart_alarm_triggered."""
    await coord.async_load()
    events = []
    hass.bus.async_listen(EVENT_TRIGGERED, lambda e: events.append(e))

    await coord.async_trigger_now()
    await hass.async_block_till_done()

    assert len(events) == 1
    assert events[0].data["name"] == "Ev test"
    assert coord.state == STATE_TRIGGERED


async def test_snooze_emits_event(
    hass: HomeAssistant, coord: SmartAlarmCoordinator
) -> None:
    """snooze() fires smart_alarm_snoozed and updates next_trigger."""
    await coord.async_load()
    await coord.async_trigger_now()
    await hass.async_block_till_done()

    events = []
    hass.bus.async_listen(EVENT_SNOOZED, lambda e: events.append(e))

    await coord.async_snooze()
    await hass.async_block_till_done()

    assert len(events) == 1
    assert events[0].data["snooze_count"] == 1


async def test_stop_emits_event_with_reason(
    hass: HomeAssistant, coord: SmartAlarmCoordinator
) -> None:
    """stop() fires smart_alarm_stopped with reason=manual."""
    await coord.async_load()
    await coord.async_trigger_now()
    await hass.async_block_till_done()

    events = []
    hass.bus.async_listen(EVENT_STOPPED, lambda e: events.append(e))

    await coord.async_stop()
    await hass.async_block_till_done()

    assert len(events) == 1
    assert events[0].data[EVENT_DATA_REASON] == STOP_REASON_MANUAL
