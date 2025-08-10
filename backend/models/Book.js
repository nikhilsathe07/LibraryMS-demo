import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    publishedDate: {
      type: Date,
    },
    publisher: {
      type: String,
      trim: true,
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 0,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
    },
    borrowedCopies: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
      default: "https://i.postimg.cc/hPLx2628/book-demo.jpg",
    },
    files: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        uploadDate: { type: Date, default: Date.now },
      },
    ],
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    borrowCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ title: 'text', author: 'text', genre: 'text' });

const Book = mongoose.model('Book', bookSchema);
export default Book;