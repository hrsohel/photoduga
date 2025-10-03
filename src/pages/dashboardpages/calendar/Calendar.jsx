
import React, { useState, useEffect } from 'react';
import CalendarLeftSide from '@/components/dashboardcomponents/calendar/CalendarLeftSide';
import CalendarMiddleSide from '@/components/dashboardcomponents/calendar/CalendarMiddleSide';
import PhotoAlbumToolbar from '@/components/dashboardcomponents/photoAlbum/PhotoAlbumToolbar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { calendarPages as initialPages } from '@/data/calendar/data';
import { openDB } from 'idb';
import TextEditingTools from '@/components/dashboardcomponents/photoAlbum/TextEditingTools';
import LayoutSelector from '@/components/dashboardcomponents/calendar/LayoutSelector';
import CalendarTools from '@/components/dashboardcomponents/calendar/CalendarTools';

const dbPromise = openDB('calendar-db', 1, {
  upgrade(db) {
    db.createObjectStore('calendar-pages');
  },
});

const Calendar = () => {
  const [pages, setPages] = useState(initialPages);
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const [activeLeftBar, setActiveLeftBar] = useState("Pictures");
  const [showTextTools, setShowTextTools] = useState(false);
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [bgType, setBgType] = useState('plain');
  const [selectedBg, setSelectedBg] = useState('#FFFFFF');

  useEffect(() => {
    const loadState = async () => {
      const db = await dbPromise;
      const savedPages = await db.get('calendar-pages', 'pages');
      if (savedPages) {
        setPages(savedPages);
        setCurrentPage(savedPages[0]);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      const db = await dbPromise;
      await db.put('calendar-pages', pages, 'pages');
    };
    saveState();
  }, [pages]);

  const handleTextSelect = () => {
    setShowTextTools(!showTextTools);
    setShowLayoutSelector(false);
  };

  const handleLayoutSelect = () => {
    setShowLayoutSelector(!showLayoutSelector);
    setShowTextTools(false);
  };

  const handleLayoutChange = (layout) => {
    const newPages = pages.map(p => {
      if (p.id === currentPage.id) {
        return { ...p, layout: { ...p.layout, ...layout } };
      }
      return p;
    });
    setPages(newPages);
    setCurrentPage(newPages.find(p => p.id === currentPage.id));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImagesPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(newImagesPromises).then(newImages => {
      setUploadedImages([...uploadedImages, ...newImages]);
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <PhotoAlbumToolbar />
        <div className="flex flex-1 overflow-hidden">
          <CalendarLeftSide 
            onSelect={(tool) => setActiveLeftBar(tool)} 
            onTextSelect={handleTextSelect}
            onLayoutSelect={handleLayoutSelect}
          />
          <div className="w-48 bg-white p-4 overflow-y-auto">
            <CalendarTools 
              uploadedImages={uploadedImages}
              handleImageUpload={handleImageUpload}
              activeLeftBar={activeLeftBar}
              bgType={bgType}
              setBgType={setBgType}
              selectedBg={selectedBg}
              setSelectedBg={setSelectedBg}
              onSelectLayout={handleLayoutChange}
            />
            {showLayoutSelector && <LayoutSelector onSelect={handleLayoutChange} />}
          </div>
          <CalendarMiddleSide
            pages={pages}
            setPages={setPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default Calendar;
