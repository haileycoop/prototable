import React from "react";
import "./dice.css";

function Dice({ faces, color }) {
  const faceStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    height: "75%",
    backgroundSize: "cover",
  };

  const containerStyle = {
    position: "relative",
    display: "inline-block",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: color || "white",
    boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.3)",
  };

  return (
    <div style={containerStyle}>
      {faces.map((face, index) => (
        <div key={index} className="face" style={{ ...faceStyle, backgroundImage: `url(${face})` }} />
      ))}
    </div>
  );
}

export default Dice;
