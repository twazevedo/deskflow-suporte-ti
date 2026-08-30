import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Suporte nativo para GitHub Pages e execuções em subdiretórios
  server: {
    port: 5180,
    strictPort: false,
    open: false,
  },
});
