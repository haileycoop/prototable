import React from 'react';
import Die from './Die';

const Table = () => {
  return (
    <div className="table" style={{ width: '600px', height: '600px', backgroundColor: '#2c3e50', position: 'relative' }}>
      {/* Table content will go here */}
      <Die />
    </div>
  );
};

export default Table;
