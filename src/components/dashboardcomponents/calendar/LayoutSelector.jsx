
import React, { useState } from 'react';

const gridLayouts = [
  {
    category: '1 photo layouts',
    options: [
      {
        name: "1x1 Left, 1x1 Right",
        gridCount: { left: 1, right: 1 },
        layoutModeLeft: 0,
        layoutModeRight: 0,
        preview: [[1]],
        rowHeights: [],
        colWidths: []
      }
    ]
  },
  {
    category: '2 photos layouts',
    options: [
      {
        name: "2x2 Left, 2x2 Right",
        gridCount: { left: 2, right: 2 },
        layoutModeLeft: 2,
        layoutModeRight: 2,
        preview: [[1, 2], [3, 4]],
        rowHeights: ['50%', '50%'],
        colWidths: ['50%', '50%']
      },
      {
        name: "1x2 Left, 1x2 Right",
        gridCount: { left: 2, right: 2 },
        layoutModeLeft: 0,
        layoutModeRight: 0,
        preview: [[1], [2]],
        rowHeights: ['50%', '50%'],
        colWidths: []
      }
    ]
  },
  {
    category: '3 photos layouts',
    options: [
      {
        name: "3 Vertical Left, 3 Vertical Right",
        gridCount: { left: 3, right: 3 },
        layoutModeLeft: 2,
        layoutModeRight: 2,
        preview: [[1], [2], [3]],
        rowHeights: ['33%', '33%', '33%'],
        colWidths: []
      },
      {
        name: "3 Horizontal Left, 3 Horizontal Right",
        gridCount: { left: 3, right: 3 },
        layoutModeLeft: 3,
        layoutModeRight: 3,
        preview: [[1, 2, 3]],
        rowHeights: [],
        colWidths: ['33%', '33%', '33%']
      }
    ]
  },
];

const renderPreview = (preview, rowHeights = [], colWidths = []) => {
  const numRows = preview.length;
  const maxCols = Math.max(...preview.map(row => row.length));
  const gridStyle = {
    display: 'grid',
    gridTemplateRows: rowHeights.length === numRows ? rowHeights.join(' ') : `repeat(${numRows}, 1fr)`,
        gridTemplateColumns: colWidths.length === maxCols ? colWidths.join(' ') : `repeat(${maxCols}, 1fr)`,    gap: '4px',
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

const LayoutSelector = ({ onSelect }) => {
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set(['1 photo layouts']));

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleLayoutClick = (layout) => {
    setSelectedLayoutId(layout.name);
    onSelect(layout);
  };

  return (
    <div className='w-[300px] bg-white p-6 h-[91vh] sticky top-0 border-l-[1px] border-[#98989833] overflow-y-auto'>
      <h3 className="font-semibold text-[22px] text-[#727273] font-sans text-center">Page Layouts</h3>
      
      <div className='space-y-4 mt-[40px]'>
        {gridLayouts.map((layoutGroup) => (
          <div key={layoutGroup.category}>
            <button
              onClick={() => toggleCategory(layoutGroup.category)}
              className={`w-full mb-2 text-left text-[12px] font-[600] font-sans px-[24px] py-[12px] flex justify-between items-center rounded-[8px] ${
                expandedCategories.has(layoutGroup.category)
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
                    key={option.name}
                    onClick={() => handleLayoutClick(option)}
                    className={`cursor-pointer p-2 rounded-md border ${selectedLayoutId === option.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                                <div className='flex items-center gap-2'>
                                  {renderPreview(option.preview, option.rowHeights, option.colWidths)}
                                </div>                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
