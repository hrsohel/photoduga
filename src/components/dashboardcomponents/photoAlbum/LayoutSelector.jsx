// LayoutSelector.js
import React from "react";

const LayoutSelector = ({ onLayoutSelect }) => {
  const layouts = [
    { name: "1x1 Left, 1x1 Right", gridCount: { left: 1, right: 1 }, layoutModeLeft: 0, layoutModeRight: 0 },
    { name: "2x2 Left, 2x2 Right", gridCount: { left: 2, right: 2 }, layoutModeLeft: 2, layoutModeRight: 2 },
    { name: "3 Vertical Left, 3 Vertical Right", gridCount: { left: 3, right: 3 }, layoutModeLeft: 2, layoutModeRight: 2 },
    { name: "1x2 Left, 1x2 Right", gridCount: { left: 2, right: 2 }, layoutModeLeft: 0, layoutModeRight: 0 },
    { name: "3 Horizontal Left, 3 Horizontal Right", gridCount: { left: 3, right: 3 }, layoutModeLeft: 3, layoutModeRight: 3 },
  ];

  return (
    <div className="w-[200px] h-full p-4 bg-gray-100 border-r-2">
      <h3 className="text-lg font-semibold mb-4">Select Layout</h3>
      {layouts.map((layout, index) => (
        <div
          key={index}
          className="p-2 mb-2 bg-white border rounded cursor-pointer hover:bg-gray-200"
          onClick={() => onLayoutSelect(layout)}
        >
          {layout.name}
        </div>
      ))}
    </div>
  );
};

export default LayoutSelector;