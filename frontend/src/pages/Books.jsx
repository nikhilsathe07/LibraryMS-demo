import React, { useState, useEffect } from 'react'
import api from '../services/api'
import BookCard from '../components/BookCard'
import SearchFilters from '../components/SearchFilters'
import Pagination from '../components/Pagination'

const Books = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    author: '',
    available: '',
    page: 1,
    limit: 12,
    sort: 'title'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  useEffect(() => {
    fetchBooks()
  }, [filters])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value)
        }
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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page) => {
    setFilters({ ...filters, page })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Books</h1>
        <p className="text-gray-600">
          Discover our extensive collection of books across various genres and authors.
        </p>
      </div>

      <SearchFilters onFilterChange={handleFilterChange} filters={filters} />

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {loading ? (
            'Loading...'
          ) : (
            `Showing ${books.length} of ${pagination.total} books`
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filters.sort}
            onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value, page: 1 })}
          >
            <option value="title">Title (A-Z)</option>
            <option value="-title">Title (Z-A)</option>
            <option value="author">Author (A-Z)</option>
            <option value="-borrowCount">Most Popular</option>
            <option value="-rating.average">Highest Rated</option>
            <option value="-createdAt">Newest First</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="card p-6 animate-pulse">
              <div className="aspect-[3/4] bg-gray-300 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or browse all books.
          </p>
          <button
            onClick={() => handleFilterChange({
              search: '',
              genre: '',
              author: '',
              available: '',
              page: 1,
              limit: 12,
              sort: 'title'
            })}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Books