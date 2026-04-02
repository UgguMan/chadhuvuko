import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      ),
      title: 'Browse Courses',
      desc: 'Explore a curated catalog of courses across Web Dev, Data Science, Machine Learning, and more.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      ),
      title: 'Enroll Instantly',
      desc: 'One-click enrollment. Start learning immediately with structured lesson plans.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      ),
      title: 'Track Progress',
      desc: 'Monitor your learning journey with detailed progress tracking and completion stats.'
    }
  ];

  const stats = [
    { value: '50+', label: 'Courses' },
    { value: '10K+', label: 'Students' },
    { value: '500+', label: 'Lessons' },
    { value: '95%', label: 'Satisfaction' }
  ];

  return (
    <div className="landing page-enter" id="landing-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-orbs">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>

        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge animate-fade-in-up">
              <span className="hero-badge-dot"></span>
              Platform for Lifelong Learning
            </div>
            <h1 className="hero-title animate-fade-in-up">
              Master New Skills,<br/>
              <span className="hero-title-gradient">Track Your Growth</span>
            </h1>
            <p className="hero-desc animate-fade-in-up">
              Enroll in expert-led courses, track your progress lesson by lesson, and achieve your learning goals with our comprehensive platform.
            </p>
            <div className="hero-actions animate-fade-in-up">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg" id="hero-cta">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta">
                    Start Learning Free →
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-lg" id="hero-login">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hero-visual animate-fade-in-up">
            <div className="hero-card-stack">
              <div className="hero-float-card hero-float-1">
                <div className="hfc-icon">📊</div>
                <div>
                  <div className="hfc-title">Progress</div>
                  <div className="hfc-bar"><div className="hfc-fill" style={{width: '72%'}}></div></div>
                </div>
              </div>
              <div className="hero-float-card hero-float-2">
                <div className="hfc-icon">🎯</div>
                <div>
                  <div className="hfc-title">3 Courses</div>
                  <div className="hfc-sub">Enrolled</div>
                </div>
              </div>
              <div className="hero-float-card hero-float-3">
                <div className="hfc-icon">✅</div>
                <div>
                  <div className="hfc-title">12 Lessons</div>
                  <div className="hfc-sub">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip" id="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features-section">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <span className="section-tag">Why Chadhuvuko!!?</span>
            <h2 className="section-title">Everything you need to learn effectively</h2>
            <p className="section-desc">Simple, powerful, and designed for your success.</p>
          </div>

          <div className="features-grid stagger">
            {features.map((feature, i) => (
              <div key={i} className="feature-card card animate-fade-in-up" id={`feature-${i}`}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta-section">
        <div className="container">
          <div className="cta-card animate-fade-in-up">
            <h2 className="cta-title">Ready to start your learning journey?</h2>
            <p className="cta-desc">Join thousands of learners already building new skills.</p>
            {user ? (
              <Link to="/courses" className="btn btn-primary btn-lg">Browse Courses</Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-lg">Create Free Account →</Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>© 2025 Chadhuvuko!!. Built with the MERN Stack.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
