import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      'pages': resolve(__dirname, 'src/pages'),
      '@lib': resolve(__dirname, 'src/lib'),
      '(components)': resolve(__dirname, 'src/(components)'),
    }
  },
  define: {
    // Define process.env.NODE_ENV for libraries that expect it
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  build: {
    // Build the widget library with Vite
    outDir: 'dist/extension', // Output directly to the extension directory
    emptyOutDir: true, // Clear the output directory before building
    lib: {
      entry: resolve(__dirname, 'src/polymet/widget.tsx'),
      name: 'GhostGovWidget',
      fileName: () => 'ghostgov-widget.umd.js',
      formats: ['umd'],
    },
    rollupOptions: {
      // Bundle React and ReactDOM with the widget
      external: [],
      output: {
        globals: {},
        assetFileNames: 'ghostgov-widget.css',
      },
    },
    minify: true,
    sourcemap: true,
  }
})
