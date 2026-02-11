import {host} from "./host";
import {
    WebviewOpenOptions,
    WebviewInfo,
    WebviewPatchRequest,
    Vec2,
} from "./math";
import {Vrm} from "./vrm";

/**
 * Webview management for creating and controlling embedded web interfaces.
 *
 * Desktop Homunculus uses webviews to provide rich UI experiences that can be
 * positioned anywhere in 3D space or attached to VRM characters.
 *
 * @example
 * ```typescript
 * const webview = await Webview.open({
 *   source: "my-mod::ui.html",
 *   transform: {
 *     translation: { x: 0, y: 1.5, z: 0 },
 *   },
 *   viewportSize: [800, 600]
 * });
 *
 * if (!(await webview.isClosed())) {
 *   await webview.close();
 * }
 * ```
 */

/**
 * Represents a webview instance that can display HTML content in 3D space.
 */
export class Webview {
    constructor(readonly entity: number) {
        this.entity = entity;
    }

    /**
     * Closes the webview.
     */
    async close(): Promise<void> {
        await host.deleteMethod(host.createUrl(`webviews/${this.entity}`));
    }

    /**
     * Checks whether this webview has been closed.
     *
     * @returns A promise that resolves to true if the webview is closed
     */
    async isClosed(): Promise<boolean> {
        const response = await host.get(host.createUrl(`webviews/${this.entity}/is-closed`));
        return await response.json();
    }

    /**
     * Gets information about this webview.
     *
     * @returns A promise that resolves to the webview info
     */
    async info(): Promise<WebviewInfo> {
        const response = await host.get(host.createUrl(`webviews/${this.entity}`));
        return await response.json() as WebviewInfo;
    }

    /**
     * Patches webview properties (offset, size, viewportSize).
     *
     * @param options - The properties to update
     */
    async patch(options: WebviewPatchRequest): Promise<void> {
        await host.patch(host.createUrl(`webviews/${this.entity}`), options);
    }

    /**
     * Sets the offset of the webview.
     *
     * @param offset - The new offset
     */
    async setOffset(offset: Vec2): Promise<void> {
        await host.put(host.createUrl(`webviews/${this.entity}/offset`), offset);
    }

    /**
     * Sets the size of the webview.
     *
     * @param size - The new size
     */
    async setSize(size: Vec2): Promise<void> {
        await host.put(host.createUrl(`webviews/${this.entity}/size`), size);
    }

    /**
     * Sets the viewport size of the webview.
     *
     * @param size - The new viewport size
     */
    async setViewportSize(size: Vec2): Promise<void> {
        await host.put(host.createUrl(`webviews/${this.entity}/viewport-size`), size);
    }

    /**
     * Navigates the webview to a new source.
     *
     * @param source - The new source URL or mod asset path
     */
    async navigate(source: string): Promise<void> {
        await host.post(host.createUrl(`webviews/${this.entity}/navigate`), {source});
    }

    /**
     * Reloads the webview content.
     */
    async reload(): Promise<void> {
        await host.post(host.createUrl(`webviews/${this.entity}/reload`));
    }

    /**
     * Takes a screenshot of the webview.
     *
     * @returns The raw Response containing the PNG image
     */
    async screenshot(): Promise<Response> {
        return await host.get(host.createUrl(`webviews/${this.entity}/screenshot`));
    }

    /**
     * Gets the VRM linked to this webview.
     *
     * @returns The linked VRM instance, or undefined if no VRM is linked
     */
    async linkedVrm(): Promise<Vrm | undefined> {
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
     */
    async setLinkedVrm(vrm: Vrm): Promise<void> {
        await host.put(
            host.createUrl(`webviews/${this.entity}/linked-vrm`),
            {vrm: vrm.entity}
        );
    }

    /**
     * Removes the VRM link from this webview.
     */
    async unlinkVrm(): Promise<void> {
        await host.deleteMethod(
            host.createUrl(`webviews/${this.entity}/linked-vrm`)
        );
    }

    /**
     * Gets all open webviews.
     *
     * @returns A promise that resolves to an array of webview info
     */
    static async all(): Promise<WebviewInfo[]> {
        const response = await host.get(host.createUrl("webviews"));
        return await response.json() as WebviewInfo[];
    }

    /**
     * Creates and opens a webview positioned in world space.
     *
     * @param options - Configuration for the webview
     * @returns A promise that resolves to a new Webview instance
     *
     * @example
     * ```typescript
     * const panel = await Webview.open({
     *   source: "my-mod::settings.html",
     *   transform: {
     *     translation: { x: 0, y: 2, z: -1 },
     *   },
     *   viewportSize: [800, 600]
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
     * @returns The current Webview instance, or undefined if not in a webview context
     */
    static current(): Webview | undefined {
        //@ts-ignore
        const entity: number | undefined = window.WEBVIEW_ENTITY;
        return entity !== undefined ? new Webview(entity) : undefined;
    }
}
