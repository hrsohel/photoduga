import React from 'react';

const TextEditingTools = ({ selectedText, onUpdateText }) => {
  if (!selectedText) {
    return null;
  }

  const handleUpdate = (property, value) => {
    onUpdateText({ ...selectedText, [property]: value });
  };

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  return (
    <div className="flex flex-row items-center p-2 space-x-2 bg-white rounded-md shadow-lg h-12 max-w-full">
      <div className="h-full w-40">
        <select
          value={selectedText.fontFamily || 'Arial'}
          onChange={(e) => handleUpdate('fontFamily', e.target.value)}
          className="h-full block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#A8C3A0] focus:border-[#A8C3A0] sm:text-sm rounded-md border-2 border-[#A8C3A0]"
        >
          <option>Arial</option>
          <option>Verdana</option>
          <option>Times New Roman</option>
          <option>Courier New</option>
          <option>Georgia</option>
          <option>Palatino</option>
          <option>Garamond</option>
          <option>Comic Sans MS</option>
          <option>Impact</option>
        </select>
      </div>

      <div className="h-full">
        <select
          value={selectedText.fontSize || 20}
          onChange={(e) => handleUpdate('fontSize', parseInt(e.target.value, 10))}
          className="h-full focus:ring-[#A8C3A0] focus:border-[#A8C3A0] block w-20 shadow-sm sm:text-sm border-gray-300 rounded-md"
        >
          {fontSizes.map(size => <option key={size} value={size}>{size}</option>)}
        </select>
      </div>

      <div className="h-full">
        <input
          type="color"
          value={selectedText.fill || '#000000'}
          onChange={(e) => handleUpdate('fill', e.target.value)}
          className="h-full w-10"
        />
      </div>

      <div className="h-full flex space-x-1">
        <button
          onClick={() => handleUpdate('align', 'left')}
          className={`h-full px-2 py-1 border rounded ${selectedText.align === 'left' ? 'bg-[#A8C3A0] text-white' : 'bg-white text-[#A8C3A0] border-[#A8C3A0]'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4H21V6H3V4ZM3 9H17V11H3V9ZM3 14H21V16H3V14ZM3 19H17V21H3V19Z" fill="currentColor"/>
          </svg>
        </button>
        <button
          onClick={() => handleUpdate('align', 'center')}
          className={`h-full px-2 py-1 border rounded ${selectedText.align === 'center' ? 'bg-[#A8C3A0] text-white' : 'bg-white text-[#A8C3A0] border-[#A8C3A0]'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4H21V6H3V4ZM7 9H17V11H7V9ZM3 14H21V16H3V14ZM7 19H17V21H7V19Z" fill="currentColor"/>
          </svg>
        </button>
        <button
          onClick={() => handleUpdate('align', 'right')}
          className={`h-full px-2 py-1 border rounded ${selectedText.align === 'right' ? 'bg-[#A8C3A0] text-white' : 'bg-white text-[#A8C3A0] border-[#A8C3A0]'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4H21V6H3V4ZM7 9H21V11H7V9ZM3 14H21V16H3V14ZM7 19H21V21H7V19Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div className="h-full">
        <button 
          onClick={() => handleUpdate('textDecoration', selectedText.textDecoration === 'underline' ? 'none' : 'underline')}
          className={`h-full px-3 py-1 border rounded ${selectedText.textDecoration === 'underline' ? 'bg-[#A8C3A0] text-white' : 'bg-white text-[#A8C3A0] border-[#A8C3A0]'}`}>
          U
        </button>
      </div>
    </div>
  );
};

export default TextEditingTools;