import {host} from "./host";
import {SubtitleOptions} from "./math";

/**
 * Shadow Panel API namespace for controlling the application's shadow overlay.
 *
 * The shadow panel is a visual overlay that can be used to create atmospheric
 * effects, focus attention, or provide visual feedback.
 *
 * @example
 * ```typescript
 * await shadowPanel.setAlpha(0.7);
 * const currentAlpha = await shadowPanel.alpha();
 * await shadowPanel.setAlpha(0);
 * ```
 */
export namespace shadowPanel {
    /**
     * Gets the current transparency level of the shadow panel.
     *
     * @returns A promise that resolves to the current alpha value (0-1)
     */
    export const alpha = async () => {
        const response = await host.get(host.createUrl("shadow-panel/alpha"));
        return Number(await response.json());
    }

    /**
     * Sets the transparency level of the shadow panel.
     *
     * @param alpha - The transparency value between 0 (invisible) and 1 (opaque)
     * @param options - Optional speaker and subtitle settings
     *
     * @example
     * ```typescript
     * await shadowPanel.setAlpha(0.7);
     * await shadowPanel.setAlpha(0.5, { speaker: 1 });
     * ```
     */
    export const setAlpha = async (
        alpha: number,
        options?: { speaker?: number; subtitle?: SubtitleOptions }
    ): Promise<void> => {
        await host.put(host.createUrl("shadow-panel/alpha"), {
            alpha,
            ...options,
        });
    }
}
