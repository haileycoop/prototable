import React, { useState, useContext } from "react";
// import { db, auth } from "./firebaseConfig";
import { FirebaseContext } from "./firebaseConfig";
import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion, where, query, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function RoomForm() {
  const { auth, db } = useContext(FirebaseContext);
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [joinRoomPassword, setJoinRoomPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    // Create new room document with a unique ID
    const roomRef = await addDoc(collection(db, "rooms"), { name: roomName, password: roomPassword });

    // Update user document with new room ID
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (userDoc.exists()) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        rooms: arrayUnion(roomRef.id),
      });
    } else {
      console.log("No such document!");
    }

    navigate(`/room/${roomRef.id}`);
  };

  const handleJoinRoomSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    // Check if room with the given ID and password exists
    const roomQuery = query(collection(db, "rooms"), where("password", "==", joinRoomPassword));
    const querySnapshot = await getDocs(roomQuery);
    let roomExists = false;
    let roomId;
    querySnapshot.forEach((doc) => {
      if (doc.id === joinRoomId) {
        roomExists = true;
        roomId = doc.id;
      }
    });

    // If room exists, update user document with new room ID
    if (roomExists) {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          rooms: arrayUnion(roomId),
        });
      } else {
        console.log("No such document!");
      }

      navigate(`/room/${roomId}`);
    } else {
      setErrorMessage("Room with given ID and password does not exist.");
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
