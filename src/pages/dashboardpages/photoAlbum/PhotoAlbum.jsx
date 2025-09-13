import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Text, Group, Transformer } from "react-konva";
import useImage from "use-image";

// Layout definitions for grid
const layouts = {
  twoByThree: [
    { x: 100, y: 150, width: 200, height: 200 },
    { x: 350, y: 150, width: 200, height: 200 },
    { x: 600, y: 150, width: 200, height: 200 },
    { x: 100, y: 400, width: 200, height: 200 },
    { x: 350, y: 400, width: 200, height: 200 },
    { x: 600, y: 400, width: 200, height: 200 },
  ],
  threeByThree: [
    { x: 50, y: 100, width: 180, height: 180 },
    { x: 250, y: 100, width: 180, height: 180 },
    { x: 450, y: 100, width: 180, height: 180 },
    { x: 650, y: 100, width: 180, height: 180 },
    { x: 50, y: 320, width: 180, height: 180 },
    { x: 250, y: 320, width: 180, height: 180 },
    { x: 450, y: 320, width: 180, height: 180 },
    { x: 650, y: 320, width: 180, height: 180 },
    { x: 50, y: 540, width: 180, height: 180 },
  ],
};

const realImages = [
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1473448912268-2022ce7d4e6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1475113548510-1f9a63ef5e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80",
  "https://images.unsplash.com/photo-1468851508491-4f854ec88b97?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
];

// CORS-friendly sticker images (small icons)
const stickerImages = [
  "https://twemoji.maxcdn.com/v/latest/72x72/1f600.png",
  "https://twemoji.maxcdn.com/v/latest/72x72/1f60d.png",
  "https://twemoji.maxcdn.com/v/latest/72x72/1f602.png",
  "https://twemoji.maxcdn.com/v/latest/72x72/1f609.png",
  "https://twemoji.maxcdn.com/v/latest/72x72/1f60b.png"
];

const loadImage = async (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Attempt to handle CORS
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(new Image()); // Return a blank image on error
  });
};

