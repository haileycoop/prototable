import React, { useState } from 'react';
import { collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';

const RoomForm = () => {
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Generate a unique room ID
      const roomRef = doc(collection(db, 'rooms'));
      const roomId = roomRef.id;

      // Store the room data in the 'rooms' collection
      await setDoc(roomRef, {
        id: roomId,
        name: roomName,
        password: roomPassword,
      });

      // Add the room ID to the user's 'rooms' array
      await updateDoc(doc(db, 'users', currentUser.uid), {
        rooms: firebase.firestore.FieldValue.arrayUnion(roomId),
      });

      alert('Room created successfully');
    } else {
      alert('Please sign in first');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="roomName">Room Name:</label>
        <input
          type="text"
          id="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="roomPassword">Room Password:</label>
        <input
          type="password"
          id="roomPassword"
          value={roomPassword}
          onChange={(e) => setRoomPassword(e.target.value)}
        />
      </div>
      <button type="submit">Create Room</button>
    </form>
  );
};

export default RoomForm;
