import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  getUserTransactions
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticate, getProfile);
router.get('/transactions', authenticate, getUserTransactions);

export default router;
