# VeloTools

Browser-based utility tools (image compression, PDF compression, QR generation, invoice builder, focus tools, and background removal).

## Project setup

```bash
npm install
```

## Quality checks

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm test
npm run test:watch
```

## Notes

- This project is currently static-first (HTML/CSS/JS, no build step required to run in browser).
- `image-compress` loads modular scripts from `image-compress/js/` (shared helpers in `core-utils.js`).
- ESLint is configured in a soft-adoption mode (warnings are expected while we progressively tighten rules).
