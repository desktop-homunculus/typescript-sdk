# Ecosystem & Meta-Info Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Clean up package.json, tsconfig.json, rollup.config.ts, and CLAUDE.md to fix misplaced dependencies, remove dead code, and align documentation with reality.

**Architecture:** Configuration-only changes across 4 files. No source code logic changes. Verification via build and type-check.

**Tech Stack:** npm, TypeScript, Rollup

---

### Task 1: Fix package.json dependencies and metadata

**Files:**
- Modify: `sdk/typescript-sdk/package.json`

**Step 1: Update package.json**

Replace the full file with the corrected version:

```json
{
  "name": "@homunculus/sdk",
  "version": "1.0.0",
  "description": "TypeScript SDK for building mods and extensions for Desktop Homunculus",
  "author": "notelm",
  "license": "ISC",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "default": "./dist/index.js"
    }
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "keywords": [],
  "scripts": {
    "dev": "rollup -c --configPlugin typescript --watch",
    "build": "rollup -c --configPlugin typescript",
    "prepare": "npm run build",
    "check-types": "tsc --noEmit",
    "tsc": "rimraf dist && tsc --watch",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/desktop-homunculus/typescript-sdk.git",
    "directory": "sdk/typescript-sdk"
  },
  "files": [
    "dist"
  ],
  "packageManager": "npm@11.8.0",
  "dependencies": {
    "eventsource": "^4.1.0"
  },
  "devDependencies": {
    "@rollup/plugin-typescript": "^11.1.6",
    "@types/node": "^20.19.33",
    "rimraf": "^6.1.2",
    "rollup": "^4.57.1",
    "rollup-plugin-dts": "^6.3.0",
    "tslib": "^2.8.1",
    "typescript": "^5.9.3"
  }
}
```

**Changes from original:**
- Removed from `dependencies`: `typescript` (^5.9.3), `ts-node` (^10.9.2)
- Removed from `devDependencies`: `fast-glob`, `@rollup/plugin-commonjs`, `@rollup/plugin-node-resolve`, `@rollup/plugin-terser`
- Updated `devDependencies.typescript` from `^5.4.5` to `^5.9.3`
- Added `"sideEffects": false`
- Added `"engines": { "node": ">=20.0.0" }`
- Added `"check-types": "tsc --noEmit"` script
- Updated `description`
- Added `"directory"` to `repository`
- Added `"default"` to `exports`

**Step 2: Regenerate lockfile**

Run: `cd sdk/typescript-sdk && rm -rf node_modules package-lock.json && npm install`
Expected: Clean install with fewer packages (removed deps are gone).

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "fix: clean up dependencies and package.json metadata"
```

---

### Task 2: Fix tsconfig.json

**Files:**
- Modify: `sdk/typescript-sdk/tsconfig.json`

**Step 1: Update tsconfig.json**

Replace with:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "bundler",
    "declaration": true,
    "newLine": "lf",
    "pretty": true,
    "outDir": "./dist",
    "strict": true,
    "skipLibCheck": true,
    "rootDir": "./src",
    "esModuleInterop": true
  },
  "include": [
    "src"
  ]
}
```

**Changes:**
- Added `"moduleResolution": "bundler"`
- Added `"esModuleInterop": true`
- Changed `include` from `["src/*"]` to `["src"]`

**Step 2: Verify type checking**

Run: `npm run check-types`
Expected: No errors (exit code 0).

**Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "fix: add moduleResolution bundler and esModuleInterop to tsconfig"
```

---

### Task 3: Clean up rollup.config.ts

**Files:**
- Modify: `sdk/typescript-sdk/rollup.config.ts`

**Step 1: Replace rollup.config.ts with cleaned version**

```typescript
import typescript from '@rollup/plugin-typescript';
import {defineConfig} from 'rollup'
import * as path from "node:path";
import {fileURLToPath} from "node:url";
import {dts} from "rollup-plugin-dts";

export default defineConfig([
    {
        input: path.join(path.dirname(fileURLToPath(import.meta.url)), 'src', 'index.ts'),
        output: [
            {
                format: 'esm',
                dir: './dist',
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name.includes('node_modules')) {
                        return chunkInfo.name.replace('node_modules', 'external') + '.js'
                    }

                    return '[name].js'
                }
            },
            {
                format: 'cjs',
                dir: './dist',
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name.includes('node_modules')) {
                        return chunkInfo.name.replace('node_modules', 'external') + '.cjs'
                    }

                    return '[name].cjs'
                }
            },
        ],
        plugins: [
            typescript({
                declaration: true,
                declarationDir: 'dist/types',
                rootDir: 'src',
                target: "esnext",
                module: "esnext",
            }),
        ],
    },
    {
        input: 'dist/types/index.d.ts',
        output: {file: 'dist/index.d.ts', format: 'es'},
        plugins: [dts()]
    },
]);
```

**Removed:**
- Unused imports: `nodeResolve`, `commonjs`, `terser`, commented `fg`/`copyFileSync`
- Commented-out IIFE/Deno build config (~20 lines)
- Commented-out CEF build config (~20 lines)
- Commented-out `makeFlatPackageInDist` function (~10 lines)

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds, `dist/` contains `.js`, `.cjs`, `.d.ts` files.

**Step 3: Commit**

```bash
git add rollup.config.ts
git commit -m "chore: remove dead code from rollup config"
```

---

### Task 4: Update CLAUDE.md documentation

**Files:**
- Modify: `sdk/typescript-sdk/CLAUDE.md`

**Step 1: Update Build System section**

Change lines 22-26 from:

```markdown
Rollup produces three outputs from `src/index.ts`:

1. **ESM + CJS modules** (`dist/*.js`, `dist/*.cjs`) — `preserveModules: true` keeps one output file per source file for tree-shaking
2. **Bundled type definitions** (`dist/index.d.ts`) — assembled from individual `dist/types/*.d.ts` via `rollup-plugin-dts`
3. **IIFE bundle for Deno** (`../../assets/scripts/denoMain.js`) — minified with Terser, exposes the SDK as `Deno.api`
```

To:

```markdown
Rollup produces two outputs from `src/index.ts`:

1. **ESM + CJS modules** (`dist/*.js`, `dist/*.cjs`) — `preserveModules: true` keeps one output file per source file for tree-shaking
2. **Bundled type definitions** (`dist/index.d.ts`) — assembled from individual `dist/types/*.d.ts` via `rollup-plugin-dts`
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update build system description to match current config"
```

---

### Task 5: Final verification

**Step 1: Clean build from scratch**

Run: `rm -rf dist && npm run build`
Expected: Build succeeds.

**Step 2: Type check**

Run: `npm run check-types`
Expected: No errors.

**Step 3: Verify dist output**

Run: `ls dist/`
Expected: `.js`, `.cjs`, `.d.ts` files for each module, plus `index.d.ts` and `types/` directory.
