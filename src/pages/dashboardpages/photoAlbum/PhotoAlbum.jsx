import AlbumMenuBar from '@/components/dashboardcomponents/photoAlbum/AlbumMenuBar';
import LeftSide from '@/components/dashboardcomponents/photoAlbum/LeftSide';
import MiddleSide from '@/components/dashboardcomponents/photoAlbum/MiddleSide';
import PageNavigation from '@/components/dashboardcomponents/photoAlbum/PageNavigation';
import RightSide from '@/components/dashboardcomponents/photoAlbum/RightSide';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { get, set, clear } from '@/lib/db';
import PhotoAlbumAllPagesView from '@/components/dashboardcomponents/photoAlbum/PhotoAlbumAllPagesView';

const createBlankPage = () => ({
  placedImages: [],
  gridCount: { left: 5, right: 5 },
  gridPositions: [],
  layoutModeLeft: 0,
  layoutModeRight: 0,
  bgType: 'plain',
  selectedBg: '#FFFFFF',
  history: [],
  historyIndex: -1,
  lastStableState: { gridCount: { left: 5, right: 5 }, layoutModeLeft: 0, layoutModeRight: 0 },
  skipAutoLayout: false,
  canvasStickers: [],
  canvasTexts: [],
});

export default function PhotoAlbum() {
  const stageRef = useRef(null);
  const [pages, setPages] = useState([createBlankPage()]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('one-side');

  // States for the active page
  const [uploadedImages, setUploadedImages] = useState([]);
  const [bgType, setBgType] = useState(pages[currentPageIndex].bgType);
  const [selectedBg, setSelectedBg] = useState(pages[currentPageIndex].selectedBg);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedPhotoLayout, setSelectedPhotoLayout] = useState(null);
  const [activeLeftBar, setActiveLeftBar] = useState("Frames");
  const [showPageNavigation, setShowPageNavigation] = useState(false);
  const [placedImages, setPlacedImages] = useState(pages[currentPageIndex].placedImages);
  const [gridCount, setGridCount] = useState(pages[currentPageIndex].gridCount);
  const [gridPositions, setGridPositions] = useState(pages[currentPageIndex].gridPositions);
  const [layoutModeLeft, setLayoutModeLeft] = useState(pages[currentPageIndex].layoutModeLeft);
  const [layoutModeRight, setLayoutModeRight] = useState(pages[currentPageIndex].layoutModeRight);
  const [history, setHistory] = useState(pages[currentPageIndex].history);
  const [historyIndex, setHistoryIndex] = useState(pages[currentPageIndex].historyIndex);
  const [lastStableState, setLastStableState] = useState(pages[currentPageIndex].lastStableState);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedElement, setSelectedElement] = useState({ type: null, imageIndex: null, elementIndex: null });
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: null, imageIndex: null, elementIndex: null });
  const [selectedPartition, setSelectedPartition] = useState('left');
  const [showPageLayout, setShowPageLayout] = useState(false);
  const [loadedImages, setLoadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skipAutoLayout, setSkipAutoLayout] = useState(pages[currentPageIndex].skipAutoLayout);
  const [canvasStickers, setCanvasStickers] = useState(pages[currentPageIndex].canvasStickers);
  const [canvasTexts, setCanvasTexts] = useState(pages[currentPageIndex].canvasTexts);

  const onStickerPlaced = useCallback(() => {
    setSelectedSticker(null);
  }, []);

  const onLayoutApplied = useCallback(() => {
    setSelectedPhotoLayout(null);
  }, []);

  const [undoRedoCallbacks, setUndoRedoCallbacks] = useState({ onUndo: () => { }, onRedo: () => { } });

  const registerUndoRedoCallbacks = useCallback((callbacks) => {
    setUndoRedoCallbacks(callbacks);
  }, []);

  // Load all pages from IndexedDB
  useEffect(() => {
    async function loadPages() {
      try {
        const savedData = await get('photoAlbumPages');
        if (savedData && Array.isArray(savedData.pages) && savedData.pages.length > 0) {
          setPages(savedData.pages);
          const pageIndex = savedData.currentPageIndex || 0;
          setCurrentPageIndex(pageIndex);
          loadPageData(savedData.pages[pageIndex]);
        } else {
          loadPageData(pages[0]);
        }
      } catch (error) {
        console.error("Error loading pages, resetting to default.", error);
        await clear();
        setPages([createBlankPage()]);
        setCurrentPageIndex(0);
        loadPageData(createBlankPage());
      } finally {
        setIsLoading(false);
      }
    }
    loadPages();
  }, []);

  const handleSaveState = async () => {
    if (isLoading) return;
    try {
      const currentEditorState = {
        placedImages, gridCount, gridPositions, layoutModeLeft, layoutModeRight, bgType, selectedBg,
        history, historyIndex, lastStableState, skipAutoLayout, canvasStickers, canvasTexts
      };
      const updatedPages = pages.map((page, index) => index === currentPageIndex ? currentEditorState : page);
      const stateToSave = { pages: updatedPages, currentPageIndex };
      const sanitizedState = JSON.parse(JSON.stringify(stateToSave));
      await set('photoAlbumPages', sanitizedState);
      console.log("Photo album state saved to IndexedDB.");
    } catch (error) {
      console.error("Error saving pages:", error);
    }
  };

  // Synchronize current page state with pages array
  useEffect(() => {
    const currentEditorState = {
      placedImages, gridCount, gridPositions, layoutModeLeft, layoutModeRight, bgType, selectedBg,
      history, historyIndex, lastStableState, skipAutoLayout, canvasStickers, canvasTexts
    };
    setPages(prevPages => prevPages.map((page, index) => index === currentPageIndex ? currentEditorState : page));
  }, [currentPageIndex, placedImages, gridCount, gridPositions, layoutModeLeft, layoutModeRight, bgType, selectedBg, history, historyIndex, lastStableState, skipAutoLayout, canvasStickers, canvasTexts]);

  const loadPageData = (pageData) => {
    setPlacedImages(pageData.placedImages || []);
    setGridCount(pageData.gridCount || { left: 5, right: 5 });
    setGridPositions(pageData.gridPositions || []);
    setLayoutModeLeft(pageData.layoutModeLeft || 0);
    setLayoutModeRight(pageData.layoutModeRight || 0);
    setBgType(pageData.bgType || 'plain');
    setSelectedBg(pageData.selectedBg || '#FFFFFF');
    setHistory(pageData.history || []);
    setHistoryIndex(pageData.historyIndex || -1);
    setLastStableState(pageData.lastStableState || { gridCount: { left: 5, right: 5 }, layoutModeLeft: 0, layoutModeRight: 0 });
    setSkipAutoLayout(pageData.skipAutoLayout || false);
    setCanvasStickers(pageData.canvasStickers || []);
    setCanvasTexts(pageData.canvasTexts || []);
  };

  const handlePageChange = (newIndex) => {
    if (newIndex === currentPageIndex) return;

    const currentEditorState = {
      placedImages, gridCount, gridPositions, layoutModeLeft, layoutModeRight, bgType, selectedBg,
      history, historyIndex, lastStableState, skipAutoLayout, canvasStickers, canvasTexts
    };

    const updatedPages = pages.map((page, index) => index === currentPageIndex ? currentEditorState : page);
    setPages(updatedPages);

    setCurrentPageIndex(newIndex);
    loadPageData(updatedPages[newIndex]);
  };

  const handleAddBlankPage = () => {
    const currentEditorState = {
      placedImages, gridCount, gridPositions, layoutModeLeft, layoutModeRight, bgType, selectedBg,
      history, historyIndex, lastStableState, skipAutoLayout, canvasStickers, canvasTexts
    };
    const savedPages = pages.map((page, index) => index === currentPageIndex ? currentEditorState : page);
    const newPage = createBlankPage();
    const newPagesArray = [...savedPages, newPage];
    const newPageIndex = newPagesArray.length - 1;

    setPages(newPagesArray);
    setCurrentPageIndex(newPageIndex);
    loadPageData(newPage);
  };

  const handleDuplicatePage = () => {
    const currentEditorState = {
      placedImages, gridCount, gridPositions, layoutModeLeft, layoutModeRight, bgType, selectedBg,
      history, historyIndex, lastStableState, skipAutoLayout, canvasStickers, canvasTexts
    };
    const savedPages = pages.map((page, index) => index === currentPageIndex ? currentEditorState : page);

    const pageToDuplicate = savedPages[currentPageIndex];
    const duplicatedPage = JSON.parse(JSON.stringify(pageToDuplicate));

    const newPagesArray = [...savedPages, duplicatedPage];
    const newPageIndex = newPagesArray.length - 1;

    setPages(newPagesArray);
    setCurrentPageIndex(newPageIndex);
    loadPageData(duplicatedPage);
  };

  const handleRemovePage = () => {
    if (pages.length <= 1) return; // Cannot remove the last page
    const newPages = pages.filter((_, index) => index !== currentPageIndex);
    setPages(newPages);
    const newPageIndex = Math.max(0, currentPageIndex - 1);
    setCurrentPageIndex(newPageIndex);
    loadPageData(newPages[newPageIndex]);
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

  const handleStickerSelect = (sticker) => setSelectedSticker(sticker);
  const handleLayoutSelect = (layout) => setSelectedPhotoLayout(layout);

  const handleAddCanvasText = () => {
    const newText = {
      text: "Double click to edit",
      x: 100,
      y: 100,
      fontSize: 20,
      fill: "black",
      width: 150,
      height: 30,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      draggable: true,
      id: Date.now() + Math.random(),
    };
    setCanvasTexts([...canvasTexts, newText]);
    setSelectedElement({ type: 'canvas-text', imageIndex: null, elementIndex: canvasTexts.length });
  };

  const handleSave = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const transformers = stage.find('Transformer');
    transformers.forEach(tr => tr.hide());
    stage.draw();

    setTimeout(() => {
      try {
        const dataURL = stage.toDataURL({ mimeType: 'image/png', pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `photo-album-page-${currentPageIndex + 1}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Could not save image.", error);
      }

      transformers.forEach(tr => tr.show());
      stage.draw();
    }, 100);
  };

  if (isLoading) {
    return (
      <section className='bg-[#F0F1F5] p-0 h-screen flex items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your photo album...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className='bg-[#F0F1F5] p-0'>
        <AlbumMenuBar
          onUndo={undoRedoCallbacks.onUndo}
          onRedo={undoRedoCallbacks.onRedo}
          onDownload={handleSave}
          onSaveState={handleSaveState}
        />
        <div className='flex items-start relative'>
          <div className="flex">
            <LeftSide activeLeftBar={activeLeftBar} setActiveLeftBar={setActiveLeftBar} setShowPageNavigation={setShowPageNavigation} />
            <MiddleSide
              uploadedImages={uploadedImages}
              handleImageUpload={handleImageUpload}
              bgType={bgType}
              setBgType={setBgType}
              selectedBg={selectedBg}
              setSelectedBg={setSelectedBg}
              activeLeftBar={activeLeftBar}
              setActiveLeftBar={setActiveLeftBar}
              onSelectSticker={handleStickerSelect}
              onSelectLayout={handleLayoutSelect}
            />
          </div>
          <div className="flex-1 flex justify-center items-center">
            {viewMode === 'one-side' ? (
              <RightSide
                stageRef={stageRef}
                bgType={bgType}
                setBgType={setBgType}
                selectedBg={selectedBg}
                setSelectedBg={setSelectedBg}
                selectedSticker={selectedSticker}
                setSelectedSticker={setSelectedSticker}
                onStickerPlaced={onStickerPlaced}
                selectedText={selectedText}
                setSelectedText={setSelectedText}
                selectedPhotoLayout={selectedPhotoLayout}
                setSelectedPhotoLayout={setSelectedPhotoLayout}
                onLayoutApplied={onLayoutApplied}
                registerUndoRedoCallbacks={registerUndoRedoCallbacks}
                placedImages={placedImages}
                setPlacedImages={setPlacedImages}
                gridCount={gridCount}
                setGridCount={setGridCount}
                gridPositions={gridPositions}
                setGridPositions={setGridPositions}
                layoutModeLeft={layoutModeLeft}
                setLayoutModeLeft={setLayoutModeLeft}
                layoutModeRight={layoutModeRight}
                setLayoutModeRight={setLayoutModeRight}
                history={history}
                setHistory={setHistory}
                historyIndex={historyIndex}
                setHistoryIndex={setHistoryIndex}
                lastStableState={lastStableState}
                setLastStableState={setLastStableState}
                selectedImageIndex={selectedImageIndex}
                setSelectedImageIndex={setSelectedImageIndex}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                contextMenu={contextMenu}
                setContextMenu={setContextMenu}
                selectedPartition={selectedPartition}
                setSelectedPartition={setSelectedPartition}
                showPageLayout={showPageLayout}
                setShowPageLayout={setShowPageLayout}
                loadedImages={loadedImages}
                setLoadedImages={setLoadedImages}
                activeLeftBar={activeLeftBar}
                setActiveLeftBar={setActiveLeftBar}
                skipAutoLayout={skipAutoLayout}
                setSkipAutoLayout={setSkipAutoLayout}
                canvasStickers={canvasStickers}
                setCanvasStickers={setCanvasStickers}
                canvasTexts={canvasTexts}
                setCanvasTexts={setCanvasTexts}
                onAddCanvasText={handleAddCanvasText}
              />
            ) : (
              <PhotoAlbumAllPagesView pages={pages} />
            )}
          </div>
          {showPageNavigation && (
            <div className="fixed bottom-0 w-full">
              <PageNavigation 
                currentPage={currentPageIndex}
                totalPages={pages.length}
                pages={pages.map((page, index) => index === currentPageIndex ? {
                  placedImages, gridCount, gridPositions, layoutModeLeft, layoutModeRight, bgType, selectedBg,
                  history, historyIndex, lastStableState, skipAutoLayout, canvasStickers, canvasTexts
                } : page)}
                onPageChange={handlePageChange}
                onAddPage={handleAddBlankPage}
                onDuplicatePage={handleDuplicatePage}
                onRemovePage={handleRemovePage}
                setViewMode={setViewMode}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
