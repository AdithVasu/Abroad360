import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Adding 'return' here stops the function and satisfies TS
    return res.status(401).json({ error: 'Access denied. Please log in.' });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as { userId: number };
    
    req.user = decoded;
    
    // Crucial: You must return the call to next() so TS knows the path ends here
    return next(); 
  } catch (err) {
    // Path for expired or malformed tokens
    return res.status(403).json({ error: 'Invalid or expired session.' });
  }
};