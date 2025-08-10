import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, User, LogOut, Menu, X, Settings } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-600">
            <BookOpen className="h-8 w-8" />
            <span>LibraryMS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/books" className="text-gray-700 hover:text-primary-600 transition-colors">
              Books
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 inline mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              <Link
                to="/books"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Books
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar