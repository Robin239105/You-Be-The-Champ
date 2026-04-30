const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@youbethechamp.com';
  const password = 'AdminPassword123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Upserting admin user...');
  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User'
    },
    create: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User'
    }
  });

  console.log('-----------------------------------');
  console.log('Admin User Verified/Created!');
  console.log(`Email: ${email}`);
  console.log(`Role: ${admin.role}`);
  console.log('-----------------------------------');

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
