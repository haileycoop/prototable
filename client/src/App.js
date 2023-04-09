import { useEffect, useState } from "react";
import { app, auth, db } from "./firebaseConfig";
import './App.css';
import React from 'react';
import Auth from "./Auth";
import RoomForm from './RoomForm';
import Room from './components/Room';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    if (app) {
      setFirebaseReady(true);
    }
  }, []);

  return (
    <div className="App">
      {firebaseReady && <Router>
        {firebaseReady && <Routes>
          <Route path="/" element={
            <Auth>
              {(signedIn) => signedIn && <RoomForm auth={auth} db={db}/>}
            </Auth>
          } />
          <Route path="/room/:id" element={<Room />} />
        </Routes>}
      </Router>}
    </div>
  );
}

export default App;
