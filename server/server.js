const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Enable CORS
const allowedOrigins = ['http://localhost:5173', 'https://chadhuvuko.vercel.app', 'https://chadhuvuko.in'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.includes(origin)) return callback(null, true);
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
    const fs = require('fs');
    const path = require('path');
    const seedCode = fs.readFileSync(path.join(__dirname, 'seeds', 'seed.js'), 'utf8');
    
    // Quick and dirty seed execution inline for Render
    const User = require('./models/User');
    const Course = require('./models/Course');
    const Enrollment = require('./models/Enrollment');
    const Progress = require('./models/Progress');
    const bcrypt = require('bcryptjs');
    
    await Enrollment.deleteMany({});
    await Progress.deleteMany({});
    await Course.deleteMany({});
    await User.deleteMany({});
    
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', 'users.json'), 'utf-8'));
    const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', 'courses.json'), 'utf-8'));
    
    const hashedUsers = users.map(user => {
      const salt = bcrypt.genSaltSync(10);
      return {...user, password: bcrypt.hashSync(user.password, salt)};
    });
    
    await User.create(hashedUsers);
    await Course.create(courses);
    
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
