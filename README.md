# hmcl-sdk

TypeScript SDK for building mods and extensions for [Desktop Homunculus](https://github.com/not-elm/desktop_homunculus).

## Install

```bash
npm install hmcl-sdk@https://github.com/desktop-homunculus/typescript-sdk
```

## Quick Start

```typescript
import { Vrm } from "hmcl-sdk";
// Spawn a VRM character
const vrm = await Vrm.spawn("my-mod:avatar");
```

## License

LGPL-3.0-only