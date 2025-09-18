import React, {useState, useRef, useEffect} from "react";
import { Stage, Layer, Image as KonvaImage, Text, Group, Transformer, Rect } from "react-konva";
import useImage from "use-image";
import { stickerImages } from "../../../data/imagesForPhotoAlbum"; // Assuming you have this

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
          <button onClick={() => handleResize(10, 10)} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
            Increase Size
          </button>
          <button onClick={() => handleResize(-10, -10)} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
            Decrease Size
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

// Sticker Picker Component
function StickerPicker({ onSelectSticker, onClose, selectedStickerIndex }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "60px",
        right: "20px",
        zIndex: 10,
        background: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        maxWidth: "300px",
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3>Select Sticker</h3>
        <button onClick={onClose} style={{ padding: '5px 10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          ×
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {stickerImages.map((sticker, index) => (
          <div
            key={index}
            onClick={() => onSelectSticker(index)}
            style={{
              padding: '5px',
              cursor: 'pointer',
              background: selectedStickerIndex === index ? '#e6f3ff' : 'transparent',
              borderRadius: '4px',
            }}
          >
            <img src={sticker} alt={`Sticker ${index + 1}`} style={{ width: 32, height: 32 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RightSide() {
  const [bgUrl, setBgUrl] = useState("https://via.placeholder.com/1200x800?text=Background");
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
  const [selectedStickerIndex, setSelectedStickerIndex] = useState(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [gridCount, setGridCount] = useState(4);
  const [gridPositions, setGridPositions] = useState([]);
  const [placedImages, setPlacedImages] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const [loadedStickers, setLoadedStickers] = useState([]);
  const stageRef = useRef();
  const gridRefs = useRef([]);
  const imageTransformerRef = useRef();
  const textTransformerRef = useRef();
  const stickerTransformerRef = useRef();
  const [bg] = useImage(bgUrl);

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = placedImages.map((img) => loadImage(img.src));
      const loaded = await Promise.all(imagePromises);
      setLoadedImages(loaded);
    };
    loadImages();
  }, [placedImages]);

  useEffect(() => {
    const loadStickers = async () => {
      const stickerPromises = stickerImages.map((src) => loadImage(src));
      const loaded = await Promise.all(stickerPromises);
      setLoadedStickers(loaded);
    };
    loadStickers();
  }, []);

  useEffect(() => {
    const initialLayout = getCurrentGridLayout();
    setGridPositions(initialLayout);
    gridRefs.current = initialLayout.map(() => React.createRef());
    setPlacedImages(prev => {
      return prev
        .filter(img => img.gridId < gridCount)
        .map(img => {
          const newCell = initialLayout.find(pos => pos.id === img.gridId && pos.shape === "rect");
          if (newCell) {
            return { ...img, width: newCell.width, height: newCell.height };
          }
          return img;
        });
    });
  }, [gridCount]);

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
      if (e.key === 'Backspace' && selectedImageIndex !== null) {
        const updatedImages = placedImages.filter(img => img.gridId !== selectedImageIndex);
        setPlacedImages(updatedImages);
        setSelectedImageIndex(null);
        setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, placedImages]);

  const handleImageClick = (index, e) => {
    e.cancelBubble = true;
    if (selectedStickerIndex !== null) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      const gridCell = gridPositions[index];
      const relativeX = pointerPosition.x - gridCell.x;
      const relativeY = pointerPosition.y - gridCell.y;
      const updatedImages = [...placedImages];
      const imageIndex = updatedImages.findIndex(img => img.gridId === index);
      if (imageIndex !== -1) {
        updatedImages[imageIndex].stickers.push({
          src: stickerImages[selectedStickerIndex],
          x: relativeX,
          y: relativeY,
          width: 72,
          height: 72,
          scale: 1,
        });
        setPlacedImages(updatedImages);
        setSelectedStickerIndex(null);
      }
    } else {
      setSelectedElement({ type: 'image', imageIndex: index, elementIndex: null });
      setSelectedImageIndex(index);
      setContextMenu({ visible: true, x: e.evt.clientX, y: e.evt.clientY, type: 'image', imageIndex: index });
    }
  };

  const handleElementClick = (type, imageIndex, elementIndex, e) => {
    e.cancelBubble = true;
    setSelectedElement({ type, imageIndex, elementIndex });
    setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null });
  };

  const getCurrentGridLayout = () => {
    const stageWidth = 1200;
    const stageHeight = 800;
    const padding = 20;
    const middleGap = 40;
    const maxCellSize = 200;
    const sideWidth = (stageWidth - middleGap) / 2;
    const rightX = sideWidth + middleGap;
    let layout = [];
    const leftCount = Math.floor(gridCount / 2);
    const rightCount = gridCount - leftCount;

    const addSide = (count, startX, baseId) => {
      if (count === 0) return;
      const cols = Math.ceil(Math.sqrt(count));
      const rows = Math.ceil(count / cols);
      const calculatedWidth = (sideWidth - padding * (cols + 1)) / cols;
      const calculatedHeight = (stageHeight - padding * (rows + 1)) / rows;
      const cellSize = Math.min(calculatedWidth, calculatedHeight, maxCellSize);
      const totalHeight = rows * cellSize + (rows - 1) * padding;
      const startY = (stageHeight - totalHeight) / 2;
      let k = 0;
      for (let i = 0; i < rows; i++) {
        let cellsInRow = cols;
        if (i === rows - 1 && count % cols !== 0 && count % cols > 0) {
          cellsInRow = count % cols;
        }
        const totalRowWidth = cellsInRow * cellSize + (cellsInRow - 1) * padding;
        const startXRow = startX + (sideWidth - totalRowWidth) / 2;
        for (let j = 0; j < cellsInRow; j++) {
          const x = startXRow + j * (cellSize + padding);
          const y = startY + i * (cellSize + padding);
          layout.push({
            x,
            y,
            width: cellSize,
            height: cellSize,
            id: baseId + k,
            shape: "rect",
          });
          k++;
        }
      }
    };

    addSide(leftCount, 0, 0);
    addSide(rightCount, rightX, leftCount);

    // Add double partitions
    layout.push({
      x: sideWidth + 10,
      y: padding,
      width: 2,
      height: stageHeight - 2 * padding,
      id: gridCount,
      shape: "line",
    });
    layout.push({
      x: sideWidth + middleGap - 12,
      y: padding,
      width: 2,
      height: stageHeight - 2 * padding,
      id: gridCount + 1,
      shape: "line",
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
    if (!imageUrl) return;

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
      updatedImages[imgIndex].stickers[stickerIndex].scale = node.scaleX();
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
      updatedImages[imageIndex].width += widthDelta;
      updatedImages[imageIndex].height += heightDelta;
      updatedImages[imageIndex].width = Math.max(50, updatedImages[imageIndex].width);
      updatedImages[imageIndex].height = Math.max(50, updatedImages[imageIndex].height);
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

  return (
    <div className="flex w-full">
      <div className="w-[100px] p-4 border-r space-y-4 bg-gray-100 border-2">
        {/* Text Tools */}
        <div onClick={handleAddText} className="border-[1px] p-[10px] rounded-[2px] border-[#E0E0E0] cursor-pointer w-[40px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0002 14.0007H6.00016M8.00016 2V14M8.00016 2C8.92483 2 10.1135 2.02 11.0588 2.11733C11.4588 2.15867 11.6588 2.17933 11.8362 2.252C12.0214 2.33032 12.187 2.44855 12.3212 2.59824C12.4555 2.74793 12.555 2.92541 12.6128 3.118C12.6668 3.30267 12.6668 3.51333 12.6668 3.93467M8.00016 2C7.0755 2 5.88683 2.02 4.9415 2.11733C4.5415 2.15867 4.3415 2.17933 4.16416 2.252C3.97885 2.33024 3.81309 2.44843 3.67872 2.59813C3.54435 2.74783 3.44468 2.92534 3.38683 3.118C3.3335 3.30267 3.3335 3.51333 3.3335 3.93467" stroke="#A8C3A0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p className="font-semibold text-[8px] font-sans text-[#727273]">Text</p>
        </div>
        {/* Sticker Tools */}
        {/* <div>
          <button
            onClick={() => setShowStickerPicker(true)}
            className="block mt-1 p-2 bg-orange-500 text-white rounded w-full"
          >
            Select Sticker
          </button>
        </div> */}
        {/* Grid Count */}
        <div className="border-[1px] p-[10px] rounded-[2px] border-[#E0E0E0] cursor-pointer w-[40px] relative">
          <div className="flex items-center justify-center flex-col">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.6001 1.59961H5.6001V10.3996H1.6001V1.59961ZM6.4001 1.59961H10.4001V5.59961H6.4001V1.59961ZM11.2001 1.59961H14.4001V14.3996H11.2001V1.59961ZM6.4001 6.39961H10.4001V10.3996H6.4001V6.39961ZM1.6001 11.1996H10.4001V14.3996H1.6001V11.1996Z" fill="#A8C3A0" />
            </svg>
            <p className="font-semibold text-[8px] font-sans text-[#727273] text-center">Photo Layout</p>
            <div className="flex items-center mt-1 absolute -right-14 top-0 z-[100]">
              <button onClick={() => setGridCount((prev) => Math.max(1, prev - 1))} className="px-2 py-[0.5px] bg-white border rounded-l">
                -
              </button>
              <button onClick={() => setGridCount((prev) => Math.min(12, prev + 1))} className="px-2 py-[0.5px] bg-white border rounded-r">
                +
              </button>
            </div>
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
            setSelectedStickerIndex(null);
          }}
          onContextMenu={(e) => {
            setSelectedImageIndex(null);
            setSelectedElement({ type: null, imageIndex: null, elementIndex: null });
            setContextMenu({ visible: false, x: 0, y: 0, type: null, imageIndex: null });
            setSelectedStickerIndex(null);
          }}
        >
          <Layer>
            {/* Background Image */}
            <KonvaImage image={bg} width={1200} height={800} />
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
                  onTransformEnd={(e) => frame.shape === "rect" && handleTransformEnd(frame.id, e)}
                  onContextMenu={(e) => imageInThisGrid && handleContextMenu('image', frame.id, null, e)}
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
                    <>
                      <Text
                        text="Drag here"
                        x={0}
                        y={frame.height / 2 - 20}
                        width={frame.width}
                        align="center"
                        fontSize={20}
                        fill="gray"
                      />
                      <Text
                        text="🖼️+"
                        x={0}
                        y={frame.height / 2 + 10}
                        width={frame.width}
                        align="center"
                        fontSize={30}
                        fill="gray"
                      />
                    </>
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
                          }}
                        />
                      ))}
                      {imageInThisGrid.stickers.map((sticker, stickerIndex) => {
                        const stickerImage = loadedStickers[stickerImages.indexOf(sticker.src)] || new Image();
                        return (
                          <KonvaImage
                            key={`sticker-${stickerIndex}`}
                            name={`sticker-${stickerIndex}`}
                            image={stickerImage}
                            x={sticker.x}
                            y={sticker.y}
                            width={sticker.width}
                            height={sticker.height}
                            scaleX={sticker.scale}
                            scaleY={sticker.scale}
                            draggable
                            onClick={(e) => handleElementClick('sticker', frame.id, stickerIndex, e)}
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
                            }}
                            onTransformEnd={(e) => handleStickerTransformEnd(frame.id, stickerIndex, e)}
                            onContextMenu={(e) => handleContextMenu('sticker', frame.id, stickerIndex, e)}
                          />
                        );
                      })}
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

        {showStickerPicker && (
          <StickerPicker
            onSelectSticker={(index) => {
              setSelectedStickerIndex(index);
              setShowStickerPicker(false);
            }}
            onClose={() => setShowStickerPicker(false)}
            selectedStickerIndex={selectedStickerIndex}
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
  );
}