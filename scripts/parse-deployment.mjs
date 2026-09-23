import fs from 'node:fs';

const text = fs.readFileSync(process.argv[2] || '.deploy-output.json', 'utf8');

function findDeploymentId(value) {
  if (!value) return '';
  if (typeof value === 'object') {
    if (typeof value.deploymentId === 'string') return value.deploymentId;
    for (const key of Object.keys(value)) {
      const found = findDeploymentId(value[key]);
      if (found) return found;
    }
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findDeploymentId(item);
      if (found) return found;
    }
  }
  return '';
}

let id = '';
try {
  id = findDeploymentId(JSON.parse(text));
} catch {}

if (!id) {
  const match = text.match(/\bAKfy[A-Za-z0-9_-]{20,}\b/);
  if (match) id = match[0];
}

if (!id) {
  console.error(text);
  throw new Error('Could not parse Apps Script deployment ID');
}

process.stdout.write(id);
