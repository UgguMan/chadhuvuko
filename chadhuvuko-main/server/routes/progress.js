const express = require('express');
const router = express.Router();
const { completeLesson, getCourseProgress, getDashboardStats } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.put('/complete', protect, completeLesson);
router.get('/dashboard', protect, getDashboardStats);
router.get('/:courseId', protect, getCourseProgress);

module.exports = router;
