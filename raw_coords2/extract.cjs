const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'data', 'products.ts');
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

// Split into top-level product blocks: entries close with <=2-space indented "},"
const blocks = [];
let cur = [];
for (const line of lines) {
  if (/^\s*\{?\s*$/.test(line) && cur.length === 0) { }
  cur.push(line);
  if (/^\s{0,2}\},?\s*$/.test(line) && cur.length > 3) { blocks.push(cur.join('\n')); cur = []; }
}
if (cur.length) blocks.push(cur.join('\n'));

const items = [];
for (const b of blocks) {
  const idM = b.match(/\n\s+id: "([^"]+)"/);
  if (!idM) continue;
  const nameM = b.match(/\n\s+name: "([^"]+)"/);
  const catM = b.match(/\n\s+category: "([^"]+)"/);
  const colM = b.match(/\n\s+colors: (\[[^\]]*\])/);
  items.push({
    id: idM[1],
    name: nameM ? nameM[1] : '',
    category: catM ? catM[1] : '',
    colors: colM ? colM[1] : 'MISSING',
  });
}

const allColors = new Set();
for (const it of items) {
  const m = it.colors.match(/"([^"]+)"/g) || [];
  for (const c of m) allColors.add(c.replace(/"/g, ''));
}

console.log('=== TOTAL PRODUCTS: ' + items.length + ' ===');
const byCat = {};
for (const it of items) { byCat[it.category] = (byCat[it.category] || 0) + 1; }
console.log('By category: ' + JSON.stringify(byCat));
console.log('');
console.log('=== PER-PRODUCT (id | category | name | colors) ===');
for (const it of items) {
  console.log(`${it.id} | ${it.category} | ${it.name} | ${it.colors}`);
}
console.log('');
console.log('=== ALL UNIQUE COLORS (' + allColors.size + ') ===');
console.log([...allColors].sort().join(' | '));
