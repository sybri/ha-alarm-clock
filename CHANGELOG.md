# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Integration `smart_alarm`
  - Config flow (name, time, days, start_script, optional stop_script)
  - Options flow (condition_entity, snooze_duration)
  - State machine: `disabled` / `idle` / `triggered` / `snoozed`
  - Recurring scheduler (`async_track_time_change`) + one-shot snooze
  - Auto-stop detection when `start_script` ends
  - State persistence via `homeassistant.helpers.storage.Store`
  - Services: `enable`, `disable`, `set_time`, `set_days`, `snooze`, `stop`, `trigger_now`
  - Events: `smart_alarm_triggered`, `smart_alarm_stopped`, `smart_alarm_snoozed`
  - Conditional `binary_sensor` evaluation at trigger time
  - i18n: EN + FR
- Lovelace card `smart-alarm-card`
  - Lit web component with state-driven styling
  - Master toggle, time picker, 7-day chips
  - Test / Snooze / Stop buttons (conditional rendering)
  - Visual config editor with entity picker filtered on `smart_alarm`
- CI pipelines
  - Tests + hassfest + HACS integration validation (Python)
  - Build + bundle check + HACS plugin validation (Card)
  - Release on `v*` tags (verifies manifest version, ships `card/dist/`)
- Docs
  - FR + EN install guide
  - Services reference
  - Example scripts (sunrise, cleanup, conditional binary_sensor, event logger)
- HACS metadata (`hacs.json`), MIT license, FR + EN README

