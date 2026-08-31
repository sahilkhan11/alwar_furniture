import { Request, Response } from 'express';
import { prisma } from '@alwarfurniture/db';

export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }

  const category = await prisma.category.create({
    data: { name, description },
  });

  res.status(201).json(category);
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
  res.json(categories);
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, description } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name, description },
    });
    res.json(category);
  } catch (error) {
    res.status(404).json({ error: 'Category not found' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Category not found or cannot be deleted' });
  }
};
