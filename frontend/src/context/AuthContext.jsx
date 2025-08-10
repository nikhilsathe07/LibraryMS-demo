import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile')
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, ...userData } = response.data
      
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { token, ...user } = response.data
      
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      setUser(response.data)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      }
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}