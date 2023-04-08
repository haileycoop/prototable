import React, { useState } from 'react';
import "./die.css";

function Die() {
  const [value, setValue] = useState(6);

  return (
    <div 
      className="die"
      onClick={() => {
        const newValue = Math.floor(Math.random() * 6) + 1;
        setValue(newValue);
      }}
    >
      {value}
    </div>
  );
}

export default Die;