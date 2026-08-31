const { PrismaClient } = require('@alwarfurniture/db');
const prisma = new PrismaClient();
prisma.user.findMany().then(console.log).finally(() => prisma.$disconnect());
