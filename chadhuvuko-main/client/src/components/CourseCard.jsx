import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course, progress, enrolled, onEnroll }) => {
  const difficultyClass = course.difficulty ? course.difficulty.toLowerCase() : 'beginner';

  const getCategoryIcon = (category) => {
    const icons = {
      'Web Development': '🌐',
      'Data Science': '📊',
      'Mobile Development': '📱',
      'Machine Learning': '🤖',
      'DevOps': '⚙️',
      'Design': '🎨',
      'Other': '📚'
    };
    return icons[category] || '📚';
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0min';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="course-card card animate-fade-in-up" id={`course-card-${course._id}`}>
      <div className="course-card-thumbnail">
        <div className="course-card-thumb-bg" style={{
          background: `linear-gradient(135deg, 
            hsl(${(course.title.length * 37) % 360}, 70%, 60%), 
            hsl(${(course.title.length * 73) % 360}, 70%, 50%))`
        }}>
          <span className="course-card-thumb-emoji">{getCategoryIcon(course.category)}</span>
        </div>
        <div className="course-card-badges">
          <span className={`badge badge-${difficultyClass}`}>{course.difficulty}</span>
        </div>
      </div>

      <div className="course-card-body">
        <span className="course-card-category">{getCategoryIcon(course.category)} {course.category}</span>
        <h3 className="course-card-title">
          <Link to={`/courses/${course._id}`}>{course.title}</Link>
        </h3>
        <p className="course-card-desc">{course.description?.substring(0, 100)}...</p>

        <div className="course-card-meta">
          <span className="course-card-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>
            {course.instructor}
          </span>
          <span className="course-card-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {formatDuration(course.totalDuration)}
          </span>
          <span className="course-card-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            {course.lessons?.length || 0} lessons
          </span>
        </div>

        {progress !== undefined && progress !== null && (
          <div className="course-card-progress">
            <div className="course-card-progress-bar">
              <div className="course-card-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="course-card-progress-text">{progress}% complete</span>
          </div>
        )}

        <div className="course-card-footer">
          {enrolled ? (
            <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm course-card-btn">
              Continue Learning →
            </Link>
          ) : (
            <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm course-card-btn">
              View Course →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
