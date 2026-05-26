# Installation détaillée — Smart Alarm

[Français](#installation-détaillée--smart-alarm) · [English version](#detailed-installation--smart-alarm)

## 1. Pré-requis

- Home Assistant ≥ 2026.4.0
- HACS installé et fonctionnel

## 2. Installation via HACS (custom repository, en attendant l'ajout à HACS default)

Smart Alarm est un **monorepo intégration + carte**. La carte Lovelace est
embarquée et auto-servie par l'intégration — **un seul ajout HACS suffit**.

1. HACS → **Integrations** → menu ⋮ → **Custom Repositories**
2. URL : `https://github.com/sybri/ha-alarm-clock`
3. Catégorie : **Integration**
4. **Add** → **Install**
5. Redémarrer Home Assistant

## 3. Créer un réveil

1. **Settings** → **Devices & Services** → **Add Integration**
2. Chercher **Smart Alarm**
3. Renseigner :
   - **Nom** : ex. « Réveil Noah »
   - **Heure** : ex. `07:00`
   - **Jours actifs** : sélectionnez Lundi à Vendredi
   - **Start script** : le script qui démarre votre scénario réveil (sunrise,
     Alexa, radio…). Voir [`docs/examples/`](./examples/).
   - **Stop script** *(optionnel)* : script qui nettoie quand on appuie Stop.
4. Submit → l'entité `sensor.smart_alarm_<nom>` est créée.

## 4. Ajouter la carte au dashboard

Dans l'éditeur Lovelace :

1. **+ Add Card**
2. Chercher **Smart Alarm Card** (apparaît automatiquement)
3. Sélectionner votre `sensor.smart_alarm_<nom>` dans l'éditeur visuel
4. Sauvegarder

> **Si la carte n'apparaît pas** : hard refresh du navigateur (Ctrl+Shift+R).
> Le JS est servi sur `/smart_alarm_assets/smart-alarm-card.js`, tu peux
> vérifier sa présence via une simple visite de l'URL.

## 5. Options avancées (par alarme)

Settings → Devices & Services → **Smart Alarm** → ⋮ sur l'entrée → **Configure** :

- **Condition entity** : un `binary_sensor` qui doit être `on` pour autoriser
  le déclenchement (ex: `binary_sensor.workday`, ou un template combinant
  workday + vacances scolaires).
- **Snooze duration** : durée en secondes entre 2 sonneries lors d'un snooze.

---

# Detailed installation — Smart Alarm

## 1. Prerequisites

- Home Assistant ≥ 2026.4.0
- HACS installed and working

## 2. HACS installation (custom repository, until merged into HACS default)

Smart Alarm is a **monorepo (integration + card)**. The Lovelace card is
bundled with and auto-served by the integration — **a single HACS install is
all you need**.

1. HACS → **Integrations** → ⋮ → **Custom Repositories**
2. URL: `https://github.com/sybri/ha-alarm-clock`
3. Category: **Integration**
4. Add → Install → restart HA

## 3. Create an alarm

Settings → Devices & Services → Add Integration → **Smart Alarm**.
Fill name, time, days, start script (and optionally stop script).

## 4. Add the card

Dashboard editor → + Add Card → **Smart Alarm Card** (auto-listed) → pick
your entity.

> If the card isn't listed, hard-refresh the browser (Ctrl+Shift+R). The JS
> is served at `/smart_alarm_assets/smart-alarm-card.js`; you can verify by
> hitting that URL.

## 5. Per-alarm advanced options

Devices & Services → Smart Alarm entry → Configure:
- Condition entity (binary_sensor)
- Snooze duration in seconds
