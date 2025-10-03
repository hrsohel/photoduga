import React from 'react';

const CalendarLeftSide = ({ onSelect, onLayoutSelect }) => {
  return (
    <div className="w-48 bg-white p-4 overflow-y-auto">
      <div className="space-y-4">
        <button onClick={() => onSelect("Pictures")} className="w-full text-left font-semibold">Pictures</button>
        <button onClick={() => onSelect("Backgrounds")} className="w-full text-left font-semibold">Background</button>
        <button onClick={() => onSelect("Frames")} className="w-full text-left font-semibold">Frames</button>
        <button onClick={() => onSelect("Stickers")} className="w-full text-left font-semibold">Stickers</button>
        <button onClick={() => {onSelect("Layouts"); onLayoutSelect()}} className="w-full text-left font-semibold">Page Layout</button>
      </div>
    </div>
  );
};

export default CalendarLeftSide;