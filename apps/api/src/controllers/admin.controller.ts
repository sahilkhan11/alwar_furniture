import { Request, Response } from 'express';
import { prisma } from '@alwarfurniture/db';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();
    const totalOrders = await prisma.order.count();
    const orders = await prisma.order.findMany();
    
    const totalRevenue = orders.reduce((acc, order) => {
      // only count paid/delivered if desired, for now we sum all
      return acc + Number(order.totalAmount);
    }, 0);

    res.json({
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
