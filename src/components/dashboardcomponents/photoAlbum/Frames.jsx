import React, { useState } from 'react'

export default function Frames({ uploadedImages, handleImageUpload }) {
  const [ackMessage, setAckMessage] = useState('');
  const [isDropping, setIsDropping] = useState(false);

  const handleDragStart = (e, imageUrl) => {
    e.dataTransfer.setData('imageUrl', imageUrl);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default to allow drop
    setIsDropping(true); // Indicate drag-over state
  };

  const handleDragLeave = () => {
    setIsDropping(false); // Reset drag-over state
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDropping(false); // Reset drag-over state
    const files = Array.from(e.dataTransfer.files);
    // Filter for image files only
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      // Pass the files to the handleImageUpload function
      handleImageUpload({ target: { files: imageFiles } });
      // Show acknowledgment message
      setAckMessage(`${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} uploaded successfully!`);
      // Clear message after 3 seconds
      setTimeout(() => setAckMessage(''), 3000);
    } else {
      // Show error message if no valid images
      setAckMessage('No valid images dropped.');
      setTimeout(() => setAckMessage(''), 3000);
    }
  };

  return (
    <div className='w-[300px] bg-white p-6 h-[91vh] sticky top-0 border-l-[1px] border-[#98989833]'>
      <div>
        <p className='font-semibold text-[12px] text-[#727273CC] font-sans text-center'>Select a source for</p>
        <p className='font-bold text-[18px] text-[#A8C3A0] font-sans mt-[6px] text-center'>Your pictures</p>
      </div>
      <div className='mt-[40px]'>
        <div className='border-[1px] border-[#E0E0E0] rounded-[8px] flex items-center justify-center p-4'>
          <div>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 3H5C4.17158 3 3.5 3.67158 3.5 4.5V15.5C3.5 16.3285 4.17158 17 5 17H20C20.8285 17 21.5 16.3285 21.5 15.5V11.5" stroke="#727273" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12.5 17V21" stroke="#727273" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15.5 6H21.5" stroke="#727273" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M18.5 3V9" stroke="#727273" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M7.5 21H17.5" stroke="#727273" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <input
            type="file"
            id='uploadImage'
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className='hidden'
          />
          <label htmlFor='uploadImage' className='text-[12px] font-[600] font-sans text-[#727273] cursor-pointer'>Computer</label>
        </div>
      </div>
      <div
        className={`mt-[40px] p-4 flex items-center justify-center flex-col border-[2px] border-dashed rounded-[8px] ${
          isDropping ? 'border-green-500 bg-green-50' : 'border-[#727273]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className='font-[600] text-[12px] text-[#727273CC] font-sans'>Or</p>
        <p className='text-[#FA7579] text-[18px] font-[700] font-sans'>Drag here</p>
        {ackMessage && (
          <p className='mt-2 text-[12px] font-[600] font-sans text-green-600'>{ackMessage}</p>
        )}
      </div>
      <div className="mt-[40px] space-y-2 h-96 overflow-y-auto flex items-stretch justify-center gap-2 flex-wrap border-b-[2px] border-[#777]">
        {uploadedImages.map((src, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, src)}
            className="cursor-move"
          >
            <img
              src={src}
              alt={`Uploaded ${index + 1}`}
              className="w-16 h-16 object-cover border rounded"
            />
          </div>
        ))}
      </div>
    </div>
  )
}