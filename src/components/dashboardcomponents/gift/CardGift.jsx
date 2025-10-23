import React, { useState } from 'react';

const CardGift = () => {
  const [image, setImage] = useState(null);

  const cards = [
    { resolution: '255.37 x 384.19' }, // BOTTOM card with grid
    { suit: '♠', color: 'text-black' },
    { suit: '♥', color: 'text-red-600' },
    { suit: '♦', color: 'text-red-600' },
    { suit: '♣', color: 'text-black' }
  ];

  const isBottomCard = (index) => index === 0;

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData('imageUrl');
    if (imageUrl) {
      setImage(imageUrl);
    }
  };

  return (
    <div className="flex items-center justify-center h-[90vh] bg-gray-100">
      <div className="relative flex items-center">
        {cards.map((card, index) => (
          <div
            key={index}
            className="absolute w-72 h-96 bg-white border-4 border-blue-300 rounded-lg shadow-lg flex items-center justify-center transition-transform duration-300 hover:z-50 hover:scale-105"
            style={{
              transform: `rotate(${index * 5 - 10}deg) translateX(${index * 35 - 70}px)`,
              zIndex: cards.length - index
            }}
          >
            {/* BOTTOM CARD: Grid + Drag & Drop */}
            {isBottomCard(index) ? (
              <div
                className="relative w-full h-full flex items-center justify-center p-4"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div
                  className="grid grid-cols-2 grid-rows-4 gap-1 w-full h-full max-w-[240px] max-h-[360px]"
                  style={{
                    border: '2px dashed #9CA3AF',
                    borderRadius: '8px',
                    backgroundImage: image ? `url(${image})` : `
                      linear-gradient(to right, rgba(156, 163, 175, 0.3) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(156, 163, 175, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: image ? 'cover' : '60px 90px',
                    backgroundPosition: 'center',
                  }}
                >
                  {!image && (
                    <div className="col-span-2 row-span-4 flex items-center justify-center p-4">
                      <p className="text-gray-600 text-center text-sm font-medium">
                        Drag and drop an image here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : card.suit ? (
              /* ACE CARDS */
              <>
                <span className={`absolute top-4 left-4 text-5xl ${card.color}`}>{card.suit}</span>
                <span className={`absolute top-4 right-4 text-5xl ${card.color}`}>A</span>
                <span className={`absolute bottom-6 right-6 text-5xl ${card.color}`}>{card.suit}</span>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGift;
