import { copyFile, mkdir, readdir, stat, rm } from 'fs/promises';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function prepareExtension() {
  const extensionDir = resolve(__dirname, '../dist/extension');

  // Ensure the extension directory exists
  await mkdir(extensionDir, { recursive: true });

  // Copy manifest
  await copyFile(
    resolve(__dirname, '../public/manifest.json'),
    resolve(extensionDir, 'manifest.json')
  );

  // Check for built files (Vite and Esbuild should place them directly in extensionDir)
  const requiredFiles = [
      'ghostgov-widget.umd.js',
      'ghostgov-widget.css',
      'content-script.js',
      'background.js',
  ];

  for (const file of requiredFiles) {
      const filePath = resolve(extensionDir, file);
      try {
          await stat(filePath); // Check if file exists
          console.log(`[PrepareExtension] Confirmed built file exists: ${file}`);
      } catch (error) {
          console.error(`[PrepareExtension] Error: Built file not found: ${file}`, error);
          throw new Error(`Missing built file: ${file}. Ensure build steps succeeded.`);
      }
  }

  // Convert SVG to PNG icons and copy them
  const iconSizes = [16, 48, 128];
  const svgBuffer = await sharp(resolve(__dirname, '../public/icon.svg')).toBuffer();
  
  for (const size of iconSizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(resolve(extensionDir, `icon${size}.png`));
  }

  console.log('Extension files prepared successfully!');
}

prepareExtension().catch(console.error); 