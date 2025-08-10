import express from 'express';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  addReview,
  getGenres,
  getPopularBooks
} from '../controllers/bookController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/genres', getGenres);
router.get('/popular', getPopularBooks);
router.get('/:id', getBook);
router.post('/', protect, authorize('admin'), createBook);
// router.post("/", createBook);

router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);
router.post('/:id/review', protect, addReview);

export default router;