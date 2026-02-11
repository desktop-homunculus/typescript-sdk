import {host} from "./host";

/**
 * Provides access to the application API.
 */
export namespace app {
    /**
     * Exits the application without any problems.
     */
    export const exit = async () => {
        await host.post(host.createUrl("app/exit"));
    }

    /**
     * Checks if the Desktop Homunculus server is running and healthy.
     *
     * Returns `true` if the server responds with a successful health check,
     * `false` if the server is unreachable or unhealthy.
     *
     * @example
     * ```typescript
     * const alive = await app.health();
     * if (!alive) {
     *   console.error("Homunculus server is not running");
     * }
     * ```
     */
    export const health = async (): Promise<boolean> => {
        try {
            const response = await fetch(host.createUrl("health"));
            return response.ok;
        } catch {
            return false;
        }
    }
}