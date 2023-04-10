import React, { useEffect, useState } from 'react';
import Table from './Table';
import { ref, onValue } from "firebase/database";
import { db } from '../firebaseConfig';
import { useParams } from "react-router-dom";

const Room = ({ userId }) => {
  const {roomId} = useParams();
  const [idCopied, setIdCopied] = useState(false);
  const diceRef = ref(db, 'dice');
  useEffect(() => {
    const unsubscribe = onValue(diceRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const dieData = childSnapshot.val();
        const dieControl = dieData.control;
        if (dieControl === userId) {
          console.log('You are in control of the die');
        } else {
          console.log('Your opponent is in control of the die');
        }
      });
    });

    return unsubscribe;
  }, [userId, diceRef]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(roomId);
    setIdCopied(true);
    setTimeout(() => {
    setIdCopied(false);
  }, 3000);
  };

  return (
    <div className="room" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#34495e' }}>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', margin: '0 0 10px 0' }}>
        <p style={{ color: 'white' }}>Room ID:</p>
        <p style={{ width: '50%', margin: '0 10px', padding: '8px', border: '1px solid gray', color: 'white' }} >{roomId}</p>
        <button onClick={handleCopyClick}>{idCopied ? 'Copied!' : 'Copy'}</button>
      </div>
      <Table />
    </div>
  );
};

export default Room;
