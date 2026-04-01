const express = require('express');
const router = express.Router();
const { enroll, getMyEnrollments, unenroll } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, enroll);
router.get('/my', protect, getMyEnrollments);
router.delete('/:id', protect, unenroll);

module.exports = router;
