import mongoose from 'mongoose';

const fineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BorrowTransaction',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'waived'],
    default: 'pending'
  },
  paidDate: Date,
  paymentMethod: String
}, {
  timestamps: true
});

const Fine = mongoose.model('Fine', fineSchema);
export default Fine;