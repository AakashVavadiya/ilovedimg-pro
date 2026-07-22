const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const backupPath = path.join(rootDir, 'package.json.bak');

console.log('=== Electron Packaging Build Script ===');

try {
  // 1. Build the Next.js application first (requires full dependencies)
  console.log('\n--- Step 1: Running Next.js build ---');
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

  // 2. Copy the standalone static assets
  console.log('\n--- Step 2: Copying standalone static and public assets ---');
  execSync('node scripts/copy-assets.js', { stdio: 'inherit', cwd: rootDir });

  // 3. Backup package.json
  console.log('\n--- Step 3: Backing up package.json ---');
  fs.copyFileSync(packageJsonPath, backupPath);

  // 4. Modify package.json to clear dependencies
  // This prevents electron-builder from auto-copying the root node_modules directory
  console.log('Clearing dependencies in package.json to prevent root node_modules packaging bloat...');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.dependencies = {};
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

  // 5. Run electron-builder to package the portable executable
  console.log('\n--- Step 4: Packaging standalone application with electron-builder ---');
  process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
  execSync('npx electron-builder', { stdio: 'inherit', cwd: rootDir });

  console.log('\nBuild and packaging completed successfully!');
} catch (err) {
  console.error('\nBuild failed with error:', err);
  process.exitCode = 1;
} finally {
  // 6. Always restore original package.json from backup
  if (fs.existsSync(backupPath)) {
    console.log('\n--- Step 5: Restoring original package.json ---');
    fs.copyFileSync(backupPath, packageJsonPath);
    fs.unlinkSync(backupPath);
    console.log('Restored package.json successfully.');
  }
}
