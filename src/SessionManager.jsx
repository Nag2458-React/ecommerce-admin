import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionManager = () => {

  const navigate =
    useNavigate();

  useEffect(() => {

    const timer =
      setInterval(() => {

        const loginTime =
          localStorage.getItem(
            "loginTime"
          );

        if (!loginTime) return;

        const diff =
          Date.now() -
          Number(loginTime);

        if (
          diff >
          30 * 60 * 1000
        ) {

          localStorage.clear();

          alert(
            "Session Expired"
          );

          navigate(
            "/login",
            {
              replace: true,
            }
          );

        }

      }, 5000);

    return () =>
      clearInterval(timer);

  }, [navigate]);

  return null;
};

export default SessionManager;