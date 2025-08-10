import express from 'express';
import {
  borrowBook,
  returnBook,
  getUserBorrowings,
  getAllBorrowings,
  renewBook
} from '../controllers/borrowController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/borrow', protect, borrowBook);
router.put('/return/:transactionId', protect, returnBook);
router.get('/my-borrowings', protect, getUserBorrowings);
router.get('/all', protect, authorize('admin'), getAllBorrowings);
router.put('/renew/:transactionId', protect, renewBook);

export default router;