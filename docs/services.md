# Services reference

Smart Alarm exposes the following services under domain `smart_alarm`.
All services target a `sensor.smart_alarm_*` entity (use the target / entity_id
field).

## `smart_alarm.enable`
Transition to `idle`, recompute `next_trigger`. No-op if already active.

## `smart_alarm.disable`
Transition to `disabled`, clear `next_trigger`, cancel any pending snooze.

## `smart_alarm.set_time`
Update the alarm time and re-arm.

**Data:**
- `time` *(required)* — `HH:MM` (24h)

## `smart_alarm.set_days`
Update the days the alarm is active. 0=Monday…6=Sunday.

**Data:**
- `days` *(required)* — list of int between 0 and 6, e.g. `[0,1,2,3,4]`

## `smart_alarm.snooze`
Snooze the currently-firing alarm. Behaviour:
- `script.turn_off(start_script)` then `script.turn_on(stop_script)` if defined
- State → `snoozed`, `next_trigger` = now + `snooze_duration`
- Increments `snooze_count`
- Fires `smart_alarm_snoozed`
- No-op if alarm is not in `triggered`/`snoozed` state.

## `smart_alarm.stop`
Stop the currently-firing or snoozed alarm.
- Calls `script.turn_off(start_script)` + `script.turn_on(stop_script)` if defined
- State → `idle`, recomputes `next_trigger`, resets `snooze_count`
- Fires `smart_alarm_stopped` with `reason: "manual"`
- No-op if alarm is not `triggered`/`snoozed`.

## `smart_alarm.trigger_now`
Force an immediate trigger regardless of time / day / condition.
Useful as a "Test now" button to validate your script setup.

---

# Events fired

## `smart_alarm_triggered`

Fired when the alarm enters the `triggered` state.

```yaml
event_data:
  alarm_id: smart_alarm_reveil_noah
  name: "Réveil Noah"
  time: "07:00"
```

## `smart_alarm_stopped`

Fired when transitioning out of `triggered`/`snoozed`.

```yaml
event_data:
  alarm_id: smart_alarm_reveil_noah
  name: "Réveil Noah"
  reason: manual    # or "auto" (start_script ended) / "snooze"
```

## `smart_alarm_snoozed`

Fired on a successful snooze.

```yaml
event_data:
  alarm_id: smart_alarm_reveil_noah
  name: "Réveil Noah"
  next_trigger: "2026-05-26T07:05:00+02:00"
  snooze_count: 1
```

See [`examples/automation_log_events.yaml`](./examples/automation_log_events.yaml)
for a working consumer.
