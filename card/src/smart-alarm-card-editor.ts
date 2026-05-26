import { LitElement, html, css, type TemplateResult, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";

import { DOMAIN, EDITOR_NAME } from "./const";
import type { SmartAlarmCardConfig } from "./types";

interface HaFormSchemaItem {
  name: string;
  required?: boolean;
  selector: Record<string, unknown>;
}

// ha-form schema. Using ha-form (instead of hand-wired ha-* elements) makes
// the editor robust: HA renders every selector itself, no missing-element
// blank-screen issues.
const SCHEMA: HaFormSchemaItem[] = [
  {
    name: "entity",
    required: true,
    selector: { entity: { integration: DOMAIN, domain: "sensor" } },
  },
  { name: "name", selector: { text: {} } },
  {
    name: "time_format",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "24h", label: "24-hour (07:00)" },
          { value: "12h", label: "12-hour (7:00 AM)" },
        ],
      },
    },
  },
  { name: "hide_header", selector: { boolean: {} } },
  { name: "hide_days", selector: { boolean: {} } },
  { name: "hide_test_button", selector: { boolean: {} } },
];

const LABELS: Record<string, string> = {
  entity: "Alarm entity",
  name: "Display name (optional)",
  time_format: "Time format",
  hide_header: "Hide header",
  hide_days: "Hide days row",
  hide_test_button: "Hide test button",
};

@customElement(EDITOR_NAME)
export class SmartAlarmCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: SmartAlarmCardConfig;

  public setConfig(config: SmartAlarmCardConfig): void {
    this._config = config;
  }

  private _computeLabel = (schema: HaFormSchemaItem): string =>
    LABELS[schema.name] ?? schema.name;

  private _valueChanged = (ev: CustomEvent): void => {
    const config = { ...(ev.detail.value as SmartAlarmCardConfig) };
    // Drop empty optional keys to keep the YAML clean.
    for (const key of ["name", "time_format"] as const) {
      if (!config[key]) delete config[key];
    }
    for (const key of ["hide_header", "hide_days", "hide_test_button"] as const) {
      if (!config[key]) delete config[key];
    }
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config } }),
    );
  };

  private _openIntegration = (): void => {
    // Navigate to the integration page so the user can change snooze /
    // condition entity via the OptionsFlow.
    const path = `/config/integrations/integration/${DOMAIN}`;
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>

      <div class="advanced">
        <p class="hint">
          Snooze duration and the optional condition entity are configured on
          the integration itself (per alarm).
        </p>
        <ha-button @click=${this._openIntegration}>
          <ha-icon icon="mdi:cog" slot="icon"></ha-icon>
          Open integration settings
        </ha-button>
      </div>
    `;
  }

  static styles = css`
    .advanced {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .hint {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      margin: 0 0 8px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [EDITOR_NAME]: SmartAlarmCardEditor;
  }
}
