const fs = require('fs');
const path = require('path');

const csvFilePath = path.join(__dirname, '../../wc-product-export-17-4-2026-1776389555950.csv');
const outputFilePath = path.join(__dirname, '../src/data/productsData.js');
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x600/1a1a1a/gold?text=Image+Coming+Soon';

function parseCSV(csvText) {
  const products = [];
  const lines = [];
  let currentLine = '';
  let inQuotes = false;

  // First, group lines correctly by checking quote balance
  const rawLines = csvText.split('\n');
  for (let i = 0; i < rawLines.length; i++) {
    currentLine += (currentLine ? '\n' : '') + rawLines[i];
    const quoteCount = (rawLines[i].match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      inQuotes = !inQuotes;
    }
    
    if (!inQuotes) {
      lines.push(currentLine);
      currentLine = '';
    }
  }

  const headers = splitLine(lines[0]);
  
  function splitLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const row = splitLine(lines[i]);
    
    // ID: 0, SKU: 2, Name: 4, ShortDesc: 8, Desc: 9, Price: 26, Categories: 27, Images: 30
    const categories = row[27] ? row[27].split(',').map(c => c.trim().replace(/^"|"$/g, '')) : [];
    let images = row[30] ? row[30].split(',').map(img => img.trim().replace(/^"|"$/g, '').trim()) : [];

    // Use placeholder if no images found
    if (images.length === 0 || !images[0]) {
      images = [PLACEHOLDER_IMAGE];
    }

    products.push({
      id: row[0],
      name: row[4],
      sku: row[2],
      price: parseFloat(row[26]) || 0,
      description: row[9],
      shortDescription: row[8],
      categories: categories,
      images: images,
      isFeatured: row[6] === '1',
    });
  }
  return products;
}

try {
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  const products = parseCSV(csvData);
  
  const fileContent = `export const productsData = ${JSON.stringify(products, null, 2)};`;
  
  fs.writeFileSync(outputFilePath, fileContent);
  console.log(`Successfully imported ${products.length} products to ${outputFilePath}`);
} catch (error) {
  console.error('Error importing products:', error);
}
