const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Progress.deleteMany({});
    console.log('Cleared existing data.');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const student = await User.create({
      name: 'John Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'student'
    });

    console.log('Users created.');

    // Create courses
    const courses = await Course.create([
      {
        title: 'Complete React Masterclass',
        description: 'Master React from fundamentals to advanced patterns. Build real-world applications with hooks, context, Redux, and more. This comprehensive course covers everything from component architecture to performance optimization.',
        instructor: 'Sarah Chen',
        category: 'Web Development',
        difficulty: 'Intermediate',
        thumbnail: '',
        lessons: [
          { title: 'Introduction to React', content: 'Learn the core concepts of React including JSX, components, and the virtual DOM.', duration: 30, order: 1 },
          { title: 'Components & Props', content: 'Understand how to create reusable components and pass data using props.', duration: 45, order: 2 },
          { title: 'State & Lifecycle', content: 'Deep dive into state management within components and lifecycle methods.', duration: 40, order: 3 },
          { title: 'Hooks In Depth', content: 'Master useState, useEffect, useContext, useReducer, and custom hooks.', duration: 55, order: 4 },
          { title: 'Context API & State Management', content: 'Learn global state management with Context API and when to use Redux.', duration: 50, order: 5 },
          { title: 'React Router & Navigation', content: 'Implement client-side routing with React Router v6.', duration: 35, order: 6 }
        ]
      },
      {
        title: 'Node.js & Express API Development',
        description: 'Build production-ready RESTful APIs with Node.js and Express. Cover authentication, database integration, error handling, testing, and deployment best practices.',
        instructor: 'Marcus Johnson',
        category: 'Web Development',
        difficulty: 'Intermediate',
        thumbnail: '',
        lessons: [
          { title: 'Node.js Fundamentals', content: 'Understand the event loop, modules, and asynchronous programming in Node.js.', duration: 40, order: 1 },
          { title: 'Express.js Setup & Routing', content: 'Set up an Express server with middleware and route handlers.', duration: 35, order: 2 },
          { title: 'MongoDB & Mongoose', content: 'Connect to MongoDB, define schemas, and perform CRUD operations.', duration: 50, order: 3 },
          { title: 'Authentication with JWT', content: 'Implement secure authentication using JSON Web Tokens.', duration: 45, order: 4 },
          { title: 'Error Handling & Validation', content: 'Build robust error handling middleware and input validation.', duration: 30, order: 5 }
        ]
      },
      {
        title: 'Python for Data Science',
        description: 'Learn Python programming for data analysis, visualization, and machine learning. Work with pandas, NumPy, matplotlib, and scikit-learn to extract insights from real datasets.',
        instructor: 'Dr. Emily Watson',
        category: 'Data Science',
        difficulty: 'Beginner',
        thumbnail: '',
        lessons: [
          { title: 'Python Basics Refresher', content: 'Quick review of Python syntax, data structures, and functions.', duration: 25, order: 1 },
          { title: 'NumPy for Numerical Computing', content: 'Master arrays, mathematical operations, and broadcasting with NumPy.', duration: 45, order: 2 },
          { title: 'Data Analysis with Pandas', content: 'Load, clean, transform, and analyze data using pandas DataFrames.', duration: 55, order: 3 },
          { title: 'Data Visualization', content: 'Create stunning charts and plots with matplotlib and seaborn.', duration: 40, order: 4 },
          { title: 'Intro to Machine Learning', content: 'Build your first ML model with scikit-learn.', duration: 60, order: 5 },
          { title: 'Project: Real-World Analysis', content: 'Apply everything to analyze a real dataset end-to-end.', duration: 50, order: 6 },
          { title: 'Advanced Pandas Techniques', content: 'Master groupby, pivot tables, merge operations, and time series.', duration: 45, order: 7 }
        ]
      },
      {
        title: 'Flutter Mobile Development',
        description: 'Build beautiful cross-platform mobile apps with Flutter and Dart. From widgets to state management, navigation, and platform integration — ship to iOS and Android from a single codebase.',
        instructor: 'Alex Rivera',
        category: 'Mobile Development',
        difficulty: 'Beginner',
        thumbnail: '',
        lessons: [
          { title: 'Dart Programming Basics', content: 'Learn the Dart language: variables, functions, classes, and async programming.', duration: 40, order: 1 },
          { title: 'Flutter Widget System', content: 'Understand the widget tree, stateless vs stateful widgets.', duration: 35, order: 2 },
          { title: 'Layouts & Responsive Design', content: 'Build responsive layouts with Rows, Columns, and Flex.', duration: 45, order: 3 },
          { title: 'Navigation & Routing', content: 'Implement multi-screen navigation with named routes.', duration: 30, order: 4 },
          { title: 'State Management with Provider', content: 'Manage app state efficiently using the Provider pattern.', duration: 50, order: 5 }
        ]
      },
      {
        title: 'Machine Learning with TensorFlow',
        description: 'Deep dive into machine learning and deep learning with TensorFlow. Build neural networks, CNNs, RNNs, and deploy models to production. Hands-on projects with real datasets.',
        instructor: 'Dr. Priya Patel',
        category: 'Machine Learning',
        difficulty: 'Advanced',
        thumbnail: '',
        lessons: [
          { title: 'ML Fundamentals Review', content: 'Review supervised/unsupervised learning, bias-variance tradeoff.', duration: 35, order: 1 },
          { title: 'TensorFlow & Keras Setup', content: 'Install TensorFlow and build your first neural network.', duration: 40, order: 2 },
          { title: 'Deep Neural Networks', content: 'Multi-layer architectures, activation functions, and optimization.', duration: 55, order: 3 },
          { title: 'Convolutional Neural Networks', content: 'Image classification and feature extraction with CNNs.', duration: 60, order: 4 },
          { title: 'Recurrent Neural Networks', content: 'Sequence modeling and NLP with LSTMs and GRUs.', duration: 50, order: 5 },
          { title: 'Model Deployment', content: 'Deploy trained models using TensorFlow Serving and TFLite.', duration: 45, order: 6 }
        ]
      },
      {
        title: 'DevOps & CI/CD with Docker',
        description: 'Master containerization, orchestration, and continuous delivery. Learn Docker, Docker Compose, GitHub Actions, and Kubernetes fundamentals to streamline your deployment pipeline.',
        instructor: 'James Kim',
        category: 'DevOps',
        difficulty: 'Intermediate',
        thumbnail: '',
        lessons: [
          { title: 'Introduction to DevOps', content: 'Understand DevOps culture, practices, and toolchain.', duration: 25, order: 1 },
          { title: 'Docker Fundamentals', content: 'Build, run, and manage containers with Docker.', duration: 45, order: 2 },
          { title: 'Docker Compose', content: 'Define multi-container applications with Docker Compose.', duration: 40, order: 3 },
          { title: 'CI/CD with GitHub Actions', content: 'Automate testing and deployment with GitHub Actions workflows.', duration: 50, order: 4 },
          { title: 'Intro to Kubernetes', content: 'Container orchestration, pods, services, and deployments.', duration: 55, order: 5 },
          { title: 'Monitoring & Logging', content: 'Set up Prometheus, Grafana, and centralized logging.', duration: 35, order: 6 },
          { title: 'Infrastructure as Code', content: 'Manage infrastructure with Terraform basics.', duration: 40, order: 7 },
          { title: 'Security Best Practices', content: 'Container security, secrets management, and vulnerability scanning.', duration: 30, order: 8 }
        ]
      }
    ]);

    console.log(`${courses.length} courses created.`);

    // Enroll student in first 2 courses
    const enrollment1 = await Enrollment.create({ user: student._id, course: courses[0]._id });
    const enrollment2 = await Enrollment.create({ user: student._id, course: courses[2]._id });

    // Create progress for enrolled courses
    await Progress.create({
      user: student._id,
      course: courses[0]._id,
      completedLessons: [courses[0].lessons[0]._id, courses[0].lessons[1]._id],
      percentComplete: Math.round((2 / courses[0].lessons.length) * 100),
      lastAccessedAt: new Date()
    });

    await Progress.create({
      user: student._id,
      course: courses[2]._id,
      completedLessons: [courses[2].lessons[0]._id],
      percentComplete: Math.round((1 / courses[2].lessons.length) * 100),
      lastAccessedAt: new Date()
    });

    // Update enrollment counts
    await Course.findByIdAndUpdate(courses[0]._id, { enrollmentCount: 1 });
    await Course.findByIdAndUpdate(courses[2]._id, { enrollmentCount: 1 });

    console.log('Enrollments and progress created.');
    console.log('\n📧 Login credentials:');
    console.log('  Admin:   admin@example.com / password123');
    console.log('  Student: student@example.com / password123');
    console.log('\n✅ Seed complete!');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
