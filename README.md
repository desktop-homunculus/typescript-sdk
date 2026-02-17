# @homunculus/sdk

TypeScript SDK for building mods and extensions for [Desktop Homunculus](https://github.com/not-elm/desktop_homunculus) — a cross-platform desktop mascot application built with the Bevy game engine.

## Install

```bash
npm install @homunculus/sdk@https://github.com/desktop-homunculus/typescript-sdk
```

## Quick Start

```typescript
import { Vrm, gpt, effects } from "@homunculus/sdk";

// Spawn a VRM character
const vrm = await Vrm.spawn("my-mod::avatar.vrm");

// Chat with AI — the character speaks the response via VoiceVox
const response = await gpt.chat("Hello!", {
  vrm: vrm.entity,
  speaker: 1,
});
console.log(response.message);

// Play a sound effect
await effects.sound("my-mod::notification.wav");
```

## API Overview

| Namespace     | Description                                                               |
| ------------- | ------------------------------------------------------------------------- |
| `Vrm`         | VRM 3D character lifecycle — spawn, find, pointer events, voice synthesis |
| `Vrma`        | VRMA animation management for VRM characters                              |
| `gpt`         | AI chat, model selection, system prompts, web search                      |
| `entities`    | Bevy ECS entity lookup and transform manipulation                         |
| `webviews`    | Embed HTML UIs in 3D space (global or attached to VRM bones)              |
| `effects`     | Sound effects and visual stamps                                           |
| `commands`    | Cross-process pub/sub via SSE                                             |
| `cameras`     | Screen-to-world coordinate transforms                                     |
| `displays`    | Multi-monitor detection and display info                                  |
| `preferences` | Persistent key-value storage (JSON serialized)                            |
| `settings`    | Application configuration                                                 |
| `mods`        | Mod system integration and menu entries                                   |
| `math`        | `Transform`, `Vec2`, `Vec3`, `Rect` types                                 |

## License

LGPL-3.0-only