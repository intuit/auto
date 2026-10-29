import { defineConfig, type UserConfig } from "tsdown";

export const baseConfig: UserConfig = defineConfig({
  format: "cjs",
  fixedExtension: false,
  outputOptions: { exports: "named" },
  sourcemap: true,
  target: ["esnext"],
  dts: true,
  clean: true,
});
