# Smart Alarm — réveil intelligent pour Home Assistant

> ⚠️ **Work in progress** — MVP en cours de développement (phase 1/12).
> Pas encore publié sur HACS default. Voir [le plan complet](./docs/plan.md) ou
> issues GitHub pour l'état d'avancement.

[Français](#-français) · [English](#-english)

---

## 🇫🇷 Français

**Smart Alarm** est un module Home Assistant complet pour piloter des réveils
intelligents :

- ⏰ Une **intégration** Python qui modélise les alarmes (heure, jours,
  conditions), gère le scheduling et expose des services
- 🎴 Une **carte Lovelace** moderne avec éditeur visuel (TypeScript + Lit)
- 🪝 Bouton « Snooze » et « Stop » natifs, avec hooks vers vos propres scripts
- 🚦 Activation conditionnelle via une entité `binary_sensor` externe (workday,
  vacances, etc. — c'est vous qui définissez la logique)
- 📢 Émission d'événements HA (`smart_alarm_triggered`, etc.) pour intégration
  avec d'autres automations

### Installation

Smart Alarm est un **monorepo intégration + carte** qui s'installe en
**un seul ajout HACS**. La carte Lovelace est servie automatiquement par
l'intégration au démarrage de Home Assistant.

1. HACS → Integrations → ⋮ → Custom Repositories →
   `https://github.com/sybri/ha-alarm-clock` en catégorie **Integration** →
   Install
2. Redémarrer Home Assistant
3. Settings → Devices & Services → Add Integration → **Smart Alarm**
4. La carte **Smart Alarm Card** apparaît automatiquement dans le picker
   Lovelace, pas d'ajout HACS Frontend requis.

### Documentation

- [Installation détaillée](./docs/installation.md)
- [Exemples de scripts utilisateur](./docs/examples/)

### Licence

MIT — voir [LICENSE](./LICENSE).

---

## 🇬🇧 English

**Smart Alarm** is a complete Home Assistant module to manage smart alarm
clocks:

- ⏰ A Python **integration** modeling alarms (time, days, conditions),
  handling scheduling and exposing services
- 🎴 A modern Lovelace **card** with visual editor (TypeScript + Lit)
- 🪝 Native Snooze and Stop buttons with hooks to your own scripts
- 🚦 Conditional activation via an external `binary_sensor` entity (workday,
  holidays, etc. — you define the logic)
- 📢 HA events emission (`smart_alarm_triggered`, etc.) for integration with
  other automations

### Installation

Smart Alarm is a **monorepo (integration + card)** installed with a **single
HACS entry**. The Lovelace card is auto-served by the integration on startup.

1. HACS → Integrations → ⋮ → Custom Repositories →
   `https://github.com/sybri/ha-alarm-clock` as **Integration** → Install
2. Restart Home Assistant
3. Settings → Devices & Services → Add Integration → **Smart Alarm**
4. The **Smart Alarm Card** automatically appears in the Lovelace picker —
   no second HACS install needed.

### Documentation

- [Detailed installation](./docs/installation.md)
- [User script examples](./docs/examples/)

### License

MIT — see [LICENSE](./LICENSE).
