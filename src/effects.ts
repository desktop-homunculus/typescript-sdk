import {host} from "./host";

/**
 * Effects API namespace for playing visual and audio effects.
 *
 * Provides functionality to trigger various effects that enhance the user experience,
 * including sound effects and visual stamp effects.
 *
 * @example
 * ```typescript
 * // Play a sound effect
 * await effects.sound("notification-ding");
 *
 * // Show a stamp effect
 * await effects.stamp("heart-reaction", {
 *   width: 100,
 *   height: 100,
 *   duration: 2.0
 * });
 * ```
 */
export namespace effects {
    /**
     * Configuration options for stamp visual effects.
     */
    export interface StampOptions {
        /** X position on screen. */
        x?: number;
        /** Y position on screen. */
        y?: number;
        /** Width in pixels. */
        width?: number;
        /** Height in pixels. */
        height?: number;
        /** Opacity (0-1). */
        alpha?: number;
        /** Duration in seconds. */
        duration?: number;
    }

    /**
     * Plays a sound effect from a mod asset.
     *
     * @param asset - The asset ID of the sound effect.
     */
    export const sound = async (asset: string) => {
        await host.post(host.createUrl(`effects/sounds`), {
            asset,
        });
    }

    /**
     * Displays a visual stamp effect on the screen.
     *
     * @param asset - The asset ID of the stamp image.
     * @param options - Optional configuration for the stamp appearance
     *
     * @example
     * ```typescript
     * await effects.stamp("thumbs-up");
     *
     * await effects.stamp("heart", {
     *   x: 100,
     *   y: 200,
     *   width: 80,
     *   height: 80,
     *   duration: 1.5
     * });
     * ```
     */
    export const stamp = async (
        asset: string,
        options?: StampOptions,
    ) => {
        await host.post(host.createUrl(`effects/stamps`), {
            asset,
            ...options,
        });
    }
}
