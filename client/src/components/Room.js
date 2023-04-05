import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  where,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import Table from "./Table";
import Dice from "./Dice";

function Room() {
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [userRooms, setUserRooms] = useState([]);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState({});
  const [diceData, setDiceData] = useState({});
  const [selectedDice, setSelectedDice] = useState(new Set());
  const [diceColor, setDiceColor] = useState("white");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(null);

  const { roomId } = useParams();

  const handleLogout = () => {
    auth.signOut();
  };

  const handleAddTable = async () => {
    const newTable = {
      name: `Table ${Object.keys(tableData).length + 1}`,
      rows: 6,
      cols: 6,
      cells: [],
    };

    const tableRef = await addDoc(collection(db, `rooms/${roomId}/tables`), newTable);

    setTableData((prevTableData) => ({
      ...prevTableData,
      [tableRef.id]: newTable,
    }));
  };

  const handleDeleteTable = async (tableId) => {
    await deleteDoc(doc(db, `rooms/${roomId}/tables/${tableId}`));

    setTableData((prevTableData) => {
      const newTableData = { ...prevTableData };
      delete newTableData[tableId];
      return newTableData;
    });
  };

  const handleAddDice = async (tableId) => {
    const newDice = {
      faces: [
        "https://example.com/face1.png",
        "https://example.com/face2.png",
        "https://example.com/face3.png",
        "https://example.com/face4.png",
        "https://example.com/face5.png",
        "https://example.com/face6.png",
      ],
      color: "red",
      position: { x: 0, y: 0 },
    };

    const diceRef = await addDoc(collection(db, `rooms/${roomId}/tables/${tableId}/dice`), newDice);

    setDiceData((prevDiceData) => ({
      ...prevDiceData,
      [diceRef.id]: newDice,
    }));
  };

  const handleDeleteDice = async (tableId, diceId) => {
    await deleteDoc(doc(db, `rooms/${roomId}/tables/${tableId}/dice/${diceId}`));

    setDiceData((prevDiceData) => {
      const newDiceData = { ...prevDiceData };
      delete newDiceData[diceId];
      return newDiceData;
    });
  };

  const handleTableDataChange = async (tableId, newData) => {
    await updateDoc(doc(db, `rooms/${roomId}/tables/${tableId}`), newData);

    setTableData((prevTableData) => ({
      ...prevTableData,
      [tableId]: {
        ...prevTableData[tableId],
        ...newData,
      },
    }));
  };

  const handleDiceDataChange = (diceId, data) => {
    setDiceData({
      ...diceData,
      [diceId]: data,
    });
       if (data.color) {
    setDiceColor(data.color);
  }
  };

  const handleRemoveDice = (diceId) => {
    const newDiceData = { ...diceData };
    delete newDiceData[diceId];
    setDiceData(newDiceData);
  };

  const handleDiceSelection = (diceId) => {
    const newSelectedDice = new Set(selectedDice);
    if (newSelectedDice.has(diceId)) {
      newSelectedDice.delete(diceId);
    } else {
      newSelectedDice.add(diceId);
    }
    setSelectedDice(newSelectedDice);
  };

  const handleTableClick = (tableId) => {
    console.log(`Table ${tableId} clicked`);
  };

  const handleTableDrag = (tableId, newPosition) => {
    console.log(`Table ${tableId} dragged to ${newPosition.x},${newPosition.y}`);
  };

  return (
    <div>
      <Table
        onTableClick={handleTableClick}
        onTableDrag={handleTableDrag}
        backgroundImage={backgroundImage}
        backgroundImageUrl={backgroundImageUrl}
      >
        {Object.entries(tableData).map(([tableId, table]) => (
          <Table
            key={tableId}
            tableId={tableId}
            name={table.name}
            rows={table.rows}
            cols={table.cols}
            cells={table.cells}
            onTableDataChange={handleTableDataChange}
            onTableDelete={handleDeleteTable}
            onAddDice={handleAddDice}
            onDeleteDice={handleDeleteDice}
            onDiceDataChange={handleDiceDataChange}
            onDiceSelection={handleDiceSelection}
            selectedDice={selectedDice}
            diceData={diceData}
            diceColor={diceColor}
          />
        ))}
      </Table>
      <div>
        <button onClick={handleAddTable}>Add Table</button>
      </div>
    </div>
  );
}
 
export default Room;