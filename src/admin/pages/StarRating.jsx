import React from "react";

const StarRating = ({
  rating = 0,
  size = 20,
}) => {
  const percentage =
    (Number(rating) / 5) * 100;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        fontSize: `${size}px`,
        lineHeight: 1,
      }}
    >
      <div
        style={{
          color: "#ddd",
        }}
      >
        ★★★★★
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "hidden",
          whiteSpace: "nowrap",
          width: `${percentage}%`,
          color: "#ffc107",
        }}
      >
        ★★★★★
      </div>
    </div>
  );
};

export default StarRating;