# OpenAPI Alignment Design

Align the TypeScript SDK (`@homunculus/sdk`) with the OpenAPI spec at `docs/api/open-api.yml`.

## 1. Modules to Delete

Remove these modules (not in OpenAPI):
- `gpt.ts`
- `settings.ts`
- `mods.ts`
- `scripts.ts`
- `functions.ts`
- `vrma.ts` (merged into `vrm.ts`)

Remove their exports from `index.ts`.

## 2. Type Changes (`math.ts`)

**Add:**
- `Quat { x, y, z, w }`
- `TransformArgs { translation?: Vec3; rotation?: Quat; scale?: Vec3 }` (object form, for spawn)
- `GlobalViewport { x, y }` (alias-like, semantic distinction from Vec2)
- `DisplayInfo { width, height, x, y, scale_factor }`
- `IVec2 { x, y }` (integer Vec2, if needed)
- VRM-related types: `VrmaRepeat`, `VrmaPlayRequest`, `VrmaState`, `VrmaInfo`, `VrmaSpeedBody`, `SpringBoneProps`, `SpringBoneChain`, `SpringBoneChainsResponse`, `ExpressionsResponse`, `ExpressionWeightResponse`, `MoveToArgs`, `VrmStateResponse`, `VrmStateRequest`, `VoiceVoxRequest`, `SubtitleOptions`
- Webview types: `WebviewInfo`, `WebviewOpenOptions`, `WebviewPatchRequest`, `WebviewNavigateRequest`, `SetLinkedVrmRequest`
- Effect types: `StampRequestBody`
- Shadow panel types: `ShadowPanelPutBody`

**Remove:**
- `Rect` (not in OpenAPI)

**Keep unchanged:**
- `Vec2`, `Vec3`, `Transform` (array form for entities)

## 3. Host Changes (`host.ts`)

Add `patch(url: URL, body?: any): Promise<Response>` method.

## 4. VRM Module (`vrm.ts`)

### Path changes
| Old                       | New               |
| ------------------------- | ----------------- |
| `GET vrm/all`             | `GET /vrm`        |
| `GET vrm/all?stream=true` | `GET /vrm/stream` |

### Static method changes
- `Vrm.findAllMetadata()` -> `GET /vrm`
- `Vrm.findAll()` -> `GET /vrm`
- `Vrm.findByName(name)` -> `GET /vrm?name=` (no longer via entities)
- `Vrm.streamAllMetadata()` -> EventSource at `/vrm/stream`
- `Vrm.streamAll()` -> wraps streamAllMetadata

### New instance methods
- `despawn()` -> `DELETE /vrm/{entity_id}/despawn`
- `moveTo(globalViewport)` -> `POST /vrm/{entity_id}/move`
- `expressions()` -> `GET /vrm/{entity_id}/expressions`
- `setExpressions(weights)` -> `PUT /vrm/{entity_id}/expressions`
- `expression(name)` -> `GET /vrm/{entity_id}/expressions/{name}`
- `setExpression(name, weight)` -> `PUT /vrm/{entity_id}/expressions/{name}`
- `springBones()` -> `GET /vrm/{entity_id}/spring-bones`
- `springBone(chainId)` -> `GET /vrm/{entity_id}/spring-bones/{chain_id}`
- `setSpringBone(chainId, props)` -> `PUT /vrm/{entity_id}/spring-bones/{chain_id}`
- `allVrma()` -> `GET /vrm/{entity_id}/vrma/all`

### VRMA methods (merged from vrma.ts)
- `playVrma(options)` -> `POST /vrm/{entity_id}/vrma/play`
- `stopVrma(source)` -> `POST /vrm/{entity_id}/vrma/stop?source=`
- `vrmaState(source)` -> `GET /vrm/{entity_id}/vrma/state?source=`
- `setVrmaSpeed(source, speed)` -> `PUT /vrm/{entity_id}/vrma/speed`
- Keep `vrma(source)` -> `GET /vrm/{entity_id}/vrma?source=` (returns entity ID)

### Event types
Add to EventMap:
- `expression-change`
- `vrma-play`
- `vrma-finish`
- `pointer-move` (if missing)

### VoiceVox
Body already matches. Ensure `SubtitleOptions` type matches OpenAPI.

## 5. Coordinates Module (rename `cameras.ts` -> `coordinates.ts`)

- Rename file and namespace
- `worldToGlobalViewport()` -> `GET /coordinates/to-viewport`
- `globalViewportToWorld2d()` -> `GET /coordinates/to-world`

## 6. Displays Module (`displays.ts`)

- Change `Display` type to `DisplayInfo`: `{ width, height, x, y, scale_factor }`
- `findAll()` returns `DisplayInfo[]`

## 7. Effects Module (`effects.ts`)

- `stamp()` body changes to: `{ source, x?, y?, width?, height?, alpha?, duration? }`
- Remove old `StampOptions` (display, bounds, size, durationSecs)
- New `StampOptions`: `{ x?, y?, width?, height?, alpha?, duration? }`

## 8. Webviews Module (`webviews.ts`)

### Path/method changes
- `close()` -> `DELETE /webviews/{entity_id}` (was POST close)

### New methods
- `static all()` -> `GET /webviews` returns `WebviewInfo[]`
- `info()` -> `GET /webviews/{entity_id}` returns `WebviewInfo`
- `patch(options)` -> `PATCH /webviews/{entity_id}`
- `setOffset(offset: Vec2)` -> `PUT /webviews/{entity_id}/offset`
- `setSize(size: Vec2)` -> `PUT /webviews/{entity_id}/size`
- `setViewportSize(size: Vec2)` -> `PUT /webviews/{entity_id}/viewport-size`
- `navigate(source)` -> `POST /webviews/{entity_id}/navigate`
- `reload()` -> `POST /webviews/{entity_id}/reload`
- `screenshot()` -> `GET /webviews/{entity_id}/screenshot`

### Type changes
- `WebviewOpenOptions`: remove `sounds`, `viewportSize` is `[number, number]`
- Remove `LocalWebviewOptions` / `openLocal`
- Add `WebviewInfo`, `WebviewPatchRequest`, `WebviewNavigateRequest`

## 9. Shadow Panel (`shadowPanel.ts`)

- `setAlpha()` body: `{ alpha, speaker?, subtitle? }` (add speaker/subtitle)

## 10. Preferences (`preferences.ts`)

- Remove `loadVrmTransform` / `saveVrmTransform`

## 11. No Changes Required

- `app.ts` (POST /app/exit matches)
- `entities.ts` (all endpoints match)
- `commands.ts` (all endpoints match)

## 12. index.ts

Remove deleted module exports. Add new exports. Rename cameras -> coordinates.
