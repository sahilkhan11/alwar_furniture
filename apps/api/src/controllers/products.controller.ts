import { Request, Response } from 'express';
import { prisma } from '@alwarfurniture/db';

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock, categoryId } = req.body;

  if (!name || !price || !categoryId) {
    res.status(400).json({ error: 'Name, price, and categoryId are required' });
    return;
  }

  // Handle uploaded files
  let imageUrls: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    // Generate full URL (e.g., http://localhost:5000/uploads/filename.jpg)
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    imageUrls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
  } else if (req.body.images) {
    // Fallback if images are provided as an array or JSON string
    imageUrls = Array.isArray(req.body.images) ? req.body.images : JSON.parse(req.body.images);
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock: stock ? parseInt(stock) : 0,
      categoryId,
      images: JSON.stringify(imageUrls),
    },
  });

  res.status(201).json({
    ...product,
    images: product.images ? JSON.parse(product.images as string) : []
  });
};

export const getProducts = async (req: Request, res: Response) => {
  const { categoryId, search } = req.query;

  const whereClause: any = {};

  if (categoryId) {
    whereClause.categoryId = categoryId as string;
  }

  if (search) {
    whereClause.name = {
      contains: search as string,
    };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedProducts = products.map(p => ({
    ...p,
    images: p.images ? JSON.parse(p.images as string) : []
  }));

  res.json(formattedProducts);
};

export const getProductById = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.json({
    ...product,
    images: product.images ? JSON.parse(product.images as string) : []
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, description, price, stock, categoryId } = req.body;

  let imageUrls: string[] | undefined = undefined;
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    imageUrls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
  } else if (req.body.images) {
    imageUrls = Array.isArray(req.body.images) ? req.body.images : JSON.parse(req.body.images);
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { 
        name, 
        description, 
        price, 
        stock: stock ? parseInt(stock) : undefined, 
        categoryId, 
        images: imageUrls ? JSON.stringify(imageUrls) : undefined 
      },
    });
    res.json({
      ...product,
      images: product.images ? JSON.parse(product.images as string) : []
    });
  } catch (error) {
    res.status(404).json({ error: 'Product not found' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Product not found or cannot be deleted' });
  }
};
