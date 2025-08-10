import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { 
  BookOpen, 
  User, 
  Calendar, 
  Star, 
  MessageCircle,
  ArrowLeft,
  Download,
  Heart
} from 'lucide-react'
import api from '../services/api'

const BookDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    try {
      const response = await api.get(`/books/${id}`)
      setBook(response.data)
    } catch (error) {
      console.error('Error fetching book:', error)
      navigate('/books')
    } finally {
      setLoading(false)
    }
  }

  const handleBorrow = async () => {
    if (!user) {
      toast.error('Please login to borrow books')
      navigate('/login')
      return
    }

    setBorrowing(true)
    try {
      await api.post('/borrow/borrow', { bookId: id })
      toast.success('Book borrowed successfully!')
      fetchBook() // Refresh book data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book')
    } finally {
      setBorrowing(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to leave a review')
      return
    }

    try {
      await api.post(`/books/${id}/review`, review)
      toast.success('Review submitted successfully!')
      setReview({ rating: 5, comment: '' })
      setShowReviewForm(false)
      fetchBook() // Refresh book data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="aspect-[3/4] bg-gray-300 rounded-lg"></div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-300 rounded"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h1>
        <button
          onClick={() => navigate('/books')}
          className="btn-primary"
        >
          Back to Books
        </button>
      </div>
    )
  }

  const userReview = book.reviews?.find(review => review.user._id === user?._id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/books')}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Books
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mb-6">
            <BookOpen className="h-24 w-24 text-primary-600" />
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            {user && (
              <button
                onClick={handleBorrow}
                disabled={borrowing || book.availableCopies === 0}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  book.availableCopies > 0 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {borrowing ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Borrowing...
                  </div>
                ) : book.availableCopies > 0 ? (
                  'Borrow Book'
                ) : (
                  'Not Available'
                )}
              </button>
            )}
            
            <button className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
              <Heart className="h-5 w-5 mr-2" />
              Add to Wishlist
            </button>
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-1" />
                  <span>{book.author}</span>
                </div>
                {book.publishedDate && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-1" />
                    <span>{new Date(book.publishedDate).getFullYear()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">
                    {book.rating?.average ? book.rating.average.toFixed(1) : 'No ratings'}
                  </span>
                  <span className="text-gray-500 ml-1">
                    ({book.rating?.count || 0} reviews)
                  </span>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm ${
                  book.availableCopies > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.availableCopies} of {book.totalCopies} available
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-200">
              <div>
                <div className="text-sm text-gray-500">Genre</div>
                <div className="font-medium">{book.genre}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Publisher</div>
                <div className="font-medium">{book.publisher || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">ISBN</div>
                <div className="font-medium">{book.isbn}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Times Borrowed</div>
                <div className="font-medium">{book.borrowCount}</div>
              </div>
            </div>

            {book.description && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>
            )}

            {/* Files Section */}
            {book.files && book.files.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Available Files</h2>
                <div className="space-y-2">
                  {book.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium">{file.originalName}</div>
                        <div className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <button className="flex items-center text-primary-600 hover:text-primary-700">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {user && !userReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center btn-primary"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReview({ ...review, rating: star })}
                      className={`text-2xl ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  rows={4}
                  className="input-field"
                  placeholder="Share your thoughts about this book..."
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                />
              </div>
              
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {book.reviews && book.reviews.length > 0 ? (
            book.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 ml-11">{review.comment}</p>
                )}
                <div className="text-sm text-gray-500 ml-11 mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No reviews yet. Be the first to review this book!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetail