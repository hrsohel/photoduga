import AlbunMenuBar from '@/components/dashboardcomponents/photoAlbum/AlbunMenuBar';
import LeftSide from '@/components/dashboardcomponents/photoAlbum/LeftSide';
import MiddleSide from '@/components/dashboardcomponents/photoAlbum/MiddleSide';
import PageNavigation from '@/components/dashboardcomponents/photoAlbum/PageNavigation';
import RightSide from '@/components/dashboardcomponents/photoAlbum/RightSide';
import React, { useState, useEffect } from 'react';

export default function PhotoAlbum() {
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

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('photoAlbumState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);

        // Enhanced validation for placedImages
        setUploadedImages(Array.isArray(parsed.uploadedImages) ? parsed.uploadedImages : []);
        setPlacedImages(Array.isArray(parsed.placedImages) ? parsed.placedImages.map(img => ({
          ...img,
          texts: Array.isArray(img.texts) ? img.texts.map(t => ({ ...t })) : [],
          stickers: Array.isArray(img.stickers) ? img.stickers.map(s => ({ ...s })) : [],
        })) : []);
        setGridPositions(Array.isArray(parsed.gridPositions) ? parsed.gridPositions : []);
        setLoadedImages(Array.isArray(parsed.loadedImages) ? parsed.loadedImages : []);

        setGridCount(typeof parsed.gridCount === 'object' ? parsed.gridCount : { left: 5, right: 5 });
        setLastStableState(typeof parsed.lastStableState === 'object' ? parsed.lastStableState : { gridCount: { left: 5, right: 5 }, layoutModeLeft: 0, layoutModeRight: 0 });

        setBgType(typeof parsed.bgType === 'string' ? parsed.bgType : 'plain');
        setSelectedBg(typeof parsed.selectedBg === 'string' ? parsed.selectedBg : '#D81B60');
        setSelectedSticker(typeof parsed.selectedSticker === 'string' ? parsed.selectedSticker : null);
        setSelectedText(parsed.selectedText || null);
        setSelectedPhotoLayout(parsed.selectedPhotoLayout || null);
        setActiveLeftBar(typeof parsed.activeLeftBar === 'string' ? parsed.activeLeftBar : "Frames");
        setLayoutModeLeft(typeof parsed.layoutModeLeft === 'number' ? parsed.layoutModeLeft : 0);
        setLayoutModeRight(typeof parsed.layoutModeRight === 'number' ? parsed.layoutModeRight : 0);
        setHistory(Array.isArray(parsed.history) && parsed.history.length > 0 ? parsed.history : [
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
        setHistoryIndex(typeof parsed.historyIndex === 'number' ? Math.max(0, Math.min(parsed.historyIndex, parsed.history?.length - 1 || 0)) : 0);
        setSelectedImageIndex(parsed.selectedImageIndex !== null && typeof parsed.selectedImageIndex === 'number' ? parsed.selectedImageIndex : null);
        setSelectedElement(typeof parsed.selectedElement === 'object' ? parsed.selectedElement : { type: null, imageIndex: null, elementIndex: null });
        setContextMenu(typeof parsed.contextMenu === 'object' ? parsed.contextMenu : { visible: false, x: 0, y: 0, type: null, imageIndex: null, elementIndex: null });
        setSelectedPartition(typeof parsed.selectedPartition === 'string' ? parsed.selectedPartition : 'left');
        setShowPageLayout(typeof parsed.showPageLayout === 'boolean' ? parsed.showPageLayout : false);
        setSkipAutoLayout(typeof parsed.skipAutoLayout === 'boolean' ? parsed.skipAutoLayout : false);

        console.log('Album state loaded successfully from localStorage');
      } catch (error) {
        console.error('Error loading album state:', error);
        resetToDefaultState();
      }
    } else {
      console.log('No saved state found in localStorage, using default state');
    }
    setIsLoading(false);
  }, []);

  // Save state to localStorage whenever relevant states change
  useEffect(() => {
    if (isLoading) return;

    const stateToSave = {
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
      lastSaved: new Date().toISOString(),
    };

    try {
      localStorage.setItem('photoAlbumState', JSON.stringify(stateToSave));
      console.log('Album state saved successfully at:', stateToSave.lastSaved);
    } catch (error) {
      console.error('Error saving album state:', error);
      // Optional: Notify user or clear localStorage if quota exceeded
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider reducing data or clearing storage.');
        // localStorage.clear(); // Uncomment if you want to reset on quota error
      }
    }
  }, [
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
    isLoading,
    skipAutoLayout,
  ]);

  // Helper function to validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

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
    setSelectedSticker(sticker); // Set the sticker (URL or emoji)
  };

  const handleTextSelect = (text) => {
    setSelectedText(text);
  };

  const handleLayoutSelect = (layout) => {
    setSelectedPhotoLayout(layout);
  };

  const [undoRedoCallbacks, setUndoRedoCallbacks] = useState({
    onUndo: () => { },
    onRedo: () => { },
  });

  const registerUndoRedoCallbacks = (callbacks) => {
    setUndoRedoCallbacks(callbacks);
  };

  const handleSave = (state) => {
    console.log('Manual save triggered');
    // Force a state update to trigger the useEffect for saving to localStorage
    setHistory([...history]); // This triggers the useEffect without changing the state meaningfully
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
          bgType={bgType}
          setBgType={setBgType}
          selectedBg={selectedBg}
          setSelectedBg={setSelectedBg}
          selectedSticker={selectedSticker}
          setSelectedSticker={setSelectedSticker}
          onStickerPlaced={() => setSelectedSticker(null)}
          selectedText={selectedText}
          setSelectedText={setSelectedText}
          selectedPhotoLayout={selectedPhotoLayout}
          setSelectedPhotoLayout={setSelectedPhotoLayout}
          onLayoutApplied={() => setSelectedPhotoLayout(null)}
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
        />
      </div>
      {/* <PageNavigation /> */}
    </section>
  );
}