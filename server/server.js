const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Fallback JWT secret in case Render environment variables were missed
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'chadhuvuko_production_fallback_secret_key_2026!';
}

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Enable CORS
// Enable CORS
app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    // Allow any localhost, any vercel preview, or chadhuvuko.in
    if (origin.includes('localhost') || origin.includes('vercel.app') || origin.includes('chadhuvuko.in')) {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked'), false);
  },
  credentials: true
}));

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/progress', require('./routes/progress'));

// Temporary seed endpoint
app.get('/api/seed', async (req, res) => {
  try {
    const User = require('./models/User');
    const Course = require('./models/Course');
    const Enrollment = require('./models/Enrollment');
    const Progress = require('./models/Progress');
    const bcrypt = require('bcryptjs');
    
    await Enrollment.deleteMany({});
    await Progress.deleteMany({});
    await Course.deleteMany({});
    await User.deleteMany({});
    
    const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'password123', role: 'admin' });
    const student = await User.create({ name: 'Student', email: 'student@example.com', password: 'password123', role: 'student' });
    
    await Course.create([
      { title: 'Complete React Masterclass', description: 'Master React from fundamentals to advanced patterns.', instructor: 'Sarah Chen', category: 'Web Development', difficulty: 'Intermediate',
        lessons: [{ title: 'Intro', content: 'Basics', duration: 30, order: 1 }] },
      { title: 'Node.js & Express API', description: 'Build production-ready RESTful APIs.', instructor: 'Marcus J', category: 'Web Development', difficulty: 'Intermediate',
        lessons: [{ title: 'Intro', content: 'Basics', duration: 40, order: 1 }] },
      { title: 'Python for Data Science', description: 'Learn Python programming for data analysis.', instructor: 'Dr. Emily W', category: 'Data Science', difficulty: 'Beginner',
        lessons: [{ title: 'Intro', content: 'Basics', duration: 25, order: 1 }] },
      { title: 'Flutter Mobile Dev', description: 'Build beautiful cross-platform mobile apps.', instructor: 'Alex R', category: 'Mobile Development', difficulty: 'Beginner',
        lessons: [{ title: 'Intro', content: 'Basics', duration: 40, order: 1 }] },
      { title: 'Machine Learning', description: 'Deep dive into machine learning.', instructor: 'Dr. Priya P', category: 'Machine Learning', difficulty: 'Advanced',
        lessons: [{ title: 'Intro', content: 'Basics', duration: 35, order: 1 }] },
      { title: 'DevOps & CI/CD', description: 'Master containerization and orchestration.', instructor: 'James Kim', category: 'DevOps', difficulty: 'Intermediate',
        lessons: [{ title: 'Intro', content: 'Basics', duration: 25, order: 1 }] }
    ]);
    
    res.json({ success: true, message: 'Database beautifully seeded! You can go login now! 🎉' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
