import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebaseConfig';

const Box = ({ roomId, boxData }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    set(ref(db, `rooms/${roomId}/box`), { ...boxData, isHovering: true });
    // console.log(boxData);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    set(ref(db, `rooms/${roomId}/box`), { ...boxData, isHovering: false });
    // console.log(boxData);
  };

  return (
    <div
      className="box"
      style={{
        width: '50px',
        height: '50px',
        border: '1px solid black',
        backgroundColor: isHovering ? '#ADD8E6' : 'white',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    ></div>
  );
};

export default Box;
