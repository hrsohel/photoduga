import React from 'react';
import CalendarPageNavigation from './CalendarPageNavigation';
import CalendarRightSide from './CalendarRightSide';
import CalendarRightToolbar from './CalendarRightToolbar';

const CalendarMiddleSide = ({ pages, setPages, currentPage, setCurrentPage, selectedBg, bgType, selectedSticker, setSelectedSticker, onAddCanvasText, isAddingText, setIsAddingText, layout, onAddGrid, onRemoveGrid, onShuffleGrids, calendarContainerRef }) => {
  return (
    <div className="w-full flex flex-col bg-gray-100 p-4">
      {/* <CalendarPageNavigation
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      /> */}
      <div className="flex-1 flex items-start justify-center gap-1">
        <CalendarRightToolbar 
          onAddCanvasText={onAddCanvasText}
          onAddGrid={onAddGrid}
          onRemoveGrid={onRemoveGrid}
          onShuffleGrids={onShuffleGrids}
        />
          <CalendarRightSide
            currentPage={currentPage}
            pages={pages}
            setPages={setPages}
            selectedBg={selectedBg}
            bgType={bgType}
            selectedSticker={selectedSticker}
            setSelectedSticker={setSelectedSticker}
            isAddingText={isAddingText}
            setIsAddingText={setIsAddingText}
            gridLayout={layout}
            onAddGrid={onAddGrid}
            onRemoveGrid={onRemoveGrid}
            onShuffleGrids={onShuffleGrids}
            calendarContainerRef={calendarContainerRef}
          />      </div>
    </div>
  );
};

export default CalendarMiddleSide;