import React from 'react';
import Table from './Table';

const Room = () => {
  return (
    <div className="room" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#34495e' }}>
      <Table />
    </div>
  );
};

export default Room;
