import User from '../models/User.js';
import Book from '../models/Book.js';
import BorrowTransaction from '../models/BorrowTransaction.js';
import Fine from '../models/Fine.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBooks = await Book.countDocuments();
    const totalBorrowedBooks = await BorrowTransaction.countDocuments({ status: 'borrowed' });
    const overdueBooks = await BorrowTransaction.countDocuments({
      status: 'borrowed',
      dueDate: { $lt: new Date() }
    });
    const totalFines = await Fine.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Popular books
    const popularBooks = await Book.find()
      .sort({ borrowCount: -1 })
      .limit(5)
      .select('title author borrowCount');

    // Recent borrowings
    const recentBorrowings = await BorrowTransaction.find()
      .populate('user', 'name email')
      .populate('book', 'title author')
      .sort({ createdAt: -1 })
      .limit(10);

    // Monthly borrowing stats
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await BorrowTransaction.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Genre distribution
    const genreStats = await Book.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalBooks,
        totalBorrowedBooks,
        overdueBooks,
        totalFines: totalFines[0]?.total || 0
      },
      popularBooks,
      recentBorrowings,
      monthlyStats,
      genreStats
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for active borrowings
    const activeBorrowings = await BorrowTransaction.countDocuments({
      user: req.params.id,
      status: 'borrowed'
    });

    if (activeBorrowings > 0) {
      return res.status(400).json({
        message: 'Cannot delete user with active borrowings'
      });
    }

    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFines = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const fines = await Fine.find(query)
      .populate('user', 'name email')
      .populate({
        path: 'transaction',
        populate: { path: 'book', select: 'title author' }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Fine.countDocuments(query);

    res.json({
      fines,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFine = async (req, res) => {
  try {
    const fine = await Fine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user', 'name email');

    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    res.json(fine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};