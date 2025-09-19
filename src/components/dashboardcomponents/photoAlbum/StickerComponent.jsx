import { stickerCategories } from '@/data/imagesForPhotoAlbum';
import React, { useState } from 'react';

export default function StickerComponent({ onSelectSticker, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('Happy & Positive');

  const handleStickerSelect = (sticker) => {
    if (onSelectSticker) {
      onSelectSticker(sticker);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className='w-[300px] bg-white p-6 h-[91vh] sticky top-0 border-l-[1px] border-[#98989833] overflow-y-auto'>
      <h3 className='font-semibold text-[22px] text-[#727273] font-sans text-center'>Stickers</h3>
      
      <div className='space-y-4 mt-[40px]'>
        {Object.keys(stickerCategories).map(category => (
          <div key={category}>
            <button
              onClick={() => setSelectedCategory(category)}
              className={`w-full mb-2 text-left text-[12px] font-[600] font-sans px-[24px] py-[12px] flex justify-between items-center rounded-[8px] ${
                selectedCategory === category 
                  ? 'bg-[#A8C3A0] text-[#ffffff] border-l-4 border-[#A8C3A0]' 
                  : 'text-[#727273CC] hover:bg-gray-50'
              }`}
            >
              <span>{category}</span>
              {selectedCategory === category && <span>▼</span>}
            </button>
            {selectedCategory === category && (
              <div className='mt-0 grid grid-cols-2 gap-3 ml-2'>
                {stickerCategories[category].map((sticker, index) => (
                  <div
                    key={index}
                    onClick={() => handleStickerSelect(sticker)}
                    className='cursor-pointer hover:scale-105 transition-transform duration-200'
                  >
                    <span 
                      className='w-16 h-16 flex items-center justify-center text-4xl border border-gray-200 rounded-lg shadow-sm hover:shadow-md bg-white'
                    >
                      {sticker}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}