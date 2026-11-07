import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works on GitHub Pages under any repo name
  base: './',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  }
});
