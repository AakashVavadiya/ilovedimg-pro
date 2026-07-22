const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  try {
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log(`Successfully copied ${src} to ${dest}`);
  } catch (err) {
    console.error(`Error copying ${src} to ${dest}:`, err);
    process.exit(1);
  }
}

const rootDir = path.join(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');

if (!fs.existsSync(standaloneDir)) {
  console.error('Standalone directory does not exist. Please run next build first.');
  process.exit(1);
}

// Copy public directory if it exists
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(standaloneDir, 'public');
if (fs.existsSync(publicSrc)) {
  copyDir(publicSrc, publicDest);
}

// Copy static directory
const staticSrc = path.join(rootDir, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
if (fs.existsSync(staticSrc)) {
  copyDir(staticSrc, staticDest);
}
