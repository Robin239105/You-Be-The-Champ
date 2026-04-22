const fs = require('fs');
const { parse } = require('csv-parse/sync');

const filePath = '/Users/wpdevrobin/Downloads/You Be The Champ/wc-product-export-17-4-2026-1776389555950.csv';
const fileContent = fs.readFileSync(filePath, 'utf8');

const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
  bom: true,
  relax_column_count: true
});

const categorySet = new Set();

records.forEach(record => {
  if (record.Categories) {
    const categories = record.Categories.split(',').map(c => c.trim());
    categories.forEach(cat => {
      if (cat) categorySet.add(cat);
    });
  }
});

const sortedCategories = Array.from(categorySet).sort();
fs.writeFileSync('all_categories_list.txt', sortedCategories.join('\n'));
console.log(`Total unique category paths found: ${sortedCategories.length}`);
