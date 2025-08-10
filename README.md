# Library Management System

A comprehensive full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing library operations with modern design and advanced features.

## 🚀 Features

### Core Features
- **User Authentication & Role-Based Access Control (RBAC)**
  - JWT-based authentication
  - Three user roles: Admin, User, Guest
  - Protected routes and API endpoints

- **Book Inventory Management**
  - Add, update, delete books
  - Track stock levels and availability
  - Search and filter by title, author, genre
  - Book categorization and reviews

- **Borrowing & Return System**
  - 14-day borrowing period
  - Due date tracking and overdue notifications
  - Renewal system (up to 2 renewals)
  - Automatic fine calculation

- **Advanced Search & Filtering**
  - Full-text search across books
  - Filter by genre, author, availability
  - Pagination and sorting options

- **Data Visualization**
  - Admin dashboard with charts and analytics
  - Monthly borrowing trends
  - Genre distribution
  - Popular books tracking

- **Fine Management**
  - Automatic fine calculation for overdue books
  - Payment tracking with multiple payment methods
  - Fine waiver capabilities for admins

### Additional Features
- **User Dashboard**: Personal borrowing history and active loans
- **Book Reviews & Ratings**: User-generated content and ratings
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Clean, professional interface with animations
- **Real-time Updates**: Dynamic data updates and notifications

## 🛠 Tech Stack

### Frontend
- **React** - UI library with hooks and context
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications
- **Recharts** - Data visualization charts
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation

## 📁 Project Structure

```
library-management-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── borrowController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── BorrowTransaction.js
│   │   └── Fine.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── borrowRoutes.js
│   │   └── adminRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SearchFilters.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Books.jsx
│   │   │   ├── BookDetail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminBooks.jsx
│   │   │       ├── AdminUsers.jsx
│   │   │       ├── AdminBorrowings.jsx
│   │   │       └── AdminFines.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-management-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/library_management
   JWT_SECRET=your_jwt_secret_key_here_make_it_very_secure
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the application**
   ```bash
   npm start
   ```

   This will start both the backend server (port 5000) and frontend development server (port 5173).

### Manual Setup

If you prefer to start services separately:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 👥 User Roles & Permissions

### Guest Users
- Browse books catalog
- View book details
- Search and filter books
- Register for an account

### Regular Users
- All guest permissions
- Borrow and return books
- View borrowing history
- Renew borrowed books
- Leave reviews and ratings
- Manage personal profile

### Admin Users
- All user permissions
- Manage book inventory (CRUD operations)
- Manage user accounts
- View all borrowing transactions
- Manage fines and payments
- Access admin dashboard with analytics
- Generate reports

## 🎯 Demo Credentials

**Admin Account:**
- Email: admin@library.com
- Password: admin123

**User Account:**
- Email: user@library.com
- Password: user123

## 🔧 Key Features Explained

### Authentication System
- JWT-based authentication with refresh tokens
- Password hashing using bcrypt
- Role-based access control middleware
- Protected routes on both frontend and backend

### Book Management
- Full CRUD operations for books
- Image upload support for book covers
- Inventory tracking with available/total copies
- Search functionality with full-text indexing

### Borrowing System
- 14-day default borrowing period
- Automatic due date calculation
- Renewal system with limits
- Overdue detection and fine calculation

### Fine Management
- Automatic fine calculation ($1 per day overdue)
- Multiple payment methods supported
- Fine waiver capabilities for admins
- Payment history tracking

### Data Visualization
- Monthly borrowing trends chart
- Genre distribution pie chart
- Popular books ranking
- Real-time statistics dashboard

## 🎨 Design Features

- **Modern UI/UX**: Clean, professional design with intuitive navigation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Micro-interactions**: Smooth animations and hover effects
- **Loading States**: Skeleton loading for better UX
- **Toast Notifications**: Real-time feedback for user actions
- **Form Validation**: Client and server-side validation

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
```

### Backend (Heroku/Railway)
Ensure environment variables are set in your hosting platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the flexible database solution
- Lucide React for the beautiful icons
- All open-source contributors who made this project possible

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@libraryms.com
- Documentation: [Link to docs]

---

**Built with ❤️ using the MERN stack**