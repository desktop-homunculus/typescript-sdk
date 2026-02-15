import {host} from "./host";
import {EventSource} from 'eventsource'

/**
 * Signals API namespace for cross-process communication.
 *
 * Provides a pub/sub mechanism that allows external processes to communicate
 * with the Desktop Homunculus application and its mods through event streaming.
 *
 * Key features:
 * - Real-time event streaming via Server-Sent Events (SSE)
 * - Signal broadcasting to multiple subscribers
 * - Type-safe payload handling
 *
 * @example
 * ```typescript
 * // Listen for custom events from external processes
 * const eventSource = signals.stream<{action: string, data: any}>(
 *   "my-custom-signal",
 *   (payload) => {
 *     console.log("Received signal:", payload.action, payload.data);
 *   }
 * );
 *
 * // Send signals to all listeners
 * await signals.send("my-custom-signal", {
 *   action: "update",
 *   data: { message: "Hello from external app!" }
 * });
 *
 * // Clean up when done
 * eventSource.close();
 * ```
 */
export namespace signals {
    /**
     * Creates a persistent connection to stream signal events of a specific type.
     *
     * This establishes a Server-Sent Events (SSE) connection that will receive
     * all signals sent to the specified signal channel. The connection remains
     * open until explicitly closed.
     *
     * @template V - The type of the payload that will be received
     * @param signal - The signal channel name to subscribe to
     * @param f - Callback function to handle received payloads
     * @returns EventSource instance for managing the connection
     *
     * @example
     * ```typescript
     * // Listen for user interaction events
     * interface UserAction {
     *   type: 'click' | 'hover' | 'scroll';
     *   position: [number, number];
     *   timestamp: number;
     * }
     *
     * const userEventStream = signals.stream<UserAction>(
     *   "user-interactions",
     *   async (action) => {
     *     console.log(`User ${action.type} at`, action.position);
     *     // Process the user action...
     *   }
     * );
     *
     * // Later, close the stream
     * userEventStream.close();
     * ```
     */
    export const stream = <V>(
        signal: string,
        f: (payload: V) => (void | Promise<void>),
    ): EventSource => {
        const url = host.createUrl(`signals/${signal}`);
        const es = new EventSource(url);
        es.addEventListener("message", async (event: MessageEvent) => {
            try {
                const payload: V = JSON.parse(event.data);
                await f(payload);
            } catch (error) {
                console.error(`Error processing signal ${signal}:`, error);
            }
        });
        return es;
    }

    /**
     * Sends a signal payload to all subscribers listening to the specified signal channel.
     *
     * This broadcasts the payload to all active EventSource connections that are
     * streaming the same signal type. The operation is asynchronous and will
     * complete once the signal has been distributed to all subscribers.
     *
     * @template V - The type of the payload being sent
     * @param signal - The signal channel name to broadcast to
     * @param payload - The data to send to all subscribers
     *
     * @throws Will throw an error if the signal broadcast fails
     *
     * @example
     * ```typescript
     * // Send a notification to all mod windows
     * await signals.send("notifications", {
     *   type: "info",
     *   title: "Update Available",
     *   message: "A new version of the character is available",
     *   timestamp: Date.now()
     * });
     *
     * // Send real-time data updates
     * await signals.send("data-update", {
     *   source: "weather-api",
     *   temperature: 72,
     *   conditions: "sunny"
     * });
     *
     * // Trigger actions in mods
     * await signals.send("vrm-action", {
     *   action: "wave",
     *   target: vrmEntity,
     *   duration: 2000
     * });
     * ```
     */
    export const send = async <V>(signal: string, payload: V): Promise<void> => {
        await host.post(host.createUrl(`signals/${signal}`), payload);
    }
}
