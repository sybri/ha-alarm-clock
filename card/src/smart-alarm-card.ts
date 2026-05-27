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

console.info(
  `%c  SMART-ALARM-CARD  %c  v${CARD_VERSION}  `,
  "color: white; background: #0288d1; font-weight: 700",
  "color: #0288d1; background: white; font-weight: 700",
);

const w = window as unknown as { customCards?: unknown[] };
w.customCards = w.customCards || [];
w.customCards.push({
  type: CARD_NAME,
  name: "Smart Alarm Card",
  description: "Bedside-clock style control for a Smart Alarm.",
  preview: false,
});

const DEFAULT_TIME = "07:00";

// JS Date.getDay(): 0=Sunday..6=Saturday → backend 0=Monday..6=Sunday.
function backendWeekday(d: Date): number {
  return (d.getDay() + 6) % 7;
}

@customElement(CARD_NAME)
export class SmartAlarmCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: SmartAlarmCardConfig;
  @state() private _selectedDay = backendWeekday(new Date());
  @state() private _now = new Date();

  private _clockTimer?: number;

  public static styles = cardStyles;

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./smart-alarm-card-editor");
    return document.createElement(EDITOR_NAME);
  }

  public static getStubConfig(): SmartAlarmCardConfig {
    return { type: `custom:${CARD_NAME}`, entity: "" };
  }

  public setConfig(config: SmartAlarmCardConfig): void {
    if (!config?.entity) throw new Error("entity is required");
    this._config = config;
  }

  public getCardSize(): number {
    return 5;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._clockTimer = window.setInterval(() => {
      this._now = new Date();
    }, 1000);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._clockTimer) window.clearInterval(this._clockTimer);
  }

  // --- helpers ---

  private _use12h(): boolean {
    return this._config?.time_format === "12h";
  }

  private _state(): string | undefined {
    return this.hass?.states[this._config!.entity]?.state;
  }

  private _attrs(): SmartAlarmAttributes {
    return (
      (this.hass?.states[this._config!.entity]?.attributes as SmartAlarmAttributes) ||
      {}
    );
  }

  private _name(): string {
    if (this._config?.name) return this._config.name;
    const friendly = this.hass?.states[this._config!.entity]?.attributes
      ?.friendly_name as string | undefined;
    return friendly || this._config?.entity || "Alarm";
  }

  private _schedule(): Record<string, string> {
    return this._attrs().schedule ?? {};
  }

  private _dayTime(day: number): string | undefined {
    return this._schedule()[String(day)];
  }

  private _fmtTime(hhmm: string): string {
    const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
    if (this._use12h()) {
      const ampm = h < 12 ? "AM" : "PM";
      const hh = h % 12 === 0 ? 12 : h % 12;
      return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
    }
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  private _formatNextTrigger(iso?: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    const dateStr = d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
    const timeStr = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: this._use12h(),
    });
    return `${dateStr} · ${timeStr}`;
  }

  // --- service calls ---

  private _call(service: string, extra: Record<string, unknown> = {}): void {
    this.hass.callService(DOMAIN, service, {
      entity_id: this._config!.entity,
      ...extra,
    });
  }

  private _onToggleEnable = (): void => {
    this._call(this._state() === STATE_DISABLED ? "enable" : "disable");
  };

  private _onSelectDay = (day: number): void => {
    this._selectedDay = day;
  };

  private _onToggleSelectedDay = (): void => {
    const day = this._selectedDay;
    if (this._dayTime(day)) {
      this._call("clear_day", { day });
    } else {
      this._call("set_day_time", { day, time: DEFAULT_TIME });
    }
  };

  private _onDayTimeChanged = (ev: CustomEvent): void => {
    // ha-time-input emits "HH:MM:SS"; backend wants "HH:MM".
    const value = (ev.detail as { value?: string }).value;
    if (!value) return;
    this._call("set_day_time", {
      day: this._selectedDay,
      time: value.slice(0, 5),
    });
  };

  private _onTestNow = (): void => this._call("trigger_now");
  private _onSnooze = (): void => this._call("snooze");
  private _onStop = (): void => this._call("stop");

  // --- render ---

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;

    const state = this._state();
    if (state === undefined) {
      return html`<ha-card><div class="header">Entity not found</div></ha-card>`;
    }

    const attrs = this._attrs();
    const isActive = state === STATE_TRIGGERED || state === STATE_SNOOZED;
    const classes = classMap({ [`state-${state}`]: true });

    return html`
      <ha-card class=${classes}>
        ${this._renderClock(state)}
        ${this._config.hide_header ? nothing : this._renderHeader(state, attrs)}
        <div class="divider"></div>
        ${this._config.hide_days ? nothing : this._renderDays()}
        ${this._config.hide_days ? nothing : this._renderEditor()}
        ${this._renderActions(isActive, state === STATE_DISABLED)}
      </ha-card>
    `;
  }

  private _renderClock(state: string): TemplateResult {
    const timeStr = this._now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: this._use12h(),
    });
    const dateStr = this._now.toLocaleDateString(undefined, {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
    const icon =
      state === STATE_TRIGGERED
        ? "mdi:bell-ring"
        : state === STATE_SNOOZED
        ? "mdi:alarm-snooze"
        : state === STATE_DISABLED
        ? "mdi:alarm-off"
        : "mdi:alarm";
    return html`
      <div class="clock">
        <div class="clock-time">
          <ha-icon
            icon=${icon}
            style="--mdc-icon-size:28px;vertical-align:middle;margin-right:8px;"
          ></ha-icon>${timeStr}
        </div>
        <div class="clock-date">${dateStr}</div>
      </div>
    `;
  }

  private _renderHeader(state: string, attrs: SmartAlarmAttributes): TemplateResult {
    return html`
      <div class="header">
        <div class="header-info">
          <div class="title">${this._name()}</div>
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

  private _renderDays(): TemplateResult {
    return html`
      <div class="day-row">
        ${DAY_LABELS_SHORT.map((label, idx) => {
          const t = this._dayTime(idx);
          const classes = classMap({
            day: true,
            selected: idx === this._selectedDay,
            active: !!t,
          });
          return html`
            <div
              class=${classes}
              title=${DAY_LABELS_LONG[idx]}
              role="button"
              tabindex="0"
              @click=${() => this._onSelectDay(idx)}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") this._onSelectDay(idx);
              }}
            >
              <span class="dow">${label}</span>
              <span class="dtime ${t ? "" : "off"}"
                >${t ? this._fmtTime(t) : "—"}</span
              >
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderEditor(): TemplateResult {
    const day = this._selectedDay;
    const t = this._dayTime(day);
    const enabled = !!t;
    // ha-time-input honours the card's 12h/24h preference via a cloned locale.
    const locale = {
      ...this.hass.locale,
      time_format: this._use12h() ? "12" : "24",
    } as HomeAssistant["locale"];

    return html`
      <div class="editor">
        <div class="editor-head">
          <span class="editor-day">${DAY_LABELS_LONG[day]}</span>
          <ha-switch
            .checked=${enabled}
            @change=${this._onToggleSelectedDay}
          ></ha-switch>
        </div>
        ${enabled
          ? html`
              <div class="time-row">
                <ha-time-input
                  .locale=${locale}
                  .value=${`${t}:00`}
                  @value-changed=${this._onDayTimeChanged}
                ></ha-time-input>
              </div>
            `
          : html`<div class="day-off-hint">
              Jour désactivé — active-le pour régler l'heure.
            </div>`}
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
                <ha-icon icon="mdi:test-tube"></ha-icon>Tester
              </button>
            `}
        ${isActive
          ? html`
              <button class="action-btn snooze" @click=${this._onSnooze}>
                <ha-icon icon="mdi:alarm-snooze"></ha-icon>Snooze
              </button>
              <button class="action-btn stop" @click=${this._onStop}>
                <ha-icon icon="mdi:stop-circle"></ha-icon>Arrêter
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
