import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Clock, Star, Search, ArrowRight } from 'lucide-react'
import api from '../services/api'
import BookCard from '../components/BookCard'

const Home = () => {
  const [popularBooks, setPopularBooks] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [booksResponse, statsResponse] = await Promise.all([
        api.get('/books/popular'),
        api.get('/books?limit=6')
      ])
      
      setPopularBooks(booksResponse.data)
      setStats({
        totalBooks: statsResponse.data.total || 0,
        availableBooks: statsResponse.data.books?.filter(book => book.availableCopies > 0).length || 0
      })
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to
              <span className="block text-primary-200">LibraryMS</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Your gateway to knowledge. Discover, borrow, and explore thousands of books 
              in our comprehensive digital library management system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/books"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                <Search className="h-5 w-5 mr-2" />
                Browse Books
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-400 transition-colors border border-primary-400"
              >
                Join Library
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, label: 'Total Books', value: stats.totalBooks, color: 'text-blue-600' },
              { icon: Users, label: 'Active Members', value: '1,250+', color: 'text-green-600' },
              { icon: Clock, label: 'Available Now', value: stats.availableBooks, color: 'text-purple-600' },
              { icon: Star, label: 'Rating', value: '4.8/5', color: 'text-yellow-600' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Books</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most borrowed and highly-rated books in our collection.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card p-6 animate-pulse">
                  <div className="aspect-[3/4] bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularBooks.slice(0, 6).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/books"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              View All Books
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LibraryMS?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of library management with our comprehensive features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: 'Smart Search',
                description: 'Find books instantly with our powerful search and filtering system.'
              },
              {
                icon: Clock,
                title: 'Easy Borrowing',
                description: 'Borrow and return books with just a few clicks. Track due dates effortlessly.'
              },
              {
                icon: Star,
                title: 'Reviews & Ratings',
                description: 'Read reviews and rate books to help others discover great reads.'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home