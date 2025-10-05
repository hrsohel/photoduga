import React from 'react';
import CalendarFrames from './CalendarFrames';
import CalendarBackground from './CalendarBackground';
import CalendarStickerComponent from './CalendarStickerComponent';
import LayoutSelector from './LayoutSelector';
import CalendarPictures from './CalendarPictures';

export default function CalendarTools({ uploadedImages, handleImageUpload, activeLeftBar, bgType, setBgType, selectedBg, setSelectedBg, onSelectSticker, onSelectLayout }) {
  const showComponent = {
    "Frames": () => <CalendarPictures uploadedImages={uploadedImages} handleImageUpload={handleImageUpload} />,
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
    "Pictures": () => <CalendarFrames uploadedImages={uploadedImages} handleImageUpload={handleImageUpload} />,
  };

  return (
    <>
      {showComponent[activeLeftBar] ? showComponent[activeLeftBar]() : null}
    </>
  );
}
