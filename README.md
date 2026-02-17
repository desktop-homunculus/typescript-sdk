# @homunculus/sdk

TypeScript SDK for building mods and extensions for [Desktop Homunculus](https://github.com/not-elm/desktop_homunculus) — a cross-platform desktop mascot application built with the Bevy game engine.

## Install

```bash
npm install @homunculus/sdk@https://github.com/desktop-homunculus/typescript-sdk
```

## Quick Start

```typescript
import { Vrm } from "@homunculus/sdk";
// Spawn a VRM character
const vrm = await Vrm.spawn("my-mod:avatar");
```

## License

LGPL-3.0-only