import React, { useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { auth as firebaseuiAuth } from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import RoomForm from "./RoomForm";


const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    {
      provider: "password",
      requireDisplayName: true,
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

let uiInstance = null;

const Auth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const signInContainerRef = useRef(null);

  useEffect(() => {
    if (!uiInstance) {
      uiInstance = new firebaseuiAuth.AuthUI(auth);
    }

    const unregisterAuthObserver = onAuthStateChanged(auth, async (user) => {
      setIsSignedIn(!!user);

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          await setDoc(userRef, {
            rooms: [],
          });
        }
      }
    });

    uiInstance.start(signInContainerRef.current, uiConfig);

    return () => {
      unregisterAuthObserver();
    };
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <h1>ProtoTable</h1>
        <p>Please sign in:</p>
        <div ref={signInContainerRef} id="firebaseui-auth-container" />
      </div>
    );
  }

  return (
    <div>
      <h1>ProtoTable</h1>
      <p>You are now signed in!</p>
       <RoomForm />
    </div>
  );
};

export default Auth;
