import React from 'react';
import Frames from './Frames';
import Background from './Background';
import StickerComponent from './StickerComponent';
import PhotoLayouts from './PhotoLayouts';
import Pictures from './Pictures';

export default function MiddleSide({ uploadedImages, handleImageUpload, activeLeftBar, bgType, setBgType, selectedBg, setSelectedBg, onSelectSticker }) {
  const showComponent = {
    "Frames": () => <Frames uploadedImages={uploadedImages} handleImageUpload={handleImageUpload} />,
    "Stickers": () => <StickerComponent onSelectSticker={onSelectSticker} />,
    "Backgrounds": () => <Background 
      uploadedImages={uploadedImages} 
      handleImageUpload={handleImageUpload} 
      bgType={bgType} 
      selectedBg={selectedBg} 
      setBgType={setBgType} 
      setSelectedBg={setSelectedBg}
    />,
    "Photo Layouts": () => <PhotoLayouts />,
    "Pictures": () => <Pictures />
  };

  return (
    <>
      {showComponent[activeLeftBar]()}
    </>
  );
}