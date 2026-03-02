import type { Request, Response } from 'express';
import type { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../lib/db.js'; 

const pool = db as Pool;


export const signup = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !email.endsWith('@wustl.edu')) {
    return res.status(403).json({ error: 'WashU email required.' });
  }

  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, email',
      [firstName, lastName, email, hashedPassword]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Signup Error:', err);
    return res.status(500).json({ error: 'Signup failed. Email might already be in use.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      { userId: user.id }, 
      secret, 
      { expiresIn: '7d' }
    );
    
    return res.json({ 
      token, 
      user: { 
        id: user.id, 
        firstName: user.first_name,
        lastName: user.last_name
      } 
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};