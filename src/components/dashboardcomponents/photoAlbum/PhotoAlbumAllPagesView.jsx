import React from 'react';
import PageThumbnail from './PageThumbnail';

const PhotoAlbumAllPagesView = ({ pages }) => {
  return (
    <div className="p-4 w-full overflow-y-auto">
      <div className="grid grid-cols-4 gap-4"> {/* 4 pages per row */}
        {pages.map((page, index) => (
          <div key={index} className="border p-2 rounded flex flex-col items-center justify-center">
            <h3 className="font-bold mb-2 text-center">Page {index + 1}</h3>
            <PageThumbnail page={page} thumbWidth={200} thumbHeight={150} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoAlbumAllPagesView;
