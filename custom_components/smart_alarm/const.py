"""Constants for the Smart Alarm integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "smart_alarm"
PLATFORMS: Final = ["sensor"]

# Frontend (Lovelace card auto-served by the integration)
FRONTEND_URL_PATH: Final = "/smart_alarm_assets"
FRONTEND_FILENAME: Final = "smart-alarm-card.js"

# Storage
STORAGE_VERSION: Final = 1
STORAGE_KEY_PREFIX: Final = "smart_alarm"

# Config flow keys
CONF_NAME: Final = "name"
CONF_TIME: Final = "time"  # legacy (pre-schedule); kept for migration
CONF_DAYS: Final = "days_active"  # legacy (pre-schedule); kept for migration
CONF_SCHEDULE: Final = "schedule"  # dict {str(0..6): "HH:MM" | None}
CONF_START_SCRIPT: Final = "start_script"
CONF_STOP_SCRIPT: Final = "stop_script"
CONF_CONDITION_ENTITY: Final = "condition_entity"
CONF_SNOOZE_DURATION: Final = "snooze_duration"

# Defaults
DEFAULT_TIME: Final = "07:00"
DEFAULT_DAYS: Final = [0, 1, 2, 3, 4]  # Mon-Fri
DEFAULT_SNOOZE_DURATION: Final = 300  # 5 minutes in seconds

# Weekday convention: 0=Monday .. 6=Sunday (matches Python date.weekday())
WEEKDAYS: Final = [0, 1, 2, 3, 4, 5, 6]

# State values
STATE_DISABLED: Final = "disabled"
STATE_IDLE: Final = "idle"
STATE_TRIGGERED: Final = "triggered"
STATE_SNOOZED: Final = "snoozed"

# Attributes exposed on the entity
ATTR_SCHEDULE: Final = "schedule"
ATTR_NEXT_TRIGGER: Final = "next_trigger"
ATTR_NEXT_DAY: Final = "next_day"
ATTR_CONDITION_ENTITY: Final = "condition_entity"
ATTR_START_SCRIPT: Final = "start_script"
ATTR_STOP_SCRIPT: Final = "stop_script"
ATTR_SNOOZE_DURATION: Final = "snooze_duration"
ATTR_SNOOZE_COUNT: Final = "snooze_count"

# Events emitted on the HA bus
EVENT_TRIGGERED: Final = "smart_alarm_triggered"
EVENT_STOPPED: Final = "smart_alarm_stopped"
EVENT_SNOOZED: Final = "smart_alarm_snoozed"

# Event data keys
EVENT_DATA_ALARM_ID: Final = "alarm_id"
EVENT_DATA_NAME: Final = "name"
EVENT_DATA_TIME: Final = "time"
EVENT_DATA_DAY: Final = "day"
EVENT_DATA_REASON: Final = "reason"
EVENT_DATA_NEXT_TRIGGER: Final = "next_trigger"
EVENT_DATA_SNOOZE_COUNT: Final = "snooze_count"

# Stop reasons
STOP_REASON_MANUAL: Final = "manual"
STOP_REASON_AUTO: Final = "auto"
STOP_REASON_SNOOZE: Final = "snooze"

# Services
SERVICE_ENABLE: Final = "enable"
SERVICE_DISABLE: Final = "disable"
SERVICE_SET_DAY_TIME: Final = "set_day_time"
SERVICE_CLEAR_DAY: Final = "clear_day"
SERVICE_SNOOZE: Final = "snooze"
SERVICE_STOP: Final = "stop"
SERVICE_TRIGGER_NOW: Final = "trigger_now"
