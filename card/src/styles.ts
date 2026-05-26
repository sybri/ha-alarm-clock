import { css } from "lit";

export const cardStyles = css`
  ha-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

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
    font-size: 1.15em;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--primary-text-color);
  }

  .title ha-icon {
    --mdc-icon-size: 22px;
  }

  .next-trigger {
    font-size: 0.9em;
    color: var(--secondary-text-color);
  }

  .state-triggered .title,
  .state-triggered .next-trigger {
    color: var(--error-color);
  }

  .state-snoozed .title,
  .state-snoozed .next-trigger {
    color: var(--warning-color);
  }

  .state-disabled .title,
  .state-disabled .next-trigger {
    color: var(--disabled-text-color);
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .row-label {
    font-size: 0.95em;
    color: var(--primary-text-color);
  }

  .time-picker {
    font-size: 1em;
    padding: 4px 8px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
  }

  .day-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .day-chip {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9em;
    cursor: pointer;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    border: 1px solid var(--divider-color);
    transition: all 150ms ease-out;
    user-select: none;
  }

  .day-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color);
    border-color: var(--primary-color);
  }

  .day-chip:active {
    transform: scale(0.95);
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 100px;
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
    0%, 100% { box-shadow: 0 0 0 0 var(--error-color); }
    50% { box-shadow: 0 0 0 6px transparent; }
  }

  .state-triggered ha-card {
    animation: pulse 1.5s ease-in-out infinite;
  }
`;
