import { mergeConfig, type UserConfig } from 'tsdown'
import { baseConfig } from '../../tsdown.config.mts'

// @ts-ignore isolatedDeclarations
const config: UserConfig = mergeConfig(baseConfig, {
  entry: ['./src/**/*.ts'],
  unbundle: true,
  sourcemap: true,
  target: ['esnext'],
  dts: true,
  clean: true,
})

export default config;
