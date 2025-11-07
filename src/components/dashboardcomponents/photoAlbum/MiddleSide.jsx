// Modified MiddleSide.jsx
import React from 'react';
import Frames from './Frames';
import Background from './Background';
import StickerComponent from './StickerComponent';
import PhotoLayouts from './PhotoLayouts'; // Updated to use GridLayoutComponent
import Pictures from './Pictures';
import Masks from './Masks';
import { maskCategories } from '@/data/photoAlbum/masks.js';

export default function MiddleSide({ uploadedImages, handleImageUpload, activeLeftBar, bgType, setBgType, selectedBg, setSelectedBg, onSelectSticker, onSelectLayout }) {
  const showComponent = {
    "Frames": () => <Frames />,
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
    "Pictures": () => <Pictures uploadedImages={uploadedImages} handleImageUpload={handleImageUpload} />,
    "Masks": () => <Masks maskData={maskCategories} />,
  };

  return (
    <>
      {showComponent[activeLeftBar]()}
    </>
  );
}
