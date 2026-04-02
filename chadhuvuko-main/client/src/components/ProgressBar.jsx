import './ProgressBar.css';

const ProgressBar = ({ percent = 0, size = 'md', showLabel = true, label }) => {
  return (
    <div className={`progress-bar-wrapper progress-${size}`}>
      {showLabel && (
        <div className="progress-bar-label">
          <span>{label || 'Progress'}</span>
          <span className="progress-bar-percent">{percent}%</span>
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.min(percent, 100)}%` }}
        >
          {percent > 0 && <div className="progress-bar-shine"></div>}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
