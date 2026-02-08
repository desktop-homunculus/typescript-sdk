import {host} from "./host";
import {Transform} from "./math";
import {Vrm} from "./vrm";

/**
 * Webview management for creating and controlling embedded web interfaces.
 *
 * Desktop Homunculus uses webviews to provide rich UI experiences that can be
 * positioned anywhere in 3D space or attached to VRM characters. Webviews can
 * display HTML/CSS/JavaScript content from mod assets and provide interactive
 * interfaces for users.
 *
 * Key features:
 * - 3D positioned webviews in world space (global webviews)
 * - VRM bone-attached webviews that follow characters (local webviews)
 * - Transparent and styled webview windows
 * - Mod asset integration for custom HTML content
 * - Cross-webview communication via commands API
 *
 * @example
 * ```typescript
 * // Open a global webview at a fixed world position
 * const webview = await Webview.open({
 *   source: "my-mod::ui.html",
 *   transform: {
 *     translation: [0, 1.5, 0],
 *     rotation: [0, 0, 0, 1],
 *     scale: [1, 1, 1]
 *   },
 *   viewportSize: [800, 600]
 * });
 *
 * // Open a local webview attached to a VRM character's head
 * const chatBubble = await Webview.openLocal({
 *   source: "chat-mod::bubble.html",
 *   vrm: vrmEntity,
 *   bone: "head",
 *   offset: [0, 0.3, 0],
 *   viewportSize: [400, 300]
 * });
 *
 * // Check if webview is still open
 * if (!(await webview.isClosed())) {
 *   await webview.close();
 * }
 * ```
 */

/**
 * Sound options for webview open/close events.
 */
export interface WebviewSoundOptions {
    /**
     * Sound to play when the webview is opened.
     * This can be a mod asset sound file path.
     */
    open?: string;
    /**
     * Sound to play when the webview is closed.
     * This can be a mod asset sound file path.
     */
    close?: string;
}

/**
 * Configuration options for opening a global webview in world space.
 */
export interface WebviewOpenOptions {
    /**
     * The source local path (relative to `assets/mods`) or URL to display.
     * Format: "mod-name::path/to/file.html" or a full URL.
     */
    source: string;
    /**
     * 3D transform (position, rotation, scale) in world space.
     */
    transform: Transform;
    /**
     * Parent entity ID to attach the webview to (optional).
     */
    parent?: number;
    /**
     * VRM entity ID to associate with this webview (optional).
     * This creates a metadata link, not a parent-child relationship.
     */
    linkedVrm?: number;
    /**
     * Viewport resolution in pixels [width, height].
     * @defaultValue [800, 800]
     */
    viewportSize?: [number, number];
    /**
     * Sound effects for open/close events.
     */
    sounds?: WebviewSoundOptions;
}

/**
 * Configuration options for opening a local webview attached to a VRM bone.
 */
export interface LocalWebviewOptions {
    /**
     * The source local path (relative to `assets/mods`) or URL to display.
     * Format: "mod-name::path/to/file.html" or a full URL.
     */
    source: string;
    /**
     * VRM entity ID to attach the webview to.
     */
    vrm: number;
    /**
     * Bone name to attach the webview to (e.g., "head", "neck", "spine").
     */
    bone: string;
    /**
     * Translation offset from the bone position [x, y, z].
     * @defaultValue [0, 0, 0]
     */
    offset?: [number, number, number];
    /**
     * Viewport resolution in pixels [width, height].
     * @defaultValue [800, 800]
     */
    viewportSize?: [number, number];
    /**
     * Sound effects for open/close events.
     */
    sounds?: WebviewSoundOptions;
}

/**
 * Represents a webview instance that can display HTML content in 3D space.
 *
 * Webviews are embedded browser windows that can render mod assets and provide
 * interactive user interfaces. They can be positioned freely in 3D space or
 * attached to VRM characters.
 */
export class Webview {
    constructor(readonly entity: number) {
        this.entity = entity;
    }

    /**
     * Closes the webview.
     *
     * @example
     * ```ts
     * await webview.close();
     * ```
     */
    async close(): Promise<void> {
        await host.post(host.createUrl(`webviews/${this.entity}/close`));
    }

