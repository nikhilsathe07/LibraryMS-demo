import mongoose from 'mongoose';

const borrowTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  fine: {
    amount: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    paidDate: Date
  },
  renewalCount: {
    type: Number,
    default: 0,
    max: 2
  }
}, {
  timestamps: true
});

const BorrowTransaction = mongoose.model('BorrowTransaction', borrowTransactionSchema);
export default BorrowTransaction;