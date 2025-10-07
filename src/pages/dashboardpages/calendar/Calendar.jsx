import React, { useState, useEffect, useRef } from 'react';
import CalendarLeftSide from '@/components/dashboardcomponents/calendar/CalendarLeftSide';
import CalendarMiddleSide from '@/components/dashboardcomponents/calendar/CalendarMiddleSide';
import PhotoAlbumToolbar from '@/components/dashboardcomponents/photoAlbum/PhotoAlbumToolbar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { calendarPages as initialPages } from '@/data/calendar/data';
import { openDB } from 'idb';
import { nanoid } from 'nanoid';
import TextEditingTools from '@/components/dashboardcomponents/photoAlbum/TextEditingTools';
import LayoutSelector from '@/components/dashboardcomponents/calendar/LayoutSelector';
import CalendarTools from '@/components/dashboardcomponents/calendar/CalendarTools';
import AlbunMenuBar from '@/components/dashboardcomponents/photoAlbum/AlbunMenuBar';
import PhotoLayoutModal from '@/components/dashboardcomponents/calendar/PhotoLayoutModal';
import html2canvas from 'html2canvas';

const dbPromise = openDB('calendar-db', 1, {
  upgrade(db) {
    db.createObjectStore('calendar-pages');
  },
});

const generateGridsFromLayoutData = (layoutData, canvasWidth, canvasHeight) => {
  if (!layoutData) {
    console.log('generateGridsFromLayoutData: layoutData is falsy, returning []');
    return [];
  }

  if (layoutData.type === 'month' && layoutData.grid) {
    const numRows = layoutData.rows || 1;
    const numCols = layoutData.cols || 1;

    let cellWidth = canvasWidth / numCols;
    let cellHeight = canvasHeight / numRows;

    // Cap cell size at 200x200
    if (cellWidth > 200) cellWidth = 200;
    if (cellHeight > 200) cellHeight = 200;

    const grids = [];
    let idCounter = 0;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        grids.push({
          id: `grid-${idCounter++}`,
          x: col * cellWidth,
          y: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
        });
      }
    }
    console.log('generateGridsFromLayoutData: month type, returning grids:', grids);
    return grids;
  } else if (layoutData.type === 'cover') {
    console.log('generateGridsFromLayoutData: cover type, returning default grid');
    let coverWidth = canvasWidth;
    let coverHeight = canvasHeight;
    if (coverWidth > 200) coverWidth = 200;
    if (coverHeight > 200) coverHeight = 200;
    return [{ x: 0, y: 0, width: coverWidth, height: coverHeight, id: 'grid-0' }];
  }
  console.log('generateGridsFromLayoutData: no matching type, returning []');
  return []; 
};

const transformInitialPages = (pages) => {
  const canvasWidth = 400; 
  const canvasHeight = 700; 

  return pages.map(page => {
    if (page.layout) {
      const transformedLayout = generateGridsFromLayoutData(page.layout, canvasWidth, canvasHeight);
      console.log(`transformInitialPages: page ${page.id}, transformedLayout:`, transformedLayout);
      return { ...page, layout: transformedLayout };
    }
    console.log(`transformInitialPages: page ${page.id}, layout is falsy, returning empty array`);
    return { ...page, layout: [] }; 
  });
};

