// Modified PhotoLayouts.jsx (minimal change to pass full option)
import React, { useState } from 'react';

const gridLayouts = [
  {
    category: '1 photo layouts',
    options: [
      { id: 1, preview: [[1]], count: 1 }
    ]
  },
  {
    category: '2 photos layouts',
    options: [
      { id: 2, preview: [[1, 2]], count: 2 },
      // { id: 3, preview: [[1], [2]], count: 2 }
    ]
  },
  {
    category: '3 photos layouts',
    options: [
      { id: 4, preview: [[1, 2], [3]], count: 3 },
      // { id: 5, preview: [[1], [2, 3]], count: 3 }
    ]
  },
  {
    category: '4 photos layouts',
    options: [
      { id: 6, preview: [[1, 2], [3, 4]], count: 4 },
      // { id: 7, preview: [[1], [2, 3, 4]], count: 4, rowHeights: ['50%', '50%'], colWidths: ['50%', '16.67%', '16.67%', '16.67%'] },
      // { id: 8, preview: [[1, 2, 3], [4]], count: 4, rowHeights: ['50%', '50%'] },
      // { id: 9, preview: [[1, 2], [3], [4]], count: 4, rowHeights: ['33%', '33%', '33%'] },
      // { id: 10, preview: [[1], [2, 3], [4]], count: 4, rowHeights: ['33%', '33%', '33%'] },
      // { id: 11, preview: [[1, 2, 3, 4]], count: 4 },
      // { id: 12, preview: [[1], [2], [3], [4]], count: 4 },
      // // New grid layout added here for the exact image shape
      // { id: 13, preview: [[1, 2], [3, 4]], count: 4, rowHeights: ['50%', '50%'], colWidths: ['50%', '50%'] } // Matching 2x2 layout
    ]
  }
];

export default function PhotoLayouts({ onSelectLayout }) {
  const [selectedCategory, setSelectedCategory] = useState('1 photo layouts');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['1 photo layouts']));

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
    setSelectedCategory(category);
  };

  const renderPreview = (preview, rowHeights = [], colWidths = []) => {
    const numRows = preview.length;
    const maxCols = Math.max(...preview.map(row => row.length));
    const gridStyle = {
      display: 'grid',
      gridTemplateRows: rowHeights.length === numRows ? rowHeights.join(' ') : `repeat(${numRows}, 1fr)`,
      gridTemplateColumns: colWidths.length === maxCols ? colWidths.join(' ') : `repeat(${maxCols}, 1fr)`,
      gap: '4px',
      padding: '8px',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      height: '80px',
      width: '100%'
    };

    let cellIndex = 1;
    return (
      <div style={gridStyle}>
        {preview.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              {cellIndex++}
            </div>
          ))
        ))}
      </div>
    );
  };

  const handleLayoutSelect = (option) => {
    if (onSelectLayout) {
      onSelectLayout(option); // Pass full option
    }
  };

  return (
    <div className='w-[300px] bg-white p-6 h-[91vh] sticky top-0 border-l-[1px] border-[#98989833] overflow-y-auto'>
      <h3 className='font-semibold text-[22px] text-[#727273] font-sans text-center'>Photo Layouts</h3>

      <div className='space-y-4 mt-[40px]'>
        {gridLayouts.map((layoutGroup) => (
          <div key={layoutGroup.category}>
            <button
              onClick={() => toggleCategory(layoutGroup.category)}
              className={`w-full text-left text-[12px] font-[600] font-sans px-[24px] py-[12px] flex justify-between items-center rounded-[8px] ${expandedCategories.has(layoutGroup.category)
                  ? 'bg-[#A8C3A0] text-[#ffffff] border-l-4 border-[#A8C3A0]'
                  : 'text-[#727273CC] hover:bg-gray-50'
                }`}
            >
              <span>{layoutGroup.category}</span>
              <span>{expandedCategories.has(layoutGroup.category) ? '▲' : '▼'}</span>
            </button>
            {expandedCategories.has(layoutGroup.category) && (
              <div className='mt-2 ml-2 space-y-2'>
                {layoutGroup.options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleLayoutSelect(option)}
                    className='cursor-pointer hover:bg-gray-50 p-2 rounded border border-gray-200 transition-colors'
                  >
                    <div className='flex items-center gap-2'>
                      {renderPreview(option.preview, option.rowHeights, option.colWidths)}
                    </div>
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