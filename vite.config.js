import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'global': 'globalThis',
    '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })',
  },
  server: {
    allowedHosts: ['monkfish-app-nao2t.ondigitalocean.app'],
    host: '0.0.0.0',
    port: 8080,
  },
  preview: {
    allowedHosts: ['monkfish-app-nao2t.ondigitalocean.app'],
    host: '0.0.0.0',
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        dead_code: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
