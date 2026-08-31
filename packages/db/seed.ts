import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Clear existing data (optional, but good for fresh seed)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Categories
  const bedroom = await prisma.category.create({
    data: {
      name: 'Bedroom',
      description: 'Beds, wardrobes, and nightstands',
    },
  });

  const dining = await prisma.category.create({
    data: {
      name: 'Dining Room',
      description: 'Dining tables, chairs, and cabinets',
    },
  });

  const living = await prisma.category.create({
    data: {
      name: 'Living Room',
      description: 'Sofas, coffee tables, and TV units',
    },
  });

  // 3. Create Products
  const products = [
    {
      name: 'Royal Teak Wood Bed',
      description: 'Experience unparalleled comfort and timeless elegance with our Royal Teak Wood Bed. Handcrafted from sustainably sourced, premium wood, designed to last for generations.',
      price: 45000,
      stock: 5,
      categoryId: bedroom.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
    },
    {
      name: 'Vintage Oak Dining Table',
      description: 'Gather around this beautiful Vintage Oak Dining Table. Perfect for family dinners and hosting guests. Features a durable finish and sturdy construction.',
      price: 32000,
      stock: 2,
      categoryId: dining.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1617806118233-18e1c0945594?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
    },
    {
      name: 'Classic Mahogany Wardrobe',
      description: 'Spacious and elegant, the Classic Mahogany Wardrobe offers ample storage space with a touch of traditional charm. Features multiple compartments and a built-in mirror.',
      price: 28000,
      stock: 0,
      categoryId: bedroom.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
    },
    {
      name: 'Modern Sheesham Sofa Set',
      description: 'Upgrade your living room with the Modern Sheesham Sofa Set. Combining comfort with contemporary design, this set includes a 3-seater and two single chairs.',
      price: 55000,
      stock: 3,
      categoryId: living.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']),
    }
  ];

  for (const p of products) {
    const created = await prisma.product.create({ data: p });
    console.log(`Created product: ${created.name}`);
  }

  // 4. Create an Admin User
  // Note: in a real app, password should be hashed. Using plain text just for mock purposes as per schema.
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@alwarfurniture.com',
      password: 'adminpassword123',
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 5. Create a Customer User and mock Order
  const customer = await prisma.user.create({
    data: {
      name: 'Ramesh Kumar',
      email: 'ramesh@example.com',
      password: 'password123',
      role: 'CUSTOMER',
    },
  });
  console.log(`Created customer user: ${customer.email}`);

  // Mock Order
  const product1 = await prisma.product.findFirst({ where: { name: 'Royal Teak Wood Bed' } });
  
  if (product1) {
    await prisma.order.create({
      data: {
        userId: customer.id,
        status: 'PENDING',
        totalAmount: product1.price,
        items: {
          create: [
            {
              productId: product1.id,
              quantity: 1,
              price: product1.price,
            }
          ]
        }
      }
    });
    console.log('Created mock order for Ramesh.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
