// Modified MiddleSide.jsx
import React from 'react';
import Frames from './Frames';
import Background from './Background';
import StickerComponent from './StickerComponent';
import PhotoLayouts from './PhotoLayouts'; // Updated to use GridLayoutComponent
import Pictures from './Pictures';

export default function MiddleSide({ uploadedImages, handleImageUpload, activeLeftBar, bgType, setBgType, selectedBg, setSelectedBg, onSelectSticker, onSelectLayout }) {
  const showComponent = {
    "Frames": () => <Pictures uploadedImages={uploadedImages} handleImageUpload={handleImageUpload} />,
    "Stickers": () => <StickerComponent onSelectSticker={onSelectSticker} />,
    "Backgrounds": () => <Background 
      uploadedImages={uploadedImages} 
      handleImageUpload={handleImageUpload} 
      bgType={bgType} 
      selectedBg={selectedBg} 
      setBgType={setBgType} 
      setSelectedBg={setSelectedBg}
    />,
    "Photo Layouts": () => <PhotoLayouts onSelectLayout={onSelectLayout} />, // Changed to onSelectLayout
    "Pictures": () => <Frames uploadedImages={uploadedImages} handleImageUpload={handleImageUpload} />,
  };

  return (
    <>
      {showComponent[activeLeftBar]()}
    </>
  );
}
