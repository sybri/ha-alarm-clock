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

Smart Alarm livre **deux composants** dans le même repo. Il faut donc
l'ajouter à HACS **deux fois**.

1. **Intégration** :
   HACS → Integrations → ⋮ → Custom Repositories →
   `https://github.com/sybri/ha-alarm-clock` en catégorie **Integration** →
   Install → redémarrer HA
2. **Carte Lovelace** :
   HACS → Frontend → ⋮ → Custom Repositories →
   même URL en catégorie **Plugin** → Install → hard refresh navigateur

Puis Settings → Devices & Services → Add Integration → **Smart Alarm**.

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

Smart Alarm ships **two components** in the same repository. Add the repo to
HACS **twice**:

1. **Integration**:
   HACS → Integrations → ⋮ → Custom Repositories →
   `https://github.com/sybri/ha-alarm-clock` as **Integration** → Install →
   restart HA
2. **Lovelace Card**:
   HACS → Frontend → ⋮ → Custom Repositories →
   same URL as **Plugin** → Install → browser hard refresh

Then Settings → Devices & Services → Add Integration → **Smart Alarm**.

### Documentation

- [Detailed installation](./docs/installation.md)
- [User script examples](./docs/examples/)

### License

MIT — see [LICENSE](./LICENSE).
