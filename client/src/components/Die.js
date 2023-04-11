import React, { useState, useEffect } from "react";
import { ref, update } from "firebase/database";
import { db } from "../firebaseConfig";

const Die = ({ value, sides, isCurrentPlayer, onRoll }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    if (isCurrentPlayer) {
      setIsDragging(true);
      update(ref(db, `rooms/${roomId}/dice`), { control: userId });
    }
  };

  const handleMouseUp = () => {
    if (isCurrentPlayer) {
      setIsDragging(false);
      update(ref(db, `rooms/${roomId}/dice`), { control: null });
    }
  };

  const handleKeyDown = (event) => {
    if (isCurrentPlayer && event.key === " ") {
      onRoll();
    }
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCurrentPlayer]);

  const handleMouseMove = (event) => {
    if (isDragging) {
      update(ref(db, `rooms/${roomId}/dice`), {
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  return (
    <div
      style={{
        display: "inline-block",
        border: "1px solid black",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        backgroundColor: "white",
        textAlign: "center",
        lineHeight: "50px",
        fontSize: "24px",
        fontWeight: "bold",
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
        cursor: isCurrentPlayer ? "move" : "default",
        opacity: isCurrentPlayer ? 1 : 0.5,
      }}
      onMouseDown={handleMouseDown}
    >
      {value}
    </div>
  );
};

export default Die;
