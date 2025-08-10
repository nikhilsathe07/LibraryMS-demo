import express from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  getFines,
  updateFine
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/fines', getFines);
router.put('/fines/:id', updateFine);

export default router;