    /**
     * Checks whether this webview has been closed.
     *
     * @returns A promise that resolves to true if the webview is closed
     * @example
     * ```typescript
     * if (await webview.isClosed()) {
     *   console.log("Webview was closed");
     * } else {
     *   console.log("Webview is still open");
     * }
     * ```
     */
    async isClosed(): Promise<boolean> {
        const response = await host.get(host.createUrl(`webviews/${this.entity}/is-closed`));
        return await response.json();
    }

    /**
     * Gets the VRM linked to this webview.
     *
     * @returns The linked VRM instance, or undefined if no VRM is linked
     *
     * @example
     * ```typescript
     * const webview = Webview.current();
     * const vrm = await webview?.linkedVrm();
     * if (vrm) {
     *   console.log("Linked to VRM:", vrm.entity);
     * }
     * ```
     */
    async linkedVrm(): Promise<Vrm | undefined> {
        console.log("linked path", host.createUrl(`webviews/${this.entity}/linked-vrm`))
        const response = await host.get(
            host.createUrl(`webviews/${this.entity}/linked-vrm`)
        );
        const entity = await response.json();
        return entity !== null ? new Vrm(entity) : undefined;
    }

    /**
     * Links this webview to a VRM entity.
     *
     * @param vrm - The VRM to link to this webview
     *
     * @example
     * ```typescript
     * const webview = Webview.current();
     * const vrm = await Vrm.findByName("MyCharacter");
     * await webview?.setLinkedVrm(vrm);
     * ```
     */
    async setLinkedVrm(vrm: Vrm): Promise<void> {
        await host.put(
            host.createUrl(`webviews/${this.entity}/linked-vrm`),
            { vrm: vrm.entity }
        );
    }

    /**
     * Removes the VRM link from this webview.
     *
     * @example
     * ```typescript
     * const webview = Webview.current();
     * await webview?.unlinkVrm();
     * ```
     */
    async unlinkVrm(): Promise<void> {
        await host.deleteMethod(
            host.createUrl(`webviews/${this.entity}/linked-vrm`)
        );
    }

    /**
     * Creates and opens a global webview positioned in absolute world coordinates.
     *
     * Global webviews exist independently in 3D space and don't follow any entity.
     * Use this for fixed UI panels, world-space menus, or standalone interfaces.
     *
     * @param options - Configuration for the global webview
     * @returns A promise that resolves to a new Webview instance
     *
     * @example
     * ```typescript
     * // Create a floating UI panel in world space
     * const panel = await Webview.open({
     *   source: "my-mod::settings.html",
     *   transform: {
     *     translation: [0, 2, -1],      // 2 units up, 1 unit back
     *     rotation: [0, 0, 0, 1],       // No rotation
     *     scale: [1, 1, 1]              // Normal size
     *   },
     *   viewportSize: [800, 600],
     *   sounds: {
     *     open: "my-mod::open.wav",
     *     close: "my-mod::close.wav"
     *   }
     * });
     * ```
     */
    static async open(options: WebviewOpenOptions): Promise<Webview> {
        const response = await host.post(host.createUrl(`webviews`), options);
        return new Webview(Number(await response.json()));
    }

    /**
     * Gets the current webview instance if called from within a webview context.
     *
     * This static method allows code running inside a webview to get a reference
     * to its own Webview instance for self-management operations.
     *
     * @returns The current Webview instance, or undefined if not in a webview context
     *
     * @example
     * ```typescript
     * // From within a webview's JavaScript code
     * const currentWebview = Webview.current();
     * if (currentWebview) {
     *   // This code is running inside a webview
     *   console.log("Webview entity ID:", currentWebview.entity);
     *
     *   // The webview can close itself
     *   await currentWebview.close();
     * } else {
     *   // This code is running outside of a webview context
     *   console.log("Not running in a webview");
     * }
     * ```
     */
    static current(): Webview | undefined {
        //@ts-ignore
        const entity: number | undefined = window.WEBVIEW_ENTITY;
        return entity !== undefined ? new Webview(entity) : undefined;
    }
}