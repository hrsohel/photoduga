import AlbunMenuBar from '@/components/dashboardcomponents/photoAlbum/AlbunMenuBar';
import LeftSide from '@/components/dashboardcomponents/photoAlbum/LeftSide';
import MiddleSide from '@/components/dashboardcomponents/photoAlbum/MiddleSide';
import PageNavigation from '@/components/dashboardcomponents/photoAlbum/PageNavigation';
import RightSide from '@/components/dashboardcomponents/photoAlbum/RightSide';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { get, set, clear } from '@/lib/db';

export default function PhotoAlbum() {
  const stageRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [bgType, setBgType] = useState('plain');
  const [selectedBg, setSelectedBg] = useState('#D81B60');
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedPhotoLayout, setSelectedPhotoLayout] = useState(null);
  const [activeLeftBar, setActiveLeftBar] = useState("Frames");
  const [placedImages, setPlacedImages] = useState([]);
  const [gridCount, setGridCount] = useState({ left: 5, right: 5 });
  const [gridPositions, setGridPositions] = useState([]);
  const [layoutModeLeft, setLayoutModeLeft] = useState(0);
  const [layoutModeRight, setLayoutModeRight] = useState(0);
  const [history, setHistory] = useState([
    {
      placedImages: [],
      gridCount: { left: 5, right: 5 },
      gridPositions: [],
      layoutModeLeft: 0,
      layoutModeRight: 0,
      bgType: 'plain',
      selectedBg: '#D81B60',
      skipAutoLayout: false,
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [lastStableState, setLastStableState] = useState({ gridCount: { left: 5, right: 5 }, layoutModeLeft: 0, layoutModeRight: 0 });
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedElement, setSelectedElement] = useState({ type: null, imageIndex: null, elementIndex: null });
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: null,
    imageIndex: null,
    elementIndex: null,
  });
  const [selectedPartition, setSelectedPartition] = useState('left');
  const [showPageLayout, setShowPageLayout] = useState(false);
  const [loadedImages, setLoadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skipAutoLayout, setSkipAutoLayout] = useState(false);
  const [canvasStickers, setCanvasStickers] = useState([]);

  // Load state from IndexedDB on mount
  useEffect(() => {
    async function loadState() {
      try {
        const savedState = await get('photoAlbumState');
        if (savedState) {
          try {
            // Load only serializable, non-image data
            setGridPositions(Array.isArray(savedState.gridPositions) ? savedState.gridPositions : []);
            setGridCount(typeof savedState.gridCount === 'object' ? savedState.gridCount : { left: 5, right: 5 });
            setLastStableState(typeof savedState.lastStableState === 'object' ? savedState.lastStableState : { gridCount: { left: 5, right: 5 }, layoutModeLeft: 0, layoutModeRight: 0 });
            setBgType(typeof savedState.bgType === 'string' ? savedState.bgType : 'plain');
            setSelectedBg(typeof savedState.selectedBg === 'string' ? savedState.selectedBg : '#D81B60');
            setSelectedSticker(typeof savedState.selectedSticker === 'string' ? savedState.selectedSticker : null);
            setSelectedText(savedState.selectedText || null);
            setSelectedPhotoLayout(savedState.selectedPhotoLayout || null);
            setActiveLeftBar(typeof savedState.activeLeftBar === 'string' ? savedState.activeLeftBar : "Frames");
            setLayoutModeLeft(typeof savedState.layoutModeLeft === 'number' ? savedState.layoutModeLeft : 0);
            setLayoutModeRight(typeof savedState.layoutModeRight === 'number' ? savedState.layoutModeRight : 0);
            setSelectedPartition(typeof savedState.selectedPartition === 'string' ? savedState.selectedPartition : 'left');
            setShowPageLayout(typeof savedState.showPageLayout === 'boolean' ? savedState.showPageLayout : false);
            setSkipAutoLayout(typeof savedState.skipAutoLayout === 'boolean' ? savedState.skipAutoLayout : false);
            setPlacedImages(
            (Array.isArray(savedState.placedImages) ? savedState.placedImages : []).map(img => ({
              ...img,
              texts: Array.isArray(img.texts) ? img.texts : [],
              stickers: Array.isArray(img.stickers) ? img.stickers : [],
            }))
          );
            setHistory(Array.isArray(savedState.history) && savedState.history.length > 0 ? savedState.history : [
              {
                placedImages: [],
                gridCount: { left: 5, right: 5 },
                gridPositions: [],
                layoutModeLeft: 0,
                layoutModeRight: 0,
                bgType: 'plain',
                selectedBg: '#D81B60',
                skipAutoLayout: false,
              },
            ]);
            setHistoryIndex(typeof savedState.historyIndex === 'number' ? savedState.historyIndex : 0);


            console.log('Album state loaded successfully from IndexedDB');
          } catch (error) {
            console.error('Error processing loaded album state, resetting to default:', error);
            resetToDefaultState();
          }
        } else {
          console.log('No saved state found in IndexedDB, using default state');
        }
      } catch (error) {
        console.error('Error loading album state from IndexedDB, clearing stored data and resetting to default:', error);
        try {
          await clear();
        } catch (clearError) {
          console.error('Failed to clear IndexedDB:', clearError);
        }
        resetToDefaultState();
      } finally {
        setIsLoading(false);
      }
    }
    loadState();
  }, []);

  // Save state to IndexedDB whenever relevant states change
  useEffect(() => {
    if (isLoading) return;

    // State to save (excluding image data)
    const stateToSave = {
      bgType,
      selectedBg,
      selectedSticker,
      selectedText,
      selectedPhotoLayout,
      activeLeftBar,
      gridCount,
      gridPositions,
      layoutModeLeft,
      layoutModeRight,
      lastStableState,
      selectedPartition,
      showPageLayout,
      skipAutoLayout,
      placedImages,
      history,
      historyIndex,
      lastSaved: new Date().toISOString(),
    };

    async function saveState() {
      try {
        const sanitizedState = JSON.parse(JSON.stringify(stateToSave));
        await set('photoAlbumState', sanitizedState);
        console.log('Album state saved successfully at:', sanitizedState.lastSaved);
      } catch (error) {
        console.error('Error saving album state:', error);
      }
    }
    saveState();
  }, [
    bgType,
    selectedBg,
    selectedSticker,
    selectedText,
    selectedPhotoLayout,
    activeLeftBar,
    gridCount,
    gridPositions,
    layoutModeLeft,
    layoutModeRight,
    lastStableState,
    selectedPartition,
    showPageLayout,
    isLoading,
    skipAutoLayout,
    placedImages,
    history,
    historyIndex,
  ]);

  const resetToDefaultState = () => {
    setUploadedImages([]);
    setBgType('plain');
    setSelectedBg('#D81B60');
    setSelectedSticker(null);
    setSelectedText(null);
    setSelectedPhotoLayout(null);
    setActiveLeftBar("Frames");
    setPlacedImages([]);
    setGridCount({ left: 5, right: 5 });
    setGridPositions([]);
    setLayoutModeLeft(0);
    setLayoutModeRight(0);
    setHistory([
      {
        placedImages: [],
        gridCount: { left: 5, right: 5 },
        gridPositions: [],
        layoutModeLeft: 0,
        layoutModeRight: 0,
        bgType: 'plain',
        selectedBg: '#D81B60',
        skipAutoLayout: false,
      },
    ]);
    setHistoryIndex(0);
    setLastStableState({ gridCount: { left: 5, right: 5 }, layoutModeLeft: 0, layoutModeRight: 0 });
    setSelectedImageIndex(null);
    setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
    setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null, elementIndex: null });
    setSelectedPartition('left');
    setShowPageLayout(false);
    setLoadedImages([]);
    setSkipAutoLayout(false);
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

  const handleStickerSelect = (sticker) => {
    setSelectedSticker(sticker);
  };

  const handleTextSelect = (text) => {
    setSelectedText(text);
  };

  const handleLayoutSelect = (layout) => {
    setSelectedPhotoLayout(layout);
  };

  const onStickerPlaced = useCallback(() => {
    setSelectedSticker(null);
  }, []);

  const onLayoutApplied = useCallback(() => {
    setSelectedPhotoLayout(null);
  }, []);

  const [undoRedoCallbacks, setUndoRedoCallbacks] = useState({
    onUndo: () => { },
    onRedo: () => { },
  });

  const registerUndoRedoCallbacks = useCallback((callbacks) => {
    setUndoRedoCallbacks(callbacks);
  }, []);

  const handleSave = () => {
    const stage = stageRef.current;
    if (!stage) {
        console.error("Stage ref not available");
        return;
    }

    const transformers = stage.find('Transformer');
    transformers.forEach(tr => tr.hide());
    stage.draw();

    const dataURL = stage.toDataURL({ mimeType: 'image/png', pixelRatio: 2 });

    transformers.forEach(tr => tr.show());
    stage.draw();

    // Trigger download
    const link = document.createElement('a');
    link.download = 'photo-album.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const albumState = {
    uploadedImages,
    bgType,
    selectedBg,
    selectedSticker,
    selectedText,
    selectedPhotoLayout,
    activeLeftBar,
    placedImages,
    gridCount,
    gridPositions,
    layoutModeLeft,
    layoutModeRight,
    history,
    historyIndex,
    lastStableState,
    selectedImageIndex,
    selectedElement,
    contextMenu,
    selectedPartition,
    showPageLayout,
    loadedImages,
    skipAutoLayout,
    canvasStickers,
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
    <section className='bg-[#F0F1F5] p-0'>
      <AlbunMenuBar
        onUndo={undoRedoCallbacks.onUndo}
        onRedo={undoRedoCallbacks.onRedo}
        onSave={handleSave}
        albumState={albumState}
      />
      <div className='flex items-start justify-center'>
        <LeftSide activeLeftBar={activeLeftBar} setActiveLeftBar={setActiveLeftBar} />
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
          onSelectText={handleTextSelect}
          onSelectLayout={handleLayoutSelect}
        />
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
        />
      </div>
      <PageNavigation />
    </section>
  );
}