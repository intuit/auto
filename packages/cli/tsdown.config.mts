import { mergeConfig, type UserConfig } from 'tsdown'
import { baseConfig } from '../../tsdown.config.mts'

// @ts-ignore isolatedDeclarations
const config: UserConfig[] = [
  mergeConfig(baseConfig, {
    entry: ['./src/index.ts'],
  }),
  // The CLI binary is emitted as ESM at dist/bin/auto.mjs
  mergeConfig(baseConfig, {
    entry: { 'bin/auto': './src/bin/auto.ts' },
    format: 'esm',
    fixedExtension: true,
    platform: 'node',
    shims: true,
    // endent only has an `exports.default`, which Node's ESM/CJS interop can't see
    deps: { alwaysBundle: ['endent'] },
    // Bake the version into standalone binaries (see scripts/inject-version.js)
    ...(process.env.AUTO_CLI_VERSION && {
      env: { AUTO_CLI_VERSION: process.env.AUTO_CLI_VERSION },
    }),
    dts: false,
    clean: false,
  }),
]

export default config;
