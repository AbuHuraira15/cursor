import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir, callback) {
  readdirSync(dir).forEach(f => {
    let dirPath = join(dir, f);
    let isDirectory = statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = readFileSync(filePath, 'utf8');
    // Fix 'from "package@version"'
    let newContent = content.replace(/(from\s+["'])(.+?)@\d[^"']*?(["'])/g, '$1$2$3');
    // Fix '} from "package@version"'
    // the above regex already covers '} from "package@version"' because it just matches 'from '
    if (content !== newContent) {
      writeFileSync(filePath, newContent, 'utf8');
      console.log('Fixed', filePath);
    }
  }
});
