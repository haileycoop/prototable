import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebaseConfig';

const Die = ({ roomId, dieData }) => {
  const [isHovering, setIsHovering] = useState(dieData?.isHovering || false);
  const [dieValue, setDieValue] = useState(dieData?.value || 6);

  useEffect(() => {
    const dieRef = ref(db, `rooms/${roomId}/die`);
    const unsubscribe = onValue(dieRef, (snapshot) => {
      const data = snapshot.val();
      setIsHovering(data?.isHovering || false);
      setDieValue(data?.value || 6);
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

  const handleMouseClick = () => {
    const newValue = Math.floor(Math.random() * 6) + 1;
    update(ref(db, `rooms/${roomId}/die`), { value: newValue });
  };

  return (
    <div
      className="die"
      style={{
        width: '50px',
        height: '50px',
        border: '1px solid black',
        backgroundColor: isHovering ? '#ADD8E6' : 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseClick}
    >
      {dieValue}
    </div>
  );
};

export default Die;
