// Update product prices based on WhatsApp message:
// Dresses: ₹3k-₹7k, Jeans: ₹3k-₹5k, Formal: ₹4k-₹6k, Tops: ₹2k-₹3k

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'products.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Price mapping: id -> new price
// Formal: ₹4000-₹6000
const formalPrices = {
  'fp-001': 4499, 'fp-002': 4799, 'fp-003': 4999, 'fp-005': 4599,
  'fp-007': 4699, 'fp-008': 4799, 'fp-009': 4699, 'fp-010': 4799,
  'fp-012': 5299, 'fp-013': 4899, 'fp-014': 4699, 'fp-015': 5099,
  'fp-017': 4999, 'fp-020': 4799, 'fp-021': 4799, 'fp-022': 5999,
  'fp-023': 4200, 'fp-024': 4100, 'fp-025': 4399, 'fp-026': 4399,
  'fp-028': 4100, 'fp-030': 3499, 'fp-032': 3199, 'fp-034': 4499,
  'fp-035': 5499, 'fp-038': 3499, 'fp-041': 3999, 'fp-042': 4000,
};

// Jeans: ₹3000-5000
const jeansPrices = {
  'jn-003': 3599, 'jn-004': 3499, 'jn-005': 3699, 'jn-006': 3000,
};

// Tops: ₹2000-₹3000
const topsPrices = {
  'tops-001': 2899, 'tops-003': 2499, 'tops-008': 2599,
};

// Dresses: ₹3000-₹7000
const dressPrices = {
  'dr-001': 5499, 'dr-002': 5299, 'dr-003': 4799, 'dr-004': 4999,
  'dr-005': 4799, 'dr-006': 5499, 'dr-007': 4999, 'dr-008': 4999,
  'dr-009': 5299, 'dr-010': 4499, 'dr-011': 4799, 'dr-012': 5499,
  'dr-013': 4999, 'dr-014': 4799, 'dr-015': 5299,
};

// Track pants: keep around ₹2000-₹3500 (not specified by user)
const trackPrices = {
  'pt-004': 2899, 'pt-005': 2999, 'tp-002': 2699, 'tp-005': 2899,
  'tp-006': 2799, 'tp-007': 2799, 'tp-010': 1999, 'tp-012': 2200,
  'tp-013': 1999, 'tp-014': 2299, 'test-001': 1,
};

// Co-ords: keep around ₹2500-4500 (not specified by user)
const coordsPrices = {
  'cord-set-001': 2197, 'cord-set-002': 3999, 'cord-set-003': 3799, 'cord-set-004': 5499,
};

const allPrices = { ...formalPrices, ...jeansPrices, ...topsPrices, ...dressPrices, ...trackPrices, ...coordsPrices };

// Replace prices in the file
for (const [id, newPrice] of Object.entries(allPrices)) {
  // Find the product block by id and replace its price
  const regex = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?price:\\s*)\\d+`, 'm');
  const match = content.match(regex);
  if (match) {
    content = content.replace(regex, `$1${newPrice}`);
    console.log(`Updated ${id}: price → ₹${newPrice}`);
  } else {
    console.log(`WARNING: Could not find price for ${id}`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\nDone! Prices updated in products.ts');
