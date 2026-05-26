import type { LovelaceCardConfig } from "custom-card-helpers";

export type TimeFormat = "24h" | "12h";

export interface SmartAlarmCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  time_format?: TimeFormat;
  hide_header?: boolean;
  hide_days?: boolean;
  hide_test_button?: boolean;
}

export interface SmartAlarmAttributes {
  // schedule maps weekday "0"(Mon).."6"(Sun) -> "HH:MM"; missing = day off
  schedule?: Record<string, string>;
  next_trigger?: string | null;
  next_day?: number | null;
  condition_entity?: string | null;
  start_script?: string;
  stop_script?: string | null;
  snooze_duration?: number;
  snooze_count?: number;
}
