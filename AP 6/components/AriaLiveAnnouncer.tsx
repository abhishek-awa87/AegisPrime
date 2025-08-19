import React, { useState, useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';

const AriaLiveAnnouncer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (notifications.length > 0) {
      const { id, message } = notifications[0];
      setCurrentMessage(message);
      // The message is cleared after a short delay to allow screen readers to announce repeated messages.
      setTimeout(() => setCurrentMessage(''), 100);
      removeNotification(id);
    }
  }, [notifications, removeNotification]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        margin: '-1px',
        padding: '0',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        border: '0',
      }}
    >
      {currentMessage}
    </div>
  );
};

export default AriaLiveAnnouncer;
