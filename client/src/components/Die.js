import React, { useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getDieValue } from "../helpers/DieHelpers";
import "./die.css";


const Die = ({ x,y }) => {
  const firestore = useFirestore();
  const [value, setValue] = useState(6); // 6 is the default value for a die
  const [hovering, setHovering] = useState(false);
  const [control, setControl] = useState(null); // track which user is in control of the die

  //helper function to check which player is in control of the die
  const handleMouseEnter = () => {
    if (!hovering) {
      setHovering(true);
      const currentUser = firebase.auth().currentUser;
      if (control === null) {
        setControl(currentUser.uid);
        console.log(`${currentUser.displayName} is in control of the die`);
      } else if (control !== currentUser.uid) {
        const dieRef = firestore.collection('dice').doc(uuidv4());
        dieRef.set({ value, control });
        setControl(currentUser.uid);
        console.log(`${currentUser.displayName} is in control of the die`);
      }
    }
  };

  const handleMouseLeave = () => {
    if (hovering) {
      setHovering(false);
      const currentUser = firebase.auth().currentUser;
      if (control === currentUser.uid) {
        setControl(null);
        console.log(`${currentUser.displayName} is no longer in control of the die`);
      }
    }
  };

  const rollDie = () => {
    const newValue = getDieValue();
    setValue(newValue);
    const currentUser = firebase.auth().currentUser;
    if (control === currentUser.uid) {
      const dieRef = firestore.collection('dice').doc(uuidv4());
      dieRef.set({ value: newValue, control });
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