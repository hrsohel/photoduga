import React, { useState } from 'react';

export default function TshirtGift() {
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
          src="\t-shirt-2.webp"
          alt="T-shirt Gift"
          className="w-[600px] rounded-lg"
        />
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border-2 border-gray-300 ${
            droppedImage ? '' : 'bg-gray-200 bg-grid-gray-500/50'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {droppedImage && (
            <img
              src={droppedImage}
              alt="Dropped"
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}