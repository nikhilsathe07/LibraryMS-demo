import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Clock, 
  User,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import api from '../../services/api'

const AdminBorrowings = () => {
  const [borrowings, setBorrowings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    fetchBorrowings()
  }, [filters])

  const fetchBorrowings = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await api.get(`/borrow/all?${queryParams}`)
      setBorrowings(response.data.transactions)
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      })
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

  const getStatusIcon = (status, dueDate) => {
    if (status === 'returned') {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    if (status === 'borrowed' && new Date() > new Date(dueDate)) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
    return <Clock className="h-5 w-5 text-blue-500" />
  }

  const getStatusColor = (status, dueDate) => {
    if (status === 'returned') {
      return 'bg-green-100 text-green-800'
    }
    if (status === 'borrowed' && new Date() > new Date(dueDate)) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-blue-100 text-blue-800'
  }

  const getStatusText = (status, dueDate) => {
    if (status === 'returned') return 'Returned'
    if (status === 'borrowed' && new Date() > new Date(dueDate)) {
      return 'Overdue'
    }
    return 'Borrowed'
  }

  const getDaysOverdue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    if (today > due) {
      return Math.ceil((today - due) / (1000 * 60 * 60 * 24))
    }
    return 0
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Borrowing Management</h1>
        <p className="text-gray-600 mt-2">
          Track and manage all book borrowing transactions.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Filter Borrowings</h3>
          </div>
          
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">All Status</option>
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>

            <button
              onClick={() => fetchBorrowings()}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="font-medium text-blue-800">Total Transactions</div>
            <div className="text-blue-600">{pagination.total || 0}</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="font-medium text-yellow-800">Active Borrowings</div>
            <div className="text-yellow-600">
              {borrowings.filter(b => b.status === 'borrowed').length}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="font-medium text-red-800">Overdue</div>
            <div className="text-red-600">
              {borrowings.filter(b => b.status === 'borrowed' && new Date() > new Date(b.dueDate)).length}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="font-medium text-green-800">Returned</div>
            <div className="text-green-600">
              {borrowings.filter(b => b.status === 'returned').length}
            </div>
          </div>
        </div>
      </div>

      {/* Borrowings Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrow Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </td>
                  </tr>
                ))
              ) : borrowings.length > 0 ? (
                borrowings.map((borrowing) => {
                  const isOverdue = borrowing.status === 'borrowed' && new Date() > new Date(borrowing.dueDate)
                  const daysOverdue = getDaysOverdue(borrowing.dueDate)
                  
                  return (
                    <tr key={borrowing._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {borrowing.user?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {borrowing.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-6">
                            <div className="h-8 w-6 bg-blue-100 rounded flex items-center justify-center">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {borrowing.book?.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              by {borrowing.book?.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(borrowing.borrowDate).toLocaleDateString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(borrowing.dueDate).toLocaleDateString()}
                          {isOverdue && (
                            <span className="ml-2 text-xs text-red-600 font-medium">
                              ({daysOverdue} days late)
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(borrowing.status, borrowing.dueDate)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(borrowing.status, borrowing.dueDate)}`}>
                            {getStatusText(borrowing.status, borrowing.dueDate)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {borrowing.fine?.amount > 0 ? (
                          <span className="text-red-600 font-medium">
                            ${borrowing.fine.amount}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {borrowing.status === 'borrowed' && (
                          <button
                            onClick={() => handleReturn(borrowing._id)}
                            className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-lg transition-colors"
                          >
                            Mark as Returned
                          </button>
                        )}
                        
                        {borrowing.status === 'returned' && borrowing.returnDate && (
                          <span className="text-sm text-gray-500">
                            Returned {new Date(borrowing.returnDate).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="text-lg font-medium mb-2">No borrowings found</div>
                    <div className="text-sm">Borrowing transactions will appear here once users start borrowing books.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.total)} of {pagination.total} transactions
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm bg-primary-600 text-white rounded">
                  {pagination.currentPage}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBorrowings