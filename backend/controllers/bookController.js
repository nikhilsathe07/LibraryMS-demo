import Book from '../models/Book.js';
import BorrowTransaction from '../models/BorrowTransaction.js';

export const getBooks = async (req, res) => {
  try {
    const { search, genre, author, available, page = 1, limit = 12, sort = 'title' } = req.query;
    
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }
    
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }
    
    if (available === 'true') {
      query.availableCopies = { $gt: 0 };
    }

    const books = await Book.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('reviews.user', 'name');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if book is currently borrowed
    const activeBorrows = await BorrowTransaction.countDocuments({
      book: req.params.id,
      status: 'borrowed'
    });

    if (activeBorrows > 0) {
      return res.status(400).json({
        message: 'Cannot delete book with active borrowing transactions'
      });
    }

    await book.deleteOne();
    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = book.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.date = Date.now();
    } else {
      book.reviews.push({
        user: req.user.id,
        rating,
        comment
      });
    }

    // Update rating average
    const totalRatings = book.reviews.length;
    const averageRating = book.reviews.reduce((acc, review) => acc + review.rating, 0) / totalRatings;
    
    book.rating.average = averageRating;
    book.rating.count = totalRatings;

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getGenres = async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    res.json(genres);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPopularBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ borrowCount: -1, 'rating.average': -1 })
      .limit(10);
    
    res.json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};