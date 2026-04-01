import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import './MyEnrollments.css';

const MyEnrollments = () => {
  const { showToast } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get('/api/enrollments/my');
      setEnrollments(res.data.data);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to unenroll from this course?')) return;
    try {
      await api.delete(`/api/enrollments/${enrollmentId}`);
      setEnrollments(prev => prev.filter(e => e._id !== enrollmentId));
      showToast('Unenrolled successfully', 'info');
    } catch (error) {
      showToast('Failed to unenroll', 'error');
    }
  };

  const filteredEnrollments = enrollments.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  if (loading) {
    return <div className="page-wrapper"><div className="loader-overlay"><div className="loader"></div></div></div>;
  }

  return (
    <div className="page-wrapper page-enter" id="enrollments-page">
      <div className="container">
        <div className="me-header animate-fade-in-up">
          <div>
            <h1>My Learning</h1>
            <p>Track and continue your enrolled courses</p>
          </div>
          <div className="me-filter-pills">
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                className={`filter-pill ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'all' && ` (${enrollments.length})`}
                {f === 'active' && ` (${enrollments.filter(e => e.status === 'active').length})`}
                {f === 'completed' && ` (${enrollments.filter(e => e.status === 'completed').length})`}
              </button>
            ))}
          </div>
        </div>

        {filteredEnrollments.length > 0 ? (
          <div className="me-grid stagger">
            {filteredEnrollments.map(enrollment => (
              <div key={enrollment._id} className="me-card-wrapper animate-fade-in-up">
                <CourseCard
                  course={enrollment.course}
                  progress={enrollment.progress?.percentComplete}
                  enrolled={true}
                />
                <button 
                  className="me-unenroll-btn btn btn-ghost btn-sm"
                  onClick={() => handleUnenroll(enrollment._id)}
                >
                  Unenroll
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="dash-empty-state card animate-fade-in-up">
            <div className="dash-empty-icon">📖</div>
            <h3>{filter === 'all' ? "You haven't enrolled in any courses yet" : `No ${filter} courses`}</h3>
            <p>Browse our catalog and start learning today!</p>
            <Link to="/courses" className="btn btn-primary btn-sm">Browse Courses</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollments;
