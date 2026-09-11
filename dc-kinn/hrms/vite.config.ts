import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [svgr(), react()],
  server: {
    port: 4001,
  },
  resolve: {
    alias: {
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'legacy'
      }
    },
  },
  define: { "process.env": {}, global: {} },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
