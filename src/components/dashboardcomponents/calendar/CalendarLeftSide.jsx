import React, { useState } from 'react';

const CalendarLeftSide = ({ onSelect, onLayoutSelect }) => {
  const [activeLeftBar, setActiveLeftBar] = useState("Pictures");

  const buttons = [
    { id: 1, label: "Pictures" },
    { id: 2, label: "Backgrounds" },
    { id: 3, label: "Frames" },
    { id: 4, label: "Stickers" },
    { id: 5, label: "Page Layout" },
  ];

  const handleButtonClick = (label) => {
    setActiveLeftBar(label);
    if (label === "Page Layout") {
      onSelect("Layouts");
      onLayoutSelect();
    } else {
      onSelect(label);
    }
  };

  return (
    <div className='flex items-center justify-start flex-col w-[130px] bg-white h-[91vh] sticky top-0'>
      {buttons.map(data => (
        <div 
          onClick={() => handleButtonClick(data.label)} 
          key={data.id} 
          className={`p-6 py-8 flex items-center ${data.label === activeLeftBar ? "bg-[#A8C3A0]" : ""} hover:bg-slate-100 justify-start flex-col cursor-pointer w-full`}
        >
          <p className={`font-semibold text-[16px] ${data.label === activeLeftBar ? "text-[#ffffff]" : "text-[#727273]"} font-sans text-center`}>{data.label}</p>
        </div>
      ))}
    </div>
  );
};

export default CalendarLeftSide;
