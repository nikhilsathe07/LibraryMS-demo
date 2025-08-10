import React from 'react'
import { Link } from 'react-router-dom'
import { Star, BookOpen, User } from 'lucide-react'

const BookCard = ({ book }) => {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
        <BookOpen className="h-12 w-12 text-primary-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
          {book.title}
        </h3>
        
        <div className="flex items-center text-gray-600">
          <User className="h-4 w-4 mr-1" />
          <span className="text-sm">{book.author}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {book.rating?.average ? book.rating.average.toFixed(1) : 'No ratings'}
            </span>
          </div>
          
          <span className={`text-xs px-2 py-1 rounded-full ${
            book.availableCopies > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {book.availableCopies > 0 ? 'Available' : 'Not Available'}
          </span>
        </div>
        
        <div className="pt-2">
          <Link
            to={`/books/${book._id}`}
            className="block w-full text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookCard