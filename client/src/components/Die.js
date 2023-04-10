import React, { useState, useEffect } from 'react';
import { getDieValue } from "../helpers/DieHelpers";
import { ref, push, onValue, update } from 'firebase/database';
import "./die.css";
import { auth, db } from '../firebaseConfig';

const Die = ({ x, y }) => {
  const [value, setValue] = useState(6); // 6 is the default value for a die
  const [hovering, setHovering] = useState(false);
  const [control, setControl] = useState(null); // track which user is in control of the die

  const [userId] = useState(null);

  useEffect(() => {
    const diceRef = ref(db, 'dice');
  
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

      return () => {
        unsubscribe();
      };
    }, [userId]);


    //helper function to check which player is in control of the die
    const handleMouseEnter = () => {
      if (!hovering) {
        setHovering(true);
        const currentUser = auth.currentUser;
        if (control === null) {
          setControl(currentUser.uid);
          console.log(`${currentUser.displayName} is in control of the die`);
        } else if (control !== currentUser.uid) {
          const dieRef = push(ref(db, 'dice'));
          update(dieRef, { value, control });
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
        const dieRef = push(ref(db, 'dice'));
        update(dieRef, { value: newValue, control });
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
  };


export default Die;