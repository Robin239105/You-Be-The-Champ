const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking 2024-2026 products...');
  try {
    const products = await prisma.product.findMany({
      include: { categories: true }
    });
    
    const latest = products.filter(p => {
      const catStr = (p.categories || []).map(c => c.name).join(' ');
      const searchStr = `${p.name} ${p.sku} ${catStr}`.toLowerCase();
      return searchStr.includes('2024') || searchStr.includes('2025') || searchStr.includes('2026');
    });
    
    console.log(`Total 2024-2026 products found: ${latest.length}`);
    if (latest.length > 0) {
      console.log('Sample matches:');
      latest.slice(0, 5).forEach(p => console.log(`- ${p.name} (SKU: ${p.sku})`));
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
