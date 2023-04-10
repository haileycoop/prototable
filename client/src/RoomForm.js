import React, { useState } from "react";
import { app, auth, db } from "./firebaseConfig";
import { ref, onValue, get, push, update } from "firebase/database";
import { useNavigate } from "react-router-dom";

function RoomForm() {
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [joinRoomPassword, setJoinRoomPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (app) {

      // Create new room document with a unique ID
      const roomsRef = ref(db, "rooms");
      const roomRef = push(roomsRef, { name: roomName, password: roomPassword });

      // Update user document with new room ID
      const userDoc = ref(db, "users/" + auth.currentUser.uid);
      get(userDoc).then((snapshot) => {
        let rooms = snapshot.child("rooms").val() || [];
        rooms.push(roomRef.key);
        update(userDoc, { rooms: rooms });
      }).catch((error) => {
        console.log("Error reading user data:", error);
      });

      navigate("/room/" + roomRef.key);
      console.log(roomRef.key);
    } else {
      console.log("Firebase not initialized");
    }
  };

  const handleJoinRoomSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (app) {
      // Check if room with the given ID and password exists
      const roomRef = ref(db, "rooms/" + joinRoomId);
      onValue(roomRef, async (snapshot) => {
        const room = snapshot.val();
        if (room && room.password === joinRoomPassword) {
          // If room exists, update user document with new room ID
          const userDoc = ref(db, "users/" + auth.currentUser.uid);
          const userSnapshot = await get(userDoc);
          const user = userSnapshot.val();
          if (user && user.rooms) {
            const rooms = [...user.rooms, joinRoomId];
            update(userDoc, { rooms });
          }
          navigate("room/" + joinRoomId);
        } else {
          setErrorMessage("Room with given ID and password does not exist.");
        }
      });
    } else {
      console.log("Firebase not initialized");
    }
  };

  return (
  <div>
    <form onSubmit={handleSubmit}>
      <h2>Create a new room</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <label htmlFor="room-name">Room name:</label>
      <input type="text" id="room-name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
      <label htmlFor="room-password">Room password:</label>
      <input
        type="password"
        id="room-password"
        value={roomPassword}
        onChange={(e) => setRoomPassword(e.target.value)}
      />
      <button type="submit">Create room</button>
    </form>
    <form onSubmit={handleJoinRoomSubmit}>
      <h2>Join a room</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <label htmlFor="join-room-id">Room ID:</label>
      <input type="text" id="join-room-id" value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value)} />
      <label htmlFor="join-room-password">Room password:</label>
      <input
        type="password"
        id="join-room-password"
        value={joinRoomPassword}
        onChange={(e) => setJoinRoomPassword(e.target.value)}
      />
      <button type="submit">Join room</button>
    </form>
  </div>
  );
}

export default RoomForm;
