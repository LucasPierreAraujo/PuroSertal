// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'out/renderer', // pasta de saída para os arquivos do renderizador
    rollupOptions: {
      input: {
        main: 'src/renderer/index.html', // caminho para o seu HTML principal
      },
    },
  },
  server: {
    port: 3000, // porta do servidor durante o desenvolvimento
  },
})
