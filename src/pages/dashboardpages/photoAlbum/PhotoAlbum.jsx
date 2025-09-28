import AlbunMenuBar from '@/components/dashboardcomponents/photoAlbum/AlbunMenuBar';
import LeftSide from '@/components/dashboardcomponents/photoAlbum/LeftSide';
import MiddleSide from '@/components/dashboardcomponents/photoAlbum/MiddleSide';
import PageNavigation from '@/components/dashboardcomponents/photoAlbum/PageNavigation';
import RightSide from '@/components/dashboardcomponents/photoAlbum/RightSide';
import React, { useState, useEffect, useRef } from 'react';

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

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('photoAlbumState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);

        // Load only serializable, non-image data
        setGridPositions(Array.isArray(parsed.gridPositions) ? parsed.gridPositions : []);
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
        setSelectedPartition(typeof parsed.selectedPartition === 'string' ? parsed.selectedPartition : 'left');
        setShowPageLayout(typeof parsed.showPageLayout === 'boolean' ? parsed.showPageLayout : false);
        setSkipAutoLayout(typeof parsed.skipAutoLayout === 'boolean' ? parsed.skipAutoLayout : false);

        console.log('Album state loaded successfully from localStorage');
      } catch (error) {
        console.error('Error loading album state:', error);
        // Do not reset to default, just clear the broken state
        localStorage.removeItem('photoAlbumState');
      }
    } else {
      console.log('No saved state found in localStorage, using default state');
    }
    setIsLoading(false);
  }, []);

  // Save state to localStorage whenever relevant states change
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
      lastSaved: new Date().toISOString(),
    };

    try {
      localStorage.setItem('photoAlbumState', JSON.stringify(stateToSave));
      console.log('Album state saved successfully at:', stateToSave.lastSaved);
    } catch (error) {
      console.error('Error saving album state:', error);
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider reducing data or clearing storage.');
      }
    }
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

  const [undoRedoCallbacks, setUndoRedoCallbacks] = useState({
    onUndo: () => { },
    onRedo: () => { },
  });

  const registerUndoRedoCallbacks = (callbacks) => {
    setUndoRedoCallbacks(callbacks);
  };

  const handleSave = () => {
    const stage = stageRef.current;
    if (!stage) {
        console.error("Stage ref not available");
        return;
    }

    const layer = stage.getLayers()[0];
    if (!layer) {
        console.error("No layer found to export.");
        return;
    }

    const contentGroups = stage.find('.image-content');
    const transformers = stage.find('Transformer');
    const gridCells = stage.find('.grid-cell-rect');

    // Store original properties
    const originalFills = new Map();
    gridCells.forEach(cell => {
        originalFills.set(cell, cell.fill());
        cell.fill('#f0f0f0'); // Set to grey
    });

    // Hide content
    contentGroups.forEach(group => group.visible(false));
    transformers.forEach(tr => tr.visible(false));

    layer.batchDraw();

    const dataURL = stage.toDataURL({ mimeType: 'image/png' });

    // Restore original state
    gridCells.forEach(cell => {
        if (originalFills.has(cell)) {
            cell.fill(originalFills.get(cell));
        }
    });
    contentGroups.forEach(group => group.visible(true));
    transformers.forEach(tr => tr.visible(true));

    layer.batchDraw();

    // Trigger download
    const link = document.createElement('a');
    link.download = 'album-layout.png';
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