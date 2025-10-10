import React from 'react';
import CalendarPageThumbnail from './CalendarPageThumbnail';

const AllPagesView = ({ calendarMonths }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="p-4 w-full overflow-y-auto">
      <div className="grid grid-cols-6 gap-4">
        {calendarMonths.map((monthData, index) => (
          <div key={index} className="border p-2 rounded">
            <h3 className="font-bold mb-2 text-center">{months[index]}</h3>
            <CalendarPageThumbnail monthName={months[index]} isSelected={false} monthData={monthData} monthIndex={index} thumbWidth={144} thumbHeight={270} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPagesView;
