import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import pool from '../lib/db.js';

export const getUserDashboard = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    
    
    const createdPlans = await pool.query(
      'SELECT * FROM plans WHERE creator_id = $1 ORDER BY plan_at ASC',
      [userId]
    );

    const joinedPlans = await pool.query(
      `SELECT p.*, u.first_name as host_name 
       FROM plans p
       JOIN participants pr ON p.id = pr.plan_id
       JOIN users u ON p.creator_id = u.id
       WHERE pr.user_id = $1
       ORDER BY p.plan_at ASC`,
      [userId]
    );

    res.json({
      myCreatedPlans: createdPlans.rows,
      myJoinedPlans: joinedPlans.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard.' });
  }
};