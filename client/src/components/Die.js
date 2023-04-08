import React from 'react';

const Die = () => {
  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: '50px',
      height: '50px',
      border: '2px solid black',
      backgroundColor: 'white',
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
      fontWeight: "bold"
    }}></div>
  );
}

export default Die;