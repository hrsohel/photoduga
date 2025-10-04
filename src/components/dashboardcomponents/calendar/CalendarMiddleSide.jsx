
import React from 'react';
import CalendarPageNavigation from './CalendarPageNavigation';
import CalendarRightSide from './CalendarRightSide';

const CalendarMiddleSide = ({ pages, setPages, currentPage, setCurrentPage }) => {
  return (
    <div className="w-full flex flex-col bg-gray-100 p-4">
      {/* <CalendarPageNavigation
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      /> */}
      <div className="flex-1 flex items-center justify-center">
        <CalendarRightSide
          currentPage={currentPage}
          pages={pages}
          setPages={setPages}
        />
      </div>
    </div>
  );
};

export default CalendarMiddleSide;
