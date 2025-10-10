// Modified MiddleSide.jsx
import React from 'react';
import Frames from './Frames';
import Background from './Background';
import StickerComponent from './StickerComponent';
import PhotoLayouts from './PhotoLayouts'; // Updated to use GridLayoutComponent
import Pictures from './Pictures';
import Masks from './Masks';

export default function MiddleSide({ uploadedImages, handleImageUpload, activeLeftBar, bgType, setBgType, selectedBg, setSelectedBg, onSelectSticker, onSelectLayout }) {
  const maskData = [
    {
      "rectangle": ["/masks/rect-1.png", "/masks/rect-2.jpg", "/masks/rect-3.jpg"]
    },
    {
      "shape": ["/masks/shape-1.png", "/masks/shape-2.jpg", "/masks/shape-3.png", "/masks/circle-1.png"]
    },
    {
      "text": ["/masks/text-1.png", "/masks/text-2.png", "/masks/text-3.png"]
    }
  ];

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
    "Photo Layouts": () => <PhotoLayouts onSelectLayout={onSelectLayout} />,
    "Pictures": () => <Frames uploadedImages={uploadedImages} handleImageUpload={handleImageUpload} />,
    "Masks": () => <Masks maskData={maskData} />,
  };

  return (
    <>
      {showComponent[activeLeftBar]()}
    </>
  );
}
