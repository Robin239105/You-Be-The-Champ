const fs = require('fs');
const path = require('path');

// Read the file content
const filePath = '/Users/wpdevrobin/Downloads/You Be The Champ/src/data/productsData.js';
let content = fs.readFileSync(filePath, 'utf8');

// Remove 'export const productsData = ' and ';' at the end
content = content.replace('export const productsData = ', '').trim();
if (content.endsWith(';')) content = content.slice(0, -1);

let products = [];
try {
  products = JSON.parse(content);
} catch (e) {
  console.error('Failed to parse JSON. It might be a JS object, trying eval (safe-ish for this local context)');
  // Since it's a JS file with exports, we can use a simpler approach or a regex if it's too complex
  // For now, let's try a regex-based approach or just a simple string replacement to make it valid JSON
}

if (products.length === 0) {
  console.log('Falling back to a more robust parser for JS objects...');
  // Simple hack: use eval in a controlled way or just process the string
  // For a more robust way, let's just use the fact that it's ALMOST JSON
  // If it's valid JS, we can just require it if we change the extension or use a temp file
}

// Actually, I'll just write a small node script that 'requires' it and outputs JSON
const tempScriptPath = path.join(__dirname, 'extract.cjs');
const tempJsPath = path.join(__dirname, 'productsData.cjs');

// Create a version that uses module.exports
fs.writeFileSync(tempJsPath, content.replace('export const productsData = ', 'module.exports = '));

const extractScript = `
const products = require('./productsData.cjs');
const fs = require('fs');

console.log('Extracted ' + products.length + ' products');

const csvHeader = 'name,sku,price,salePrice,stockQuantity,status,isFeatured,categories,images,description,shortDescription\\n';
const csvRows = products.map(p => {
  const name = '"' + (p.name || '').replace(/"/g, '""') + '"';
  const sku = '"' + (p.sku || '').replace(/"/g, '""') + '"';
  const price = p.price || 0;
  const salePrice = p.salePrice || '';
  const stockQuantity = p.stockQuantity || 100;
  const status = p.status || 'PUBLISHED';
  const isFeatured = p.isFeatured || false;
  const categories = '"' + (p.categories || []).join(',') + '"';
  const images = '"' + (p.images || []).join(',') + '"';
  const description = '"' + (p.description || '').replace(/"/g, '""').replace(/\\n/g, ' ') + '"';
  const shortDescription = '"' + (p.shortDescription || '').replace(/"/g, '""').replace(/\\n/g, ' ') + '"';
  
  return [name, sku, price, salePrice, stockQuantity, status, isFeatured, categories, images, description, shortDescription].join(',');
}).join('\\n');

fs.writeFileSync('product_import_template.csv', csvHeader + csvRows);
fs.writeFileSync('product_import_template.json', JSON.stringify(products, null, 2));
`;

fs.writeFileSync(tempScriptPath, extractScript);
console.log('Script created. Run it with: node extract.cjs');