const Calendar = () => {
  const calendarContainerRef = useRef(null);
  const [pages, setPages] = useState(transformInitialPages(initialPages));
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const [activeLeftBar, setActiveLeftBar] = useState("Pictures");
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [bgType, setBgType] = useState('plain');
  const [selectedBg, setSelectedBg] = useState('#FFFFFF');
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [isAddingText, setIsAddingText] = useState(false);
  const [showPhotoLayoutModal, setShowPhotoLayoutModal] = useState(false);

  const handleAddText = () => {
    setIsAddingText(true);
  };

  const onTogglePhotoLayoutModal = () => {
    setShowPhotoLayoutModal(prev => !prev);
  };

  const handleAddGrid = () => {
    const canvasWidth = 400; 
    const newGridWidth = 200;
    const newGridHeight = 200;
    const currentLayout = currentPage.layout || [];

    const numGridsInRow = Math.floor(canvasWidth / newGridWidth);
    const newGridIndex = currentLayout.length;

    const newX = (newGridIndex % numGridsInRow) * newGridWidth;
    const newY = Math.floor(newGridIndex / numGridsInRow) * newGridHeight;

    const newGrid = {
      id: 'grid-' + nanoid(),
      x: newX,
      y: newY,
      width: newGridWidth,
      height: newGridHeight,
    };
    const updatedLayout = [...currentLayout, newGrid];
    const newPages = pages.map(p =>
      p.id === currentPage.id ? { ...p, layout: updatedLayout } : p
    );
    setPages(newPages);
    setCurrentPage(newPages.find(p => p.id === currentPage.id));
  };

  const handleRemoveGrid = () => {
    if (currentPage.layout && currentPage.layout.length > 0) {
      const updatedLayout = currentPage.layout.slice(0, -1);
      const newPages = pages.map(p =>
        p.id === currentPage.id ? { ...p, layout: updatedLayout } : p
      );
      setPages(newPages);
      setCurrentPage(newPages.find(p => p.id === currentPage.id));
    }
  };

  const handleShuffleGrids = () => {
    if (currentPage.layout && currentPage.layout.length > 0) {
      const canvasWidth = 400; 

      const shuffledLayout = [...currentPage.layout].sort(() => Math.random() - 0.5);

      let currentX = 0;
      let currentY = 0;

      const repositionedLayout = shuffledLayout.map(grid => {
        const gridWidth = grid.width; // Use the grid's original width
        const gridHeight = grid.height; // Use the grid's original height

        const newGrid = {
          ...grid,
          x: currentX,
          y: currentY,
        };

        currentX += gridWidth;
        if (currentX + gridWidth > canvasWidth) {
          currentX = 0;
          currentY += gridHeight;
        }
        return newGrid;
      });

      const newPages = pages.map(p =>
        p.id === currentPage.id ? { ...p, layout: repositionedLayout } : p
      );
      setPages(newPages);
      setCurrentPage(newPages.find(p => p.id === currentPage.id));
    }
  };

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

  const handleLayoutSelect = () => {
    setShowLayoutSelector(!showLayoutSelector);
  };

  const generateGridsFromLayout = (layout, canvasWidth, canvasHeight) => {
    const grids = [];
    const preview = layout.preview;
    const numRows = preview.length;
    const numCols = preview[0] ? preview[0].length : 1; 

    let cellWidth = canvasWidth / numCols;
    let cellHeight = canvasHeight / numRows;

    // Cap cell size at 200x200
    if (cellWidth > 200) cellWidth = 200;
    if (cellHeight > 200) cellHeight = 200;

    let idCounter = 0;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        grids.push({
          id: `grid-${idCounter++}`,
          x: col * cellWidth,
          y: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
        });
      }
    }
    return grids;
  };

  const handleLayoutChange = (layout) => {
    const newGrids = generateGridsFromLayout(layout, 400, 700); 
    const newPages = pages.map(p => {
      if (p.id === currentPage.id) {
        return { ...p, layout: newGrids }; 
      }
      return p;
    });
    setPages(newPages);
    setCurrentPage(newPages.find(p => p.id === currentPage.id));
  };

  const handleSelectSticker = (sticker) => {
    setSelectedSticker(sticker);
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

  const handleSaveCalendarAsPng = async () => {
    if (calendarContainerRef.current) {
      const canvas = await html2canvas(calendarContainerRef.current);
      const link = document.createElement('a');
      link.download = `calendar-page-${currentPage.id}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        {/* <PhotoAlbumToolbar /> */}
        <AlbunMenuBar onSave={handleSaveCalendarAsPng} />
        <div className="flex flex-1 overflow-hidden h-full">
          <CalendarLeftSide 
            onSelect={(tool) => setActiveLeftBar(tool)} 
            onLayoutSelect={handleLayoutSelect}
          />
          <div className="w-[100px] bg-white p-4 h-screen -mt-8">
            <CalendarTools 
              uploadedImages={uploadedImages}
              handleImageUpload={handleImageUpload}
              activeLeftBar={activeLeftBar}
              bgType={bgType}
              setBgType={setBgType}
              selectedBg={selectedBg}
              setSelectedBg={setSelectedBg}
              onSelectLayout={handleLayoutChange}
              onSelectSticker={handleSelectSticker}
              onAddCanvasText={handleAddText}
              onAddGrid={handleAddGrid}
              onRemoveGrid={handleRemoveGrid}
              onShuffleGrids={handleShuffleGrids}
            />
            {showLayoutSelector && <LayoutSelector onSelect={handleLayoutChange} />}
          </div>
          {console.log('currentPage.layout:', currentPage.layout)}
          <CalendarMiddleSide
            pages={pages}
            setPages={setPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            selectedBg={selectedBg}
            bgType={bgType}
            layout={currentPage.layout}
            selectedSticker={selectedSticker}
            setSelectedSticker={setSelectedSticker}
            onAddCanvasText={handleAddText}
            isAddingText={isAddingText}
            setIsAddingText={setIsAddingText}
            showPhotoLayoutModal={showPhotoLayoutModal}
            onAddGrid={handleAddGrid}
            onRemoveGrid={handleRemoveGrid}
            onShuffleGrids={handleShuffleGrids}
            calendarContainerRef={calendarContainerRef}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default Calendar;