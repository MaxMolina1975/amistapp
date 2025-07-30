import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Asegura que los assets se carguen correctamente en producción
  build: {
    outDir: 'dist', // Directorio de salida para la compilación
    assetsDir: 'assets', // Directorio para los assets estáticos
    sourcemap: false, // Desactivar sourcemaps en producción para reducir tamaño
    minify: 'terser', // Usar terser para minificar el código
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.log en producción
      },
    },
  },
  server: {
    port: 5175, // Puerto diferente al de la aplicación principal
    proxy: {
      '/api': {
        target: 'http://localhost:3007',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})