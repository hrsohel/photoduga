import React, { useState } from 'react';

const PageNavigation = ({ currentPage, onPageChange }) => {
  const [zoomLevel, setZoomLevel] = useState('100%');

  const handlePreviousPage = () => {
    if (currentPage > 3) {
      onPageChange(currentPage - 2);
    }
  };

  const handleNextPage = () => {
    if (currentPage < 9) {
      onPageChange(currentPage + 2);
    }
  };

  const handleZoomChange = (level) => {
    setZoomLevel(level);
    // Implement zoom functionality if needed
    console.log("Zoom changed to:", level);
  };

  const handleDuplicatePage = () => {
    // Implement duplicate page functionality
    console.log("Duplicate page:", currentPage);
  };

  const handleRemovePage = () => {
    // Implement remove page functionality
    console.log("Remove page:", currentPage);
  };

  const handleAddBlankPage = () => {
    // Implement add blank page functionality
    console.log("Add blank page");
  };

  return (
    <div className="w-full bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">One side</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">All Pages</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePreviousPage}
            disabled={currentPage <= 3}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous page
          </button>
          <span className="text-xs font-medium text-gray-700">Page {currentPage} - {currentPage + 1}</span>
          <button 
            onClick={handleNextPage}
            disabled={currentPage >= 9}
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
            onClick={handleAddBlankPage}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            Blank page
          </button>
          
          <button 
            onClick={handleDuplicatePage}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            Duplicate
          </button>
          
          <button 
            onClick={handleRemovePage}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Horizontal scrollable page thumbnails */}
      <div 
        className="flex space-x-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f1f5f9' }}
      >
        {/* Covers */}
        <div 
          className={`flex-shrink-0 w-16 h-20 bg-gray-100 border rounded flex items-center justify-center cursor-pointer ${
            currentPage === 1 ? 'border-2 border-blue-500' : 'border-gray-300'
          }`}
          onClick={() => onPageChange(1)}
        >
          <span className="text-xs text-gray-600">Page 1-2</span>
        </div>
        
        {/* Page thumbnails */}
        {[3, 5, 7, 9].map((page) => (
          <div 
            key={page}
            className={`flex-shrink-0 w-16 h-20 border rounded flex items-center justify-center cursor-pointer ${
              currentPage === page ? 'border-2 border-blue-500' : 'border-gray-300'
            }`}
            onClick={() => onPageChange(page)}
          >
            <span className="text-xs text-gray-600">Page {page}-{page+1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageNavigation;