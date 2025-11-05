import fs from 'fs';
import path from 'path';

const promptPath = path.join(process.cwd(), 'resources/systemPrompt.txt');

export function getSystemPrompt() {
  return fs.readFileSync(promptPath, 'utf-8');
}

export function getReactWebPrompt() {
  return fs.readFileSync(path.join(process.cwd(), 'resources/webPrompt.txt'), 'utf-8');
}
