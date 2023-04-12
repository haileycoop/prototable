import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebaseConfig';

const Die = ({ roomId, dieData, tableSize, tableRef }) => {
  const [dieValue, setDieValue] = useState(dieData?.value || 6);
  const [diePosition, setDiePosition] = useState({ x: (tableSize.width - 50) / 2, y: (tableSize.height - 50) / 2 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const dieRef = ref(db, `rooms/${roomId}/die`);
    const unsubscribe = onValue(dieRef, (snapshot) => {
      const data = snapshot.val();
      setDieValue(data?.value || 6);
      setDiePosition(data?.position || { x: (tableSize.width - 50) / 2, y: (tableSize.height - 50) / 2 });
      setIsHovering(data?.isHovering || false);
    });
    return () => {
      unsubscribe();
    };
  }, [roomId, tableSize]);

  const drawDie = useCallback(() => {
    if (tableRef.current) {
      const ctx = tableRef.current.getContext('2d');
      ctx.clearRect(0, 0, tableSize.width, tableSize.height);
      ctx.fillStyle = isHovering ? 'lightblue' : 'white';
      ctx.fillRect(diePosition.x, diePosition.y, 50, 50);
      ctx.font = '24px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(dieValue, diePosition.x + 20, diePosition.y + 30);
    }
  }, [diePosition, dieValue, tableSize, tableRef, isHovering]);

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
    const rect = tableRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const isHoveringNow =
      x >= diePosition.x &&
      x <= diePosition.x + 50 &&
      y >= diePosition.y &&
      y <= diePosition.y + 50;

    if (isHoveringNow !== isHovering) {
      setIsHovering(isHoveringNow);
      update(ref(db, `rooms/${roomId}/die`), { isHovering: isHoveringNow });
    }

    if (!isDragging) return;

    setHasMoved(true);

    const newX = x - cursorOffset.x;
    const newY = y - cursorOffset.y;

    setDiePosition({ x: newX, y: newY });
    update(ref(db, `rooms/${roomId}/die`), { position: { x: newX, y: newY } });
  },
  [cursorOffset, isDragging, roomId, tableRef, diePosition, isHovering]
);

  const rollDie = useCallback(() => {
    const newValue = Math.floor(Math.random() * 6) + 1;
    setDieValue(newValue);
    update(ref(db, `rooms/${roomId}/die`), { value: newValue });
  }, [roomId]);

  const handleMouseUp = useCallback((e) => {
    setIsDragging(false);

    const rect = tableRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (
      !hasMoved &&
      x >= diePosition.x &&
      x <= diePosition.x + 50 &&
      y >= diePosition.y &&
      y <= diePosition.y + 50
    ) {
      rollDie();
    }

    setHasMoved(false);
  }, [diePosition, hasMoved, rollDie, tableRef]);

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
