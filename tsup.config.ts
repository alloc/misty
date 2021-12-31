import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/spin.ts', 'src/task.ts'],
  outDir: './',
  format: ['esm', 'cjs'],
  external: Object.keys(require('./package.json').dependencies),
  splitting: true,
  dts: true,
})
