import React, { useEffect, useState } from "react";

const DeliveryCountdown = ({ deliveryDate, status }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!deliveryDate || status === "Delivered") return;

    const interval = setInterval(() => {
      const now = new Date();
      const target = deliveryDate.toDate
        ? deliveryDate.toDate()
        : new Date(deliveryDate);

      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Arriving Today");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (diff % (1000 * 60 * 60)) /
          (1000 * 60)
      );

      if (days > 0)
        setTimeLeft(`${days} Day(s) ${hours} Hour(s) Left`);
      else
        setTimeLeft(`${hours} Hour(s) ${minutes} Min Left`);
    }, 1000);

    return () => clearInterval(interval);
  }, [deliveryDate, status]);

 
 return (
  <div>

    {status === "Delivered" ? (

      <span
        className="badge bg-success"
        style={{
          fontSize: "13px",
        }}
      >
        Delivered
      </span>

    ) : (

      <span
        className="badge bg-warning text-dark"
        style={{
          fontSize: "13px",
        }}
      >
        ⏳ {timeLeft}
      </span>

    )}

  </div>
);
  
};

export default DeliveryCountdown;