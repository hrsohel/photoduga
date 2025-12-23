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
import AlbumMenuBar from '@/components/dashboardcomponents/photoAlbum/AlbumMenuBar';
import PhotoLayoutModal from '@/components/dashboardcomponents/calendar/PhotoLayoutModal';
import CalendarPageNavigation from '@/components/dashboardcomponents/calendar/CalendarPageNavigation';
import html2canvas from 'html2canvas-pro';
import AllPagesView from '@/components/dashboardcomponents/calendar/AllPagesView';

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
  const canvasWidth = 320; 
  const canvasHeight = 600; 

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
  const [viewMode, setViewMode] = useState('one-side');
  const [activeLeftBar, setActiveLeftBar] = useState('Pictures');

  const initialMonthState = () => ({
    pages: transformInitialPages(initialPages),
    currentPage: transformInitialPages(initialPages)[0],
    bgType: 'plain',
    selectedBg: '#FFFFFF',
    stickers: [],
    texts: [],
    selectedId: null,
    selectedSticker: null,
    history: [],
    historyIndex: -1,
    showPhotoLayoutModal: false,
    isAddingText: false,
    uploadedImages: [],
    showLayoutSelector: false,
  });

  const [calendarMonths, setCalendarMonths] = useState(() => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(initialMonthState());
    }
    return months;
  });
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const updateCurrentMonthState = (newState) => {
    setCalendarMonths(prevMonths => {
      const newMonths = [...prevMonths];
      newMonths[currentMonthIndex] = { ...newMonths[currentMonthIndex], ...newState };
      return newMonths;
    });
  };

  const currentMonthState = calendarMonths[currentMonthIndex];

  if (!currentMonthState) {
    return null; // Or render a loading spinner/error message
  }

  const { pages, currentPage, bgType, selectedBg, stickers, texts, selectedId, selectedSticker = null, isAddingText = false, history, historyIndex, showPhotoLayoutModal, uploadedImages, showLayoutSelector } = currentMonthState;

  const isRestoringRef = useRef(false); // Added
  const previousStateRef = useRef();

  console.log('selectedSticker:', selectedSticker, 'currentMonthState:', currentMonthState);
  useEffect(() => {
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }
    const currentState = {
      pages,
      currentPage,
      bgType,
      selectedBg,
      stickers,
      texts,
      selectedId,
    };
    saveStateToHistory(currentState);
  }, [pages, currentPage, bgType, selectedBg, stickers, texts, selectedId]);

  const saveStateToHistory = (currentState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    updateCurrentMonthState({ history: newHistory, historyIndex: newHistory.length - 1 });
  };

  useEffect(() => {
    if (selectedSticker) {
      const newSticker = {
        id: 'sticker-' + nanoid(),
        text: selectedSticker,
        x: 100,
        y: 100,
        fontSize: 50,
      };
      updateCurrentMonthState({ stickers: [...stickers, newSticker], selectedSticker: null });
    }
  }, [selectedSticker]);

  useEffect(() => {
    if (isAddingText) {
        const newText = {
            id: 'text-' + nanoid(),
            text: 'Double click to edit',
            x: 150,
            y: 150,
            fontSize: 20,
            fontFamily: 'Arial',
            fill: 'black',
            width: 150,
            height: 30,
            align: 'left',
          };
          updateCurrentMonthState({ texts: [...texts, newText], isAddingText: false });
    }
  }, [isAddingText]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isRestoringRef.current = true;
      const newHistoryIndex = historyIndex - 1;
      const previousState = history[newHistoryIndex];
      updateCurrentMonthState({
        pages: previousState.pages,
        currentPage: previousState.currentPage,
        bgType: previousState.bgType,
        selectedBg: previousState.selectedBg,
        stickers: previousState.stickers,
        texts: previousState.texts,
        historyIndex: newHistoryIndex,
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isRestoringRef.current = true;
      const newHistoryIndex = historyIndex + 1;
      const nextState = history[newHistoryIndex];
      updateCurrentMonthState({
        pages: nextState.pages,
        currentPage: nextState.currentPage,
        bgType: nextState.bgType,
        selectedBg: nextState.selectedBg,
        stickers: nextState.stickers,
        texts: nextState.texts,
        historyIndex: newHistoryIndex,
      });
    }
  };

  const handleAddText = () => {
    updateCurrentMonthState({ isAddingText: true });
  };

  const onTogglePhotoLayoutModal = () => {
    updateCurrentMonthState(prev => ({ showPhotoLayoutModal: !prev.showPhotoLayoutModal }));
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
    updateCurrentMonthState({
      pages: newPages,
      currentPage: newPages.find(p => p.id === currentPage.id),
    });
  };

  const handleRemoveGrid = () => {
    console.log("handleRemoveGrid called");
    if (currentPage.layout && currentPage.layout.length > 0) {
      console.log("Current layout length:", currentPage.layout.length);
      const updatedLayout = currentPage.layout.slice(0, -1);
      console.log("New layout length:", updatedLayout.length);
      const newPages = pages.map(p =>
        p.id === currentPage.id ? { ...p, layout: updatedLayout } : p
      );
      updateCurrentMonthState({
        pages: newPages,
        currentPage: newPages.find(p => p.id === currentPage.id),
      });
    } else {
      console.log("No layout or layout is empty");
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
      updateCurrentMonthState({
        pages: newPages,
        currentPage: newPages.find(p => p.id === currentPage.id),
      });
    }
  };

  useEffect(() => {
    const loadState = async () => {
      const db = await dbPromise;
      const savedState = await db.get('calendar-pages', 'calendar-state');
      if (savedState && savedState.calendarMonths) {
        setCalendarMonths(savedState.calendarMonths);
        setCurrentMonthIndex(savedState.currentMonthIndex || 0);
      } else {
        // If no saved state, initialize with default values for all 12 months
        const months = [];
        for (let i = 0; i < 12; i++) {
          months.push(initialMonthState());
        }
        setCalendarMonths(months);
        setCurrentMonthIndex(0);
      }
    };
    loadState();
  }, []);

  // Initialize selectedId after all state declarations
  useEffect(() => {
    if (selectedId === undefined) {
      updateCurrentMonthState({ selectedId: null });
    }
  }, [selectedId]);

  const handleLayoutSelect = () => {
    updateCurrentMonthState(prev => ({ showLayoutSelector: !prev.showLayoutSelector }));
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
    const newPages = pages.map(p =>
      p.id === currentPage.id ? { ...p, layout: newGrids } : p
    );
    updateCurrentMonthState({
      pages: newPages,
      currentPage: newPages.find(p => p.id === currentPage.id),
    });
  };

  const handleSelectSticker = (sticker) => {
    updateCurrentMonthState({ selectedSticker: sticker });
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
      updateCurrentMonthState({ uploadedImages: [...uploadedImages, ...newImages] });
    });
  };

  const handleUpdateLayout = (updatedLayout) => {
    const newPages = pages.map(p =>
      p.id === currentPage.id ? { ...p, layout: updatedLayout } : p
    );
    updateCurrentMonthState({
      pages: newPages,
      currentPage: newPages.find(p => p.id === currentPage.id),
    });
  };

  const handleSaveStateToIndexedDB = async () => {
    try {
      const db = await dbPromise;
      const stateToSave = {
        calendarMonths,
        currentMonthIndex,
      };
      await db.put('calendar-pages', stateToSave, 'calendar-state');
      console.log('Calendar state explicitly saved to IndexedDB');
    } catch (error) {
      console.error('Error explicitly saving calendar state to IndexedDB:', error);
    }
  };

  const handleDownloadImage = async () => {
    // First, save the state to IndexedDB
    await handleSaveStateToIndexedDB();

    // Then, proceed with image download
    if (calendarContainerRef.current) {
      html2canvas(calendarContainerRef.current.container()).then(canvas => {
        const link = document.createElement('a');
        link.download = 'calendar.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const setPagesForCurrentMonth = (newPages) => {
    updateCurrentMonthState({ pages: newPages });
  };

  const setCurrentPageForCurrentMonth = (newPage) => {
    updateCurrentMonthState({ currentPage: newPage });
  };

  const handleToolSelect = (tool) => {
    setActiveLeftBar(tool);
    setViewMode('one-side');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        {/* <PhotoAlbumToolbar /> */}
        <AlbumMenuBar onUndo={handleUndo} onRedo={handleRedo} onDownload={handleDownloadImage} onSaveState={handleSaveStateToIndexedDB} />
        <div className="flex flex-1 overflow-hidden h-full">
          {viewMode === 'one-side' &&
            <>
              <CalendarLeftSide 
                onSelect={handleToolSelect} 
                onLayoutSelect={handleLayoutSelect}
              />
              <div className={`bg-white p-4 h-screen -mt-8 ${activeLeftBar === 'Frames' || activeLeftBar === 'Masks' ? 'w-[400px]' : 'w-[100px]'}`}>
                <CalendarTools 
                  uploadedImages={uploadedImages}
                  handleImageUpload={handleImageUpload}
                  activeLeftBar={activeLeftBar}
                  bgType={bgType}
                  setBgType={(type) => updateCurrentMonthState({ bgType: type })}
                  selectedBg={selectedBg}
                  setSelectedBg={(color) => updateCurrentMonthState({ selectedBg: color })}
                  onSelectLayout={handleLayoutChange}
                  onSelectSticker={handleSelectSticker}
                  onAddCanvasText={handleAddText}
                  onAddGrid={handleAddGrid}
                  onRemoveGrid={handleRemoveGrid}
                  onShuffleGrids={handleShuffleGrids}
                  currentMonthIndex={currentMonthIndex}
                  onMonthChange={setCurrentMonthIndex}
                  calendarMonths={calendarMonths}
                  setViewMode={setViewMode}
                />
                {showLayoutSelector && <LayoutSelector onSelect={handleLayoutChange} />}
              </div>
            </>
          }
          {console.log('currentPage.layout:', currentPage.layout)}
          {viewMode === 'one-side' ? (
            <CalendarMiddleSide
              pages={pages}
              setPages={setPagesForCurrentMonth}
              currentPage={currentPage}
              setCurrentPage={setCurrentPageForCurrentMonth}
              selectedBg={selectedBg}
              bgType={bgType}
              layout={currentPage.layout}
              onUpdateLayout={handleUpdateLayout}
              selectedSticker={selectedSticker}
              setSelectedSticker={(sticker) => updateCurrentMonthState({ selectedSticker: sticker })}
              onAddCanvasText={handleAddText}
              isAddingText={isAddingText}
              setIsAddingText={(value) => updateCurrentMonthState({ isAddingText: value })}
              showPhotoLayoutModal={showPhotoLayoutModal}
              onAddGrid={handleAddGrid}
              onRemoveGrid={handleRemoveGrid}
              onShuffleGrids={handleShuffleGrids}
              calendarContainerRef={calendarContainerRef}
              stickers={stickers}
              setStickers={(newStickers) => updateCurrentMonthState({ stickers: newStickers })}
              texts={texts}
              setTexts={(newTexts) => updateCurrentMonthState({ texts: newTexts })}
              selectedId={selectedId}
              selectShape={(id) => updateCurrentMonthState({ selectedId: id })}
              currentMonthIndex={currentMonthIndex}
            />
          ) : (
            <AllPagesView calendarMonths={calendarMonths} />
          )}
        </div>
        <CalendarPageNavigation
          currentMonthIndex={currentMonthIndex}
          onMonthChange={setCurrentMonthIndex}
          calendarMonths={calendarMonths}
          setViewMode={setViewMode}
        />
      </div>
    </DndProvider>
  );
};

export default Calendar;