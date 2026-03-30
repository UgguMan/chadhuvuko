import { useAuth } from '../context/AuthContext';

const Toast = () => {
  const { toasts } = useAuth();

  if (toasts.length === 0) return null;

  const icons = {
    success: '✓',
    error: '✗',
    info: 'ⓘ'
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{icons[toast.type]}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
