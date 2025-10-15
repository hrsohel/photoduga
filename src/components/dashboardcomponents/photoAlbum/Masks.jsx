import React from 'react';

export default function Masks({ maskData }) {
  return (
    <div className="masks-container p-4">
      <h2 className="text-lg font-semibold mb-4">Masks</h2>
      {maskData.map((category, index) => {
        const categoryName = Object.keys(category)[0];
        const images = category[categoryName];
        return (
          <div key={index} className="mb-6">
            <h3 className="text-md font-medium mb-3 capitalize">{categoryName}</h3>
            <div className="grid grid-cols-3 gap-4">
              {images.map((imagePath, imgIndex) => (
                <div key={imgIndex} className="mask-item border rounded-lg overflow-hidden shadow-sm flex justify-center items-center p-2 cursor-move" draggable onDragStart={(e) => e.dataTransfer.setData('maskUrl', imagePath)}>
                  <img src={imagePath} alt={`${categoryName} mask ${imgIndex + 1}`} className="w-12 h-12 object-cover" />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}