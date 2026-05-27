import { css } from "lit";

export const cardStyles = css`
  ha-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* Live clock */
  .clock {
    text-align: center;
    line-height: 1;
  }
  .clock-time {
    font-size: 3.2em;
    font-weight: 300;
    font-variant-numeric: tabular-nums;
    letter-spacing: 2px;
    color: var(--primary-text-color);
  }
  .clock-ampm {
    font-size: 0.4em;
    font-weight: 500;
    margin-left: 6px;
    vertical-align: super;
    color: var(--secondary-text-color);
  }
  .clock-date {
    font-size: 0.85em;
    color: var(--secondary-text-color);
    margin-top: 2px;
    text-transform: capitalize;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .header-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .title {
    font-size: 1.1em;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--primary-text-color);
  }
  .title ha-icon {
    --mdc-icon-size: 20px;
  }
  .next-trigger {
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }

  .state-triggered .title,
  .state-triggered .next-trigger,
  .state-triggered .clock-time {
    color: var(--error-color);
  }
  .state-snoozed .title,
  .state-snoozed .next-trigger {
    color: var(--warning-color);
  }
  .state-disabled .clock-time {
    color: var(--disabled-text-color);
  }

  .divider {
    height: 1px;
    background: var(--divider-color);
    margin: 2px 0;
  }

  /* Day selector */
  .day-row {
    display: flex;
    gap: 6px;
    justify-content: space-between;
  }
  .day {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 2px;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid var(--divider-color);
    background: var(--secondary-background-color);
    transition: all 120ms ease-out;
    user-select: none;
  }
  .day.selected {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }
  .day.active {
    background: var(--primary-color);
    color: var(--text-primary-color);
  }
  .day .dow {
    font-size: 0.8em;
    font-weight: 600;
  }
  .day .dtime {
    font-size: 0.7em;
    font-variant-numeric: tabular-nums;
    opacity: 0.9;
  }
  .day .dtime.off {
    opacity: 0.4;
  }

  /* Selected-day editor */
  .editor {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .editor-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .editor-day {
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .time-row {
    display: flex;
    justify-content: center;
    padding: 4px 0;
  }
  .time-native {
    font-size: 1.4em;
    padding: 6px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
  }
  .slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .slider-label {
    width: 52px;
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }
  .slider-row input[type="range"] {
    flex: 1;
    accent-color: var(--primary-color);
  }
  .slider-value {
    width: 56px;
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-size: 1em;
    color: var(--primary-text-color);
  }
  .day-off-hint {
    font-size: 0.85em;
    color: var(--secondary-text-color);
    font-style: italic;
  }

  /* Actions */
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .action-btn {
    flex: 1;
    min-width: 90px;
    padding: 10px 12px;
    border-radius: 12px;
    border: none;
    font-size: 0.95em;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: opacity 150ms ease-out;
  }
  .action-btn:active {
    opacity: 0.7;
  }
  .action-btn.test {
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
  }
  .action-btn.snooze {
    background: var(--warning-color);
    color: var(--text-primary-color);
  }
  .action-btn.stop {
    background: var(--error-color);
    color: var(--text-primary-color);
  }

  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 var(--error-color);
    }
    50% {
      box-shadow: 0 0 0 5px transparent;
    }
  }
  .state-triggered ha-card {
    animation: pulse 1.5s ease-in-out infinite;
  }
`;
