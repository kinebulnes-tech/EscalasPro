import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'crypto';

const BUILD_HASH = createHash('md5').update(Date.now().toString()).digest('hex').slice(0, 8);

export default defineConfig({
  plugins: [react()],

  define: {
    // Inyecta el hash del build en el Service Worker para versionado automático
    __BUILD_HASH__: JSON.stringify(BUILD_HASH),
  },

  build: {
    target: 'es2020',
    sourcemap: false,
    // Divide el bundle en chunks para carga más rápida
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — cambia poco, se cachea bien
          'vendor-react': ['react', 'react-dom'],
          // UI icons — cambia poco
          'vendor-icons': ['lucide-react'],
          // Charts — solo se carga cuando hay historial
          'vendor-charts': ['recharts'],
          // PDF — solo se carga al generar informe
          'vendor-pdf': ['jspdf', 'html-to-image'],
          // Crypto + DB — solo en sesión con paciente
          'vendor-storage': ['crypto-js', 'idb'],
        },
      },
    },
    // Alerta si algún chunk supera 500KB
    chunkSizeWarningLimit: 500,
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  // Encabezados de seguridad en desarrollo
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
});
