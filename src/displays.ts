import {DisplayInfo} from "./math";
import {host} from "./host";

/**
 * Displays API namespace for monitor and screen management.
 *
 * Provides functionality to query information about connected displays/monitors,
 * including their dimensions, positions, and scale factors.
 *
 * @example
 * ```typescript
 * const allDisplays = await displays.findAll();
 * console.log(`Found ${allDisplays.length} displays`);
 * allDisplays.forEach((display, index) => {
 *   console.log(`Display ${index + 1}: ${display.width}x${display.height} at (${display.x}, ${display.y})`);
 * });
 * ```
 */
export namespace displays {
    /**
     * Retrieves information about all currently connected displays/monitors.
     *
     * @returns A promise that resolves to an array of display information
     *
     * @example
     * ```typescript
     * const allDisplays = await displays.findAll();
     * console.log(`System has ${allDisplays.length} displays`);
     * ```
     */
    export const findAll = async (): Promise<DisplayInfo[]> => {
        const response = await host.get(host.createUrl("displays"));
        return await response.json() as DisplayInfo[];
    }
}
