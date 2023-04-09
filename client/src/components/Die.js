import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getDieValue } from "../helpers/DieHelpers";
import { doc, collection, setDoc } from 'firebase/firestore';
import "./die.css";
import { auth, db } from '../firebaseConfig';

const Die = ({ x, y }) => {
  const [value, setValue] = useState(6); // 6 is the default value for a die
  const [hovering, setHovering] = useState(false);
  const [control, setControl] = useState(null); // track which user is in control of the die

  //helper function to check which player is in control of the die
  const handleMouseEnter = () => {
    if (!hovering) {
      setHovering(true);
      const currentUser = auth.currentUser;
      if (control === null) {
        setControl(currentUser.uid);
        console.log(`${currentUser.displayName} is in control of the die`);
      } else if (control !== currentUser.uid) {
        const dieRef = doc(collection(db, 'dice'), uuidv4());
        setDoc(dieRef, { value, control });
        setControl(currentUser.uid);
        console.log(`${currentUser.displayName} is in control of the die`);
      }
    }
  };

  const handleMouseLeave = () => {
    if (hovering) {
      setHovering(false);
      const currentUser = auth.currentUser;
      if (control === currentUser.uid) {
        setControl(null);
        console.log(`${currentUser.displayName} is no longer in control of the die`);
      }
    }
  };

  const rollDie = () => {
    const newValue = getDieValue();
    setValue(newValue);
    const currentUser = auth.currentUser;
    if (control === currentUser.uid) {
      const dieRef = doc(collection(db, 'dice'), uuidv4());
      setDoc(dieRef, { value: newValue, control });
    }
  };

  return (
    <div 
      className="die"
      style={{ left: x, top: y }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={rollDie}
    >
      {value}
    </div>
  );
}

export default Die;