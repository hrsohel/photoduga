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
      "shapes": [
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iYmxhY2siLz48L3N2Zz4=",
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iYmxhY2siLz48L3N2Zz4=",
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cG9seWdvbiBwb2ludHM9IjUwLDAgNjEuOCwzOC4yIDEwMCwzOC4yIDY5LjEsNjEuOCA3OS40LDEwMCA1MCw3Ni40IDIwLjYsMTAwIDMwLjksNjEuOCAwLDM4LjIgMzguMiwzOC4yIiBmaWxsPSJibGFjayIvPjwvc3ZnPg==",
        "/masks/mask-image.png"
      ]
    }
  ];

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
    "Masks": () => <Masks maskData={maskData} />,
  };

  return (
    <>
      {showComponent[activeLeftBar]()}
    </>
  );
}
