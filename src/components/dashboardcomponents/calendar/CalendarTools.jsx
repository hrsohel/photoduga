import React from 'react';
import CalendarFrames from './CalendarFrames';
import CalendarBackground from './CalendarBackground';
import CalendarStickerComponent from './CalendarStickerComponent';
import LayoutSelector from './LayoutSelector';
import CalendarPictures from './CalendarPictures';
import CalendarMasks from './CalendarMasks';

export default function CalendarTools({ uploadedImages, handleImageUpload, activeLeftBar, bgType, setBgType, selectedBg, setSelectedBg, onSelectSticker, onSelectLayout, currentMonthIndex, onMonthChange, calendarMonths, setViewMode }) {
  const showComponent = {
    "Frames": () => <CalendarFrames />,
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
    "Masks": () => <CalendarMasks />,
  };

  return (
    <>
      {showComponent[activeLeftBar] ? showComponent[activeLeftBar]() : null}
    </>
  );
}
