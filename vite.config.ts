
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // For aurates.github.io, we serve from the root
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
