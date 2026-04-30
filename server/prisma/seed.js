const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration...');

  // Read the productsData.js file
  const productsFilePath = path.join(__dirname, '../../src/data/productsData.js');
  const fileContent = fs.readFileSync(productsFilePath, 'utf8');
  
  // Extract the array from the export statement
  const jsonMatch = fileContent.match(/export const productsData = (\[[\s\S]*\]);/);
  if (!jsonMatch) {
    throw new Error('Could not find productsData array in file');
  }

  const productsData = JSON.parse(jsonMatch[1]);

  console.log(`Found ${productsData.length} products to migrate.`);

  for (const product of productsData) {
    const slug = slugify(product.name, { lower: true, strict: true }) + '-' + product.sku.toLowerCase();
    
    // Process categories
    const categoryConnect = [];
    if (product.categories && Array.isArray(product.categories)) {
      for (const catString of product.categories) {
        // We'll take the full string as the category name for now
        // or split by '>' and take the last part
        const parts = catString.split('>').map(p => p.trim());
        const catName = parts[parts.length - 1];
        const catSlug = slugify(catName, { lower: true, strict: true });

        const category = await prisma.category.upsert({
          where: { slug: catSlug },
          update: {},
          create: {
            name: catName,
            slug: catSlug,
          },
        });
        categoryConnect.push({ id: category.id });
      }
    }

    // Create or Update the product
    const createdProduct = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        slug: slug,
        price: product.price || 0,
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        isFeatured: product.isFeatured || false,
        status: 'PUBLISHED',
        categories: {
          set: categoryConnect,
        },
      },
      create: {
        name: product.name,
        slug: slug,
        sku: product.sku,
        price: product.price || 0,
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        isFeatured: product.isFeatured || false,
        status: 'PUBLISHED',
        stockQuantity: 100,
        categories: {
          connect: categoryConnect,
        },
        images: {
          create: product.images ? product.images.map((url, index) => ({
            url: url,
            isPrimary: index === 0,
          })) : [],
        },
      },
    });

    console.log(`Migrated: ${createdProduct.name}`);
  }

  console.log('Migration completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
