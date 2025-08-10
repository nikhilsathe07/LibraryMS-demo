import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guest'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  membershipDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  borrowingHistory: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    borrowDate: Date,
    returnDate: Date,
    dueDate: Date,
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue'],
      default: 'borrowed'
    }
  }],
  preferences: {
    favoriteGenres: [String],
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;