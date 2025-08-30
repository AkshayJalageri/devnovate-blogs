# Devnovate Blogs - Backend API

This is the backend API for the Devnovate Blogs platform, a blogging platform for developers to share technical knowledge.

## Features

- User authentication (signup, login, password reset)
- Blog creation, editing, and deletion
- Blog approval workflow (admin approval required)
- Comments and likes on blogs
- User profiles
- Admin dashboard for content moderation
- Email notifications
- Analytics tracking

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for email notifications

## Project Structure

```
server/
  ├── config/         # Configuration files
  ├── controllers/    # Route controllers
  ├── middleware/     # Custom middleware
  ├── models/         # Mongoose models
  ├── routes/         # API routes
  ├── utils/          # Utility functions
  ├── .env            # Environment variables
  ├── server.js       # Entry point
  └── package.json    # Dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/devnovate-blogs
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@devnovate.com
   CLIENT_URL=http://localhost:5173
   ```

### Running the Server

- Development mode:
  ```
  npm run dev
  ```

- Production mode:
  ```
  npm start
  ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:resettoken` - Reset password
- `PUT /api/auth/update-password` - Update password

### Blogs

- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/trending` - Get trending blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create a new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `PUT /api/blogs/:id/like` - Like/unlike blog
- `POST /api/blogs/:id/comments` - Add comment to blog
- `GET /api/blogs/:id/comments` - Get comments for a blog

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/blogs/me` - Get current user's blogs
- `GET /api/users/:id/blogs` - Get user's published blogs
- `GET /api/users/blogs/liked` - Get user's liked blogs

### Admin

- `GET /api/admin/blogs/pending` - Get all pending blogs
- `PUT /api/admin/blogs/:id/approve` - Approve a blog
- `PUT /api/admin/blogs/:id/reject` - Reject a blog
- `PUT /api/admin/blogs/:id/hide` - Hide a published blog
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/stats` - Get admin dashboard stats