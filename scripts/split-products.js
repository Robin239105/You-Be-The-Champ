const fs = require('fs');
const path = require('path');

// Read the productsData.js and extract the array
const src = fs.readFileSync(path.join(__dirname, '../src/data/productsData.js'), 'utf8');
// Strip the export wrapper to get raw JSON array
const match = src.match(/export const productsData = (\[[\s\S]*\]);?\s*$/);
if (!match) { console.error('Could not parse productsData.js'); process.exit(1); }

const products = JSON.parse(match[1]);
console.log(`Total products: ${products.length}`);

const BATCH = 50;
const outDir = path.join(__dirname, '../src/data/products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let fileCount = 0;
for (let i = 0; i < products.length; i += BATCH) {
  const slice = products.slice(i, i + BATCH);
  fileCount++;
  const filename = `products_${String(fileCount).padStart(2, '0')}.json`;
  fs.writeFileSync(path.join(outDir, filename), JSON.stringify(slice, null, 2));
  console.log(`Created ${filename} (${slice.length} products, SKUs: ${slice[0].sku} - ${slice[slice.length-1].sku})`);
}

// Also write an index file that imports all chunks
const indexLines = [
  `// Auto-generated index of all product JSON files (50 per file)`,
];
for (let f = 1; f <= fileCount; f++) {
  indexLines.push(`export { default as products_${String(f).padStart(2,'0')} } from './products/products_${String(f).padStart(2,'0')}.json';`);
}
fs.writeFileSync(path.join(__dirname, '../src/data/productsIndex.js'), indexLines.join('\n') + '\n');
console.log(`\nDone! ${fileCount} files created in src/data/products/`);
