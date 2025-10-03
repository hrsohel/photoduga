import React from 'react';

const frames = [
  '/path/to/frame1.png',
  '/path/to/frame2.png',
  '/path/to/frame3.png',
  '/path/to/frame4.png',
];

export default function CalendarFrames() {
  const handleDragStart = (e, frameUrl) => {
    e.dataTransfer.setData('frameUrl', frameUrl);
  };

  return (
    <div className='w-[300px] bg-white p-6 h-[91vh] sticky top-0 border-l-[1px] border-[#98989833]'>
      <div>
        <p className='font-bold text-[18px] text-[#A8C3A0] font-sans mt-[6px] text-center'>Frames</p>
      </div>
      <div className="mt-[40px] w-full space-y-2 h-96 overflow-y-auto flex items-stretch justify-center gap-2 flex-wrap border-b-[2px] border-[#777]">
        {frames.map((src, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, src)}
            className="cursor-move"
          >
            <img
              src={src}
              alt={`Frame ${index + 1}`}
              className="w-16 h-16 object-cover border rounded"
            />
          </div>
        ))}
      </div>
    </div>
  )
}