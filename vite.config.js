import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server:{
    proxy: {
      '/api': {
        target: "http://api.farm.0531yun.cn",
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace('/api', '/api')
        }
      }
    }
  }
})
