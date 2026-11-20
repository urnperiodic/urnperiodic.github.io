import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirPath = path.resolve(__dirname, '../public');

function buildPublicFileMap(dir = publicDirPath, baseDir = publicDirPath, map = {}) {
  try {
    if (!fs.existsSync(dir)) return map;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        buildPublicFileMap(fullPath, baseDir, map);
      } else if (entry.isFile()) {
        const relPath = '/' + path.relative(baseDir, fullPath).split(path.sep).join('/');
        if (!map[entry.name]) {
          map[entry.name] = relPath;
        }
        const lower = entry.name.toLowerCase();
        if (!map[lower]) {
          map[lower] = relPath;
        }
      }
    }
  } catch {
    // Ignore scan errors
  }
  return map;
}

function autoPublicResolverPlugin() {
  let fileMap = buildPublicFileMap();
  return {
    name: 'auto-public-file-resolver',
    buildStart() {
      fileMap = buildPublicFileMap();
    },
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url || req.url.startsWith('/api/') || req.url.startsWith('/src/') || req.url.startsWith('/@')) {
          return next();
        }
        const [rawPathname, queryStr] = req.url.split('?');
        let decodedPath = rawPathname;
        try {
          decodedPath = decodeURIComponent(rawPathname);
        } catch {
          // Keep rawPathname
        }

        // Strip optional leading /public/ prefix
        if (decodedPath.startsWith('/public/')) {
          decodedPath = decodedPath.slice('/public'.length);
          req.url = decodedPath + (queryStr ? `?${queryStr}` : '');
        }

        const directDiskPath = path.join(publicDirPath, decodedPath);
        if (fs.existsSync(directDiskPath) && fs.statSync(directDiskPath).isFile()) {
          return next();
        }

        const baseName = path.basename(decodedPath);
        if (baseName && baseName.includes('.') && baseName !== 'index.html' && baseName !== 'dev.html') {
          let resolvedRel = fileMap[baseName] || fileMap[baseName.toLowerCase()];
          if (!resolvedRel) {
            fileMap = buildPublicFileMap();
            resolvedRel = fileMap[baseName] || fileMap[baseName.toLowerCase()];
          }
          if (resolvedRel) {
            req.url = encodeURI(resolvedRel) + (queryStr ? `?${queryStr}` : '');
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: './',
  root: __dirname,
  publicDir: publicDirPath,

  define: {
    __PUBLIC_FILE_MAP__: JSON.stringify(buildPublicFileMap()),
  },

  plugins: [
    autoPublicResolverPlugin(),
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '..'),
    },
  },

  // Don't let Vite watch/scan the huge game collection
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: {
      ignored: [
        '**/Gmfiles/**',
        '**/node_modules/**',
        '**/.git/**',
      ],
    },
  },

  // Don't allow these files to be pulled into the Vite bundle
  build: {
    outDir: path.resolve(__dirname, '../dist'),
    emptyOutDir: true,
    rollupOptions: {
      external: [
        /^\/Gmfiles\//,
      ],
    },
  },
});