import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/spin.ts', 'src/task.ts'],
  outDir: './',
  format: ['esm', 'cjs'],
  splitting: false,
  external: Object.keys(require('./package.json').dependencies),
  dts: true,
})
