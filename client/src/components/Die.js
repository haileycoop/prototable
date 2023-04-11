import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebaseConfig';

const Die = ({ roomId, dieData }) => {
  const [isHovering, setIsHovering] = useState(dieData?.isHovering || false);

  useEffect(() => {
    const dieRef = ref(db, `rooms/${roomId}/die`);
    const unsubscribe = onValue(dieRef, (snapshot) => {
      const data = snapshot.val();
      setIsHovering(data?.isHovering || false);
    });
    return () => {
      unsubscribe();
    };
  }, [roomId]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    update(ref(db, `rooms/${roomId}/die`), { ...dieData, isHovering: true });
    // console.log(dieData);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    update(ref(db, `rooms/${roomId}/die`), { ...dieData, isHovering: false });
    // console.log(dieData);
  };

  return (
    <div
      className="die"
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

export default Die;
