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
          style={{ width: '80%', height: '80%', backgroundColor: '#2c3e50', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Spawn a die inside the table and pass in hover updates */},
          {dieData && <Die roomId={roomId} dieData={dieData} isHovered={dieData.isHovering} handleHover={handleDieHover} handleLeave={handleDieLeave} value={dieData.dieValue} />}
      </div>
    </div>
  );
};

export default Room;
