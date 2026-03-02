import type { Response } from 'express';
import type { Pool } from 'pg';
import type { AuthRequest } from '../middleware/authMiddleware';
import db from '../lib/db.js';

const pool = db as Pool;

export const getPlansByCity = async (req: AuthRequest, res: Response) => {
  const { city } = req.params;
  const userId = req.user?.userId; 

  try {
    const result = await pool.query(
      `SELECT p.*, u.first_name, u.last_name, 
       (SELECT COUNT(*) FROM participants WHERE plan_id = p.id) as attendee_count,
       -- This subquery checks if the current user is in the participants table for this plan
       EXISTS (
         SELECT 1 FROM participants 
         WHERE plan_id = p.id AND user_id = $2
       ) as joined_by_me
       FROM plans p
       JOIN users u ON p.creator_id = u.id
       WHERE p.city = $1
       ORDER BY p.plan_at ASC`,
      [city, userId] 
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching plans.' });
  }
};

export const createPlan = async (req: AuthRequest, res: Response) => {
  const { city, title, description, planAt } = req.body;
  const creatorId = req.user?.userId;

  try {
    const result = await pool.query(
      `INSERT INTO plans (creator_id, city, title, description, plan_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [creatorId, city, title, description, planAt]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create plan.' });
  }
};

export const joinPlan = async (req: AuthRequest, res: Response) => {
  const { planId } = req.params;
  const userId = req.user?.userId;

  try {
    await pool.query(
      'INSERT INTO participants (user_id, plan_id) VALUES ($1, $2)',
      [userId, planId]
    );
    res.json({ message: 'Successfully joined the plan!' });
  } catch (err) {
    
    res.status(409).json({ error: 'You have already joined this plan.' });
  }
};