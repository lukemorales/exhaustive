import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['**/node_modules/**', '**/dist/**', 'src/vitest-setup.ts'],
    coverage: {
      exclude: ['src/vitest-setup.ts', 'src/**/*.spec.ts', 'src/**/types.ts'],
    },
  },
});
