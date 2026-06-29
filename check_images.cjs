const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/yurek/OneDrive/Desktop/tubhyam/tubhyamoffical/public/images/products';
const files = fs.readdirSync(dir).map(f => {
  const s = fs.statSync(path.join(dir, f));
  return { name: f, size: s.size };
}).sort((a, b) => b.size - a.size);
files.slice(0, 20).forEach(f => console.log((f.size / 1024).toFixed(1) + 'KB', f.name));
console.log('---');
console.log('Total files:', files.length);
console.log('Total size:', (files.reduce((a, f) => a + f.size, 0) / 1024 / 1024).toFixed(1) + 'MB');
console.log('Avg size:', (files.reduce((a, f) => a + f.size, 0) / files.length / 1024).toFixed(1) + 'KB');
