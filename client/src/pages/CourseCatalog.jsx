import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import './CourseCatalog.css';

const CourseCatalog = () => {
  const { user, showToast } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  const categories = ['All', 'Web Development', 'Data Science', 'Mobile Development', 'Machine Learning', 'DevOps', 'Design'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
    if (user) fetchEnrollments();
  }, [category, difficulty]);

  const fetchCourses = async () => {
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (difficulty !== 'All') params.difficulty = difficulty;
      const res = await api.get('/api/courses', { params });
      setCourses(res.data.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await api.get('/api/enrollments/my');
      setEnrolledIds(res.data.data.map(e => e.course._id));
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      showToast('Please login to enroll', 'error');
      return;
    }
    try {
      await api.post('/api/enrollments', { courseId });
      setEnrolledIds(prev => [...prev, courseId]);
      showToast('Enrolled successfully! 🎉', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Enrollment failed', 'error');
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loader-overlay"><div className="loader"></div></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper page-enter" id="catalog-page">
      <div className="container">
        <div className="catalog-header animate-fade-in-up">
          <div>
            <h1>Course Catalog</h1>
            <p>Discover courses to advance your skills</p>
          </div>
          <span className="catalog-count">{filteredCourses.length} courses</span>
        </div>

        {/* Filters */}
        <div className="catalog-filters animate-fade-in-up" id="catalog-filters">
          <div className="catalog-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              className="input-field"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-input"
            />
          </div>

          <div className="catalog-filter-pills">
            <div className="filter-group">
              <label>Category</label>
              <div className="pill-row">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-pill ${category === cat ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Difficulty</label>
              <div className="pill-row">
                {difficulties.map(diff => (
                  <button
                    key={diff}
                    className={`filter-pill ${difficulty === diff ? 'active' : ''}`}
                    onClick={() => setDifficulty(diff)}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="catalog-grid stagger">
            {filteredCourses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                enrolled={enrolledIds.includes(course._id)}
                onEnroll={enrolledIds.includes(course._id) ? null : handleEnroll}
              />
            ))}
          </div>
        ) : (
          <div className="dash-empty-state card animate-fade-in-up">
            <div className="dash-empty-icon">🔍</div>
            <h3>No courses found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;
