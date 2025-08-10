import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { 
  DollarSign, 
  Search, 
  Calendar, 
  User,
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  X,
  Save
} from 'lucide-react'
import api from '../../services/api'

const AdminFines = () => {
  const [fines, setFines] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedFine, setSelectedFine] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'cash'
  })

  useEffect(() => {
    fetchFines()
  }, [filters])

  const fetchFines = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await api.get(`/admin/fines?${queryParams}`)
      setFines(response.data.fines)
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      })
    } catch (error) {
      console.error('Error fetching fines:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    
    try {
      await api.put(`/admin/fines/${selectedFine._id}`, {
        status: 'paid',
        paidDate: new Date(),
        paymentMethod: paymentData.paymentMethod
      })
      
      toast.success('Fine payment recorded successfully!')
      setShowModal(false)
      fetchFines()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record payment')
    }
  }

  const handleWaiveFine = async (fineId) => {
    if (window.confirm('Are you sure you want to waive this fine?')) {
      try {
        await api.put(`/admin/fines/${fineId}`, {
          status: 'waived',
          paidDate: new Date()
        })
        
        toast.success('Fine waived successfully!')
        fetchFines()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to waive fine')
      }
    }
  }

  const openPaymentModal = (fine) => {
    setSelectedFine(fine)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedFine(null)
    setPaymentData({ paymentMethod: 'cash' })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'waived':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'waived':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  const totalPendingAmount = fines
    .filter(fine => fine.status === 'pending')
    .reduce((sum, fine) => sum + fine.amount, 0)

  const totalPaidAmount = fines
    .filter(fine => fine.status === 'paid')
    .reduce((sum, fine) => sum + fine.amount, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Fines Management</h1>
        <p className="text-gray-600 mt-2">
          Track and manage library fines and payments.
        </p>
      </div>

      {/* Filters and Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Fine Management</h3>
          </div>
          
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="waived">Waived</option>
            </select>

            <button
              onClick={() => fetchFines()}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="font-medium text-red-800">Total Fines</div>
            <div className="text-red-600">{pagination.total || 0}</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="font-medium text-yellow-800">Pending Amount</div>
            <div className="text-yellow-600">${totalPendingAmount.toFixed(2)}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="font-medium text-green-800">Paid Amount</div>
            <div className="text-green-600">${totalPaidAmount.toFixed(2)}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="font-medium text-blue-800">Waived Fines</div>
            <div className="text-blue-600">
              {fines.filter(f => f.status === 'waived').length}
            </div>
          </div>
        </div>
      </div>

      {/* Fines Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book & Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
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
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </td>
                  </tr>
                ))
              ) : fines.length > 0 ? (
                fines.map((fine) => (
                  <tr key={fine._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {fine.user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {fine.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-6 mt-1">
                          <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                            <BookOpen className="h-3 w-3 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {fine.transaction?.book?.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            by {fine.transaction?.book?.author}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {fine.reason}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {fine.amount.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(fine.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(fine.status)}`}>
                          {fine.status}
                        </span>
                      </div>
                      {fine.paidDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          {fine.status} on {new Date(fine.paidDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(fine.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {fine.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openPaymentModal(fine)}
                            className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-lg transition-colors text-xs"
                          >
                            Record Payment
                          </button>
                          <button
                            onClick={() => handleWaiveFine(fine._id)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-lg transition-colors text-xs"
                          >
                            Waive Fine
                          </button>
                        </div>
                      )}
                      
                      {fine.status === 'paid' && fine.paymentMethod && (
                        <span className="text-xs text-gray-500">
                          Paid via {fine.paymentMethod}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="text-lg font-medium mb-2">No fines found</div>
                    <div className="text-sm">Fines will appear here when users have overdue books.</div>
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
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.total)} of {pagination.total} fines
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

      {/* Payment Modal */}
      {showModal && selectedFine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Record Fine Payment</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Fine Details:</div>
              <div className="font-medium text-gray-900">{selectedFine.user?.name}</div>
              <div className="text-sm text-gray-600">{selectedFine.transaction?.book?.title}</div>
              <div className="text-sm text-gray-600">{selectedFine.reason}</div>
              <div className="text-lg font-bold text-red-600 mt-2">
                ${selectedFine.amount.toFixed(2)}
              </div>
            </div>

            <form onSubmit={handlePayment}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  className="input-field"
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="online">Online Payment</option>
                  <option value="check">Check</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminFines