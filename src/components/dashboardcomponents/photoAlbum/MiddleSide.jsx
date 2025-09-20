// Modified MiddleSide.jsx
import React from 'react';
import Frames from './Frames';
import Background from './Background';
import StickerComponent from './StickerComponent';
import PhotoLayouts from './PhotoLayouts'; // Updated to use GridLayoutComponent
import Pictures from './Pictures';
// import TextComponent from './TextComponent';

export default function MiddleSide({ uploadedImages, handleImageUpload, activeLeftBar, bgType, setBgType, selectedBg, setSelectedBg, onSelectSticker, onSelectText, onSelectLayout }) {
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
    "Photo Layouts": () => <PhotoLayouts onSelectLayout={onSelectLayout} />, // Changed to onSelectLayout
    "Pictures": () => <Pictures />,
    // "Text": () => <TextComponent onSelectText={onSelectText} />,
  };

  return (
    <>
      {showComponent[activeLeftBar]()}
    </>
  );
}