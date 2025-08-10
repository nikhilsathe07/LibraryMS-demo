import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X } from 'lucide-react'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      }

      if (formData.newPassword) {
        updateData.password = formData.newPassword
      }

      const result = await updateProfile(updateData)
      
      if (result.success) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Profile update failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
        <p className="text-gray-600">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-primary-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{user?.name}</h2>
              <p className="text-gray-600 mb-2">{user?.email}</p>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Shield className={`h-4 w-4 ${user?.role === 'admin' ? 'text-red-500' : 'text-green-500'}`} />
                <span className={`text-sm font-medium capitalize ${
                  user?.role === 'admin' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {user?.role}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Member since {new Date(user?.membershipDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Books Borrowed</span>
                <span className="font-medium">{user?.borrowingHistory?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Status</span>
                <span className={`font-medium ${user?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={user?.role}
                      disabled
                      className="input-field pl-10 bg-gray-50 text-gray-500 capitalize"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Password Change Section */}
              {isEditing && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Leave password fields empty if you don't want to change your password.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="loading-spinner mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile