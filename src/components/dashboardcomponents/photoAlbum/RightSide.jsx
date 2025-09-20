import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Group, Transformer, Rect } from "react-konva";
import useImage from "use-image";
import PageNavigation from "./PageNavigation";

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

// Image Editor Component with Resize and Zoom
function ImageEditor({ onClose, onDelete, onResize, onZoom, selectedImage }) {
  const handleResize = (widthDelta, heightDelta) => {
    onResize(widthDelta, heightDelta);
  };

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
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Edit Image</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleResize(10, 0)} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
            Wider
          </button>
          <button onClick={() => handleResize(-10, 0)} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
            Narrower
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleResize(0, 10)} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
            Taller
          </button>
          <button onClick={() => handleResize(0, -10)} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
            Shorter
          </button>
        </div>
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
  selectedBg, 
  setBgType, 
  setSelectedBg, 
  selectedSticker, 
  onStickerPlaced,
  selectedPhotoLayout,
  onLayoutApplied 
}) {
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
  const [gridCount, setGridCount] = useState({ left: 2, right: 2 });
  const [gridPositions, setGridPositions] = useState([]);
  const [placedImages, setPlacedImages] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const [selectedPartition, setSelectedPartition] = useState('left'); // 'left' or 'right'
  const stageRef = useRef();
  const gridRefs = useRef([]);
  const imageTransformerRef = useRef();
  const textTransformerRef = useRef();
  const stickerTransformerRef = useRef();

  const [bgImage] = useImage(bgType === 'image' && selectedBg.startsWith('http') ? selectedBg : null);

  // Load images and stickers
  useEffect(() => {
    const loadAssets = async () => {
      const imagePromises = placedImages.map((img) => loadImage(img.src));
      const loaded = await Promise.all(imagePromises);
      setLoadedImages(loaded);
    };
    loadAssets();
  }, [placedImages]);

  // Add effect to handle layout selection
  useEffect(() => {
    if (selectedPhotoLayout) {
      // Update grid count for the selected partition
      setGridCount(prev => ({
        ...prev,
        [selectedPartition]: selectedPhotoLayout.count
      }));
      
      // Notify parent that layout has been applied
      if (onLayoutApplied) {
        onLayoutApplied();
      }
    }
  }, [selectedPhotoLayout, selectedPartition, onLayoutApplied]);

  useEffect(() => {
    const initialLayout = getCurrentGridLayout();
    setGridPositions(initialLayout);
    gridRefs.current = initialLayout.map(() => React.createRef());
    setPlacedImages(prev => {
      return prev
        .filter(img => {
          // Keep images that are in the current grid layout
          const cellExists = initialLayout.some(pos => pos.id === img.gridId && pos.shape === "rect");
          return cellExists;
        })
        .map(img => {
          const newCell = initialLayout.find(pos => pos.id === img.gridId && pos.shape === "rect");
          if (newCell) {
            return { ...img, width: newCell.width, height: newCell.height };
          }
          return img;
        });
    });
  }, [gridCount, selectedPhotoLayout, selectedPartition]);

  useEffect(() => {
    if (selectedElement.type === 'image' && selectedElement.imageIndex !== null) {
      const selectedNode = gridRefs.current[selectedElement.imageIndex]?.current;
      if (selectedNode) {
        imageTransformerRef.current.nodes([selectedNode]);
        textTransformerRef.current.nodes([]);
        stickerTransformerRef.current.nodes([]);
      }
    } else if (selectedElement.type === 'text' && selectedElement.imageIndex !== null && selectedElement.elementIndex !== null) {
      const textNode = gridRefs.current[selectedElement.imageIndex]?.current?.findOne(`.text-${selectedElement.elementIndex}`);
      if (textNode) {
        textTransformerRef.current.nodes([textNode]);
        textTransformerRef.current.getLayer().batchDraw();
        imageTransformerRef.current.nodes([]);
        stickerTransformerRef.current.nodes([]);
      }
    } else if (selectedElement.type === 'sticker' && selectedElement.imageIndex !== null && selectedElement.elementIndex !== null) {
      const stickerNode = gridRefs.current[selectedElement.imageIndex]?.current?.findOne(`.sticker-${selectedElement.elementIndex}`);
      if (stickerNode) {
        stickerTransformerRef.current.nodes([stickerNode]);
        stickerTransformerRef.current.getLayer().batchDraw();
        imageTransformerRef.current.nodes([]);
        textTransformerRef.current.nodes([]);
      }
    } else {
      imageTransformerRef.current.nodes([]);
      textTransformerRef.current.nodes([]);
      stickerTransformerRef.current.nodes([]);
    }
  }, [selectedElement]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace' && selectedElement.type && selectedElement.imageIndex !== null) {
        if (selectedElement.type === 'image') {
          const updatedImages = placedImages.filter(img => img.gridId !== selectedElement.imageIndex);
          setPlacedImages(updatedImages);
          setSelectedImageIndex(null);
        } else if (selectedElement.type === 'text' || selectedElement.type === 'sticker') {
          const updatedImages = [...placedImages];
          const imgIndex = updatedImages.findIndex(img => img.gridId === selectedElement.imageIndex);
          if (imgIndex !== -1) {
            if (selectedElement.type === 'text') {
              updatedImages[imgIndex].texts.splice(selectedElement.elementIndex, 1);
            } else if (selectedElement.type === 'sticker') {
              updatedImages[imgIndex].stickers.splice(selectedElement.elementIndex, 1);
            }
            setPlacedImages(updatedImages);
          }
        }
        setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, placedImages]);

  const handleImageClick = (index, e) => {
    e.cancelBubble = true;
    setSelectedElement({ type: 'image', imageIndex: index, elementIndex: null });
    setSelectedImageIndex(index);
    setContextMenu({ visible: true, x: e.evt.clientX, y: e.evt.clientY, type: 'image', imageIndex: index });
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
  };

  const getCurrentGridLayout = () => {
    const stageWidth = 1200;
    const stageHeight = 800;
    const padding = 20;
    const middleGap = 40;
    
    // If we have a specific layout from PhotoLayouts, use it for the selected partition
    if (selectedPhotoLayout && selectedPhotoLayout.preview) {
      return generateCustomGridLayout(selectedPhotoLayout, stageWidth, stageHeight, padding, selectedPartition);
    }
    
    // Default layout logic for both partitions
    const sideWidth = (stageWidth - middleGap) / 2;
    const rightX = sideWidth + middleGap;
    let layout = [];

    // Generate layout for left partition
    const addSide = (count, startX, baseId, partition) => {
      if (count === 0) return;
      
      // For rectangular grids, use a 2-column layout
      const cols = 2;
      const rows = Math.ceil(count / cols);
      
      const calculatedWidth = (sideWidth - padding * (cols + 1)) / cols;
      const calculatedHeight = (stageHeight - padding * (rows + 1)) / rows;
      
      // Make cells rectangular (wider than tall)
      const cellWidth = calculatedWidth;
      const cellHeight = calculatedHeight;
      
      const totalHeight = rows * cellHeight + (rows - 1) * padding;
      const startY = (stageHeight - totalHeight) / 2;
      let k = 0;
      
      for (let i = 0; i < rows; i++) {
        let cellsInRow = cols;
        if (i === rows - 1 && count % cols !== 0 && count % cols > 0) {
          cellsInRow = count % cols;
        }
        const totalRowWidth = cellsInRow * cellWidth + (cellsInRow - 1) * padding;
        const startXRow = startX + (sideWidth - totalRowWidth) / 2;
        
        for (let j = 0; j < cellsInRow; j++) {
          const x = startXRow + j * (cellWidth + padding);
          const y = startY + i * (cellHeight + padding);
          layout.push({
            x,
            y,
            width: cellWidth,
            height: cellHeight,
            id: baseId + k,
            shape: "rect",
            partition: partition
          });
          k++;
        }
      }
    };

    // Add left partition
    addSide(gridCount.left, 0, 0, 'left');
    
    // Add right partition
    addSide(gridCount.right, rightX, gridCount.left, 'right');

    // Add double partitions
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

  // Helper function to generate custom grid layout based on PhotoLayouts selection
  const generateCustomGridLayout = (layoutOption, stageWidth, stageHeight, padding, partition) => {
    const { preview, rowHeights = [], colWidths = [] } = layoutOption;
    const layout = [];
    let cellId = partition === 'left' ? 0 : gridCount.left;
    
    const numRows = preview.length;
    const numCols = Math.max(...preview.map(row => row.length));
    
    // Calculate partition dimensions
    const partitionWidth = (stageWidth - 40) / 2;
    const availableWidth = partitionWidth - padding * 2;
    const availableHeight = stageHeight - padding * 2;
    
    // Use provided row heights or default to equal distribution
    const rowHeightValues = rowHeights.length === numRows 
      ? rowHeights.map(h => parseFloat(h) / 100 * availableHeight)
      : Array(numRows).fill(availableHeight / numRows);
    
    // Use provided column widths or default to equal distribution
    const colWidthValues = colWidths.length === numCols
      ? colWidths.map(w => parseFloat(w) / 100 * availableWidth)
      : Array(numCols).fill(availableWidth / numCols);
    
    // Calculate starting position based on partition
    const totalGridWidth = colWidthValues.reduce((sum, width) => sum + width, 0) + padding * (numCols - 1);
    const totalGridHeight = rowHeightValues.reduce((sum, height) => sum + height, 0) + padding * (numRows - 1);
    
    const startX = partition === 'left' 
      ? (partitionWidth - totalGridWidth) / 2 
      : partitionWidth + 20 + (partitionWidth - totalGridWidth) / 2;
    const startY = (stageHeight - totalGridHeight) / 2;
    
    // Create grid cells based on the preview pattern
    let currentY = startY;
    for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
      let currentX = startX;
      const row = preview[rowIdx];
      const rowHeight = rowHeightValues[rowIdx];
      
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const cellValue = row[colIdx];
        if (cellValue > 0) { // Only create cells for positive values
          const colSpan = 1;
          const rowSpan = 1;
          
          const cellWidth = colWidthValues[colIdx] * colSpan + padding * (colSpan - 1);
          const cellHeight = rowHeight * rowSpan + padding * (rowSpan - 1);
          
          layout.push({
            x: currentX,
            y: currentY,
            width: cellWidth,
            height: cellHeight,
            id: cellId++,
            shape: "rect",
            partition: partition
          });
        }
        
        currentX += colWidthValues[colIdx] + padding;
      }
      
      currentY += rowHeight + padding;
    }
    
    // Add double partitions
    const sideWidth = (stageWidth - 40) / 2;
    layout.push({
      x: sideWidth + 10,
      y: padding,
      width: 2,
      height: stageHeight - 2 * padding,
      id: cellId++,
      shape: "line",
      partition: 'middle'
    });
    layout.push({
      x: sideWidth + 40 - 12,
      y: padding,
      width: 2,
      height: stageHeight - 2 * padding,
      id: cellId++,
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
          scale: 1,
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

        if (existingImageIndex !== -1) {
          const updatedImages = [...placedImages];
          updatedImages[existingImageIndex] = newImage;
          setPlacedImages(updatedImages);
        } else {
          setPlacedImages([...placedImages, newImage]);
        }
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
        }
      }
    }
  };

  const handleImageDelete = (imageId) => {
    setPlacedImages(placedImages.filter(img => img.id !== imageId));
    setSelectedImageIndex(null);
    setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
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
    }
  };

  const handleGridDragEnd = (index, e) => {
    const updatedPositions = [...gridPositions];
    updatedPositions[index].x = e.target.x();
    updatedPositions[index].y = e.target.y();
    setGridPositions(updatedPositions);
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
      updatedImages[imageIndex].scale = scaleX;
      updatedImages[imageIndex].rotation = rotation;
      setPlacedImages(updatedImages);
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
    }

    node.scaleX(1);
    node.scaleY(1);
  };

  const handleResize = (widthDelta, heightDelta) => {
    if (selectedImageIndex === null) return;

    const updatedImages = [...placedImages];
    const imageIndex = updatedImages.findIndex(img => img.gridId === selectedImageIndex);
    if (imageIndex !== -1) {
      // Only update the dimension that changed
      if (widthDelta !== 0) {
        updatedImages[imageIndex].width += widthDelta;
        updatedImages[imageIndex].width = Math.max(50, updatedImages[imageIndex].width);
      }
      if (heightDelta !== 0) {
        updatedImages[imageIndex].height += heightDelta;
        updatedImages[imageIndex].height = Math.max(50, updatedImages[imageIndex].height);
      }
      setPlacedImages(updatedImages);
    }
  };

  const handleZoom = (factor) => {
    if (selectedImageIndex === null) return;

    const updatedImages = [...placedImages];
    const imageIndex = updatedImages.findIndex(img => img.gridId === selectedImageIndex);
    if (imageIndex !== -1) {
      updatedImages[imageIndex].scale *= factor;
      updatedImages[imageIndex].scale = Math.max(0.1, Math.min(5, updatedImages[imageIndex].scale));
      setPlacedImages(updatedImages);
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
    area.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const updatedImages = [...placedImages];
        const imgIndex = updatedImages.findIndex(img => img.gridId === imageIndex);
        if (imgIndex !== -1) {
          updatedImages[imgIndex].texts[textIndex].text = area.value;
          setPlacedImages(updatedImages);
        }
        document.body.removeChild(area);
      }
    });
  };

  const handleContextMenu = (type, imageIndex, elementIndex, e) => {
    e.evt.preventDefault();
    setSelectedImageIndex(imageIndex);
    setContextMenu({
      visible: true,
      x: e.evt.clientX,
      y: e.evt.clientY,
      type,
      imageIndex,
      elementIndex,
    });
  };

  // Handle sticker placement when selectedSticker changes
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
        if (onStickerPlaced) onStickerPlaced(); // Reset sticker in parent
      }
    }
  }, [selectedSticker, selectedImageIndex, onStickerPlaced]);

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
  const [showPageLayout, setShowPageLayout] = useState(false)

  return (
    <>
    <div className="flex w-full">
      <div className="w-[100px] p-4 border-r space-y-4 bg-gray-100 border-2">
        {/* Text Tools */}
        <div onClick={handleAddText} className="border-[1px] p-[10px] rounded-[2px] border-[#E0E0E0] cursor-pointer w-[40px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0002 14.0007H6.00016M8.00016 2V14M8.00016 2C8.92483 2 极客时间 2.02 11.0588 2.11733C11.4588 2.15867 11.6588 2.17933 11.8362 2.252C12.0214 2.33032 12.187 极客时间 2.44855 12.3212 2.59824C12.4555 2.74793 12.555 2.92541 12.6128 3.118C12.6668 3.30267 12.6668 3.51333 12.极客时间 3.93467M8.00016 2C7.0755 2 5.88683 2.02 4.9415 2.11733C4.5415 2.15867 4.3415 2.17933 4.16416 2.252C3.97885 2.33024 3.81309 2.44843 3.67872 2.59813C3.54435 2.74783 3.44468 2.92534 3.38683 3.118C3.3335 3.30267 3.3335 3.51333 3.3335 3.93467" stroke="#A8C3A0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p className="font-semibold text-[8px] font-sans text-[#727273]">Text</p>
        </div>
        {/* Grid Count */}
        <div className="border-[1px] p-[极客时间] rounded-[2px] border-[#E0E0E0] cursor-pointer w-[40px] relative">
          <div className="flex items-center justify-center flex-col">
            <div onClick={() => setShowPageLayout(!showPageLayout)} className="flex items-center justify-center flex-col">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.6001 1.59961H5.6001V10.3996H1.6001V1.59961ZM6.4001 1.59961H10.4001V5.59961H极客时间 1V1.59961ZM11.2001 1.59961H14.4001V14.3996H11.2001V1.59961ZM6.4001 6.39961H10.4001V10.3996H6.4001V6.39961ZM1.6001 11.1996H10.4001V14.3996H1.6001V11.1996Z" fill="#A8C3A0" />
              </svg>
              <p className="font-semibold text-[8px] font-sans text-[#727273] text-center">Photo Layout</p>
            </div>
            {showPageLayout && (
              <div className="flex flex-col items-center mt-1 absolute -right-14 top-0 z-[100] bg-white p-2 rounded shadow">
                <div className="flex mb-2">
                  <button 
                    onClick={() => setSelectedPartition('left')} 
                    className={`px-2 py-1 text-xs ${selected极客时间 === 'left' ? 'bg-green-200' : 'bg-gray-100'} border rounded-l`}
                  >
                    Left
                  </button>
                  <button 
                    onClick={() => setSelectedPartition('right')} 
                    className={`px-2 py-1 text-xs ${selectedPartition === 'right' ? 'bg-green-200' : 'bg-gray-100'} border rounded-r`}
                  >
                    Right
                  </button>
                </div>
                <div className="flex">
                  <button onClick={() => setGridCount(prev => ({...prev, [selectedPartition]: Math.max(1, prev[selectedPartition] - 1)}))} className="px-2 py-[0.5px] bg-white border rounded-l">
                    -
                  </button>
                  <button onClick={() => setGridCount(prev => ({...prev, [selectedPartition]: Math.min(12, prev[selectedPartition] + 1)}))} className="px-2 py-[0.5px] bg-white border rounded-r">
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center bg-gray-200 relative">
        <Stage
          ref={stageRef}
          width={1200}
          height={800}
          onClick={() => {
            setSelectedImageIndex(null);
            setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
            setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null });
          }}
          onContextMenu={(e) => {
            setSelectedImageIndex(null);
            setSelected极客时间({ type: null, imageIndex: null, elementIndex: null });
            setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null });
          }}
        >
          <Layer>
            {/* Background Image */}
            <KonvaImage image={bgImage} width={1200} height={800} fill={bgType === 'plain' ? selectedBg : 'transparent'} />
            
            {/* Partition selection highlights */}
            <Rect
              x={0}
              y={0}
              width={580}
              height={800}
              fill={selectedPartition === 'left' ? 'rgba(168, 195, 160, 0.1)' : 'transparent'}
              stroke={selectedPartition === 'left' ? '#A8C3A0' : 'transparent'}
              strokeWidth={2}
              onClick={(e) => handlePartitionClick('left', e)}
            />
            <Rect
              x={600}
              y={0}
              width={580}
              height={800}
              fill={selectedPartition === 'right' ? 'rgba(168, 195, 160, 0.1)' : 'transparent'}
              stroke={selectedPartition === 'right' ? '#A8C3A0' : 'transparent'}
              strokeWidth={2}
              onClick={(e) => handlePartitionClick('right', e)}
            />
            
            {/* Grid Frames */}
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
                  onDragEnd={(e) => frame.shape === "rect" && handleGridDragEnd(frame.id, e)}
                  onClick={(e) => imageInThisGrid && handleImageClick(frame.id, e)}
                  onTransformEnd={(e) => frame.shape === "极客时间" && handleTransformEnd(frame.id, e)}
                  onContextMenu={(e) => image极客时间Grid && handleContextMenu('image', frame.id, null, e)}
                  scaleX={imageInThisGrid?.scale || 1}
                  scaleY={imageInThisGrid?.scale || 1}
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
                          x极客时间={text.x}
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
                          onDblClick={(极客时间) => handleTextDblClick(frame.id, textIndex, e)}
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
                            updatedImages[img极客时间].stickers[stickerIndex].y = e.target.y();
                            setPlacedImages(updatedImages);
                          }}
                        />
                      ))}
                    </>
                  )}
                </Group>
              );
            })}
            <Transformer ref={imageTransformerRef} />
            <Transformer ref={textTransformerRef} />
            <Transformer ref={stickerTransformerRef} />
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
            onResize={handleResize}
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
              style={{ padding: "2px 8px", cursor: "pointer", color: "极客时间" }}
            >
              Delete {contextMenu.type}
            </div>
          </div>
        )}
      </div>
    </div>
      </>
  );
}