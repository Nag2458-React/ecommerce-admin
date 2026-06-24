import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionManager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem(
        "lastActivity",
        Date.now()
      );
    };

    updateActivity();

    window.addEventListener(
      "mousemove",
      updateActivity
    );

    window.addEventListener(
      "keydown",
      updateActivity
    );

    window.addEventListener(
      "click",
      updateActivity
    );

    window.addEventListener(
      "scroll",
      updateActivity
    );

    const interval = setInterval(() => {
      const lastActivity =
        localStorage.getItem(
          "lastActivity"
        );

      if (!lastActivity) return;

      const now = Date.now();

      const diff =
        now - Number(lastActivity);

      // 10 Minutes
      if (diff > 10 * 60 * 1000) {
        localStorage.removeItem("user");
        localStorage.removeItem("admin");
        localStorage.removeItem("adminData");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("lastActivity");

        alert(
          "Session Expired. Please Login Again."
        );

        navigate("/login", {
          replace: true,
        });
      }
    }, 5000);

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "mousemove",
        updateActivity
      );

      window.removeEventListener(
        "keydown",
        updateActivity
      );

      window.removeEventListener(
        "click",
        updateActivity
      );

      window.removeEventListener(
        "scroll",
        updateActivity
      );
    };
  }, [navigate]);

  return null;
};

export default SessionManager;