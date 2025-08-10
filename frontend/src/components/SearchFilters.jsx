import React, { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import api from '../services/api'

const SearchFilters = ({ onFilterChange, filters }) => {
  const [genres, setGenres] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    try {
      const response = await api.get('/books/genres')
      setGenres(response.data)
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  const handleInputChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters */}
      <div className={`mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 ${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden lg:grid'}`}>
        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genre
          </label>
          <select
            className="input-field"
            value={filters.genre || ''}
            onChange={(e) => handleInputChange('genre', e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Author Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author
          </label>
          <input
            type="text"
            placeholder="Filter by author"
            className="input-field"
            value={filters.author || ''}
            onChange={(e) => handleInputChange('author', e.target.value)}
          />
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <select
            className="input-field"
            value={filters.available || ''}
            onChange={(e) => handleInputChange('available', e.target.value)}
          >
            <option value="">All Books</option>
            <option value="true">Available Only</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchFilters