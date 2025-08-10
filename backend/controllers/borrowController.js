import BorrowTransaction from '../models/BorrowTransaction.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import Fine from '../models/Fine.js';

export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // Check if user already has this book
    const existingBorrow = await BorrowTransaction.findOne({
      user: userId,
      book: bookId,
      status: 'borrowed'
    });

    if (existingBorrow) {
      return res.status(400).json({ message: 'You already have this book' });
    }

    // Check user's borrowing limit (max 5 books)
    const userActiveBooks = await BorrowTransaction.countDocuments({
      user: userId,
      status: 'borrowed'
    });

    if (userActiveBooks >= 5) {
      return res.status(400).json({ message: 'Borrowing limit exceeded (max 5 books)' });
    }

    // Create borrow transaction
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks borrowing period

    const transaction = await BorrowTransaction.create({
      user: userId,
      book: bookId,
      dueDate
    });

    // Update book availability
    book.availableCopies -= 1;
    book.borrowedCopies += 1;
    book.borrowCount += 1;
    await book.save();

    // Update user borrowing history
    await User.findByIdAndUpdate(userId, {
      $push: {
        borrowingHistory: {
          book: bookId,
          borrowDate: new Date(),
          dueDate,
          status: 'borrowed'
        }
      }
    });

    await transaction.populate('book');
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await BorrowTransaction.findById(transactionId)
      .populate('book')
      .populate('user');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (transaction.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // Update transaction
    transaction.returnDate = new Date();
    transaction.status = 'returned';

    // Calculate fine if overdue
    const today = new Date();
    if (today > transaction.dueDate) {
      const daysOverdue = Math.ceil((today - transaction.dueDate) / (1000 * 60 * 60 * 24));
      const fineAmount = daysOverdue * 1; // $1 per day

      transaction.fine.amount = fineAmount;

      // Create fine record
      await Fine.create({
        user: transaction.user._id,
        transaction: transaction._id,
        amount: fineAmount,
        reason: `Overdue return (${daysOverdue} days late)`
      });
    }

    await transaction.save();

    // Update book availability
    const book = await Book.findById(transaction.book._id);
    book.availableCopies += 1;
    book.borrowedCopies -= 1;
    await book.save();

    // Update user borrowing history
    await User.findByIdAndUpdate(transaction.user._id, {
      $set: {
        'borrowingHistory.$[elem].returnDate': new Date(),
        'borrowingHistory.$[elem].status': 'returned'
      }
    }, {
      arrayFilters: [{ 'elem.book': transaction.book._id, 'elem.status': 'borrowed' }]
    });

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserBorrowings = async (req, res) => {
  try {
    const transactions = await BorrowTransaction.find({ user: req.user.id })
      .populate('book')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllBorrowings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const transactions = await BorrowTransaction.find(query)
      .populate('book', 'title author')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BorrowTransaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const renewBook = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await BorrowTransaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (transaction.renewalCount >= 2) {
      return res.status(400).json({ message: 'Maximum renewals reached' });
    }

    if (transaction.status !== 'borrowed') {
      return res.status(400).json({ message: 'Book is not currently borrowed' });
    }

    // Extend due date by 14 days
    const newDueDate = new Date(transaction.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);

    transaction.dueDate = newDueDate;
    transaction.renewalCount += 1;

    await transaction.save();
    await transaction.populate('book');

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};