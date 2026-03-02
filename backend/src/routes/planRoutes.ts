import { Router } from 'express';
import { getPlansByCity, createPlan, joinPlan } from '../controllers/planController.js';
import { getUserDashboard } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Dashboard route (needs to be specific)
router.get('/dashboard', authenticateToken, getUserDashboard);

// City routes
router.get('/city/:city', authenticateToken, getPlansByCity);

// Action routes
router.post('/create', authenticateToken, createPlan);
router.post('/:planId/join', authenticateToken, joinPlan);

export default router;