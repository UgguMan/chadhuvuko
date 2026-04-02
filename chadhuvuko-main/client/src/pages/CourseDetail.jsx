import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProgressBar from '../components/ProgressBar';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
    if (user) fetchProgress();
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/api/courses/${id}`);
      setCourse(res.data.data);
    } catch (error) {
      showToast('Course not found', 'error');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const enrollRes = await api.get('/api/enrollments/my');
      const enrollment = enrollRes.data.data.find(e => e.course._id === id);
      if (enrollment) {
        setEnrolled(true);
        setEnrollmentId(enrollment._id);
      }

      const progRes = await api.get(`/api/progress/${id}`);
      setProgress(progRes.data.data);
    } catch (error) {
      // Not enrolled, that's fine
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/api/enrollments', { courseId: id });
      setEnrolled(true);
      setEnrollmentId(res.data.data._id);
      setProgress({ percentComplete: 0, completedLessons: [] });
      showToast('Enrolled successfully! 🎉', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Enrollment failed', 'error');
    }
  };

  const handleUnenroll = async () => {
    if (!enrollmentId) return;
    try {
      await api.delete(`/api/enrollments/${enrollmentId}`);
      setEnrolled(false);
      setEnrollmentId(null);
      setProgress(null);
      showToast('Unenrolled from course', 'info');
    } catch (error) {
      showToast('Failed to unenroll', 'error');
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    try {
      const res = await api.put('/api/progress/complete', { courseId: id, lessonId });
      setProgress(res.data.data);
      showToast('Lesson completed! ✅', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update progress', 'error');
    }
  };

  const isLessonCompleted = (lessonId) => {
    return progress?.completedLessons?.includes(lessonId);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0min';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web Development': '🌐', 'Data Science': '📊', 'Mobile Development': '📱',
      'Machine Learning': '🤖', 'DevOps': '⚙️', 'Design': '🎨', 'Other': '📚'
    };
    return icons[category] || '📚';
  };

  if (loading) {
    return <div className="page-wrapper"><div className="loader-overlay"><div className="loader"></div></div></div>;
  }

  if (!course) return null;

  const difficultyClass = course.difficulty?.toLowerCase() || 'beginner';

  return (
    <div className="page-wrapper page-enter" id="course-detail-page">
      {/* Hero */}
      <div className="cd-hero" style={{
        background: `linear-gradient(135deg, 
          hsl(${(course.title.length * 37) % 360}, 70%, 45%), 
          hsl(${(course.title.length * 73) % 360}, 70%, 35%))`
      }}>
        <div className="container cd-hero-inner">
          <button onClick={() => navigate(-1)} className="cd-back-btn" id="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <div className="cd-hero-content animate-fade-in-up">
            <div className="cd-hero-badges">
              <span className="badge badge-category">{getCategoryIcon(course.category)} {course.category}</span>
              <span className={`badge badge-${difficultyClass}`}>{course.difficulty}</span>
            </div>
            <h1 className="cd-title">{course.title}</h1>
            <p className="cd-instructor">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>
              {course.instructor}
            </p>
            <div className="cd-meta">
              <span>{course.lessons?.length || 0} lessons</span>
              <span>•</span>
              <span>{formatDuration(course.totalDuration)}</span>
              <span>•</span>
              <span>{course.enrollmentCount || 0} students</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container cd-body">
        <div className="cd-main">
          {/* Progress Section */}
          {enrolled && progress && (
            <div className="cd-progress-section card animate-fade-in-up" id="course-progress">
              <h3>Your Progress</h3>
              <ProgressBar percent={progress.percentComplete} size="lg" label="Course Completion" />
              {progress.percentComplete === 100 && (
                <div className="cd-complete-badge">
                  <span>🎓</span> Course Completed!
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="cd-section card animate-fade-in-up">
            <h2>About this course</h2>
            <p className="cd-description">{course.description}</p>
          </div>

          {/* Lessons */}
          <div className="cd-section animate-fade-in-up" id="lessons-section">
            <h2>Course Content <span className="cd-lesson-count">({course.lessons?.length || 0} lessons)</span></h2>
            
            {!enrolled && user && (
              <div className="cd-enroll-prompt">
                <div className="cd-enroll-prompt-icon">🔓</div>
                <div>
                  <strong>Enroll to start learning</strong>
                  <p>Get access to all lessons and track your progress</p>
                </div>
                <button onClick={handleEnroll} className="btn btn-primary btn-sm">Enroll Now — Free</button>
              </div>
            )}

            {!user && (
              <div className="cd-enroll-prompt">
                <div className="cd-enroll-prompt-icon">🔓</div>
                <div>
                  <strong>Sign in to enroll</strong>
                  <p>Create an account to start learning and track progress</p>
                </div>
                <button onClick={() => navigate('/register')} className="btn btn-primary btn-sm">Get Started</button>
              </div>
            )}

            <div className="cd-lessons-list">
              {course.lessons?.sort((a, b) => a.order - b.order).map((lesson, i) => {
                const completed = isLessonCompleted(lesson._id);
                return (
                  <div key={lesson._id} className={`cd-lesson-item card ${completed ? 'completed' : ''}`} id={`lesson-${i}`}>
                    <div className="cd-lesson-left">
                      <div className={`cd-lesson-num ${completed ? 'done' : ''}`}>
                        {completed ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      <div className="cd-lesson-info">
                        <h4>{lesson.title}</h4>
                        <p>{lesson.content}</p>
                        <span className="cd-lesson-duration">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {lesson.duration} min
                        </span>
                      </div>
                    </div>
                    {enrolled && !completed && (
                      <button 
                        onClick={() => handleCompleteLesson(lesson._id)} 
                        className="btn btn-primary btn-sm"
                        id={`complete-lesson-${i}`}
                      >
                        Mark Complete
                      </button>
                    )}
                    {completed && <span className="cd-lesson-done-badge">✅ Done</span>}
                    {!enrolled && (
                      <span className="cd-lesson-lock">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="cd-sidebar">
          <div className="cd-sidebar-card card animate-fade-in-up" id="enrollment-card">
            <div className="cd-sidebar-thumb" style={{
              background: `linear-gradient(135deg, 
                hsl(${(course.title.length * 37) % 360}, 70%, 55%), 
                hsl(${(course.title.length * 73) % 360}, 70%, 45%))`
            }}>
              <span>{getCategoryIcon(course.category)}</span>
            </div>
            <div className="cd-sidebar-body">
              {!enrolled ? (
                <button onClick={handleEnroll} className="btn btn-primary btn-lg cd-enroll-btn" id="enroll-btn">
                  Enroll Now — Free
                </button>
              ) : (
                <div className="cd-enrolled-actions">
                  <div className="cd-enrolled-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Enrolled
                  </div>
                  <button onClick={handleUnenroll} className="btn btn-danger btn-sm" id="unenroll-btn">
                    Unenroll
                  </button>
                </div>
              )}
              <div className="cd-sidebar-details">
                <div className="cd-sidebar-detail">
                  <span>Lessons</span>
                  <strong>{course.lessons?.length || 0}</strong>
                </div>
                <div className="cd-sidebar-detail">
                  <span>Duration</span>
                  <strong>{formatDuration(course.totalDuration)}</strong>
                </div>
                <div className="cd-sidebar-detail">
                  <span>Level</span>
                  <strong>{course.difficulty}</strong>
                </div>
                <div className="cd-sidebar-detail">
                  <span>Students</span>
                  <strong>{course.enrollmentCount || 0}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
