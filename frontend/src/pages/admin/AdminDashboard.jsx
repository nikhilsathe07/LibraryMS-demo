import React, { useState, useEffect } from 'react'
import { 
  Users, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  DollarSign,
  TrendingUp,
  Calendar,
  Star
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import api from '../../services/api'

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    popularBooks: [],
    recentBorrowings: [],
    monthlyStats: [],
    genreStats: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md h-24"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const { stats, popularBooks, recentBorrowings, monthlyStats, genreStats } = dashboardData

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of library operations and key metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Users</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Books</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalBooks}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Borrowed Books</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalBorrowedBooks}</div>
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
              <div className="text-2xl font-bold text-gray-900">{stats.overdueBooks}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Pending Fines</div>
              <div className="text-2xl font-bold text-gray-900">${stats.totalFines}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Borrowing Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Monthly Borrowing Trends</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id.month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center mb-6">
            <BookOpen className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Books by Genre</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genreStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {genreStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Popular Books and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Books */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Popular Books</h2>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {popularBooks.map((book, index) => (
              <div key={book._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{book.title}</h4>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {book.borrowCount} borrows
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Borrowings */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Borrowings</h2>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {recentBorrowings.map((borrowing) => (
              <div key={borrowing._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{borrowing.user?.name}</h4>
                      <p className="text-sm text-gray-600">{borrowing.book?.title}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {new Date(borrowing.createdAt).toLocaleDateString()}
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {borrowing.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard