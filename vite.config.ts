import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
    proxy: {
      // The local AI service generates an image and can take minutes on the
      // first request. Send Try-On traffic directly to it in development so a
      // stale Express process cannot reset or 404 the request. Production still
      // uses the relative /api path through the Express/Vercel proxy.
      '/api/try-on': {
        // Explicit IPv4 avoids Windows resolving localhost to an unavailable
        // IPv6 listener while the FastAPI server is bound to 0.0.0.0.
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        timeout: 300000,
        proxyTimeout: 300000,
      },
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
    sourcemap: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
}));
