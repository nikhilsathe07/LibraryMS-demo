import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  X,
  Save
} from 'lucide-react'
import api from '../../services/api'

const AdminBooks = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add', 'edit', 'view'
  const [selectedBook, setSelectedBook] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    genre: '',
    publishedDate: '',
    publisher: '',
    totalCopies: 1,
    availableCopies: 1
  })

  useEffect(() => {
    fetchBooks()
  }, [filters])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await api.get(`/books?${queryParams}`)
      setBooks(response.data.books)
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      })
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (modalMode === 'add') {
        await api.post('/books', formData)
        toast.success('Book added successfully!')
      } else if (modalMode === 'edit') {
        await api.put(`/books/${selectedBook._id}`, formData)
        toast.success('Book updated successfully!')
      }
      
      setShowModal(false)
      fetchBooks()
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${bookId}`)
        toast.success('Book deleted successfully!')
        fetchBooks()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const openModal = (mode, book = null) => {
    setModalMode(mode)
    setSelectedBook(book)
    
    if (mode === 'add') {
      resetForm()
    } else if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        description: book.description || '',
        genre: book.genre || '',
        publishedDate: book.publishedDate ? new Date(book.publishedDate).toISOString().split('T')[0] : '',
        publisher: book.publisher || '',
        totalCopies: book.totalCopies || 1,
        availableCopies: book.availableCopies || 1
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedBook(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      description: '',
      genre: '',
      publishedDate: '',
      publisher: '',
      totalCopies: 1,
      availableCopies: 1
    })
  }

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Books Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your library's book collection.
          </p>
        </div>
        
        <button
          onClick={() => openModal('add')}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Book
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books by title, author, or ISBN..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filters.search}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filters.genre}
            onChange={(e) => setFilters({ ...filters, genre: e.target.value, page: 1 })}
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Biography">Biography</option>
            <option value="Technology">Technology</option>
          </select>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrowed Count
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
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </td>
                  </tr>
                ))
              ) : books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-8">
                        <div className="h-10 w-8 bg-primary-100 rounded flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        <div className="text-sm text-gray-500">by {book.author}</div>
                        <div className="text-xs text-gray-400">ISBN: {book.isbn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {book.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.availableCopies} / {book.totalCopies}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.borrowCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal('view', book)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal('edit', book)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-900"
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
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.total)} of {pagination.total} books
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

      {/* Book Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === 'add' ? 'Add New Book' : 
                 modalMode === 'edit' ? 'Edit Book' : 'Book Details'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="input-field"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    required
                    className="input-field"
                    value={formData.author}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN *
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    required
                    className="input-field"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre *
                  </label>
                  <select
                    name="genre"
                    required
                    className="input-field"
                    value={formData.genre}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  >
                    <option value="">Select Genre</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Biography">Biography</option>
                    <option value="Technology">Technology</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Horror">Horror</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    className="input-field"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Published Date
                  </label>
                  <input
                    type="date"
                    name="publishedDate"
                    className="input-field"
                    value={formData.publishedDate}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Copies *
                  </label>
                  <input
                    type="number"
                    name="totalCopies"
                    min="1"
                    required
                    className="input-field"
                    value={formData.totalCopies}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Copies *
                  </label>
                  <input
                    type="number"
                    name="availableCopies"
                    min="0"
                    required
                    className="input-field"
                    value={formData.availableCopies}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="input-field"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                {modalMode !== 'view' && (
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {modalMode === 'add' ? 'Add Book' : 'Update Book'}
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

export default AdminBooks