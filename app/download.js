import fs from 'fs';
import path from 'path';
import https from 'https';

const outDir = '/app/applet/downloaded_repo';

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Node' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(fileUrl, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    fs.mkdirSync(dir, { recursive: true });
    const file = fs.createWriteStream(destPath);
    https.get(fileUrl, { headers: { 'User-Agent': 'Node' } }, (response) => {
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(destPath, () => reject(err));
    });
  });
}

async function run() {
  console.log('Fetching tree...');
  const treeJson = await getJson('https://api.github.com/repos/urnperiodic/urnperiodic.github.io/git/trees/main?recursive=1');
  if (!treeJson.tree) {
    console.error('No tree found:', treeJson);
    return;
  }
  for (const item of treeJson.tree) {
    if (item.type === 'blob') {
      if (item.path.startsWith('public/') || item.path === 'public') {
        console.log('Skipping public file:', item.path);
        continue;
      }
      const fileUrl = `https://raw.githubusercontent.com/urnperiodic/urnperiodic.github.io/main/${item.path}`;
      const destPath = path.join(outDir, item.path);
      console.log('Downloading:', item.path);
      try {
        await downloadFile(fileUrl, destPath);
      } catch (err) {
        console.error('Failed to download:', item.path, err.message);
      }
    }
  }
  console.log('Download complete!');
}

run();
