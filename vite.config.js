import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const resolveEntry = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolveEntry('./index.html'),
        sandGameOne: resolveEntry('./src/slide/sand-game-1.html'),
        sandGameTwo: resolveEntry('./src/slide/sand-game-2.html'),
      },
    },
  },
});
