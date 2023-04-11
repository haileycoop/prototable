import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebaseConfig';

const Box = ({ roomId, boxData }) => {
  const [isHovering, setIsHovering] = useState(boxData?.isHovering || false);

  useEffect(() => {
    const boxRef = ref(db, `rooms/${roomId}/box`);
    const unsubscribe = onValue(boxRef, (snapshot) => {
      const data = snapshot.val();
      setIsHovering(data?.isHovering || false);
    });
    return () => {
      unsubscribe();
    };
  }, [roomId]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    update(ref(db, `rooms/${roomId}/box`), { ...boxData, isHovering: true });
    // console.log(boxData);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    update(ref(db, `rooms/${roomId}/box`), { ...boxData, isHovering: false });
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
