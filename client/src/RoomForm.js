import React, { useState } from "react";
import { app, auth, db } from "./firebaseConfig";
import { ref, get, set, push, update } from "firebase/database";
import { useNavigate } from "react-router-dom";

function RoomForm() {
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [joinRoomPassword, setJoinRoomPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleCreateRoomSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (app) {
      // Get the current user's ID
      const userId = auth.currentUser.uid;

      // Create new room document with a unique ID
      const roomsRef = ref(db, "rooms");
      const roomRef = push(roomsRef, { name: roomName, password: roomPassword });
      const roomId = roomRef.key;

      // Set the initial state of the die and table
      const tableSize = { width: 800, height: 800 };
      const initialDieData = {
        position: { x: (tableSize.width - 50) / 2, y: (tableSize.height - 50) / 2 },
        value: 6,
        isHovering: false,
      };
      await update(ref(db, `rooms/${roomId}/die`), initialDieData);

      // Add the user ID to the "players" subcollection of the new room
      const playersRef = ref(db, `rooms/${roomId}/players/${userId}`);
      const playerSnapshot = await get(playersRef);
      if (!playerSnapshot.exists()) {
        await set(playersRef, true);
      }

      navigate("/room/" + roomRef.key);
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
      const roomSnapshot = await get(roomRef);

      if (roomSnapshot.exists() && roomSnapshot.val().password === joinRoomPassword) {
        // If room exists, add user to the "players" subcollection of the room
        const userId = auth.currentUser.uid;
        const playersRef = ref(db, `rooms/${joinRoomId}/players/${userId}`);
        await set(playersRef, true);

        // Navigate to the room
        navigate("room/" + joinRoomId);
      } else {
        setErrorMessage("Room with given ID and password does not exist.");
      }
    } else {
      console.log("Firebase not initialized");
    }
  };

  return (
  <div>
    <form onSubmit={handleCreateRoomSubmit}>
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
