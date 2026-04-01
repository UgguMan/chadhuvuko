const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

// @desc    Enroll in a course
// @route   POST /api/enrollments
exports.enroll = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ user: req.user._id, course: courseId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId
    });

    // Create progress record
    await Progress.create({
      user: req.user._id,
      course: courseId,
      completedLessons: [],
      percentComplete: 0
    });

    // Increment enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    const populated = await Enrollment.findById(enrollment._id).populate('course');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments/my
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course')
      .sort({ createdAt: -1 });

    // Attach progress data
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await Progress.findOne({
          user: req.user._id,
          course: enrollment.course._id
        });
        return {
          ...enrollment.toObject(),
          progress: progress ? {
            percentComplete: progress.percentComplete,
            completedLessons: progress.completedLessons,
            lastAccessedAt: progress.lastAccessedAt
          } : { percentComplete: 0, completedLessons: [], lastAccessedAt: null }
        };
      })
    );

    res.status(200).json({ success: true, count: enrollmentsWithProgress.length, data: enrollmentsWithProgress });
  } catch (error) {
    next(error);
  }
};

// @desc    Unenroll from a course
// @route   DELETE /api/enrollments/:id
exports.unenroll = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    if (enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Course.findByIdAndUpdate(enrollment.course, { $inc: { enrollmentCount: -1 } });
    await Progress.findOneAndDelete({ user: req.user._id, course: enrollment.course });
    await Enrollment.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Unenrolled successfully' });
  } catch (error) {
    next(error);
  }
};
