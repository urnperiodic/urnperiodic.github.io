import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const distIndexPath = path.join(distDir, 'index.html');
const distDevPath = path.join(distDir, 'dev.html');

if (fs.existsSync(distIndexPath) && !fs.existsSync(distDevPath)) {
  fs.copyFileSync(distIndexPath, distDevPath);
  console.log('Ensured dist/dev.html exists');
} else if (!fs.existsSync(distIndexPath) && fs.existsSync(distDevPath)) {
  fs.copyFileSync(distDevPath, distIndexPath);
  console.log('Ensured dist/index.html exists');
}

