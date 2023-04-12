import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { set, ref, onValue, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import Die from './Die';

const Room = ({userId}) => {

  // Room ID copy feature - handle parameters and set click function
  const { roomId } = useParams();
  const [idCopied, setIdCopied] = useState(false);  
  const handleCopyClick = () => {
    navigator.clipboard.writeText(roomId);
    setIdCopied(true);
    setTimeout(() => {
    setIdCopied(false);
  }, 3000);
  };

  // Game piece management

  const [dieData, setDieData] = useState({ value: 6 });

  useEffect(() => {
    // set the initial die value in the database if it doesn't exist
    const dieRef = ref(db, `rooms/${roomId}/die`);
    onValue(dieRef, (snapshot) => {
      const dieValue = snapshot.child('dieValue').val();
      if (dieValue === null) {
        set(dieRef, { dieValue: 6 });
      }
    });

    // listen for changes to the die object in the database and update the state
    const dieDataRef = ref(db, `rooms/${roomId}/die`);
    onValue(dieDataRef, (snapshot) => {
      const data = snapshot.val();
      setDieData(data || {});
    });

  }, [roomId]);

  const handleDieHover = () => {
    update(ref(db, `rooms/${roomId}/die/isHovering`), { die: { isHovering: true }});
  };

  const handleDieLeave = () => {
    update(ref(db, `rooms/${roomId}/die/isHovering`), { die: { isHovering: false }});
  };

  // Table management
  const [tablePosition, setTablePosition] = useState({ x: 0, y: 0 });
  const [initialMouseX, setInitialMouseX] = useState(null);
  const [initialMouseY, setInitialMouseY] = useState(null);
  const [initialTableX, setInitialTableX] = useState(null);
  const [initialTableY, setInitialTableY] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // Add isDragging state

  const handleTableMouseDown = (event) => {
    setInitialMouseX(event.clientX);
    setInitialMouseY(event.clientY);
    setInitialTableX(tablePosition.x);
    setInitialTableY(tablePosition.y);
    setIsDragging(true); // Set isDragging to true

    window.addEventListener('mousemove', handleTableMouseMove);
    window.addEventListener('mouseup', handleTableMouseUp);
  };

  const handleTableMouseMove = (event) => {
    if (isDragging) { // Only move the table if isDragging is true
      const newTableX = initialTableX + (event.clientX - initialMouseX);
      const newTableY = initialTableY + (event.clientY - initialMouseY);
      setTablePosition({x: newTableX, y: newTableY});
    }
  };

  const handleTableMouseUp = () => {
    setIsDragging(false); // Set isDragging to false
    window.removeEventListener('mousemove', handleTableMouseMove);
    window.removeEventListener('mouseup', handleTableMouseUp);
  };


  // Render the room

  return (
    {/* Create a room space within which everything else sits */},
    <div className="room-space"
      style={{ width: '1200px', height: '1200px', position: 'relative' }}>
      
      {/* Create a container to manage menus within the room-space */},
      
      <div className="menu-container"
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: '2', pointerEvents: 'none' }}>
          
        {/* Create a container for a menu at the top */},
        <div className="top-menu"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50px', backgroundColor: '#3d3d3d', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', pointerEvents: 'auto' }}>

          {/* Add top menu items here */}, 
          <div className="room-id" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', margin: '10px 10px 10px 10px', pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid gray', padding: '4px 8px' }}> {/* Add this new container */}
              <p style={{ color: 'white', margin: 0 }}>Room ID:</p>
              <p style={{ margin: '0 10px', padding: '2px 4px', color: 'white' }} >{roomId}</p>
              <button onClick={handleCopyClick}>{idCopied ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create a table within the room-space */},
      <div className="table"
        style={{
          position: 'absolute',
          left: `${tablePosition.x}px`,
          top: `${tablePosition.y}px`,
          width: '800px',
          height: '800px',
          backgroundColor: '#2c3e50',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '1'
        }}
          onMouseDown={handleTableMouseDown}
          onMouseUp={handleTableMouseUp}
          onMouseMove={handleTableMouseMove}
        >
        {/* Spawn a die inside the table and pass in hover updates */}
        {dieData && <Die roomId={roomId} dieData={dieData} isHovered={dieData.isHovering} handleHover={handleDieHover} handleLeave={handleDieLeave} value={dieData.dieValue} />}
      </div>
    </div>
    );
  };

export default Room;
