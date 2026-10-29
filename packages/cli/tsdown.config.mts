import { mergeConfig, type UserConfig } from 'tsdown'
import { baseConfig } from '../../tsdown.config.mts'

// @ts-ignore isolatedDeclarations
const config: UserConfig = mergeConfig(baseConfig, {
  entry: ['./src/index.ts', './src/bin/auto.ts'],
  sourcemap: true,
  target: ['esnext'],
  dts: true,
  clean: true,
})

export default config;
