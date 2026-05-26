# Development setup — fast iteration loop

This guide skips the commit / push / HACS update / restart loop. Instead,
you symlink the integration directly into your Home Assistant config so HA
loads code straight from this repository.

## 1. Mount the integration via symlink

> ⚠️ This removes the HACS-installed copy of the integration. If HACS
> Smart Alarm is currently installed, **uninstall it first** (or back up
> the directory). Otherwise HACS will think the integration is corrupted
> and may try to overwrite your symlink on its next update.

```bash
# As root on the HA OS host (VS Code addon shell is fine)
# Adjust /root/projects/ha-alarm-clock if your clone lives elsewhere.

# 1. Backup the HACS copy (in case)
mv /config/custom_components/smart_alarm /config/custom_components/smart_alarm.bak

# 2. Symlink the repo into HA config
ln -s /root/projects/ha-alarm-clock/custom_components/smart_alarm \
      /config/custom_components/smart_alarm

# 3. Verify
ls -la /config/custom_components/smart_alarm
# → smart_alarm -> /root/projects/ha-alarm-clock/custom_components/smart_alarm

# 4. Validate config
ha core check

# 5. Restart HA (UI or CLI)
ha core restart
```

## 2. Dev loop

### Editing Python (integration backend)

```bash
# in the repo
$EDITOR custom_components/smart_alarm/whatever.py
# then
ha core restart
```

`ha core check` first if you suspect a YAML/import error.

### Editing TypeScript (the Lovelace card)

```bash
cd /root/projects/ha-alarm-clock/card
npm run watch   # auto-rebuilds on save
```

The rollup config copies the built bundle into
`custom_components/smart_alarm/frontend/smart-alarm-card.js` after every
build. Since that path is symlinked into `/config/`, HA serves the new
file immediately on the next browser hard-refresh (Ctrl+Shift+R). No HA
restart needed for card-only changes.

## 3. Going back to HACS

Once you want to test the HACS path again:

```bash
# Remove the symlink
rm /config/custom_components/smart_alarm

# Either restore your backup
mv /config/custom_components/smart_alarm.bak /config/custom_components/smart_alarm

# OR (preferred) re-install through HACS UI:
# HACS → Integrations → Smart Alarm → ⋮ → Redownload
```

Restart HA after either.

## 4. Caveats

- **Cache:** HA caches `manifest.json` at boot. If you bump the version in
  manifest.json, restart HA to pick it up.
- **Translations:** edits to `translations/*.json` need a restart too.
- **Config entries:** if you change the data shape (rename a CONF_*),
  remove existing entries from Settings → Devices & Services before
  reloading, otherwise restore-state may fail.
- **`.storage/smart_alarm.*.json`:** the persisted state lives there. To
  reset, stop HA, delete those files, restart.
- **Git status:** the symlink is on the HA side only, not in the repo;
  nothing to commit.
