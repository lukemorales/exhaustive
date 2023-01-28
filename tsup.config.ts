import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'exhaustive',
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  clean: true,
  sourcemap: false,
});
