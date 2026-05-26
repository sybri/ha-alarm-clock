# smart-alarm-card

Lovelace card for the Smart Alarm integration.

## Build

```bash
cd card
npm install
npm run build
```

The bundled file lands at `dist/smart-alarm-card.js`. It must be committed
before tagging a release because HACS pulls it from the release asset.

## Dev loop

```bash
npm run watch   # auto-rebuild on save
```

Mount the dist file as a Lovelace resource:

```yaml
url: /local/dev/smart-alarm-card.js   # or wherever you serve it
type: module
```

## Lint / test

```bash
npm run lint
npm test
```
