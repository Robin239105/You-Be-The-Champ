const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Testing DB connection...');
  try {
    const count = await prisma.product.count();
    console.log(`Connection successful. Product count: ${count}`);
    const cats = await prisma.category.findMany({ take: 5 });
    console.log(`Categories found: ${cats.map(c => c.name).join(', ')}`);
  } catch (err) {
    console.error('DB Connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
