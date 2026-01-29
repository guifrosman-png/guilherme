import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@hub/shared-ui': path.resolve(__dirname, '../shared-ui'),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
