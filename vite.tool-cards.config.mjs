import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src/tool-cards'),
    },
  },
  build: {
    outDir: 'dist-tool-cards',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(root, 'src/tool-cards/main.tsx'),
      output: {
        entryFileNames: 'tool-card-grid.js',
        assetFileNames: (asset) =>
          asset.name && asset.name.endsWith('.css')
            ? 'tool-card-grid.css'
            : 'assets/[name][extname]',
        format: 'es',
      },
    },
  },
});
