import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react-router-dom', 'react-apexcharts', 'apexcharts'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});