import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@alwarfurniture/db';
import { auth as firebaseAuth } from '../services/firebase.service';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(400).json({ error: 'Email already in use' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'CUSTOMER'
      },
  });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(user);
};

export const firebaseLogin = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400).json({ error: 'Missing Firebase ID token' });
    return;
  }

  try {
    // 1. Verify the Firebase token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const phone = decodedToken.phone_number;

    if (!phone) {
      res.status(400).json({ error: 'No phone number linked to this Firebase account' });
      return;
    }

    // 2. Find or Create the user in our database
    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name: 'New User', // Default name, they can update later
          role: 'CUSTOMER',
        }
      });
    }

    // 3. Issue our own JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Firebase login successful',
      token,
      user: { id: user.id, phone: user.phone, name: user.name, role: user.role },
    });

  } catch (error) {
    console.error('Firebase token verification error:', error);
    res.status(401).json({ error: 'Invalid Firebase ID token' });
  }
};
