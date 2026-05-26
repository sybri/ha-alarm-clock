import { LitElement, html, type TemplateResult, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";

import { DOMAIN, EDITOR_NAME } from "./const";
import type { SmartAlarmCardConfig } from "./types";

@customElement(EDITOR_NAME)
export class SmartAlarmCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: SmartAlarmCardConfig;

  public setConfig(config: SmartAlarmCardConfig): void {
    this._config = config;
  }

  private _fireChange(updated: SmartAlarmCardConfig): void {
    this._config = updated;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: updated } }),
    );
  }

  private _onEntity = (ev: CustomEvent): void => {
    const value = (ev.detail as { value?: string }).value || "";
    this._fireChange({ ...this._config!, entity: value });
  };

  private _onBool = (key: keyof SmartAlarmCardConfig) =>
    (ev: CustomEvent): void => {
      const value = (ev.detail as { value?: boolean }).value;
      const next = { ...this._config!, [key]: value };
      if (!value) delete (next as Record<string, unknown>)[key];
      this._fireChange(next as SmartAlarmCardConfig);
    };

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;

    return html`
      <div class="form">
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.entity || ""}
          .label=${"Smart Alarm entity"}
          .includeDomains=${["sensor"]}
          .entityFilter=${(e: { platform?: string }) => e.platform === DOMAIN}
          required
          @value-changed=${this._onEntity}
        ></ha-entity-picker>

        <ha-textfield
          label="Display name (optional)"
          .value=${this._config.name || ""}
          @input=${(ev: Event) => {
            const v = (ev.target as HTMLInputElement).value;
            this._fireChange({ ...this._config!, name: v || undefined });
          }}
        ></ha-textfield>

        <ha-formfield label="Hide header">
          <ha-switch
            .checked=${!!this._config.hide_header}
            @change=${(ev: Event) =>
              this._onBool("hide_header")(
                new CustomEvent("v", {
                  detail: { value: (ev.target as HTMLInputElement).checked },
                }),
              )}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Hide days row">
          <ha-switch
            .checked=${!!this._config.hide_days}
            @change=${(ev: Event) =>
              this._onBool("hide_days")(
                new CustomEvent("v", {
                  detail: { value: (ev.target as HTMLInputElement).checked },
                }),
              )}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Hide test button">
          <ha-switch
            .checked=${!!this._config.hide_test_button}
            @change=${(ev: Event) =>
              this._onBool("hide_test_button")(
                new CustomEvent("v", {
                  detail: { value: (ev.target as HTMLInputElement).checked },
                }),
              )}
          ></ha-switch>
        </ha-formfield>
      </div>
    `;
  }

  static styles = [
    // Minimal layout
    `
      .form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px 0;
      }
      ha-entity-picker, ha-textfield {
        width: 100%;
      }
    `,
  ] as unknown as (typeof LitElement)["styles"];
}

declare global {
  interface HTMLElementTagNameMap {
    [EDITOR_NAME]: SmartAlarmCardEditor;
  }
}
