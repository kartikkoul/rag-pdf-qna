import { setTimeout } from "node:timers";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ErrorToast = ({ message = "Something went wrong", duration = 3000 }) => {
  const [visible, setVisible] = useState(false);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVisible(true);

    errorTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      if(errorTimerRef.current) clearTimeout(errorTimerRef.current);
    }
  }, [duration]);

  return createPortal(
    <div className="absolute top-5 right-5 z-9999 ">
      <div
        role="alert"
        className={`
          flex items-center gap-3 min-w-[240px]
        text-white
          border-2 border-red-950 bg-red-500
          px-4 py-3 rounded-lg shadow-lg
          transition-all duration-300 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
        `}
      >
        <span className="text-lg">⚠️</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>,
    document.body,
  );
};

export default ErrorToast;
