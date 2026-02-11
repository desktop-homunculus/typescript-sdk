/**
 * Mathematical types and interfaces for 3D graphics and spatial calculations.
 *
 * This module provides type definitions for common mathematical concepts used
 * throughout the Desktop Homunculus SDK, including transforms, vectors, and
 * domain-specific request/response types.
 * These types are designed to be compatible with Bevy's math system.
 *
 * @example
 * ```typescript
 * // Working with transforms
 * const transform: TransformArgs = {
 *   translation: { x: 0, y: 100, z: 0 },
 *   rotation: { x: 0, y: 0, z: 0, w: 1 },
 *   scale: { x: 1, y: 1, z: 1 }
 * };
 *
 * // Working with vectors
 * const position: Vec3 = { x: 10, y: 20, z: 30 };
 * const screenPos: Vec2 = { x: 1920, y: 1080 };
 * ```
 */

/**
 * Represents a 3D transformation containing position, rotation, and scale.
 *
 * This is the core type for positioning objects in 3D space. All spatial
 * operations in Desktop Homunculus use this transform representation,
 * which is compatible with Bevy's Transform component.
 *
 * @example
 * ```typescript
 * const identity: Transform = {
 *   translation: [0, 0, 0],
 *   rotation: [0, 0, 0, 1],
 *   scale: [1, 1, 1]
 * };
 * ```
 */
export interface Transform {
    /**
     * The position of the entity in world space.
     * Format: [x, y, z] where Y is typically up in Bevy's coordinate system.
     */
    translation: [number, number, number];
    /**
     * The rotation of the entity in world space, represented as a quaternion.
     * Format: [x, y, z, w] where [0, 0, 0, 1] represents no rotation (identity).
     */
    rotation: [number, number, number, number];
    /**
     * The scale of the entity in world space.
     * Format: [x, y, z] where [1, 1, 1] represents normal size.
     */
    scale: [number, number, number];
}

/**
 * Represents a 2D vector with x and y components.
 * Used for screen coordinates, UI positions, and 2D math operations.
 */
export interface Vec2 {
    /** The x-coordinate of the vector */
    x: number;
    /** The y-coordinate of the vector */
    y: number;
}

/**
 * Represents a 3D vector with x, y, and z components.
 * Used for 3D positions, directions, and mathematical calculations.
 */
export interface Vec3 {
    /** The x-coordinate of the vector */
    x: number;
    /** The y-coordinate of the vector */
    y: number;
    /** The z-coordinate of the vector */
    z: number;
}

/** Represents a quaternion rotation. */
export interface Quat {
    x: number;
    y: number;
    z: number;
    w: number;
}

/** Transform arguments using object form (Vec3/Quat) for API requests. */
export interface TransformArgs {
    translation?: Vec3;
    rotation?: Quat;
    scale?: Vec3;
}

/** Display information returned from the displays endpoint. */
export interface DisplayInfo {
    width: number;
    height: number;
    x: number;
    y: number;
    scale_factor: number;
}

/** Global viewport coordinates (screen-space position). */
export interface GlobalViewport {
    x: number;
    y: number;
}

// --- Persona types ---

/**
 * Big Five personality traits (OCEAN model).
 *
 * @example
 * ```typescript
 * const ocean: Ocean = {
 *   openness: 0.8,
 *   conscientiousness: 0.6,
 *   extraversion: 0.7,
 * };
 * ```
 */
export interface Ocean {
    /** Openness (0.0=conservative, 1.0=curious) */
    openness?: number;
    /** Conscientiousness (0.0=spontaneous, 1.0=organized) */
    conscientiousness?: number;
    /** Extraversion (0.0=introverted, 1.0=extroverted) */
    extraversion?: number;
    /** Agreeableness (0.0=independent, 1.0=cooperative) */
    agreeableness?: number;
    /** Neuroticism (0.0=stable, 1.0=sensitive) */
    neuroticism?: number;
}

/**
 * Persona data for a VRM character.
 *
 * @example
 * ```typescript
 * const persona: Persona = {
 *   profile: "A cheerful virtual assistant",
 *   personality: "Friendly and helpful",
 *   ocean: { openness: 0.8, extraversion: 0.7 },
 *   metadata: {},
 * };
 * ```
 */
export interface Persona {
    /** Character profile/background description. */
    profile: string;
    /** Personality description in natural language. */
    personality?: string | null;
    /** Big Five personality parameters. */
    ocean: Ocean;
    /** Extension metadata for MODs. */
    metadata: Record<string, unknown>;
}

// --- VRM types ---

/** Response for VRM state queries. */
export interface VrmStateResponse {
    state: string;
}

/** Request body for setting VRM state. */
export interface VrmStateRequest {
    state: string;
}

