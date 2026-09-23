import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('projects');
const names = fs.existsSync(root)
  ? fs.readdirSync(root).filter((name) => fs.statSync(path.join(root, name)).isDirectory())
  : [];

if (!names.length) {
  throw new Error('No projects registered under projects/');
}

for (const name of names) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(name)) {
    throw new Error(`Invalid project directory name: ${name}`);
  }

  const dir = path.join(root, name);
  const configPath = path.join(dir, 'project.json');
  const manifestPath = path.join(dir, 'src', 'appsscript.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(`${name}: missing project.json`);
  }
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`${name}: missing src/appsscript.json`);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (!config.title || typeof config.title !== 'string') {
    throw new Error(`${name}: project.json.title is required`);
  }

  if (manifest.webapp) {
    const allowedAccess = new Set(['MYSELF', 'DOMAIN', 'ANYONE', 'ANYONE_ANONYMOUS']);
    const allowedExecuteAs = new Set(['USER_ACCESSING', 'USER_DEPLOYING']);

    if (!allowedAccess.has(manifest.webapp.access)) {
      throw new Error(`${name}: invalid webapp.access`);
    }
    if (!allowedExecuteAs.has(manifest.webapp.executeAs)) {
      throw new Error(`${name}: invalid webapp.executeAs`);
    }
  }

  console.log(`OK ${name}`);
}
