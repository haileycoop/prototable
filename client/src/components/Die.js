import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebaseConfig';

const Die = ({ roomId, dieData, tableSize, tableOffset }) => {
  const [isHovering, setIsHovering] = useState(dieData?.isHovering || false);
  const [dieValue, setDieValue] = useState(dieData?.value || 6);
  const [isDragging, setIsDragging] = useState(false);
  const [diePosition, setDiePosition] = useState({ x: (tableSize.width - 50) / 2, y: (tableSize.height - 50) / 2 });
  const dieRef = useRef(null);
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const dieRef = ref(db, `rooms/${roomId}/die`);
    const unsubscribe = onValue(dieRef, (snapshot) => {
      const data = snapshot.val();
      setIsHovering(data?.isHovering || false);
      setDieValue(data?.value || 6);
      setDiePosition(data?.position || { x: (tableSize.width - 50) / 2, y: (tableSize.height - 50) / 2 });
    });
    return () => {
      unsubscribe();
    };
  }, [roomId, tableSize]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    update(ref(db, `rooms/${roomId}/die`), { ...dieData, isHovering: true });
    // console.log(dieData);
  };

  const handleMouseDown = (e) => {
    const dieRect = dieRef.current.getBoundingClientRect();
    setCursorOffset({
      x: e.clientX - dieRect.left,
      y: e.clientY - dieRect.top,
  });
    setIsDragging(true);
  };

  const handleMouseMove = useCallback ((e) => {
      if (!isDragging) return;

      const dieRect = dieRef.current.getBoundingClientRect();
      const newX = e.clientX - tableOffset.left - cursorOffset.x;
      const newY = e.clientY - tableOffset.top - cursorOffset.y;

      // Check if the die is within table boundaries
      if (
        newX >= 0 &&
        newX + dieRect.width <= tableSize.width &&
        newY >= 0 &&
        newY + dieRect.height <= tableSize.height
      ) {
        setDiePosition({ x: newX, y: newY });
      }
      
      // Update the die position in the database
      update(ref(db, `rooms/${roomId}/die`), { position: { x: newX, y: newY } });
  
    }, [cursorOffset, isDragging, roomId, tableOffset, tableSize]);

  const handleMouseUp = useCallback (() => {
      setIsDragging(false);
      const newValue = Math.floor(Math.random() * 6) + 1;
      update(ref(db, `rooms/${roomId}/die`), { value: newValue });
    }, [roomId]);
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    update(ref(db, `rooms/${roomId}/die`), { ...dieData, isHovering: false });
    // console.log(dieData);
  };

  // Listen for events
  useEffect(() => {

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [roomId, isDragging, handleMouseMove, handleMouseUp]);


  return (
    <div
      className="die"
      style={{
        position: 'absolute',
        left: `${diePosition.x}px`,
        top: `${diePosition.y}px`,
        width: '50px',
        height: '50px',
        border: '1px solid black',
        backgroundColor: isHovering ? '#ADD8E6' : 'white',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      ref={dieRef}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      {dieValue}
    </div>
  );
};

export default Die;
