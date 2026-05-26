import type { LovelaceCardConfig } from "custom-card-helpers";

export interface SmartAlarmCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  hide_header?: boolean;
  hide_days?: boolean;
  hide_test_button?: boolean;
}

export interface SmartAlarmAttributes {
  time?: string;
  days_active?: number[];
  next_trigger?: string | null;
  condition_entity?: string | null;
  start_script?: string;
  stop_script?: string | null;
  snooze_duration?: number;
  snooze_count?: number;
}
