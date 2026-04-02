const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Mark a lesson as complete
// @route   PUT /api/progress/complete
exports.completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let progress = await Progress.findOne({ user: req.user._id, course: courseId });
    if (!progress) {
      return res.status(400).json({ success: false, message: 'Not enrolled in this course' });
    }

    // Add lesson to completed if not already there
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    // Calculate percentage
    const totalLessons = course.lessons.length;
    progress.percentComplete = totalLessons > 0
      ? Math.round((progress.completedLessons.length / totalLessons) * 100)
      : 0;
    progress.lastAccessedAt = Date.now();

    await progress.save();

    // If 100%, mark enrollment as completed
    if (progress.percentComplete === 100) {
      await Enrollment.findOneAndUpdate(
        { user: req.user._id, course: courseId },
        { status: 'completed' }
      );
    }

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress for a course
// @route   GET /api/progress/:courseId
exports.getCourseProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    if (!progress) {
      return res.status(200).json({
        success: true,
        data: { percentComplete: 0, completedLessons: [], lastAccessedAt: null }
      });
    }

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/progress/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id });
    const progressRecords = await Progress.find({ user: req.user._id });

    const totalEnrolled = enrollments.length;
    const completedCourses = enrollments.filter(e => e.status === 'completed').length;
    const activeCourses = enrollments.filter(e => e.status === 'active').length;

    const overallProgress = progressRecords.length > 0
      ? Math.round(progressRecords.reduce((sum, p) => sum + p.percentComplete, 0) / progressRecords.length)
      : 0;

    const totalLessonsCompleted = progressRecords.reduce((sum, p) => sum + p.completedLessons.length, 0);

    // Recent activity
    const recentProgress = await Progress.find({ user: req.user._id })
      .sort({ lastAccessedAt: -1 })
      .limit(5)
      .populate('course', 'title thumbnail category');

    res.status(200).json({
      success: true,
      data: {
        totalEnrolled,
        completedCourses,
        activeCourses,
        overallProgress,
        totalLessonsCompleted,
        recentActivity: recentProgress
      }
    });
  } catch (error) {
    next(error);
  }
};
