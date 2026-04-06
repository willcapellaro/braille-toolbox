import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui':   ['@mui/material', '@mui/system', '@emotion/react', '@emotion/styled'],
          'vendor-icons': ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons'],
        },
      },
    },
  },
})
