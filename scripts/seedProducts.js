const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

async function main() {
  console.log('Reading product data...');
  const dataPath = path.join(__dirname, '../src/data/productsData.js');
  let content = fs.readFileSync(dataPath, 'utf8');
  
  // Clean the file content to be valid JSON
  content = content.replace('export const productsData = ', '').trim();
  if (content.endsWith(';')) content = content.slice(0, -1);
  
  const products = JSON.parse(content);
  console.log(`Found ${products.length} products. Syncing to database...`);

  const categoryCache = {};
  const allCategories = await prisma.category.findMany();
  allCategories.forEach(cat => { categoryCache[cat.slug] = cat.id; });

  let created = 0;
  let updated = 0;

  for (const item of products) {
    try {
      const { name, sku, price, salePrice, stockQuantity, description, shortDescription, status, isFeatured, categories, images } = item;
      
      if (!name || !sku) continue;

      const slug = slugify(name, { lower: true, strict: true }) + '-' + sku.toLowerCase();
      const categoryIds = [];

      if (categories) {
        const categoryNames = typeof categories === 'string' ? categories.split(',').map(c => c.trim()) : categories;
        for (const catName of categoryNames) {
          if (!catName) continue;
          const catSlug = slugify(catName, { lower: true, strict: true });
          if (categoryCache[catSlug]) {
            categoryIds.push(categoryCache[catSlug]);
          } else {
            const newCat = await prisma.category.create({ data: { name: catName, slug: catSlug } });
            categoryCache[catSlug] = newCat.id;
            categoryIds.push(newCat.id);
          }
        }
      }

      const productData = {
        name, slug, sku,
        description: description || '',
        shortDescription: shortDescription || '',
        price: parseFloat(price) || 0,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stockQuantity: parseInt(stockQuantity) || 999,
        status: status || 'PUBLISHED',
        isFeatured: isFeatured === true || isFeatured === 'true'
      };

      const product = await prisma.product.upsert({
        where: { sku },
        update: { ...productData, categories: { set: categoryIds.map(id => ({ id })) } },
        create: { ...productData, categories: { connect: categoryIds.map(id => ({ id })) } }
      });

      if (images) {
        const imageUrls = typeof images === 'string' ? images.split(',').map(i => i.trim()).filter(Boolean) : images;
        if (imageUrls.length > 0) {
          await prisma.productImage.deleteMany({ where: { productId: product.id } });
          await prisma.productImage.createMany({
            data: imageUrls.map((url, idx) => ({ url, productId: product.id, isPrimary: idx === 0 }))
          });
        }
      }

      created++;
      if (created % 50 === 0) console.log(`  Synced ${created} products...`);
    } catch (err) {
      console.error(`  Error with product ${item.sku}:`, err.message);
    }
  }

  console.log('\n--- Sync Complete ---');
  console.log(`Total processed: ${created}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
