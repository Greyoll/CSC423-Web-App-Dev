import { useNotification } from '../context/NotificationContext';
import './NotificationDisplay.css';

function NotificationDisplay() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notifications-container">
      {notifications.map(notif => (
        <div key={notif.id} className={`notification notification-${notif.type}`}>
          <div className="notification-content">
            <p>{notif.message}</p>
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notif.id)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationDisplay;