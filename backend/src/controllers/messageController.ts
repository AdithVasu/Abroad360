import type { Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import pool from '../lib/db.js';


export const searchUsers = async (req: AuthRequest, res: Response) => {
  const { query } = req.query; 
  const myId = req.user?.userId;

  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email 
       FROM users 
       WHERE (first_name ILIKE $1 OR last_name ILIKE $1)
       AND id != $2 
       LIMIT 10`,
      [`%${query}%`, myId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response) => {
  const { otherUserId } = req.params;
  const myId = req.user?.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
       OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY sent_at ASC`,
      [myId, otherUserId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch chat history' });
  }
};