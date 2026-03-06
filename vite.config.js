import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  mode: 'production',
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [
    react(),
  ],
  server: {
    allowedHosts: [
      'monkfish-app-nao2t.ondigitalocean.app',
      'ai-fest.dev'
    ],
    host: '0.0.0.0',
    port: 8080,
    hmr: {
      clientPort: 443,
      host: 'ai-fest.dev',
      protocol: 'wss'
    }
  },
  preview: {
    allowedHosts: [
      'monkfish-app-nao2t.ondigitalocean.app',
      'ai-fest.dev'
    ],
    host: '0.0.0.0',
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'react-is'],
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
