# Package Rename Design

## Problem

The `@homunculus` npm organization is already taken, so we cannot publish the SDK and UI packages under scoped names. We need to rename both packages to unscoped names.

## Rename Mapping

| Current | New |
|---------|-----|
| `@homunculus/sdk` | `homunculus-sdk` |
| `@homunculus/ui` | `homunculus-ui` |

## Changes

### Package definitions (2 files)

- `sdk/typescript-sdk/package.json` — `"name"` field
- `sdk/ui/package.json` — `"name"` field

### Dependencies in package.json (7 files)

- `engine/assets/mods/package.json`
- `mops/settings/package.json`
- `mods/menu/package.json`
- `mods/elmer/package.json`
- `mcp/package.json`
- `mods/settings/ui/package.json` (SDK + UI deps)
- `mods/menu/ui/package.json` (SDK + UI deps)

### TypeScript/JavaScript imports (~15 source files)

- `sdk/typescript-sdk/src/speech.ts`, `src/mods.ts` (JSDoc examples)
- `mods/elmer/index.js`, `mods/menu/index.js`
- `mods/settings/ui/src/App.tsx`, `mods/menu/ui/src/App.tsx`
- `mcp/src/*.ts` (8+ files)
- `mcp/dist/*.js` (compiled output)

### CSS imports (2 files)

- `mods/menu/ui/src/index.css`
- `mods/settings/ui/src/index.css`

### Build config (1 file)

- `sdk/ui/vite.config.ts` — library name field

### Documentation (~20 files)

- `CLAUDE.md` (root)
- `sdk/typescript-sdk/CLAUDE.md`
- `docs/plans/*.md` — design/plan documents

## What stays the same

- Asset reference format (`mod-name:asset-name`)
- Directory names (`sdk/typescript-sdk/`, `sdk/ui/`)
- API surface and behavior
- Build outputs and structure

## Verification

- `npm run build` in `sdk/typescript-sdk/` and `sdk/ui/`
- Reinstall dependencies in consumer packages
