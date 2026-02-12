/**
 * Host API namespace for low-level HTTP communication with the Desktop Homunculus server.
 *
 * This module provides the foundational HTTP client functionality used internally
 * by all other SDK modules. It handles the base URL configuration, URL construction,
 * and HTTP methods with automatic error handling.
 *
 * **Note:** This module is primarily for internal SDK use. Most developers should
 * use the higher-level namespaces like `vrm`, `signals`, etc.
 *
 * @example
 * ```typescript
 * // Internal SDK usage (you typically won't need this directly)
 * const response = await host.get(host.createUrl("vrm"));
 * const vrms = await response.json();
 *
 * // URL construction with parameters
 * const url = host.createUrl("vrm", { name: "MyCharacter" });
 * // Results in: http://localhost:3100/vrm?name=MyCharacter
 *
 * // Configure the base URL (e.g., from an MCP server)
 * host.configure({ baseUrl: "http://localhost:4000" });
 * ```
 */

/** Error thrown when the Homunculus HTTP API returns a non-OK response. */
export class HomunculusApiError extends Error {
    /** HTTP status code (e.g. 404, 500) */
    readonly statusCode: number;
    /** The request endpoint URL */
    readonly endpoint: string;
    /** The response body text */
    readonly body: string;

    constructor(statusCode: number, endpoint: string, body: string) {
        super(`${endpoint}: ${statusCode} ${body}`);
        this.name = "HomunculusApiError";
        this.statusCode = statusCode;
        this.endpoint = endpoint;
        this.body = body;
    }
}

export namespace host {
    let _baseUrl = "http://localhost:3100";

    /**
     * Configures the SDK's base URL for the Desktop Homunculus HTTP server.
     *
     * @param options - Configuration options
     *
     * @example
     * ```typescript
     * host.configure({ baseUrl: "http://localhost:4000" });
     * ```
     */
    export const configure = (options: { baseUrl: string }) => {
        _baseUrl = options.baseUrl.replace(/\/+$/, "");
    };

    /** Returns the base URL for the Desktop Homunculus HTTP server. */
    export const base = (): string => _baseUrl;

    /** Creates a new URL instance pointing to the base server. */
    export const baseUrl = (): URL => new URL(_baseUrl);

    /**
     * Creates a URL for the Desktop Homunculus API with optional query parameters.
     *
     * @param path - The API endpoint path (relative to base URL)
     * @param params - Optional query parameters to append to the URL
     * @returns A URL instance ready for use in HTTP requests
     *
     * @example
     * ```typescript
     * // Simple path
     * const url = host.createUrl("vrm");
     * // Result: http://localhost:3100/vrm
     *
     * // With query parameters
     * const url = host.createUrl("entities", { name: "VRM", root: 123 });
     * // Result: http://localhost:3100/entities?name=VRM&root=123
     * ```
     */
    export const createUrl = (path: string, params?: object): URL => {
        const url = new URL(path, base());
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }
        return url;
    }

    /**
     * Performs a GET request to the specified URL with automatic error handling.
     *
     * @param url - The URL to send the GET request to
     * @returns The Response object if successful
     * @throws {HomunculusApiError} If the response status is >= 400
     *
     * @example
     * ```typescript
     * const response = await host.get(host.createUrl("vrm"));
     * const data = await response.json();
     * ```
     */
    export async function get(url: URL): Promise<Response> {
        const response = await fetch(url);
        await throwIfError(response);
        return response;
    }

    /**
     * Performs a POST request with JSON payload and automatic error handling.
     *
     * @param url - The URL to send the POST request to
     * @param body - Optional request body that will be JSON-serialized
     * @returns The Response object if successful
     * @throws {HomunculusApiError} If the response status is >= 400
     *
     * @example
     * ```typescript
     * const response = await host.post(
     *   host.createUrl("vrm"),
     *   { asset: "my-mod::character.vrm" }
     * );
     * ```
     */
    export const post = async <B>(url: URL, body?: B): Promise<Response> => {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body ?? {})
        });
        await throwIfError(response);
        return response;
    }

    /**
     * Performs a PUT request with JSON payload and automatic error handling.
     *
     * @param url - The URL to send the PUT request to
     * @param body - Optional request body that will be JSON-serialized
     * @returns The Response object if successful
     * @throws {HomunculusApiError} If the response status is >= 400
     *
     * @example
     * ```typescript
     * await host.put(
     *   host.createUrl("vrm/123/state"),
     *   { state: "idle" }
     * );
     * ```
     */
    export const put = async <B>(url: URL, body?: B): Promise<Response> => {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body ?? {})
        });
        await throwIfError(response);
        return response;
    }

    /**
     * Performs a PATCH request with JSON payload and automatic error handling.
     *
     * @param url - The URL to send the PATCH request to
     * @param body - Optional request body that will be JSON-serialized
     * @returns The Response object if successful
     * @throws {HomunculusApiError} If the response status is >= 400
     */
    export const patch = async <B>(url: URL, body?: B): Promise<Response> => {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body ?? {})
        });
        await throwIfError(response);
        return response;
    }

    export const deleteMethod = async (url: URL): Promise<Response> => {
        const response = await fetch(url, {
            method: "DELETE"
        });
        await throwIfError(response);
        return response;
    }
}

const throwIfError = async (response: Response): Promise<void> => {
    if (!response.ok) {
        throw new HomunculusApiError(
            response.status,
            response.url,
            await response.text()
        );
    }
}
