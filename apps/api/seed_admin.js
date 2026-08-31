const { PrismaClient } = require('@alwarfurniture/db');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@alwarfurniture.com' },
    update: {},
    create: {
      email: 'admin@alwarfurniture.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin account created:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
