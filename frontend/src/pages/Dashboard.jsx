import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  RotateCcw,
  Eye
} from 'lucide-react'
import api from '../services/api'

const Dashboard = () => {
  const { user } = useAuth()
  const [borrowings, setBorrowings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBorrowings()
  }, [])

  const fetchBorrowings = async () => {
    try {
      const response = await api.get('/borrow/my-borrowings')
      setBorrowings(response.data)
    } catch (error) {
      console.error('Error fetching borrowings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (transactionId) => {
    try {
      await api.put(`/borrow/return/${transactionId}`)
      toast.success('Book returned successfully!')
      fetchBorrowings()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book')
    }
  }

  const handleRenew = async (transactionId) => {
    try {
      await api.put(`/borrow/renew/${transactionId}`)
      toast.success('Book renewed successfully!')
      fetchBorrowings()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to renew book')
    }
  }

  const getStatusColor = (status, dueDate) => {
    if (status === 'returned') return 'bg-green-100 text-green-800'
    if (status === 'overdue' || new Date() > new Date(dueDate)) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-blue-100 text-blue-800'
  }

  const getStatusText = (status, dueDate) => {
    if (status === 'returned') return 'Returned'
    if (status === 'overdue' || new Date() > new Date(dueDate)) {
      return 'Overdue'
    }
    return 'Borrowed'
  }

  const activeBorrowings = borrowings.filter(b => b.status === 'borrowed')
  const completedBorrowings = borrowings.filter(b => b.status === 'returned')
  const overdueBorrowings = activeBorrowings.filter(b => new Date() > new Date(b.dueDate))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">
          Manage your borrowed books and explore your reading journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Currently Borrowed</div>
              <div className="text-2xl font-bold text-gray-900">{activeBorrowings.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Books Returned</div>
              <div className="text-2xl font-bold text-gray-900">{completedBorrowings.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Overdue Books</div>
              <div className="text-2xl font-bold text-gray-900">{overdueBorrowings.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Books Read</div>
              <div className="text-2xl font-bold text-gray-900">{borrowings.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/books"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Browse Books
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-5 w-5 mr-2" />
            View Profile
          </Link>
        </div>
      </div>

      {/* Current Borrowings */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Current Borrowings</h2>
        </div>
        
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-16 w-12 bg-gray-300 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeBorrowings.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {activeBorrowings.map((borrowing) => {
              const isOverdue = new Date() > new Date(borrowing.dueDate)
              const daysUntilDue = Math.ceil((new Date(borrowing.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
              
              return (
                <div key={borrowing._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary-600" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {borrowing.book?.title}
                        </h3>
                        <p className="text-gray-600 mb-2">by {borrowing.book?.author}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Borrowed: {new Date(borrowing.borrowDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Due: {new Date(borrowing.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {isOverdue ? (
                          <div className="mt-2 flex items-center text-red-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">
                              Overdue by {Math.abs(daysUntilDue)} days
                            </span>
                          </div>
                        ) : daysUntilDue <= 3 && (
                          <div className="mt-2 flex items-center text-yellow-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">
                              Due in {daysUntilDue} days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(borrowing.status, borrowing.dueDate)}`}>
                        {getStatusText(borrowing.status, borrowing.dueDate)}
                      </span>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReturn(borrowing._id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          Return
                        </button>
                        
                        {borrowing.renewalCount < 2 && (
                          <button
                            onClick={() => handleRenew(borrowing._id)}
                            className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors flex items-center"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Renew
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books currently borrowed</h3>
            <p className="text-gray-600 mb-4">
              Explore our collection and borrow your next great read!
            </p>
            <Link
              to="/books"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Browse Books
            </Link>
          </div>
        )}
      </div>

      {/* Reading History */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Reading History</h2>
        </div>
        
        {completedBorrowings.length > 0 ? (
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {completedBorrowings.slice(0, 5).map((borrowing) => (
              <div key={borrowing._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{borrowing.book?.title}</h4>
                      <p className="text-sm text-gray-600">by {borrowing.book?.author}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Returned: {new Date(borrowing.returnDate).toLocaleDateString()}
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reading history yet</h3>
            <p className="text-gray-600">
              Your completed borrowings will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard