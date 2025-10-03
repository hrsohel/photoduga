
import React from 'react';
import PageThumbnail from '@/components/dashboardcomponents/photoAlbum/PageThumbnail';

const CalendarPageNavigation = ({ pages, currentPage, setCurrentPage }) => {
  return (
    <div className="flex items-center justify-center p-2 bg-white rounded-lg shadow-md mb-4">
      <div className="flex space-x-2">
        {pages.map((page) => (
          <PageThumbnail
            key={page.id}
            page={page}
            onClick={() => setCurrentPage(page)}
            isActive={currentPage.id === page.id}
            isCalendar={true}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarPageNavigation;
