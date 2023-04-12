import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebaseConfig';

const Die = ({ roomId, dieData, tableSize, tableRef }) => {
  const [dieValue, setDieValue] = useState(dieData?.value || 6);
  const [diePosition, setDiePosition] = useState({ x: (tableSize.width - 50) / 2, y: (tableSize.height - 50) / 2 });
  const [isDragging, setIsDragging] = useState(false);
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const dieRef = ref(db, `rooms/${roomId}/die`);
    const unsubscribe = onValue(dieRef, (snapshot) => {
      const data = snapshot.val();
      setDieValue(data?.value || 6);
      setDiePosition(data?.position || { x: (tableSize.width - 50) / 2, y: (tableSize.height - 50) / 2 });
    });
    return () => {
      unsubscribe();
    };
  }, [roomId, tableSize]);

  useEffect(() => {
    const dieRef = ref(db, `rooms/${roomId}/die`);
    const dieData = {
      position: { x: (tableSize.width - 50) / 2, y: (tableSize.height - 50) / 2 },
      value: 6,
    };
    update(dieRef, dieData);
  }, [roomId, tableSize]);

  const drawDie = useCallback(() => {
    if (tableRef.current) {
      const ctx = tableRef.current.getContext('2d');
      console.log('Context:', ctx);
      ctx.clearRect(0, 0, tableSize.width, tableSize.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(diePosition.x, diePosition.y, 50, 50);
      ctx.font = '24px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(dieValue, diePosition.x + 20, diePosition.y + 30);
      console.log('Die drawn at:', diePosition);
    }
  }, [diePosition, dieValue, tableSize, tableRef]);

  useEffect(() => {
    drawDie();
  }, [drawDie]);

  const handleMouseDown = useCallback((e) => {
  const rect = tableRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (
    x >= diePosition.x &&
    x <= diePosition.x + 50 &&
    y >= diePosition.y &&
    y <= diePosition.y + 50
  ) {
    setIsDragging(true);
    setCursorOffset({ x: x - diePosition.x, y: y - diePosition.y });
  }
}, [diePosition, tableRef]);


  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const rect = tableRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - cursorOffset.x;
      const newY = e.clientY - rect.top - cursorOffset.y;

      setDiePosition({ x: newX, y: newY });
      update(ref(db, `rooms/${roomId}/die`), { position: { x: newX, y: newY } });
    },
    [cursorOffset, isDragging, roomId, tableRef]
  );

    const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    const newValue = Math.floor(Math.random() * 6) + 1;
    setDieValue(newValue);
    update(ref(db, `rooms/${roomId}/die`), { value: newValue });
  }, [roomId]);

  useEffect(() => {
    const canvas = tableRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, tableRef]);

};

export default Die;
