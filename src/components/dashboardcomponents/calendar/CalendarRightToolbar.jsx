import React, { useState } from 'react';

const CalendarRightToolbar = ({ onLayoutChange }) => {
  const onAddCanvasText = () => {
    // TODO: Implement text adding functionality
    console.log('Add text');
  };

  const handlePhotoLayoutClick = () => {
    // This button will not display grid layouts
    console.log('Photo Layout button clicked');
  };

  return (
    <div className="w-[100px] h-full p-4 space-y-4 bg-gray-100">
      <div onClick={onAddCanvasText} className="border-[1px] p-[10px] rounded-[2px] border-[#E0E0E0] cursor-pointer w-[40px]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.0002 14.0007H6.00016M8.00016 2V14M8.00016 2C8.92483 2 9.9135 2.02 11.0588 2.11733C11.4588 2.15867 11.6588 2.17933 11.8362 2.252C12.0214 2.33032 12.187 2.44855 12.3212 2.59824C12.4555 2.74793 12.555 2.92541 12.6128 3.118C12.6668 3.30267 12.6668 3.51333 12.6668 3.93467M8.00016 2C7.0755 2 5.88683 2.02 4.9415 2.11733C4.5415 2.15867 4.3415 2.17933 4.16416 2.252C3.97885 2.33024 3.81309 2.44843 3.67872 2.59813C3.54435 2.74783 3.44468 2.92534 3.38683 3.118C3.3335 3.30267 3.3335 3.51333 3.3335 3.93467" stroke="#A8C3A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="font-semibold text-[8px] font-sans text-[#727273]">Text</p>
      </div>
      <div onClick={handlePhotoLayoutClick} className="border-[1px] p-[10px] rounded-[2px] border-[#E0E0E0] cursor-pointer w-[40px] relative">
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center justify-center flex-col">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.6001 1.59961H5.6001V10.3996H1.6001V1.59961ZM6.4001 1.59961H10.4001V5.59961H6.4001V1.59961ZM11.2001 1.59961H14.4001V14.3996H11.2001V1.59961ZM6.4001 6.39961H10.4001V10.3996H6.4001V6.39961ZM1.6001 11.1996H10.4001V14.3996H1.6001V11.1996Z" fill="#A8C3A0" />
            </svg>
            <p className="font-semibold text-[8px] font-sans text-[#727273] text-center">Photo Layout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarRightToolbar;
