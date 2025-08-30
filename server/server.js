const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS with environment variable support
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://devnovate-blogs-mu.vercel.app',
  'https://devnovate-blogs.vercel.app',
  'https://devnovate-blogs-git-main.vercel.app',
  'https://devnovate-blogs-git-master.vercel.app'
];

// Add CLIENT_URL from environment variables if it exists
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// Add any additional origins from environment variables
if (process.env.ALLOWED_ORIGINS) {
  const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',');
  allowedOrigins.push(...additionalOrigins);
}

// Remove duplicates
const uniqueOrigins = [...new Set(allowedOrigins)];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (uniqueOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow Vercel preview deployments (they have random subdomains)
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Log blocked origins for debugging
    console.log('Blocked origin:', origin);
    console.log('Allowed origins:', uniqueOrigins);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(cookieParser());
app.use(morgan('dev'));

// Import routes
const authRoutes = require('./routes/auth.routes');
const blogRoutes = require('./routes/blog.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'not set',
    allowedOrigins: uniqueOrigins
  });
});

// Environment check endpoint for debugging
app.get('/env-check', (req, res) => {
  res.status(200).json({
    status: 'Environment Check',
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV || 'not set',
    mongoUri: process.env.MONGODB_URI ? 'set' : 'not set',
    jwtSecret: process.env.JWT_SECRET ? 'set' : 'not set',
    jwtExpire: process.env.JWT_EXPIRE || 'not set (using default)',
    emailUsername: process.env.EMAIL_USERNAME ? 'set' : 'not set',
    emailPassword: process.env.EMAIL_PASSWORD ? 'set' : 'not set',
    clientUrl: process.env.CLIENT_URL || 'not set',
    port: process.env.PORT || 'not set'
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to Devnovate Blogs API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devnovate-blogs')
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Client URL: ${process.env.CLIENT_URL || 'not set'}`);
      console.log(`Allowed origins: ${uniqueOrigins.join(', ')}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
