import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Group, Transformer, Rect } from "react-konva";
import useImage from "use-image";
import Konva from "konva";

const loadImage = async (src) => {
  if (!src) return new Image();
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(new Image());
  });
};

// Image Editor Component with Zoom only
function ImageEditor({ onClose, onDelete, onZoom, selectedImage }) {
  const handleZoom = (factor) => {
    onZoom(factor);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 10,
        background: "white",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleZoom(1.1)} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
            Zoom In
          </button>
          <button onClick={() => handleZoom(0.9)} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
            Zoom Out
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onDelete} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', background: '#ff4444', color: 'white' }}>
            Delete Image
          </button>
          <button onClick={onClose} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RightSide({ 
  bgType, 
  setBgType, 
  selectedBg, 
  setSelectedBg, 
  selectedSticker, 
  setSelectedSticker,
  onStickerPlaced,
  selectedText,
  setSelectedText,
  selectedPhotoLayout,
  setSelectedPhotoLayout,
  onLayoutApplied,
  registerUndoRedoCallbacks,
  placedImages,
  setPlacedImages,
  gridCount,
  setGridCount,
  gridPositions,
  setGridPositions,
  layoutModeLeft,
  setLayoutModeLeft,
  layoutModeRight,
  setLayoutModeRight,
  history,
  setHistory,
  historyIndex,
  setHistoryIndex,
  lastStableState,
  setLastStableState,
  selectedImageIndex,
  setSelectedImageIndex,
  selectedElement,
  setSelectedElement,
  contextMenu,
  setContextMenu,
  selectedPartition,
  setSelectedPartition,
  showPageLayout,
  setShowPageLayout,
  loadedImages,
  setLoadedImages,
  activeLeftBar,
  setActiveLeftBar,
  skipAutoLayout,
  setSkipAutoLayout,
}) {
  const stageRef = useRef();
  const gridRefs = useRef([]);
  const imageTransformerRef = useRef(null);
  const textTransformerRef = useRef(null);
  const stickerTransformerRef = useRef(null);
  const previousGridPositionsRef = useRef([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [transformersReady, setTransformersReady] = useState(false);

  // Initialize grid positions when component mounts or when gridCount changes
  useEffect(() => {
    if (!isInitialized && gridPositions.length === 0) {
      const initialLayout = getCurrentGridLayout();
      setGridPositions(initialLayout);
      setIsInitialized(true);
    }
  }, [gridPositions.length, isInitialized, setGridPositions]);

  // Mark transformers as ready after component mounts
  useEffect(() => {
    setTransformersReady(true);
  }, []);

  // Enhanced saveToHistory function that ensures nested state is saved
  const saveToHistory = () => {
    const newState = {
      placedImages: JSON.parse(JSON.stringify(placedImages)).map(img => ({
        ...img,
        texts: img.texts.map(t => ({ ...t })),
        stickers: img.stickers.map(s => ({ ...s })),
      })),
      gridCount: { ...gridCount },
      gridPositions: JSON.parse(JSON.stringify(gridPositions)),
      layoutModeLeft,
      layoutModeRight,
      bgType,
      selectedBg,
      selectedSticker,
      selectedText,
      selectedPhotoLayout,
      selectedImageIndex,
      selectedElement: { ...selectedElement },
      contextMenu: { ...contextMenu },
      selectedPartition,
      showPageLayout,
      activeLeftBar,
      skipAutoLayout,
    };
    
    const currentState = history[historyIndex];
    
    const hasChanges = !(
      JSON.stringify(newState.placedImages) === JSON.stringify(currentState.placedImages) &&
      JSON.stringify(newState.gridCount) === JSON.stringify(currentState.gridCount) &&
      JSON.stringify(newState.gridPositions) === JSON.stringify(currentState.gridPositions) &&
      newState.layoutModeLeft === currentState.layoutModeLeft &&
      newState.layoutModeRight === currentState.layoutModeRight &&
      newState.bgType === currentState.bgType &&
      newState.selectedBg === currentState.selectedBg &&
      newState.selectedSticker === currentState.selectedSticker &&
      newState.selectedText === currentState.selectedText &&
      newState.selectedPhotoLayout === currentState.selectedPhotoLayout &&
      newState.selectedImageIndex === currentState.selectedImageIndex &&
      JSON.stringify(newState.selectedElement) === JSON.stringify(currentState.selectedElement) &&
      newState.selectedPartition === currentState.selectedPartition &&
      newState.activeLeftBar === currentState.activeLeftBar &&
      newState.skipAutoLayout === currentState.skipAutoLayout
    );
    
    if (hasChanges) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      console.log('History saved with changes');
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setIsRestoring(true);
      const prevIndex = historyIndex - 1;
      const prevState = history[prevIndex];
      
      setPlacedImages(prevState.placedImages.map(img => ({
        ...img,
        texts: img.texts || [],
        stickers: img.stickers || [],
      })) || []);
      setGridCount(prevState.gridCount || { left: 5, right: 5 });
      setGridPositions(prevState.gridPositions || []);
      setLayoutModeLeft(prevState.layoutModeLeft || 0);
      setLayoutModeRight(prevState.layoutModeRight || 0);
      setBgType(prevState.bgType || 'plain');
      setSelectedBg(prevState.selectedBg || '#D81B60');
      setSelectedSticker(prevState.selectedSticker || null);
      setSelectedText(prevState.selectedText || null);
      setSelectedPhotoLayout(prevState.selectedPhotoLayout || null);
      setSelectedImageIndex(prevState.selectedImageIndex || null);
      setSelectedElement(prevState.selectedElement || { type: null, imageIndex: null, elementIndex: null });
      setSelectedPartition(prevState.selectedPartition || 'left');
      setActiveLeftBar(prevState.activeLeftBar || "Frames");
      setSkipAutoLayout(prevState.skipAutoLayout || false);
      
      setHistoryIndex(prevIndex);
      console.log('Undo performed');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setIsRestoring(true);
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      
      setPlacedImages(nextState.placedImages.map(img => ({
        ...img,
        texts: img.texts || [],
        stickers: img.stickers || [],
      })) || []);
      setGridCount(nextState.gridCount || { left: 5, right: 5 });
      setGridPositions(nextState.gridPositions || []);
      setLayoutModeLeft(nextState.layoutModeLeft || 0);
      setLayoutModeRight(nextState.layoutModeRight || 0);
      setBgType(nextState.bgType || 'plain');
      setSelectedBg(nextState.selectedBg || '#D81B60');
      setSelectedSticker(nextState.selectedSticker || null);
      setSelectedText(nextState.selectedText || null);
      setSelectedPhotoLayout(nextState.selectedPhotoLayout || null);
      setSelectedImageIndex(nextState.selectedImageIndex || null);
      setSelectedElement(nextState.selectedElement || { type: null, imageIndex: null, elementIndex: null });
      setSelectedPartition(nextState.selectedPartition || 'left');
      setActiveLeftBar(nextState.activeLeftBar || "Frames");
      setSkipAutoLayout(nextState.skipAutoLayout || false);
      
      setHistoryIndex(nextIndex);
      console.log('Redo performed');
    }
  };

  const cancelLayoutChange = () => {
    setGridCount(lastStableState.gridCount);
    setLayoutModeLeft(lastStableState.layoutModeLeft);
    setLayoutModeRight(lastStableState.layoutModeRight);
    setShowPageLayout(false);
    setSkipAutoLayout(false);
    saveToHistory();
  };

  useEffect(() => {
    if (registerUndoRedoCallbacks) {
      registerUndoRedoCallbacks({ onUndo: undo, onRedo: redo });
    }
  }, [registerUndoRedoCallbacks, history, historyIndex]);

  useEffect(() => {
    if (isRestoring) {
      setIsRestoring(false);
    }
  }, [isRestoring]);

  const [bgImage] = useImage(bgType === 'image' && selectedBg.startsWith('http') ? selectedBg : null);

  // Improved image loading with better error handling
  useEffect(() => {
    const loadAssets = async () => {
      if (placedImages.length === 0) {
        setLoadedImages([]);
        return;
      }
      
      try {
        const imagePromises = placedImages.map((img) => loadImage(img.src));
        const loaded = await Promise.all(imagePromises);
        setLoadedImages(loaded);
      } catch (error) {
        console.error('Error loading images:', error);
        setLoadedImages([]);
      }
    };
    loadAssets();
  }, [placedImages]);

  useEffect(() => {
    if (selectedPhotoLayout) {
      setLastStableState(prev => ({ ...prev, gridCount: { ...gridCount } }));
      setGridCount(prev => ({
        ...prev,
        [selectedPartition]: selectedPhotoLayout.count
      }));
      setSkipAutoLayout(false);
      if (onLayoutApplied) {
        onLayoutApplied();
      }
      saveToHistory();
    }
  }, [selectedPhotoLayout, selectedPartition, onLayoutApplied, setGridCount, setLastStableState]);

  useEffect(() => {
    if (isRestoring || skipAutoLayout) return;
    const initialLayout = getCurrentGridLayout();
    setGridPositions(initialLayout);
  }, [gridCount, layoutModeLeft, layoutModeRight, isRestoring, skipAutoLayout, setGridPositions]);

  useEffect(() => {
    if (previousGridPositionsRef.current.length > 0) {
      gridRefs.current.forEach((ref, i) => {
        const node = ref.current;
        if (node) {
          const oldPos = previousGridPositionsRef.current.find(p => p.id === gridPositions[i].id);
          if (oldPos) {
            new Konva.Tween({
              node,
              duration: 0.5,
              x: gridPositions[i].x,
              y: gridPositions[i].y,
              width: gridPositions[i].width,
              height: gridPositions[i].height,
              easing: Konva.Easings.EaseInOut,
            }).play();
          }
        }
      });
    }
    previousGridPositionsRef.current = gridPositions;
    gridRefs.current = gridPositions.map(() => React.createRef());
    const updatedImages = placedImages
      .filter(img => {
        const cellExists = gridPositions.some(pos => pos.id === img.gridId && pos.shape === "rect");
        return cellExists;
      })
      .map(img => {
        const newCell = gridPositions.find(pos => pos.id === img.gridId && pos.shape === "rect");
        if (newCell) {
          return { ...img, width: newCell.width, height: newCell.height };
        }
        return img;
      });
    setPlacedImages(updatedImages);
  }, [gridPositions, setPlacedImages]);

  useEffect(() => {
    if (!transformersReady) return;

    if (selectedElement.type === 'image' && selectedElement.imageIndex !== null) {
      const selectedNode = gridRefs.current[selectedElement.imageIndex]?.current;
      if (selectedNode && imageTransformerRef.current) {
        imageTransformerRef.current.nodes([selectedNode]);
        if (textTransformerRef.current) textTransformerRef.current.nodes([]);
        if (stickerTransformerRef.current) stickerTransformerRef.current.nodes([]);
      }
    } else if (selectedElement.type === 'text' && selectedElement.imageIndex !== null && selectedElement.elementIndex !== null) {
      const textNode = gridRefs.current[selectedElement.imageIndex]?.current?.findOne(`.text-${selectedElement.elementIndex}`);
      if (textNode && textTransformerRef.current) {
        textTransformerRef.current.nodes([textNode]);
        textTransformerRef.current.getLayer()?.batchDraw();
        if (imageTransformerRef.current) imageTransformerRef.current.nodes([]);
        if (stickerTransformerRef.current) stickerTransformerRef.current.nodes([]);
      }
    } else if (selectedElement.type === 'sticker' && selectedElement.imageIndex !== null && selectedElement.elementIndex !== null) {
      const stickerNode = gridRefs.current[selectedElement.imageIndex]?.current?.findOne(`.sticker-${selectedElement.elementIndex}`);
      if (stickerNode && stickerTransformerRef.current) {
        stickerTransformerRef.current.nodes([stickerNode]);
        stickerTransformerRef.current.getLayer()?.batchDraw();
        if (imageTransformerRef.current) imageTransformerRef.current.nodes([]);
        if (textTransformerRef.current) textTransformerRef.current.nodes([]);
      }
    } else {
      if (imageTransformerRef.current) imageTransformerRef.current.nodes([]);
      if (textTransformerRef.current) textTransformerRef.current.nodes([]);
      if (stickerTransformerRef.current) stickerTransformerRef.current.nodes([]);
    }
  }, [selectedElement, transformersReady]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace' && selectedElement.type && selectedElement.imageIndex !== null) {
        let updatedImages = [...placedImages];
        if (selectedElement.type === 'image') {
          updatedImages = updatedImages.filter(img => img.gridId !== selectedElement.imageIndex);
          setSelectedImageIndex(null);
        } else if (selectedElement.type === 'text' || selectedElement.type === 'sticker') {
          const imgIndex = updatedImages.findIndex(img => img.gridId === selectedElement.imageIndex);
          if (imgIndex !== -1) {
            if (selectedElement.type === 'text') {
              updatedImages[imgIndex].texts.splice(selectedElement.elementIndex, 1);
            } else if (selectedElement.type === 'sticker') {
              updatedImages[imgIndex].stickers.splice(selectedElement.elementIndex, 1);
            }
          }
        }
        setPlacedImages(updatedImages);
        setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
        saveToHistory();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, placedImages, setPlacedImages, setSelectedElement, setSelectedImageIndex]);

  const handleImageClick = (index, e) => {
    e.cancelBubble = true;
    setSelectedElement({ type: 'image', imageIndex: index, elementIndex: null });
    setSelectedImageIndex(index);
    setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null });
  };

  const handleImageDblClick = (index, e) => {
    e.cancelBubble = true;
    setSelectedElement({ type: 'image', imageIndex: index, elementIndex: null });
    setSelectedImageIndex(index);
    setContextMenu({
      visible: true,
      x: e.evt.clientX,
      y: e.evt.clientY,
      type: 'image',
      imageIndex: index
    });
  };

  const handleElementClick = (type, imageIndex, elementIndex, e) => {
    e.cancelBubble = true;
    setSelectedElement({ type, imageIndex, elementIndex });
    setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null });
  };

  const handlePartitionClick = (partition, e) => {
    e.cancelBubble = true;
    setSelectedPartition(partition);
    setSelectedImageIndex(null);
    setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
    setShowPageLayout(false);
    saveToHistory();
  };

  const getCurrentGridLayout = () => {
    const stageWidth = 1280;
    const stageHeight = 650;
    const padding = 20;
    const middleGap = 40;
    const sideWidth = (stageWidth - middleGap) / 2;
    const rightX = sideWidth + middleGap;
    let layout = [];

    const addSide = (count, startX, baseId, partition, mode) => {
      if (count === 0) return;

      const availableWidth = sideWidth - padding * 2;
      const availableHeight = stageHeight - padding * 2;

      if (mode === 0) {
        const halfCount = Math.ceil(count / 2);
        const topHeight = (availableHeight - padding) / 2;
        const bottomCount = count - halfCount;
        const bottomHeight = (availableHeight - topHeight - padding - padding * (bottomCount - 1)) / bottomCount;

        let currentX = startX + padding;
        const topWidth = availableWidth / halfCount;
        for (let i = 0; i < halfCount; i++) {
          layout.push({
            x: currentX,
            y: padding,
            width: topWidth,
            height: topHeight,
            id: baseId + i,
            shape: "rect",
            partition: partition,
            gridArea: `grid${i + 1}`
          });
          currentX += topWidth + padding;
        }

        let currentY = padding + topHeight + padding;
        for (let i = halfCount; i < count; i++) {
          layout.push({
            x: startX + padding,
            y: currentY,
            width: availableWidth,
            height: bottomHeight,
            id: baseId + i,
            shape: "rect",
            partition: partition,
            gridArea: `grid${i + 1}`
          });
          currentY += bottomHeight + padding;
        }
      } else if (mode === 1) {
        const leftWidth = availableWidth / 3;
        const rightWidth = availableWidth - leftWidth - padding;
        const rightCount = count - 1;
        const rightHeight = availableHeight / rightCount;

        layout.push({
          x: startX + padding,
          y: padding,
          width: leftWidth,
          height: availableHeight,
          id: baseId,
          shape: "rect",
          partition: partition,
          gridArea: 'grid1'
        });

        let currentY = padding;
        for (let i = 1; i < count; i++) {
          layout.push({
            x: startX + padding + leftWidth + padding,
            y: currentY,
            width: rightWidth,
            height: rightHeight,
            id: baseId + i,
            shape: "rect",
            partition: partition,
            gridArea: `grid${i + 1}`
          });
          currentY += rightHeight + padding;
        }
      } else if (mode === 2) {
        const gridHeight = availableHeight / count;
        let currentY = padding;
        for (let i = 0; i < count; i++) {
          layout.push({
            x: startX + padding,
            y: currentY,
            width: availableWidth,
            height: gridHeight - (padding / count),
            id: baseId + i,
            shape: "rect",
            partition: partition,
            gridArea: `grid${i + 1}`
          });
          currentY += gridHeight;
        }
      } else if (mode === 3) {
        const gridWidth = availableWidth / count;
        let currentX = startX + padding;
        for (let i = 0; i < count; i++) {
          layout.push({
            x: currentX,
            y: padding,
            width: gridWidth - (padding / count),
            height: availableHeight,
            id: baseId + i,
            shape: "rect",
            partition: partition,
            gridArea: `grid${i + 1}`
          });
          currentX += gridWidth;
        }
      }
    };

    addSide(gridCount.left, 0, 0, 'left', layoutModeLeft);
    addSide(gridCount.right, rightX, gridCount.left, 'right', layoutModeRight);

    layout.push({
      x: sideWidth + 10,
      y: padding,
      width: 2,
      height: stageHeight - 2 * padding,
      id: gridCount.left + gridCount.right,
      shape: "line",
      partition: 'middle'
    });
    layout.push({
      x: sideWidth + middleGap - 12,
      y: padding,
      width: 2,
      height: stageHeight - 2 * padding,
      id: gridCount.left + gridCount.right + 1,
      shape: "line",
      partition: 'middle'
    });

    return layout;
  };

  const handleStageDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleStageDrop = (e) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData('imageUrl');
    const stickerUrl = e.dataTransfer.getData('stickerUrl');
    if (!imageUrl && !stickerUrl) return;

    const rect = stageRef.current.container().getBoundingClientRect();
    const pointerPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const layout = gridPositions;

    let targetGridIndex = -1;
    for (let i = 0; i < layout.length; i++) {
      if (layout[i].shape !== "rect") continue;
      const cell = layout[i];
      if (
        pointerPosition.x >= cell.x && pointerPosition.x <= cell.x + cell.width &&
        pointerPosition.y >= cell.y && pointerPosition.y <= cell.y + cell.height
      ) {
        targetGridIndex = cell.id;
        break;
      }
    }

    if (targetGridIndex !== -1) {
      const cell = layout.find(pos => pos.id === targetGridIndex && pos.shape === "rect");
      const existingImageIndex = placedImages.findIndex(img => img.gridId === targetGridIndex);
      if (imageUrl) {
        const newImage = {
          src: imageUrl,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          isSelected: false,
          x: 0,
          y: 0,
          width: cell.width,
          height: cell.height,
          texts: [],
          stickers: [],
          zIndex: Math.max(...placedImages.map((img) => img.zIndex || 0), 0) + 1,
          gridId: targetGridIndex,
          id: Date.now() + Math.random(),
        };

        let updatedImages = [...placedImages];
        if (existingImageIndex !== -1) {
          updatedImages[existingImageIndex] = newImage;
        } else {
          updatedImages.push(newImage);
        }
        setPlacedImages(updatedImages);
        saveToHistory();
      } else if (stickerUrl && existingImageIndex !== -1) {
        const updatedImages = [...placedImages];
        const imgIndex = updatedImages.findIndex(img => img.gridId === targetGridIndex);
        if (imgIndex !== -1) {
          updatedImages[imgIndex].stickers.push({
            sticker: stickerUrl,
            x: pointerPosition.x - cell.x,
            y: pointerPosition.y - cell.y,
            width: 50,
            height: 50,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            draggable: true,
          });
          setPlacedImages(updatedImages);
          saveToHistory();
        }
      }
    }
  };

  const handleImageDelete = (imageId) => {
    const updatedImages = placedImages.filter(img => img.id !== imageId);
    setPlacedImages(updatedImages);
    setSelectedImageIndex(null);
    setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
    saveToHistory();
  };

  const handleElementDelete = (imageIndex, type, elementIndex) => {
    const updatedImages = [...placedImages];
    const imgIndex = updatedImages.findIndex(img => img.gridId === imageIndex);
    if (imgIndex !== -1) {
      if (type === 'text') {
        updatedImages[imgIndex].texts.splice(elementIndex, 1);
      } else if (type === 'sticker') {
        updatedImages[imgIndex].stickers.splice(elementIndex, 1);
      }
      setPlacedImages(updatedImages);
      setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
      saveToHistory();
    }
  };

  const handleGridDragEnd = (index, e) => {
    const updatedPositions = [...gridPositions];
    updatedPositions[index].x = e.target.x();
    updatedPositions[index].y = e.target.y();
    setGridPositions(updatedPositions);
    setSkipAutoLayout(true);
    saveToHistory();
  };

  const handleTransformEnd = (index, e) => {
    const node = gridRefs.current[index].current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();

    const updatedImages = [...placedImages];
    const imageIndex = updatedImages.findIndex(img => img.gridId === index);
    if (imageIndex !== -1) {
      updatedImages[imageIndex].width *= scaleX;
      updatedImages[imageIndex].height *= scaleY;
      updatedImages[imageIndex].scaleX = scaleX;
      updatedImages[imageIndex].scaleY = scaleY;
      updatedImages[imageIndex].rotation = rotation;
      setPlacedImages(updatedImages);
      saveToHistory();
    }

    node.scaleX(1);
    node.scaleY(1);
  };

  const handleTextTransformEnd = (imageIndex, textIndex, e) => {
    const node = e.target;
    const updatedImages = [...placedImages];
    const imgIndex = updatedImages.findIndex(img => img.gridId === imageIndex);
    if (imgIndex !== -1) {
      updatedImages[imgIndex].texts[textIndex].width = node.width() * node.scaleX();
      updatedImages[imgIndex].texts[textIndex].height = node.height() * node.scaleY();
      updatedImages[imgIndex].texts[textIndex].scaleX = node.scaleX();
      updatedImages[imgIndex].texts[textIndex].scaleY = node.scaleY();
      updatedImages[imgIndex].texts[textIndex].rotation = node.rotation();
      setPlacedImages(updatedImages);
      saveToHistory();
    }

    node.scaleX(1);
    node.scaleY(1);
  };

  const handleStickerTransformEnd = (imageIndex, stickerIndex, e) => {
    const node = e.target;
    const updatedImages = [...placedImages];
    const imgIndex = updatedImages.findIndex(img => img.gridId === imageIndex);
    if (imgIndex !== -1) {
      updatedImages[imgIndex].stickers[stickerIndex].width = node.width() * node.scaleX();
      updatedImages[imgIndex].stickers[stickerIndex].height = node.height() * node.scaleY();
      updatedImages[imgIndex].stickers[stickerIndex].scaleX = node.scaleX();
      updatedImages[imgIndex].stickers[stickerIndex].scaleY = node.scaleY();
      updatedImages[imgIndex].stickers[stickerIndex].rotation = node.rotation();
      setPlacedImages(updatedImages);
      saveToHistory();
    }

    node.scaleX(1);
    node.scaleY(1);
  };

  const handleZoom = (factor) => {
    if (selectedImageIndex === null) return;

    const updatedImages = [...placedImages];
    const imageIndex = updatedImages.findIndex(img => img.gridId === selectedImageIndex);
    if (imageIndex !== -1) {
      updatedImages[imageIndex].scaleX *= factor;
      updatedImages[imageIndex].scaleY *= factor;
      updatedImages[imageIndex].scaleX = Math.max(0.1, Math.min(5, updatedImages[imageIndex].scaleX));
      updatedImages[imageIndex].scaleY = Math.max(0.1, Math.min(5, updatedImages[imageIndex].scaleY));
      setPlacedImages(updatedImages);
      saveToHistory();
    }
  };

  const handleAddText = () => {
    if (selectedImageIndex === null) return;

    const updatedImages = [...placedImages];
    const imageIndex = updatedImages.findIndex(img => img.gridId === selectedImageIndex);
    if (imageIndex !== -1) {
      const newText = {
        text: "Double click to edit",
        x: 20,
        y: 20,
        fontSize: 20,
        fill: "black",
        width: 150,
        height: 30,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        draggable: true,
      };
      updatedImages[imageIndex].texts.push(newText);
      setPlacedImages(updatedImages);
      setSelectedElement({ type: 'text', imageIndex: selectedImageIndex, elementIndex: updatedImages[imageIndex].texts.length - 1 });
      saveToHistory();
    }
  };

  const handleTextDblClick = (imageIndex, textIndex, e) => {
    const textNode = e.target;
    const stage = textNode.getStage();
    const stageBox = stage.container().getBoundingClientRect();
    const pos = textNode.absolutePosition();
    const area = document.createElement('textarea');
    document.body.appendChild(area);
    area.value = textNode.text();
    area.style.position = 'absolute';
    area.style.top = (stageBox.top + pos.y) + 'px';
    area.style.left = (stageBox.left + pos.x) + 'px';
    area.style.width = textNode.width() + 'px';
    area.style.height = textNode.height() + 'px';
    area.style.fontSize = textNode.fontSize() + 'px';
    area.style.border = '1px solid #ccc';
    area.style.padding = '0px';
    area.style.margin = '0px';
    area.style.overflow = 'hidden';
    area.style.background = 'white';
    area.style.outline = 'none';
    area.style.resize = 'none';
    area.focus();
    
    const handleTextSave = () => {
      const updatedImages = [...placedImages];
      const imgIndex = updatedImages.findIndex(img => img.gridId === imageIndex);
      if (imgIndex !== -1) {
        updatedImages[imgIndex].texts[textIndex].text = area.value;
        setPlacedImages(updatedImages);
        saveToHistory(); // Ensure immediate save after edit
      }
      document.body.removeChild(area);
      area.removeEventListener('blur', handleTextSave);
    };

    area.addEventListener('blur', handleTextSave);
    area.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleTextSave();
      }
    });
  };

  const handleContextMenu = (type, imageIndex, elementIndex, e) => {
    e.evt.preventDefault();
    setSelectedImageIndex(imageIndex);
    setContextMenu({
      visible: type !== 'image',
      x: e.evt.clientX,
      y: e.evt.clientY,
      type,
      imageIndex,
      elementIndex,
    });
  };

  const handleChangeLayout = () => {
    setLastStableState({ gridCount: { ...gridCount }, layoutModeLeft, layoutModeRight });
    setSkipAutoLayout(false);
    if (selectedPartition === 'left') {
      setLayoutModeLeft((prev) => (prev + 1) % 4);
    } else if (selectedPartition === 'right') {
      setLayoutModeRight((prev) => (prev + 1) % 4);
    }
    saveToHistory();
  };

  useEffect(() => {
    if (selectedSticker && selectedImageIndex !== null) {
      const updatedImages = [...placedImages];
      const imgIndex = updatedImages.findIndex(img => img.gridId === selectedImageIndex);
      if (imgIndex !== -1) {
        updatedImages[imgIndex].stickers.push({
          sticker: selectedSticker,
          x: 20,
          y: 20,
          width: 50,
          height: 50,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          draggable: true,
        });
        setPlacedImages(updatedImages);
        setSelectedElement({ type: 'sticker', imageIndex: selectedImageIndex, elementIndex: updatedImages[imgIndex].stickers.length - 1 });
        if (onStickerPlaced) onStickerPlaced();
        saveToHistory();
      }
    }
  }, [selectedSticker, selectedImageIndex, onStickerPlaced, placedImages, setPlacedImages, setSelectedElement]);

  useEffect(() => {
    const stageContainer = stageRef.current?.container();
    if (stageContainer) {
      stageContainer.addEventListener('dragover', handleStageDragOver);
      stageContainer.addEventListener('drop', handleStageDrop);
      return () => {
        stageContainer.removeEventListener('dragover', handleStageDragOver);
        stageContainer.removeEventListener('drop', handleStageDrop);
      };
    }
  }, [gridPositions, placedImages]);

  useEffect(() => {
    if (gridCount.left !== lastStableState.gridCount.left || gridCount.right !== lastStableState.gridCount.right) {
      setLastStableState(prev => ({ ...prev, gridCount: { ...gridCount } }));
      saveToHistory();
    }
  }, [gridCount, lastStableState, setLastStableState]);

  return (
    <div className="flex w-full h-[90vh] justify-start items-start bg-gray-200">
      <div className="flex w-[1280px] h-[100%] gap-4 items-start">
        <div className="w-[100px] h-full p-4 border-r space-y-4 bg-gray-100 border-2">
          <div onClick={handleAddText} className="border-[1px] p-[10px] rounded-[2px] border-[#E0E0E0] cursor-pointer w-[40px]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.0002 14.0007H6.00016M8.00016 2V14M8.00016 2C8.92483 2 9.9135 2.02 11.0588 2.11733C11.4588 2.15867 11.6588 2.17933 11.8362 2.252C12.0214 2.33032 12.187 2.44855 12.3212 2.59824C12.4555 2.74793 12.555 2.92541 12.6128 3.118C12.6668 3.30267 12.6668 3.51333 12.6668 3.93467M8.00016 2C7.0755 2 5.88683 2.02 4.9415 2.11733C4.5415 2.15867 4.3415 2.17933 4.16416 2.252C3.97885 2.33024 3.81309 2.44843 3.67872 2.59813C3.54435 2.74783 3.44468 2.92534 3.38683 3.118C3.3335 3.30267 3.3335 3.51333 3.3335 3.93467" stroke="#A8C3A0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p className="font-semibold text-[8px] font-sans text-[#727273]">Text</p>
          </div>
          <div className="border-[1px] p-[10px] rounded-[2px] border-[#E0E0E0] cursor-pointer w-[40px] relative">
            <div className="flex items-center justify-center flex-col">
              <div onClick={(e) => { e.stopPropagation(); setShowPageLayout(!showPageLayout) }} className="flex items-center justify-center flex-col">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.6001 1.59961H5.6001V10.3996H1.6001V1.59961ZM6.4001 1.59961H10.4001V5.59961H6.4001V1.59961ZM11.2001 1.59961H14.4001V14.3996H11.2001V1.59961ZM6.4001 6.39961H10.4001V10.3996H6.4001V6.39961ZM1.6001 11.1996H10.4001V14.3996H1.6001V11.1996Z" fill="#A8C3A0" />
                </svg>
                <p className="font-semibold text-[8px] font-sans text-[#727273] text-center">Photo Layout</p>
              </div>
              {showPageLayout && (
                <div className="flex flex-col items-center mt-1 absolute -right-14 top-0 z-[100] bg-white p-2 rounded shadow">
                  <div className="flex mb-2">
                    <button 
                      onClick={() => { setSelectedPartition('left'); saveToHistory(); }} 
                      className={`px-2 py-1 text-xs ${selectedPartition === 'left' ? 'bg-green-200' : 'bg-gray-100'} border rounded-l`}
                    >
                      Left
                    </button>
                    <button 
                      onClick={() => { setSelectedPartition('right'); saveToHistory(); }} 
                      className={`px-2 py-1 text-xs ${selectedPartition === 'right' ? 'bg-green-200' : 'bg-gray-100'} border rounded-r`}
                    >
                      Right
                    </button>
                  </div>
                  <div className="flex mb-2">
                    <button onClick={() => { 
                      setLastStableState(prev => ({ ...prev, gridCount: { ...gridCount } })); 
                      setSkipAutoLayout(false);
                      setGridCount(prev => ({...prev, [selectedPartition]: Math.max(1, prev[selectedPartition] - 1)})); 
                      saveToHistory(); 
                    }} className="px-2 py-[0.5px] bg-white border rounded-l">
                      -
                    </button>
                    <button onClick={() => { 
                      setLastStableState(prev => ({ ...prev, gridCount: { ...gridCount } })); 
                      setSkipAutoLayout(false);
                      setGridCount(prev => ({...prev, [selectedPartition]: Math.min(12, prev[selectedPartition] + 1)})); 
                      saveToHistory(); 
                    }} className="px-2 py-[0.5px] bg-white border rounded-r">
                      +
                    </button>
                  </div>
                  <button 
                    onClick={handleChangeLayout} 
                    className="px-2 py-1 text-xs bg-blue-200 border rounded mb-2"
                  >
                    Change Layout
                  </button>
                  <button 
                    onClick={cancelLayoutChange} 
                    className="px-2 py-1 text-xs bg-red-200 border rounded"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center bg-gray-200 relative">
          <Stage
            ref={stageRef}
            width={1280}
            height={650}
            onClick={() => {
              setSelectedImageIndex(null);
              setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
              setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null });
              setShowPageLayout(false);
            }}
            onContextMenu={(e) => {
              e.evt.preventDefault();
              setSelectedImageIndex(null);
              setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
              setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null });
              setShowPageLayout(false);
            }}
          >
            <Layer>
              <KonvaImage image={bgImage} width={1280} height={650} fill={bgType === 'plain' ? selectedBg : 'transparent'} />
              
              <Rect
                x={0}
                y={0}
                width={580}
                height={650}
                fill={selectedPartition === 'left' ? 'rgba(168, 195, 160, 0.1)' : 'transparent'}
                stroke="transparent"
                strokeWidth={0}
                onClick={(e) => handlePartitionClick('left', e)}
              />
              <Rect
                x={620}
                y={0}
                width={580}
                height={650}
                fill={selectedPartition === 'right' ? 'rgba(168, 195, 160, 0.1)' : 'transparent'}
                stroke="transparent"
                strokeWidth={0}
                onClick={(e) => handlePartitionClick('right', e)}
              />
              
              {gridPositions.map((frame, i) => {
                const imageInThisGrid = placedImages.find(img => img.gridId === frame.id);
                const imageIndex = placedImages.findIndex(img => img.gridId === frame.id);
                const image = loadedImages[imageIndex] || new Image();
                const fill = imageInThisGrid ? "transparent" : "#f0f0f0";
                return (
                  <Group
                    key={`grid-${i}`}
                    ref={gridRefs.current[i]}
                    x={frame.x}
                    y={frame.y}
                    draggable={frame.shape === "rect"}
                    onDragEnd={(e) => frame.shape === "rect" && handleGridDragEnd(i, e)}
                    onClick={(e) => imageInThisGrid && handleImageClick(frame.id, e)}
                    onDblClick={(e) => imageInThisGrid && handleImageDblClick(frame.id, e)}
                    onTransformEnd={(e) => frame.shape === "rect" && handleTransformEnd(frame.id, e)}
                    onContextMenu={(e) => imageInThisGrid && handleContextMenu('image', frame.id, null, e)}
                    scaleX={imageInThisGrid?.scaleX || 1}
                    scaleY={imageInThisGrid?.scaleY || 1}
                    rotation={imageInThisGrid?.rotation || 0}
                  >
                    {frame.shape === "rect" && (
                      <Rect
                        width={frame.width}
                        height={frame.height}
                        fill={fill}
                        stroke="#ddd"
                        strokeWidth={1}
                        cornerRadius={8}
                      />
                    )}
                    {frame.shape === "line" && (
                      <Rect
                        width={frame.width}
                        height={frame.height}
                        fill="#ddd"
                        strokeWidth={0}
                      />
                    )}
                    {!imageInThisGrid && frame.shape === "rect" && (
                      <Text
                        text="Drag here"
                        x={0}
                        y={frame.height / 2 - 20}
                        width={frame.width}
                        align="center"
                        fontSize={20}
                        fill="gray"
                      />
                    )}
                    {imageInThisGrid && (
                      <>
                        <Rect
                          width={imageInThisGrid.width}
                          height={imageInThisGrid.height}
                          fill="white"
                          stroke="#ddd"
                          strokeWidth={1}
                          cornerRadius={8}
                        />
                        <KonvaImage
                          image={image}
                          width={imageInThisGrid.width}
                          height={imageInThisGrid.height}
                          cornerRadius={8}
                        />
                        {imageInThisGrid.texts.map((text, textIndex) => (
                          <Text
                            key={`text-${textIndex}`}
                            name={`text-${textIndex}`}
                            x={text.x}
                            y={text.y}
                            text={text.text}
                            fontSize={text.fontSize}
                            fill={text.fill}
                            width={text.width}
                            height={text.height}
                            scaleX={text.scaleX}
                            scaleY={text.scaleY}
                            rotation={text.rotation}
                            draggable={text.draggable}
                            onClick={(e) => handleElementClick('text', frame.id, textIndex, e)}
                            onDblClick={(e) => handleTextDblClick(frame.id, textIndex, e)}
                            onTransformEnd={(e) => handleTextTransformEnd(frame.id, textIndex, e)}
                            onContextMenu={(e) => handleContextMenu('text', frame.id, textIndex, e)}
                            onDragStart={(e) => {
                              e.cancelBubble = true;
                            }}
                            onDragEnd={(e) => {
                              e.cancelBubble = true;
                              const updatedImages = [...placedImages];
                              const imgIndex = updatedImages.findIndex(img => img.gridId === frame.id);
                              updatedImages[imgIndex].texts[textIndex].x = e.target.x();
                              updatedImages[imgIndex].texts[textIndex].y = e.target.y();
                              setPlacedImages(updatedImages);
                              saveToHistory();
                            }}
                          />
                        ))}
                        {imageInThisGrid.stickers.map((sticker, stickerIndex) => (
                          <Text
                            key={`sticker-${stickerIndex}`}
                            name={`sticker-${stickerIndex}`}
                            x={sticker.x}
                            y={sticker.y}
                            text={sticker.sticker}
                            fontSize={50}
                            fill="black"
                            width={sticker.width}
                            height={sticker.height}
                            scaleX={sticker.scaleX}
                            scaleY={sticker.scaleY}
                            rotation={sticker.rotation}
                            draggable={sticker.draggable}
                            onClick={(e) => handleElementClick('sticker', frame.id, stickerIndex, e)}
                            onTransformEnd={(e) => handleStickerTransformEnd(frame.id, stickerIndex, e)}
                            onContextMenu={(e) => handleContextMenu('sticker', frame.id, stickerIndex, e)}
                            onDragStart={(e) => {
                              e.cancelBubble = true;
                            }}
                            onDragEnd={(e) => {
                              e.cancelBubble = true;
                              const updatedImages = [...placedImages];
                              const imgIndex = updatedImages.findIndex(img => img.gridId === frame.id);
                              updatedImages[imgIndex].stickers[stickerIndex].x = e.target.x();
                              updatedImages[imgIndex].stickers[stickerIndex].y = e.target.y();
                              setPlacedImages(updatedImages);
                              saveToHistory();
                            }}
                          />
                        ))}
                      </>
                    )}
                  </Group>
                );
              })}
              <Transformer
                ref={(node) => {
                  imageTransformerRef.current = node;
                }}
                keepRatio={false}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']}
              />
              <Transformer
                ref={(node) => {
                  textTransformerRef.current = node;
                }}
                keepRatio={false}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']}
              />
              <Transformer
                ref={(node) => {
                  stickerTransformerRef.current = node;
                }}
                keepRatio={false}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']}
              />
            </Layer>
          </Stage>

          {contextMenu.visible && contextMenu.type === 'image' && (
            <ImageEditor
              onClose={() => setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null })}
              onDelete={() => {
                const imageInGrid = placedImages.find(img => img.gridId === contextMenu.imageIndex);
                if (imageInGrid) {
                  handleImageDelete(imageInGrid.id);
                }
                setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null });
              }}
              onZoom={handleZoom}
              selectedImage={placedImages.find(img => img.gridId === contextMenu.imageIndex)}
            />
          )}

          {contextMenu.visible && (contextMenu.type === 'text' || contextMenu.type === 'sticker') && (
            <div
              style={{
                position: "absolute",
                top: contextMenu.y,
                left: contextMenu.x,
                zIndex: 20,
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "4px",
                boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              }}
            >
              <div
                onClick={() => {
                  handleElementDelete(contextMenu.imageIndex, contextMenu.type, contextMenu.elementIndex);
                  setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null });
                }}
                style={{ padding: "2px 8px", cursor: "pointer", color: "red" }}
              >
                Delete {contextMenu.type}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}