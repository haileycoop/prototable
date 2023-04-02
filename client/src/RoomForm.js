import { useState } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function RoomForm() {
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
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

  return (
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
  );
}

export default RoomForm;
