/**
 * Mod management namespace for executing bin commands defined in mod packages.
 *
 * Provides functions to run on-demand scripts from installed mods,
 * with support for passing arguments, stdin data, and configuring timeouts.
 *
 * @example
 * ```typescript
 * // Execute a bin command with no arguments
 * const result = await mods.executeBinCommand("my-mod", "greet");
 * console.log(result.stdout);
 *
 * // Execute with arguments and stdin
 * const result = await mods.executeBinCommand("my-mod", "process", {
 *   args: ["--format", "json"],
 *   stdin: '{"key": "value"}',
 *   timeout_ms: 10000,
 * });
 * ```
 */

import { host } from "./host";

export namespace mods {
    /**
     * Options for executing a mod bin command.
     *
     * @example
     * ```typescript
     * const options: mods.BinCommandRequest = {
     *   args: ["--verbose"],
     *   stdin: "input data",
     *   timeout_ms: 5000,
     * };
     * ```
     */
    export interface BinCommandRequest {
        /** Arguments to pass to the script (after the script path). */
        args?: string[];
        /** Data to write to the process stdin. Stdin is closed after writing. */
        stdin?: string;
        /** Timeout in milliseconds. Defaults to 30000 (30s). */
        timeout_ms?: number;
    }

    /**
     * Response from a mod bin command execution.
     *
     * @example
     * ```typescript
     * const result = await mods.executeBinCommand("my-mod", "hello");
     * if (result.exit_code === 0) {
     *   console.log("Output:", result.stdout);
     * } else {
     *   console.error("Error:", result.stderr);
     * }
     * ```
     */
    export interface BinCommandResponse {
        /** Exit code of the command process. */
        exit_code: number;
        /** Standard output from the command. */
        stdout: string;
        /** Standard error from the command. */
        stderr: string;
    }

    /**
     * Execute a bin command defined in a mod's package.json.
     *
     * The command runs as a Node.js child process and returns stdout/stderr.
     * An optional request body can provide arguments, stdin data, and a timeout.
     *
     * @param modName - The name of the mod (as listed in root package.json dependencies)
     * @param command - The bin command name (as defined in the mod's package.json bin field)
     * @param options - Optional execution parameters (args, stdin, timeout)
     * @returns The command execution result with exit code, stdout, and stderr
     *
     * @example
     * ```typescript
     * // Simple execution
     * const result = await mods.executeBinCommand("my-mod", "build");
     *
     * // With arguments
     * const result = await mods.executeBinCommand("my-mod", "compile", {
     *   args: ["--target", "es2020"],
     * });
     *
     * // With stdin data and custom timeout
     * const result = await mods.executeBinCommand("my-mod", "transform", {
     *   stdin: JSON.stringify({ input: "data" }),
     *   timeout_ms: 60000,
     * });
     * ```
     */
    export async function executeBinCommand(
        modName: string,
        command: string,
        options?: BinCommandRequest,
    ): Promise<BinCommandResponse> {
        const response = await host.post(
            host.createUrl(`mods/${modName}/bin/${command}`),
            options,
        );
        return await response.json();
    }
}
