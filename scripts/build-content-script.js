import { build } from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function buildScripts() {
  await build({
    entryPoints: [
      resolve(__dirname, '../src/polymet/content-script.ts'),
      resolve(__dirname, '../src/polymet/background.ts'),
    ],
    bundle: true,
    outdir: resolve(__dirname, '../dist/extension'), // Output to the extension directory
    format: 'iife',
    minify: true,
    sourcemap: true,
    target: ['chrome58'],
    // Define process.env.NODE_ENV for the scripts if needed (Vite does this for the widget)
    // define: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production') },
  });

  console.log('Content and background scripts built successfully!');
}

buildScripts().catch(console.error); 