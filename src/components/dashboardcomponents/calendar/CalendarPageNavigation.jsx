import React from 'react';
import CalendarPageThumbnail from './CalendarPageThumbnail';

const CalendarPageNavigation = ({ currentMonthIndex, onMonthChange, calendarMonths }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreviousMonth = () => {
    if (currentMonthIndex > 0) {
      onMonthChange(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex < months.length - 1) {
      onMonthChange(currentMonthIndex + 1);
    }
  };

  return (
    <div className="w-full bg-white border-t border-gray-200 p-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousMonth}
            disabled={currentMonthIndex <= 0}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Month
          </button>
          <span className="text-xs font-medium text-gray-700">{months[currentMonthIndex]}</span>
          <button
            onClick={handleNextMonth}
            disabled={currentMonthIndex >= months.length - 1}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Month
          </button>
        </div>
      </div>

      <div
        className="flex space-x-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f1f5f9' }}
      >
        {months.map((month, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => onMonthChange(index)}
          >
            <CalendarPageThumbnail monthName={month} isSelected={currentMonthIndex === index} monthData={calendarMonths[index]} monthIndex={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPageNavigation;