/// <reference types="vitest" />
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx() },
    react(),
    qrcode({
      filter: (url) => url.startsWith('http://192'),
    }),
  ],
  base: '/team-dash-uk/',
  server: {
    open: true,
    host: '0.0.0.0',
  },
  test: {},
});
