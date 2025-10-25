import React, { useState } from 'react';

export default function CupGift() {
  const [droppedImage, setDroppedImage] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData('imageUrl');
    if (imageUrl) {
      setDroppedImage(imageUrl);
    }
  };

  return (
    <div className="flex justify-center items-center h-[90vh] bg-gray-200">
      <div className="relative">
        <img
          src="\pngtree-coffee-cup-and-shadow-png-image_16858250.webp"
          alt="3D Shadow Cup"
          className="w-[800px] rounded-lg"
        />
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-[60%] -translate-y-[40%] w-100 h-60 border-2 border-white ${
            droppedImage ? '' : 'bg-gray-500 opacity-50'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {droppedImage && (
            <img
              src={droppedImage}
              alt="Dropped"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}