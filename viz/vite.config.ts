import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@data': path.resolve(__dirname, '../viz-data'),
    },
  },
  // Serve viz-data as static files in dev
  server: {
    fs: { allow: ['..'] },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          pixi:  ['pixi.js'],
          react: ['react', 'react-dom'],
          d3:    ['d3'],
        },
      },
    },
  },
})
