# DevNovate Blogs - Technical Blogging Platform

A full-stack blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to create, share, and manage technical blog posts.

## Features

- 🔐 User authentication and authorization
- 📝 Create, edit, and delete blog posts
- ✨ Rich text editor with Markdown support
- 🏷️ Tag-based categorization
- 💬 Comment system
- 👥 User profiles
- 🛡️ Admin dashboard for content moderation
- 📧 Email notifications
- 🎨 Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- React Markdown

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer
- Express Middleware for authorization

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/devnovate-blogs.git
cd devnovate-blogs
\`\`\`

2. Install dependencies:
\`\`\`bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
\`\`\`

3. Set up environment variables:

Create a \`.env\` file in the server directory with the following variables:
\`\`\`
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=your_sender_email
CLIENT_URL=http://localhost:5173
PORT=5000
\`\`\`

4. Start the development servers:

In the server directory:
\`\`\`bash
npm run dev
\`\`\`

In the client directory:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Create an account on your chosen platform
2. Connect your GitHub repository
3. Set up the environment variables
4. Deploy the backend

### Frontend Deployment (Vercel/Netlify)
1. Create an account on your chosen platform
2. Connect your GitHub repository
3. Set the build settings:
   - Build command: \`npm run build\`
   - Output directory: \`dist\`
4. Deploy the frontend

## Admin Setup
admin login : admin@devnovate.com
admin password : Admin123456!

## License
MIT License

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
