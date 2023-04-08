// import logo from './logo.svg';
import './App.css';
import React from 'react';
import Auth from "./Auth";
import FirebaseProvider from './firebaseConfig';
import RoomForm from './RoomForm';
import Room from './components/Room';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <FirebaseProvider>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={
            <Auth>
              {(signedIn) => signedIn && <RoomForm />}
            </Auth>
          } />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </Router>
      </div>
    </FirebaseProvider>
  );
}

export default App;
