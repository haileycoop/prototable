import React, { useEffect } from 'react';
import Table from './Table';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Room = ({ userId }) => {
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'dice'), (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const dieData = change.doc.data();
          const dieControl = dieData.control;
          if (dieControl === userId) {
            console.log('You are in control of the die');
          } else {
            console.log('Your opponent is in control of the die');
          }
        } else if (change.type === 'removed') {
          const dieData = change.doc.data();
          const dieControl = dieData.control;
          if (dieControl === userId) {
            console.log('You are no longer in control of the die');
          } else {
            console.log('Your opponent is no longer in control of the die');
          }
        }
      });
    });

    return unsubscribe;
  }, [userId]);

  return (
    <div className="room" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#34495e' }}>
      <Table />
    </div>
  );
};


export default Room;
