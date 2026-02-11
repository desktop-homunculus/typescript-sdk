import {host} from "./host";

/**
 * Preferences API namespace for persistent data storage and user settings.
 *
 * Provides a key-value store for saving and loading application data that persists
 * across sessions.
 *
 * @example
 * ```typescript
 * await preferences.save('user-settings', { theme: 'dark', volume: 0.8 });
 * const settings = await preferences.load<{ theme: string; volume: number }>('user-settings');
 * ```
 */
export namespace preferences {
    /**
     * Loads a value from the preference store with type safety.
     *
     * @template V - The expected type of the stored value
     * @param key - The unique identifier for the stored data
     * @returns A promise that resolves to the deserialized value
     * @throws Will throw an error if the key does not exist or cannot be parsed
     *
     * @example
     * ```typescript
     * const username = await preferences.load<string>('username');
     * ```
     */
    export const load = async <V>(key: string): Promise<V> => {
        const response = await host.get(host.createUrl(`preferences/${key}`));
        return await response.json() as V;
    }

    /**
     * Saves a value to the preference store with automatic serialization.
     *
     * @template V - The type of the value being saved
     * @param key - The unique identifier for storing the data
     * @param value - The data to save (must be JSON-serializable)
     *
     * @example
     * ```typescript
     * await preferences.save('username', 'Alice');
     * ```
     */
    export const save = async <V>(key: string, value: V): Promise<void> => {
        await host.put(host.createUrl(`preferences/${key}`), value);
    }
}
