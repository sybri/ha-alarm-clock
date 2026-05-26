import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import type { HomeAssistant, LovelaceCard } from "custom-card-helpers";

import {
  CARD_NAME,
  CARD_VERSION,
  DAY_LABELS_LONG,
  DAY_LABELS_SHORT,
  DOMAIN,
  EDITOR_NAME,
  STATE_DISABLED,
  STATE_SNOOZED,
  STATE_TRIGGERED,
} from "./const";
import { cardStyles } from "./styles";
import type { SmartAlarmAttributes, SmartAlarmCardConfig } from "./types";

// Helpful console banner (matches lovelace-mushroom convention)
console.info(
  `%c  SMART-ALARM-CARD  %c  v${CARD_VERSION}  `,
  "color: white; background: #0288d1; font-weight: 700",
  "color: #0288d1; background: white; font-weight: 700",
);

// Register card in the picker
const w = window as unknown as { customCards?: unknown[] };
w.customCards = w.customCards || [];
w.customCards.push({
  type: CARD_NAME,
  name: "Smart Alarm Card",
  description: "Control a Smart Alarm clock from your dashboard.",
  preview: false,
});

@customElement(CARD_NAME)
export class SmartAlarmCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: SmartAlarmCardConfig;

  public static styles = cardStyles;

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./smart-alarm-card-editor");
    return document.createElement(EDITOR_NAME);
  }

  public static getStubConfig(): SmartAlarmCardConfig {
    return { type: `custom:${CARD_NAME}`, entity: "" };
  }

  public setConfig(config: SmartAlarmCardConfig): void {
    if (!config?.entity) {
      throw new Error("entity is required");
    }
    this._config = config;
  }

  public getCardSize(): number {
    return 3;
  }

  // --- helpers ---

  private _state(): string | undefined {
    if (!this._config || !this.hass) return undefined;
    return this.hass.states[this._config.entity]?.state;
  }

  private _attrs(): SmartAlarmAttributes {
    if (!this._config || !this.hass) return {};
    return (
      (this.hass.states[this._config.entity]?.attributes as SmartAlarmAttributes) ||
      {}
    );
  }

  private _name(): string {
    if (this._config?.name) return this._config.name;
    const friendly = this.hass?.states[this._config!.entity]?.attributes
      ?.friendly_name as string | undefined;
    return friendly || this._config?.entity || "Alarm";
  }

  private _formatNextTrigger(iso?: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    const dateStr = d.toLocaleDateString(undefined, {
      weekday: "long",
      day: "2-digit",
      month: "short",
    });
    const timeStr = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} · ${timeStr}`;
  }

  // --- service calls ---

  private _callService(service: string, extra: Record<string, unknown> = {}): void {
    if (!this._config || !this.hass) return;
    this.hass.callService(DOMAIN, service, {
      entity_id: this._config.entity,
      ...extra,
    });
  }

  private _onToggleEnable = (): void => {
    const state = this._state();
    this._callService(state === STATE_DISABLED ? "enable" : "disable");
  };

  private _onTimeChange = (ev: Event): void => {
    const target = ev.target as HTMLInputElement;
    if (!target.value) return;
    this._callService("set_time", { time: target.value });
  };

  private _onDayToggle = (day: number): void => {
    const days = new Set(this._attrs().days_active ?? []);
    if (days.has(day)) days.delete(day);
    else days.add(day);
    this._callService("set_days", { days: Array.from(days).sort() });
  };

  private _onTestNow = (): void => {
    this._callService("trigger_now");
  };

  private _onSnooze = (): void => {
    this._callService("snooze");
  };

  private _onStop = (): void => {
    this._callService("stop");
  };

  // --- render ---

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;

    const state = this._state();
    if (state === undefined) {
      return html`<ha-card><div class="row">Entity not found</div></ha-card>`;
    }

    const attrs = this._attrs();
    const isDisabled = state === STATE_DISABLED;
    const isTriggered = state === STATE_TRIGGERED;
    const isSnoozed = state === STATE_SNOOZED;
    const isActive = isTriggered || isSnoozed;

    const classes = classMap({
      [`state-${state}`]: true,
    });

    return html`
      <ha-card class=${classes}>
        ${this._config.hide_header ? nothing : this._renderHeader(state, attrs)}
        ${this._renderTimeRow(attrs)}
        ${this._config.hide_days ? nothing : this._renderDays(attrs)}
        ${this._renderActions(isActive, isDisabled)}
      </ha-card>
    `;
  }

  private _renderHeader(state: string, attrs: SmartAlarmAttributes): TemplateResult {
    const icon =
      state === STATE_TRIGGERED
        ? "mdi:bell-ring"
        : state === STATE_SNOOZED
        ? "mdi:alarm-snooze"
        : state === STATE_DISABLED
        ? "mdi:alarm-off"
        : "mdi:alarm";

    return html`
      <div class="header">
        <div class="header-info">
          <div class="title">
            <ha-icon icon=${icon}></ha-icon>
            ${this._name()}
          </div>
          <div class="next-trigger">
            ${state === STATE_DISABLED
              ? "Désactivé"
              : html`Prochain : ${this._formatNextTrigger(attrs.next_trigger)}`}
          </div>
        </div>
        <ha-switch
          .checked=${state !== STATE_DISABLED}
          @change=${this._onToggleEnable}
        ></ha-switch>
      </div>
    `;
  }

  private _renderTimeRow(attrs: SmartAlarmAttributes): TemplateResult {
    return html`
      <div class="row">
        <div class="row-label">Heure</div>
        <input
          class="time-picker"
          type="time"
          .value=${attrs.time || "07:00"}
          @change=${this._onTimeChange}
        />
      </div>
    `;
  }

  private _renderDays(attrs: SmartAlarmAttributes): TemplateResult {
    const active = new Set(attrs.days_active ?? []);
    return html`
      <div class="day-chips">
        ${DAY_LABELS_SHORT.map(
          (label, idx) => html`
            <div
              class=${classMap({ "day-chip": true, active: active.has(idx) })}
              title=${DAY_LABELS_LONG[idx]}
              role="button"
              tabindex="0"
              @click=${() => this._onDayToggle(idx)}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") this._onDayToggle(idx);
              }}
            >
              ${label}
            </div>
          `,
        )}
      </div>
    `;
  }

  private _renderActions(isActive: boolean, isDisabled: boolean): TemplateResult {
    return html`
      <div class="actions">
        ${this._config!.hide_test_button || isDisabled
          ? nothing
          : html`
              <button class="action-btn test" @click=${this._onTestNow}>
                <ha-icon icon="mdi:test-tube"></ha-icon>
                Tester
              </button>
            `}
        ${isActive
          ? html`
              <button class="action-btn snooze" @click=${this._onSnooze}>
                <ha-icon icon="mdi:alarm-snooze"></ha-icon>
                Snooze
              </button>
              <button class="action-btn stop" @click=${this._onStop}>
                <ha-icon icon="mdi:stop-circle"></ha-icon>
                Arrêter
              </button>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [CARD_NAME]: SmartAlarmCard;
  }
}
