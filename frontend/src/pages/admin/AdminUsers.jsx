import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  X,
  Save,
  Shield,
  Calendar,
  Mail,
  Phone
} from 'lucide-react'
import api from '../../services/api'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('view')
  const [selectedUser, setSelectedUser] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    phone: '',
    address: '',
    isActive: true
  })

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await api.get(`/admin/users?${queryParams}`)
      setUsers(response.data.users)
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      })
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await api.put(`/admin/users/${selectedUser._id}`, formData)
      toast.success('User updated successfully!')
      setShowModal(false)
      fetchUsers()
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`)
        toast.success('User deleted successfully!')
        fetchUsers()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const openModal = (mode, user = null) => {
    setModalMode(mode)
    setSelectedUser(user)
    
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        phone: user.phone || '',
        address: user.address || '',
        isActive: user.isActive !== undefined ? user.isActive : true
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      phone: '',
      address: '',
      isActive: true
    })
  }

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 })
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'user':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600 mt-2">
          Manage library members and their account details.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filters.search}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Total Users: {pagination.total || 0}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Books Borrowed
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
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </td>
                  </tr>
                ))
              ) : users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.phone && (
                          <div className="text-xs text-gray-400">{user.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.membershipDate || user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.borrowingHistory?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal('view', user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal('edit', user)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.total)} of {pagination.total} users
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

      {/* User Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === 'edit' ? 'Edit User' : 'User Details'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="input-field"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="input-field"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Role
                  </label>
                  <select
                    name="role"
                    className="input-field"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="input-field"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  rows={3}
                  className="input-field"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Account is active</span>
                </label>
              </div>

              {/* User Stats (View mode only) */}
              {modalMode === 'view' && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">User Statistics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Member Since:</span>
                      <div className="font-medium">
                        {new Date(selectedUser.membershipDate || selectedUser.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Borrowed:</span>
                      <div className="font-medium">{selectedUser.borrowingHistory?.length || 0} books</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Account Status:</span>
                      <div className={`font-medium ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Updated:</span>
                      <div className="font-medium">
                        {new Date(selectedUser.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                
                {modalMode === 'edit' && (
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update User
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers