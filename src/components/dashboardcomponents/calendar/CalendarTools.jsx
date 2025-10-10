import React from 'react';
import CalendarFrames from './CalendarFrames';
import CalendarBackground from './CalendarBackground';
import CalendarStickerComponent from './CalendarStickerComponent';
import LayoutSelector from './LayoutSelector';
import CalendarPictures from './CalendarPictures';
import CalendarPageNavigation from './CalendarPageNavigation';

export default function CalendarTools({ uploadedImages, handleImageUpload, activeLeftBar, bgType, setBgType, selectedBg, setSelectedBg, onSelectSticker, onSelectLayout, currentMonthIndex, onMonthChange, calendarMonths, setViewMode }) {
  const showComponent = {
    "Frames": () => <CalendarPageNavigation currentMonthIndex={currentMonthIndex} onMonthChange={onMonthChange} calendarMonths={calendarMonths} setViewMode={setViewMode} />,
    "Stickers": () => <CalendarStickerComponent onSelectSticker={onSelectSticker} />,
    "Backgrounds": () => <CalendarBackground 
      uploadedImages={uploadedImages} 
      handleImageUpload={handleImageUpload} 
      bgType={bgType} 
      selectedBg={selectedBg} 
      setBgType={setBgType} 
      setSelectedBg={setSelectedBg}
    />,
    "Layouts": () => <LayoutSelector onSelect={onSelectLayout} />,
    "Pictures": () => <CalendarPictures uploadedImages={uploadedImages} handleImageUpload={handleImageUpload} />,
  };

  return (
    <>
      {showComponent[activeLeftBar] ? showComponent[activeLeftBar]() : null}
    </>
  );
}
