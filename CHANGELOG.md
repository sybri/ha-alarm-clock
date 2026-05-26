# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - Unreleased

### Changed (breaking — data model)

- **Per-day schedule.** Replaced the single `time` + `days_active` model with
  a `schedule` dict mapping each weekday (0=Mon..6=Sun) to its own `HH:MM`
  (or absent = day off). Existing entries are auto-migrated on load.
- Scheduler reworked from a recurring `async_track_time_change` to a one-shot
  `async_track_point_in_time` re-armed after each fire — required for a
  different time per day.
- Services: `set_time` / `set_days` replaced by **`set_day_time`** (day, time)
  and **`clear_day`** (day).
- Entity attributes: `time` + `days_active` replaced by `schedule` + `next_day`.
- `smart_alarm_triggered` event now carries `day` and `time`.

### Added

- **Bedside-clock card UI**: large live clock (current time), alarm icon, next
  alarm subtitle.
- **Per-day editor**: 7-day selector showing each day's time, hour + minute
  sliders for the selected day, per-day enable/disable toggle.
- Card `time_format` option (24h / 12h) now also drives the live clock, the
  day times and the sliders' displayed value.

### Earlier in 0.1.x

- **Install now requires only 1 HACS entry (Integration category).** The
  Lovelace card is bundled inside the integration and auto-registered with
  the HA frontend at setup time. No need to add the repo as Plugin too — a
  former limitation of HACS which refused duplicate-category entries for the
  same repo. The card stays available in the Lovelace card picker as
  `smart-alarm-card` and the static asset is served at
  `/smart_alarm_assets/smart-alarm-card.js`.
- `npm run build` now also copies the bundle to
  `custom_components/smart_alarm/frontend/` (committed for HACS).
- `release.yml` workflow validates the frontend bundle is in sync before
  tagging.

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

