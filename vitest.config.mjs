import nextEnv from '@next/env';
import { defineConfig } from 'vitest/config';

import ViteYaml from '@modyfi/vite-plugin-yaml';
import react from '@vitejs/plugin-react';

nextEnv.loadEnvConfig(process.cwd());

export default defineConfig({
  plugins: [react(), ViteYaml()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['./__tests__/functional/**/**/*.{ts,tsx}'],
    environment: 'jsdom',
  },
});
