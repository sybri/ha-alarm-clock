# Development setup — fast iteration loop

This guide skips the commit / push / HACS update / restart loop. You symlink
the integration directly into the Home Assistant config so HA loads code
straight from this repository.

## ⚠️ Where to clone

**The repo must live in a path the HA Core container can read.** On Home
Assistant OS, containers are isolated:

| Path | VS Code addon | HA Core container |
|---|---|---|
| `/root/`, `/home/` | ✅ | ❌ (their own home) |
| `/config/` | ✅ | ✅ |
| `/share/` | ✅ | ✅ |
| `/media/`, `/backup/`, `/ssl/` | ✅ | ✅ |

Use `/share/projects/ha-alarm-clock/` (or anywhere under `/share/` or
`/config/`). Cloning into `/root/projects/` works for editing but the symlink
will resolve to `Module not found` from HA Core's POV.

## 1. Clone

```bash
mkdir -p /share/projects
cd /share/projects
git clone git@github.com:sybri/ha-alarm-clock.git
```

## 2. Mount the integration via symlink

> ⚠️ This replaces the HACS-installed copy of the integration. If HACS Smart
> Alarm is currently installed, **uninstall it first** (or move its directory
> aside). Otherwise HACS may overwrite your symlink on its next update.

```bash
# 1. Move the HACS copy out of the way (NOT into custom_components/, otherwise
#    HA tries to load it as another integration). Use /config/.dev-backups/ or
#    delete it.
mkdir -p /config/.dev-backups
mv /config/custom_components/smart_alarm /config/.dev-backups/smart_alarm.bak.$(date +%s)

# 2. Symlink the repo into HA config
ln -s /share/projects/ha-alarm-clock/custom_components/smart_alarm \
      /config/custom_components/smart_alarm

# 3. Verify
ls -la /config/custom_components/smart_alarm
# → smart_alarm -> /share/projects/ha-alarm-clock/custom_components/smart_alarm

# 4. Validate config
ha core check

# 5. Restart HA
ha core restart
```

## 3. Dev loop

### Editing Python (integration backend)

```bash
$EDITOR custom_components/smart_alarm/whatever.py
ha core restart
```

`ha core check` first if you suspect a YAML/import error.

### Editing TypeScript (the Lovelace card)

```bash
cd /share/projects/ha-alarm-clock/card
npm run watch   # auto-rebuilds on save
```

The rollup config copies the built bundle into
`custom_components/smart_alarm/frontend/smart-alarm-card.js` after every
build. Since that path is symlinked into `/config/`, HA serves the new file
immediately on the next browser hard-refresh (Ctrl+Shift+R). No HA restart
needed for card-only changes.

## 4. Going back to HACS

```bash
# Remove the symlink
rm /config/custom_components/smart_alarm

# OR restore a backup if you kept one
mv /config/.dev-backups/smart_alarm.bak.<ts> /config/custom_components/smart_alarm

# Then re-install through HACS UI:
# HACS → Integrations → Smart Alarm → ⋮ → Redownload
```

Restart HA after either.

## 5. Caveats

- **HA Core container isolation:** see warning at the top — `/root/`, `/home/`
  are container-private. Use `/share/` or `/config/` only.
- **Don't keep `.bak` directories inside `custom_components/`** — HA scans
  every directory there and tries to load them. Symptom: log spam like
  `Error occurred loading flow for integration smart_alarm.bak.123…`.
- **`manifest.json` cache:** HA caches it at boot. Restart after a version
  bump.
- **Translations:** edits to `translations/*.json` need a restart too.
- **Config entries:** if you change the data shape (rename a CONF_*), remove
  existing entries from Settings → Devices & Services before reloading,
  otherwise restore-state may fail.
- **`.storage/smart_alarm.*.json`:** the persisted state lives there. To
  reset, stop HA, delete those files, restart.
- **Git status:** the symlink is on the HA side only, not in the repo;
  nothing to commit.