/** Options for subtitle display during speech. */
export interface SubtitleOptions {
    /** The mod asset ID of the font to use for the subtitle text. */
    font?: string;
    /** The font size of the subtitle text. */
    fontSize?: number;
    /** The color of the subtitle text [r, g, b, a] in 0-1 range. */
    color?: [number, number, number, number];
}

/** Request body for VoiceVox speech synthesis. */
export interface VoiceVoxRequest {
    sentences: string[];
    speaker?: number;
    pause?: number;
    waitForCompletion?: boolean;
    subtitle?: SubtitleOptions;
}

/** Response for VRM expression queries. */
export interface ExpressionsResponse {
    available: string[];
    current: Record<string, number>;
}

/** Response for a single expression weight query. */
export interface ExpressionWeightResponse {
    weight: number;
}

/** Arguments for moving a VRM to a viewport position. */
export interface MoveToArgs {
    globalViewport: GlobalViewport;
}

/** Spring bone physics properties. */
export interface SpringBoneProps {
    stiffness: number;
    dragForce: number;
    gravityPower: number;
    gravityDir: [number, number, number];
    hitRadius: number;
}

/** A single spring bone chain. */
export interface SpringBoneChain {
    index: number;
    joints: string[];
    props: SpringBoneProps;
}

/** Response for spring bone chains query. */
export interface SpringBoneChainsResponse {
    chains: SpringBoneChain[];
}

/** Repeat settings for VRMA playback. */
export interface VrmaRepeat {
    type: "forever" | "never" | "count";
    count?: number;
}

/** Request body for playing a VRMA animation. */
export interface VrmaPlayRequest {
    asset: string;
    transitionSecs?: number;
    repeat?: VrmaRepeat;
    waitForCompletion?: boolean;
}

/** State of a VRMA animation. */
export interface VrmaState {
    playing: boolean;
    repeat: string;
    speed: number;
    elapsedSecs: number;
}

/** Info about a VRMA animation entity. */
export interface VrmaInfo {
    entity: number;
    name: string;
    playing: boolean;
}

/** Current look-at state of a VRM. */
export type LookAtState =
    | { type: "cursor" }
    | { type: "target"; entity: number };

/**
 * Snapshot of a VRM instance with full runtime state.
 *
 * @example
 * ```typescript
 * const snapshots = await Vrm.findAllDetailed();
 * for (const s of snapshots) {
 *   console.log(`${s.name}: ${s.state} at (${s.globalViewport?.x}, ${s.globalViewport?.y})`);
 * }
 * ```
 */
export interface VrmSnapshot {
    entity: number;
    name: string;
    state: string;
    transform: Transform;
    globalViewport: GlobalViewport | null;
    expressions: ExpressionsResponse;
    animations: VrmaInfo[];
    lookAt: LookAtState | null;
    linkedWebviews: number[];
    persona: Persona;
}

/**
 * Response from the VRM position endpoint.
 *
 * @example
 * ```ts
 * const vrm = await Vrm.findByName("MyCharacter");
 * const pos = await vrm.position();
 * console.log(`Screen: (${pos.globalViewport?.x}, ${pos.globalViewport?.y})`);
 * console.log(`World: (${pos.world.x}, ${pos.world.y}, ${pos.world.z})`);
 * ```
 */
export interface PositionResponse {
    /** Global screen coordinates (multi-monitor origin at leftmost screen). Null if not visible. */
    globalViewport: GlobalViewport | null;
    /** Bevy world coordinates. */
    world: Vec3;
}

/** Request body for setting VRMA playback speed. */
export interface VrmaSpeedBody {
    asset: string;
    speed: number;
}

// --- Effects types ---

/** Request body for creating a stamp effect. */
export interface StampRequestBody {
    asset: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    alpha?: number;
    duration?: number;
}

// --- Shadow panel types ---

/** Request body for setting shadow panel alpha. */
export interface ShadowPanelPutBody {
    alpha: number;
    speaker?: number;
    subtitle?: SubtitleOptions;
}

// --- Webview types ---

/** Information about a webview instance. */
export interface WebviewInfo {
    entity: number;
    source: string;
    size: Vec2;
    viewportSize: Vec2;
    offset: Vec2;
    linkedVrm?: number | null;
}

/** Options for opening a webview. */
export interface WebviewOpenOptions {
    source: string;
    transform: TransformArgs;
    parent?: number;
    linkedVrm?: number;
    viewportSize?: [number, number];
}

/** Request body for patching webview properties. */
export interface WebviewPatchRequest {
    offset?: Vec2;
    size?: Vec2;
    viewportSize?: Vec2;
}

/** Request body for navigating a webview to a new source. */
export interface WebviewNavigateRequest {
    source: string;
}

/** Request body for setting a webview's linked VRM. */
export interface SetLinkedVrmRequest {
    vrm: number;
}
