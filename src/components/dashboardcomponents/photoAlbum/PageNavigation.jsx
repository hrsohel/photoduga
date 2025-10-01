import React, { useState, useEffect } from 'react';
import PageThumbnail from './PageThumbnail';


const PageNavigation = ({ currentPage, totalPages, pages, onPageChange, onAddPage, onDuplicatePage, onRemovePage }) => {
  const [zoomLevel, setZoomLevel] = useState('100%');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentPage < totalPages - 1) {
          onPageChange(currentPage + 1);
        } else {
          onPageChange(0); // Loop back to the first page
        }
      }, 3000); // Change page every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentPage, totalPages, onPageChange]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handleZoomChange = (level) => {
    setZoomLevel(level);

  };

  return (
    <div className="w-full bg-white border-t border-gray-200 p-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-semibold text-gray-700">One side</h3>
          <button onClick={togglePlay} className="focus:outline-none">
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="6" width="4" height="12" fill="#A8C3A0"/>
                <rect x="14" y="6" width="4" height="12" fill="#A8C3A0"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="#A8C3A0"/>
              </svg>
            )}
          </button>
          <button 
            onClick={handlePreviousPage}
            disabled={currentPage <= 0}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous page
          </button>
          <span className="text-xs font-medium text-gray-700">Page {currentPage * 2 + 1} - {currentPage * 2 + 2}</span>
          <button 
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next page
          </button>

        </div>

        <div className="flex items-center space-x-3">
          <select 
            className="text-xs border border-gray-300 rounded px-2 py-1"
            value={zoomLevel}
            onChange={(e) => handleZoomChange(e.target.value)}
          >
            <option value="50%">50%</option>
            <option value="75%">75%</option>
            <option value="100%">100%</option>
            <option value="125%">125%</option>
            <option value="150%">150%</option>
          </select>
          
          <button 
            onClick={onAddPage}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            Blank page
          </button>
          
          <button 
            onClick={onDuplicatePage}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            Duplicate
          </button>
          
          <button 
            onClick={onRemovePage}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      </div>

      <div 
        className="flex space-x-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f1f5f9' }}
      >
        {pages && pages.map((page, pageIndex) => (
          <div 
            key={pageIndex}
            className={`flex-shrink-0 w-24 h-16 border rounded flex items-center justify-center cursor-pointer ${
              currentPage === pageIndex ? 'border-2 border-blue-500' : 'border-gray-300'
            }`}
            onClick={() => onPageChange(pageIndex)}
          >
            <PageThumbnail page={page} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageNavigation;