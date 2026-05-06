import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir, callback) {
  readdirSync(dir).forEach(f => {
    let dirPath = join(dir, f);
    let isDirectory = statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

const replacements = [
  // Full Names
  [/Mike Johnson/g, 'Rahim Uddin'],
  [/John Doe/g, 'Karim Hasan'],
  [/Mike Chen/g, 'Sajid Ali'],
  [/John Davis/g, 'Tareq Rahman'],
  // Emails
  [/mike\.johnson@example\.com/g, 'rahim.uddin@example.com'],
  [/john\.doe@example\.com/g, 'karim.hasan@example.com'],
  [/mike\.j@example\.com/g, 'rahim.u@example.com'],
  [/john@email\.com/g, 'karim@email.com'],
  [/john@example\.com/g, 'karim@example.com'],
  // First Names (ensure this happens after full names)
  [/\bMike\b/g, 'Rahim'],
  [/\bJohn\b/g, 'Karim'],
  // Locations
  [/New York, NY 10001/g, 'Dhaka, BD 1212'],
  [/New York, NY/g, 'Dhaka, BD'],
  [/New York/g, 'Dhaka'],
  [/Chicago/g, 'Chittagong'],
  [/123 Business Ave, Suite 100/g, '123 Gulshan Avenue, Suite 100'],
  // Currency
  [/\(USD\)/g, '(BDT)'],
  [/\$/g, '৳']
];

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = readFileSync(filePath, 'utf8');
    let newContent = content;
    
    for (const [pattern, replacement] of replacements) {
      newContent = newContent.replace(pattern, replacement);
    }
    
    if (content !== newContent) {
      writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
