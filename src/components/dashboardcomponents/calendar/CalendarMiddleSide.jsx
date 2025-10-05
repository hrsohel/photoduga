import React from 'react';
import CalendarPageNavigation from './CalendarPageNavigation';
import CalendarRightSide from './CalendarRightSide';
import CalendarRightToolbar from './CalendarRightToolbar';

const CalendarMiddleSide = ({ pages, setPages, currentPage, setCurrentPage, selectedBg, bgType, selectedSticker, setSelectedSticker }) => {
  return (
    <div className="w-full flex flex-col bg-gray-100 p-4">
      {/* <CalendarPageNavigation
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      /> */}
      <div className="flex-1 flex items-start justify-center gap-1">
        <CalendarRightToolbar />
        <CalendarRightSide
          currentPage={currentPage}
          pages={pages}
          setPages={setPages}
          selectedBg={selectedBg}
          bgType={bgType}
          selectedSticker={selectedSticker}
          setSelectedSticker={setSelectedSticker}
        />
      </div>
    </div>
  );
};

export default CalendarMiddleSide;