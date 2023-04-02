// import logo from './logo.svg';
import './App.css';
import React from 'react';
import Auth from "./Auth";
import RoomForm from './RoomForm';
import Room from './components/Room';


function App() {
  return (
    <div className="App">
      <Auth>
        {(signedIn) => signedIn && <RoomForm />}
      </Auth>
    </div>
  );
}

export default App;
