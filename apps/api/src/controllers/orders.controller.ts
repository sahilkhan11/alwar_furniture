import { Request, Response } from 'express';
import { prisma } from '@alwarfurniture/db';
import Razorpay from 'razorpay';

export const createOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { items } = req.body; // Expecting [{ productId, quantity }]

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Order items are required' });
    return;
  }

  try {
    let totalAmount = 0;
    const orderItemsData = [];

    // Calculate total securely from the database
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        res.status(404).json({ error: `Product ${item.productId} not found` });
        return;
      }
      const price = Number(product.price);
      totalAmount += price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: price,
      });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
    });

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Save to Database
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING', // Will be updated to PAID after successful payment callback
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });

    res.status(201).json({
      order,
      razorpayOrder,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  res.json(orders);
};

export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(orders);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: 'Order not found' });
  }
};
