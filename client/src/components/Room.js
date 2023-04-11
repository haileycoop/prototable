import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import Box from './Box';

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

  const [boxData, setBoxData] = useState({});

  useEffect(() => {
    const boxRef = ref(db, `rooms/${roomId}/box`);
    const unsubscribe = onValue(boxRef, (snapshot) => {
      setBoxData(snapshot.val());
    });
    return () => {
      unsubscribe();
    };
  }, [roomId]);

  const handleBoxHover = () => {
    update(ref(db, `rooms/${roomId}/box/isHovering`), { box: { isHovering: true }});
  };

  const handleBoxLeave = () => {
    update(ref(db, `rooms/${roomId}/box/isHovering`), { box: { isHovering: false }});
  };

  // Render the room

  return (
    {/* Layout of the room */},
    <div className="room" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#34495e' }}>
      
      {/* Room ID copy feature - display room ID and copy button */},
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', margin: '0 0 10px 0' }}>
        <p style={{ color: 'white' }}>Room ID:</p>
        <p style={{ width: '50%', margin: '0 10px', padding: '8px', border: '1px solid gray', color: 'white' }} >{roomId}</p>
        <button onClick={handleCopyClick}>{idCopied ? 'Copied!' : 'Copy'}</button>
        </div>
      {/* Create a table within the room */},
      <div
        className="table"
          style={{ width: '80%', height: '80%', backgroundColor: '#2c3e50', position: 'relative' }} >
          {/* Spawn a box inside the table and pass in hover updates */},
          <Box roomId={roomId} boxData={boxData} isHovered={boxData?.isHovering} handleHover={handleBoxHover} handleLeave={handleBoxLeave} />
      </div>
    </div>
  );
};

export default Room;