function ImageEditor({ image, onClose, onDelete, onResize, onZoom, transformerRef, selectedImage }) {
  const handleZoomIn = () => {
    onZoom(selectedImage.scale * 1.1);
  };

  const handleZoomOut = () => {
    onZoom(selectedImage.scale * 0.9);
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
      <div>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <button onClick={onResize}>Apply Resize</button>
        <button onClick={onClose}>Close</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default function AlbumPage() {
  const [bgUrl, setBgUrl] = useState("https://via.placeholder.com/1200x800?text=Background");
  const [activeLayout, setActiveLayout] = useState("twoByThree");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedStickerIndex, setSelectedStickerIndex] = useState(null); // Track selected sticker
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, stickerIndex: null, imageIndex: null }); // Track context menu state
  const [images, setImages] = useState(
    realImages.map((src, i) => ({
      src,
      scale: 1,
      isSelected: false,
      x: layouts.twoByThree[i]?.x || 0,
      y: layouts.twoByThree[i]?.y || 0,
      stickers: [], // Array to store stickers for each grid cell
      zIndex: 0, // Add zIndex to manage overlap
    }))
  );

  const [bg] = useImage(bgUrl);
  const transformerRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState([]);
  const [loadedStickers, setLoadedStickers] = useState([]);
  const imageRefs = useRef(images.map(() => React.createRef()));
  const stickerRefs = useRef([]);

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = images.map((img) => loadImage(img.src));
      const loaded = await Promise.all(imagePromises);
      setLoadedImages(loaded);
    };
    loadImages();
  }, [images]);

  useEffect(() => {
    const loadStickers = async () => {
      const stickerPromises = stickerImages.map((src) => loadImage(src));
      const loaded = await Promise.all(stickerPromises);
      setLoadedStickers(loaded);
    };
    loadStickers();
  }, []);

  const handleImageClick = (index, e) => {
    e.cancelBubble = true; // Prevent event from bubbling to stage
    if (selectedStickerIndex !== null) {
      // Place the selected sticker on the clicked grid image
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      const updatedImages = [...images];
      const gridCell = layouts[activeLayout][index];
      const relativeX = pointerPosition.x - gridCell.x;
      const relativeY = pointerPosition.y - gridCell.y;

      updatedImages[index].stickers.push({
        src: stickerImages[selectedStickerIndex],
        x: relativeX,
        y: relativeY,
        scale: 1,
        width: 72, // Match the 72x72 size of Twemoji images
        height: 72,
      });
      setImages(updatedImages);
      setSelectedStickerIndex(null); // Reset sticker selection after placement
    } else {
      // Bring the clicked image to the front by updating its zIndex
      const updatedImages = [...images];
      const maxZIndex = Math.max(...images.map(img => img.zIndex), 0) + 1;
      updatedImages.forEach(img => img.zIndex = img.zIndex === maxZIndex ? 0 : img.zIndex); // Reset previous topmost
      updatedImages[index].zIndex = maxZIndex; // Set new topmost
      setImages(updatedImages);
      setSelectedImageIndex(index);
      if (transformerRef.current) {
        transformerRef.current.nodes([imageRefs.current[index].current]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  };

  const handleStageClick = (e) => {
    setSelectedImageIndex(null);
    setSelectedStickerIndex(null); // Deselect sticker on stage click
    setContextMenu({ visible: false, x: 0, y: 0, stickerIndex: null, imageIndex: null }); // Hide context menu
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  };

  const handleCloseEditor = () => {
    setSelectedImageIndex(null);
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      image: null,
      src: "https://via.placeholder.com/200x200?text=Add+Image",
      stickers: [],
      zIndex: 0, // Reset zIndex on deletion
    };
    setImages(updatedImages);
    setSelectedImageIndex(null);
  };

  const handleResizeImage = () => {
    if (selectedImageIndex === null || !transformerRef.current) return;

    const updatedImages = [...images];
    const selectedImage = updatedImages[selectedImageIndex];
    const node = transformerRef.current.nodes()[0];

    if (node) {
      selectedImage.width = node.width();
      selectedImage.height = node.height();
      selectedImage.scale = 1;

      node.scaleX(1);
      node.scaleY(1);

      setImages(updatedImages);
      transformerRef.current.getLayer().batchDraw();
    }
  };

  const handleZoomImage = (scale) => {
    if (selectedImageIndex === null) return;

    const updatedImages = [...images];
    updatedImages[selectedImageIndex].scale = scale;
    setImages(updatedImages);

    if (transformerRef.current && transformerRef.current.nodes().length > 0) {
      const node = transformerRef.current.nodes()[0];
      node.scaleX(scale);
      node.scaleY(scale);
      transformerRef.current.getLayer().batchDraw();
    }
  };

  const handleStickerClick = (index) => {
    setSelectedStickerIndex(index);
  };

  const handleStickerContextMenu = (e, imageIndex, stickerIndex) => {
    e.evt.preventDefault(); // Prevent default context menu
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    setContextMenu({
      visible: true,
      x: pointerPosition.x,
      y: pointerPosition.y,
      stickerIndex,
      imageIndex,
    });
  };

  const handleDeleteSticker = () => {
    if (contextMenu.visible && contextMenu.stickerIndex !== null && contextMenu.imageIndex !== null) {
      const updatedImages = [...images];
      updatedImages[contextMenu.imageIndex].stickers.splice(contextMenu.stickerIndex, 1);
      setImages(updatedImages);
      setContextMenu({ visible: false, x: 0, y: 0, stickerIndex: null, imageIndex: null });
    }
  };

  return (
    <div className="flex" onClick={() => setContextMenu({ visible: false, x: 0, y: 0, stickerIndex: null, imageIndex: null })}>
      {/* Sidebar */}
      <div className="w-[250px] p-4 border-r space-y-4 bg-gray-100">
        <h2 className="font-bold text-lg">Options</h2>

        {/* Layout Switch */}
        <div>
          <h3 className="font-semibold">Layouts</h3>
          <button
            onClick={() => setActiveLayout("twoByThree")}
            className="block mt-1 p-1 bg-white border rounded"
          >
            2 × 3 Grid
          </button>
          <button
            onClick={() => setActiveLayout("threeByThree")}
            className="block mt-1 p-1 bg-white border rounded"
          >
            3 × 3 Grid
          </button>
        </div>

        {/* Background Switch */}
        <div>
          <h3 className="font-semibold">Background</h3>
          <button
            onClick={() =>
              setBgUrl("https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1200&q=80")
            }
            className="block mt-1 p-1 bg-white border rounded"
          >
            Scenic
          </button>
          <button
            onClick={() =>
              setBgUrl("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80")
            }
            className="block mt-1 p-1 bg-white border rounded"
          >
            Beach
          </button>
        </div>

        {/* Sticker Selection */}
        <div>
          <h3 className="font-semibold">Stickers</h3>
          {stickerImages.map((sticker, index) => (
            <div
              key={index}
              onClick={() => handleStickerClick(index)}
              className={`block mt-1 p-1 border rounded ${selectedStickerIndex === index ? "bg-blue-200" : "bg-white"}`}
            >
              <img src={sticker} alt={`Sticker ${index + 1}`} style={{ width: 32, height: 32 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex justify-center items-center bg-gray-200">
        <Stage width={1200} height={800} onClick={handleStageClick}>
          <Layer>
            {/* Background */}
            <KonvaImage image={bg} width={1200} height={800} />

            {/* Grid Frames */}
            {images.map((img, i) => {
              const frame = layouts[activeLayout][i];
              if (!frame) return null; // Safeguard against index mismatch
              const image = loadedImages[i] || loadedImages[loadedImages.length - 1];
              const isTopmost = img.zIndex === Math.max(...images.map(img => img.zIndex));

              return (
                <Group
                  key={i}
                  x={frame.x}
                  y={frame.y}
                  draggable
                  onClick={(e) => handleImageClick(i, e)}
                  ref={imageRefs.current[i]}
                  scaleX={img.scale}
                  scaleY={img.scale}
                  zIndex={img.zIndex} // Apply zIndex to control overlap
                >
                  <KonvaImage
                    image={image}
                    width={frame.width}
                    height={frame.height}
                    cornerRadius={8}
                    stroke={isTopmost ? "blue" : "transparent"} // Highlight topmost image with blue border
                    strokeWidth={isTopmost ? 2 : 0}
                  />
                  {/* Render Stickers */}
                  {img.stickers.map((sticker, sIndex) => {
                    const stickerImage = loadedStickers[stickerImages.indexOf(sticker.src)] || new Image();
                    return (
                      <KonvaImage
                        key={`sticker-${i}-${sIndex}`}
                        image={stickerImage}
                        x={sticker.x}
                        y={sticker.y}
                        width={sticker.width}
                        height={sticker.height}
                        scaleX={sticker.scale}
                        scaleY={sticker.scale}
                        draggable
                        onDragEnd={(e) => {
                          const updatedImages = [...images];
                          updatedImages[i].stickers[sIndex].x = e.target.x();
                          updatedImages[i].stickers[sIndex].y = e.target.y();
                          setImages(updatedImages);
                        }}
                        onContextMenu={(e) => handleStickerContextMenu(e, i, sIndex)}
                      />
                    );
                  })}
                </Group>
              );
            })}

            {/* Example Title */}
            <Text
              text="My Album"
              x={50}
              y={30}
              fontSize={32}
              fill="white"
              shadowColor="black"
              shadowBlur={4}
            />
            
            {/* Transformer for resizing the selected image */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 30 || newBox.height < 30) {
                  return oldBox;
                }
                return newBox;
              }}
              keepRatio={true}
              resizeEnabled={true}
              rotateEnabled={true}
            />
          </Layer>
        </Stage>

        {/* Context Menu for Sticker Deletion */}
        {contextMenu.visible && (
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
            <div onClick={handleDeleteSticker} style={{ padding: "2px 8px", cursor: "pointer" }}>
              Delete Sticker
            </div>
          </div>
        )}

        {/* Image Editor Modal */}
        {selectedImageIndex !== null && images[selectedImageIndex] && (
          <ImageEditor
            image={images[selectedImageIndex]}
            onClose={handleCloseEditor}
            onDelete={() => handleDeleteImage(selectedImageIndex)}
            onResize={handleResizeImage}
            onZoom={handleZoomImage}
            transformerRef={transformerRef}
            selectedImage={images[selectedImageIndex]}
          />
        )}
      </div>
    </div>
  );
}