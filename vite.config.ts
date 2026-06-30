import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Catch-all API proxy to local backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Inventory dashboard & API — same origin at /inventory
      '/inventory': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/inventory/, ''),
      },
      // Inventory API endpoints
      '/api/products': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/orders': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/payment': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
}));
