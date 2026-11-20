import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

const publicDirPath = path.resolve(__dirname, '../public');

function buildPublicFileMap(dir = publicDirPath, baseDir = publicDirPath, map: Record<string, string> = {}) {
  try {
    if (!fs.existsSync(dir)) return map;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        buildPublicFileMap(fullPath, baseDir, map);
      } else if (entry.isFile()) {
        const relPath = '/' + path.relative(baseDir, fullPath).split(path.sep).join('/');
        if (!map[entry.name]) map[entry.name] = relPath;
        const lower = entry.name.toLowerCase();
        if (!map[lower]) map[lower] = relPath;
      }
    }
  } catch {
    // Ignore scan errors
  }
  return map;
}

export default defineConfig(() => {
  return {
    root: __dirname,
    publicDir: publicDirPath,
    define: {
      __PUBLIC_FILE_MAP__: JSON.stringify(buildPublicFileMap()),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '..'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
