import { useEffect, useState } from "react";
import "../../styles/Error/Error.css";

const ErrorToast = ({ message, duration = 5000, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!message) return;

    const interval = 50;
    const step = (120 * interval) / duration;

    let currentProgress = 100;

    const timer = setInterval(() => {
      currentProgress -= step;
      if (currentProgress <= 0) {
        clearInterval(timer);
        setIsExiting(true);
        setTimeout(onClose, 300); // match slideOut duration
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-container ${isExiting ? "toast-exit" : ""}`}>
      <span className="toast-message">{message}</span>
      <div
        className="toast-progress"
        style={{ width: `${progress}%`, transition: "width 50ms linear" }}
      />
    </div>
  );
};

export default ErrorToast;
