import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProgressBar from '../components/ProgressBar';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/progress/dashboard');
      setStats(res.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loader-overlay"><div className="loader"></div></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Enrolled Courses', value: stats?.totalEnrolled || 0, icon: '📚', color: 'violet' },
    { label: 'Completed', value: stats?.completedCourses || 0, icon: '🎓', color: 'cyan' },
    { label: 'In Progress', value: stats?.activeCourses || 0, icon: '⚡', color: 'amber' },
    { label: 'Lessons Done', value: stats?.totalLessonsCompleted || 0, icon: '✅', color: 'emerald' }
  ];

  return (
    <div className="page-wrapper page-enter" id="dashboard-page">
      <div className="container">
        {/* Welcome Banner */}
        <div className="dash-welcome animate-fade-in-up" id="welcome-banner">
          <div className="dash-welcome-content">
            <h1>Welcome back, <span className="dash-welcome-name">{user?.name?.split(' ')[0]}</span> 👋</h1>
            <p>Pick up where you left off. Your progress is waiting.</p>
          </div>
          <div className="dash-welcome-art">
            <div className="dash-ring-container">
              <svg className="dash-ring" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8"/>
                <circle 
                  cx="60" cy="60" r="52" fill="none" 
                  stroke="white" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(stats?.overallProgress || 0) * 3.27} 327`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
              </svg>
              <div className="dash-ring-text">
                <span className="dash-ring-value">{stats?.overallProgress || 0}%</span>
                <span className="dash-ring-label">Overall</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dash-stats-grid stagger">
          {statCards.map((stat, i) => (
            <div key={i} className={`dash-stat-card card animate-fade-in-up stat-${stat.color}`} id={`stat-card-${i}`}>
              <div className="dash-stat-icon">{stat.icon}</div>
              <div className="dash-stat-value">{stat.value}</div>
              <div className="dash-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="dash-section animate-fade-in-up">
          <div className="dash-section-header">
            <h2>Recent Activity</h2>
            <Link to="/my-enrollments" className="btn btn-ghost btn-sm">View All →</Link>
          </div>

          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="dash-activity-list">
              {stats.recentActivity.map((activity, i) => (
                <Link 
                  to={`/courses/${activity.course?._id}`} 
                  key={i} 
                  className="dash-activity-item card"
                  id={`activity-${i}`}
                >
                  <div className="dash-activity-thumb" style={{
                    background: `linear-gradient(135deg, 
                      hsl(${(activity.course?.title?.length * 37) % 360}, 70%, 60%), 
                      hsl(${(activity.course?.title?.length * 73) % 360}, 70%, 50%))`
                  }}></div>
                  <div className="dash-activity-info">
                    <h4>{activity.course?.title || 'Unknown Course'}</h4>
                    <span className="dash-activity-cat">{activity.course?.category}</span>
                  </div>
                  <div className="dash-activity-progress">
                    <ProgressBar percent={activity.percentComplete} size="sm" showLabel={false} />
                    <span className="dash-activity-pct">{activity.percentComplete}%</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="dash-empty-state card">
              <div className="dash-empty-icon">📖</div>
              <h3>No activity yet</h3>
              <p>Enroll in a course to get started!</p>
              <Link to="/courses" className="btn btn-primary btn-sm">Browse Courses</Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dash-quick-actions stagger">
          <Link to="/courses" className="dash-action-card card animate-fade-in-up" id="quick-browse">
            <div className="dash-action-icon">🔍</div>
            <h3>Browse Catalog</h3>
            <p>Discover new courses</p>
          </Link>
          <Link to="/my-enrollments" className="dash-action-card card animate-fade-in-up" id="quick-learning">
            <div className="dash-action-icon">📚</div>
            <h3>My Learning</h3>
            <p>Continue your courses</p>
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin/courses" className="dash-action-card card animate-fade-in-up" id="quick-admin">
              <div className="dash-action-icon">⚙️</div>
              <h3>Admin Panel</h3>
              <p>Manage courses</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
