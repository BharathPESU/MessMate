import express from 'express';
import {
  scanAndDeduct,
  listUsers,
  adjustCredits,
  getUserTransactionsAdmin
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.post('/scan', scanAndDeduct);
router.get('/users', listUsers);
router.put('/credits', adjustCredits);
router.get('/transactions/:userId', getUserTransactionsAdmin);

export default router;
