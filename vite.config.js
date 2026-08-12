import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const resolveEntry = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  // 子路径部署（如 GitHub Pages 的 https://<user>.github.io/<repo>/）在构建时
  // 通过 BASE_PATH 注入；本地开发和根域名部署保持 '/'。
  base: process.env.BASE_PATH || '/',
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
