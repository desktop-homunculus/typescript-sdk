import typescript from '@rollup/plugin-typescript';
import {defineConfig} from 'rollup'
import * as path from "node:path";
import {fileURLToPath} from "node:url";
import {dts} from "rollup-plugin-dts";

export default defineConfig([
    {
        input: path.join(path.dirname(fileURLToPath(import.meta.url)), 'src', 'index.ts'),
        output: [
            {
                format: 'esm',
                dir: './dist',
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name.includes('node_modules')) {
                        return chunkInfo.name.replace('node_modules', 'external') + '.js'
                    }

                    return '[name].js'
                }
            },
            {
                format: 'cjs',
                dir: './dist',
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name.includes('node_modules')) {
                        return chunkInfo.name.replace('node_modules', 'external') + '.cjs'
                    }

                    return '[name].cjs'
                }
            },
        ],
        plugins: [
            typescript({
                declaration: true,
                declarationDir: 'dist/types',
                rootDir: 'src',
                target: "esnext",
                module: "esnext",
            }),
        ],
    },
    {
        input: 'dist/types/index.d.ts',
        output: {file: 'dist/index.d.ts', format: 'es'},
        plugins: [dts()]
    },
]);
