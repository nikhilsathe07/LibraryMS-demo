import React from 'react'
import { BookOpen, Mail, Phone, MapPin, LibraryBigIcon, Library } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 text-xl font-bold mb-4">
              <Library className="h-8 w-8 text-primary-400" />
              <span>LibraryMS</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              A comprehensive library management system designed to streamline book borrowing, 
              inventory management, and user interactions for modern libraries.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/books" className="hover:text-primary-400 transition-colors">Browse Books</a></li>
              <li><a href="/dashboard" className="hover:text-primary-400 transition-colors">My Dashboard</a></li>
              <li><a href="/profile" className="hover:text-primary-400 transition-colors">My Profile</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@libraryms.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Library St, City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 LibraryMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer