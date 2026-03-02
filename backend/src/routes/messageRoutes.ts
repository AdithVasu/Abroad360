import { Router } from 'express';
import { searchUsers, getChatHistory } from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/search', authenticateToken, searchUsers);
router.get('/history/:otherUserId', authenticateToken, getChatHistory);

export default router;