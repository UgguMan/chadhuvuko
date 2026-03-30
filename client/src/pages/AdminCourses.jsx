import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AdminCourses.css';

const AdminCourses = () => {
  const { showToast } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', instructor: '', category: 'Web Development',
    difficulty: 'Beginner', lessons: [{ title: '', content: '', duration: 30, order: 1 }]
  });

  const categories = ['Web Development', 'Data Science', 'Mobile Development', 'Machine Learning', 'DevOps', 'Design', 'Other'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/api/courses');
      setCourses(res.data.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '', description: '', instructor: '', category: 'Web Development',
      difficulty: 'Beginner', lessons: [{ title: '', content: '', duration: 30, order: 1 }]
    });
    setEditingCourse(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      category: course.category,
      difficulty: course.difficulty,
      lessons: course.lessons.map(l => ({
        title: l.title, content: l.content, duration: l.duration, order: l.order
      }))
    });
    setShowModal(true);
  };

  const addLesson = () => {
    setForm(prev => ({
      ...prev,
      lessons: [...prev.lessons, { title: '', content: '', duration: 30, order: prev.lessons.length + 1 }]
    }));
  };

  const removeLesson = (index) => {
    if (form.lessons.length <= 1) return;
    setForm(prev => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index).map((l, i) => ({ ...l, order: i + 1 }))
    }));
  };

  const updateLesson = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      lessons: prev.lessons.map((l, i) => i === index ? { ...l, [field]: value } : l)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const res = await api.put(`/api/courses/${editingCourse._id}`, form);
        setCourses(prev => prev.map(c => c._id === editingCourse._id ? res.data.data : c));
        showToast('Course updated! ✏️', 'success');
      } else {
        const res = await api.post('/api/courses', form);
        setCourses(prev => [res.data.data, ...prev]);
        showToast('Course created! 🎉', 'success');
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save course', 'error');
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure? This will permanently delete this course.')) return;
    try {
      await api.delete(`/api/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c._id !== courseId));
      showToast('Course deleted', 'info');
    } catch (error) {
      showToast('Failed to delete course', 'error');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = { 'Web Development': '🌐', 'Data Science': '📊', 'Mobile Development': '📱', 'Machine Learning': '🤖', 'DevOps': '⚙️', 'Design': '🎨', 'Other': '📚' };
    return icons[category] || '📚';
  };

  if (loading) {
    return <div className="page-wrapper"><div className="loader-overlay"><div className="loader"></div></div></div>;
  }

  return (
    <div className="page-wrapper page-enter" id="admin-page">
      <div className="container">
        <div className="admin-header animate-fade-in-up">
          <div>
            <h1>Admin — Course Management</h1>
            <p>Create, edit, and manage all courses</p>
          </div>
          <button onClick={openCreate} className="btn btn-primary" id="create-course-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Course
          </button>
        </div>

        {/* Course Table */}
        <div className="admin-table-wrapper card animate-fade-in-up">
          <table className="admin-table" id="courses-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Lessons</th>
                <th>Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id}>
                  <td>
                    <div className="admin-course-name">
                      <div className="admin-course-thumb" style={{
                        background: `linear-gradient(135deg, 
                          hsl(${(course.title.length * 37) % 360}, 70%, 60%), 
                          hsl(${(course.title.length * 73) % 360}, 70%, 50%))`
                      }}></div>
                      <div>
                        <strong>{course.title}</strong>
                        <span>{course.instructor}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-category">{getCategoryIcon(course.category)} {course.category}</span></td>
                  <td><span className={`badge badge-${course.difficulty?.toLowerCase()}`}>{course.difficulty}</span></td>
                  <td>{course.lessons?.length || 0}</td>
                  <td>{course.enrollmentCount || 0}</td>
                  <td>
                    <div className="admin-actions">
                      <button onClick={() => openEdit(course)} className="btn btn-ghost btn-sm" id={`edit-${course._id}`}>Edit</button>
                      <button onClick={() => handleDelete(course._id)} className="btn btn-ghost btn-sm admin-delete-btn" id={`delete-${course._id}`}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {courses.length === 0 && (
            <div className="admin-empty">No courses yet. Create your first course!</div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form" id="course-form">
              <div className="input-group">
                <label htmlFor="course-title">Title</label>
                <input type="text" id="course-title" className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>

              <div className="input-group">
                <label htmlFor="course-desc">Description</label>
                <textarea id="course-desc" className="input-field admin-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={3} />
              </div>

              <div className="admin-form-row">
                <div className="input-group">
                  <label htmlFor="course-instructor">Instructor</label>
                  <input type="text" id="course-instructor" className="input-field" value={form.instructor} onChange={e => setForm({...form, instructor: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label htmlFor="course-category">Category</label>
                  <select id="course-category" className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="course-difficulty">Difficulty</label>
                <select id="course-difficulty" className="input-field" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Lessons Builder */}
              <div className="admin-lessons-section">
                <div className="admin-lessons-header">
                  <h3>Lessons ({form.lessons.length})</h3>
                  <button type="button" onClick={addLesson} className="btn btn-ghost btn-sm">+ Add Lesson</button>
                </div>
                {form.lessons.map((lesson, i) => (
                  <div key={i} className="admin-lesson-card">
                    <div className="admin-lesson-num">{i + 1}</div>
                    <div className="admin-lesson-fields">
                      <input type="text" className="input-field" placeholder="Lesson title" value={lesson.title} onChange={e => updateLesson(i, 'title', e.target.value)} required />
                      <input type="text" className="input-field" placeholder="Lesson content/description" value={lesson.content} onChange={e => updateLesson(i, 'content', e.target.value)} />
                      <input type="number" className="input-field" placeholder="Duration (min)" value={lesson.duration} onChange={e => updateLesson(i, 'duration', parseInt(e.target.value) || 0)} min="1" />
                    </div>
                    {form.lessons.length > 1 && (
                      <button type="button" className="admin-lesson-remove" onClick={() => removeLesson(i)}>×</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="admin-form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" id="save-course-btn">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
