import React, { useRef } from 'react';
// import Die from './Die';

const Table = ({ diceData, createDie, onDieClick, onDieMouseDown, onDieMouseUp }) => {
  const tableRef = useRef(null);

  const handleTableMouseDown = (event) => {
    if (event.target === tableRef.current) {
      onDieMouseUp();
    }
  };

  return (
    <div
      className="table"
      style={{ width: '80%', height: '80%', backgroundColor: '#2c3e50', position: 'relative' }}
      ref={tableRef}
      onMouseDown={handleTableMouseDown}
    >
      {diceData &&
        Object.entries(diceData).map(([id, data]) => (
          <Die
            key={id}
            id={id}
            value={data.value}
            sides={data.sides}
            x={data.x}
            y={data.y}
            rotation={data.rotation}
            isCurrentPlayer={data.isCurrentPlayer}
            onClick={onDieClick}
            onMouseDown={onDieMouseDown}
            onMouseUp={onDieMouseUp}
          />
        ))}
    </div>
  );
};

export default Table;
