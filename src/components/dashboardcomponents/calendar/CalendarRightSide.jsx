import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Transformer, Image, Group, Text } from 'react-konva';
import useImage from 'use-image';
import { nanoid } from 'nanoid';

const Sticker = ({ stickerProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    console.log("Sticker useEffect: isSelected", isSelected);
    console.log("Sticker useEffect: shapeRef.current", shapeRef.current);
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={shapeRef}
        text={stickerProps.text}
        x={stickerProps.x}
        y={stickerProps.y}
        fontSize={stickerProps.fontSize}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...stickerProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onDragStart={(e) => {
          e.cancelBubble = true;
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...stickerProps,
            x: node.x(),
            y: node.y(),
            fontSize: stickerProps.fontSize * scaleX, // Scale font size
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const GridRect = ({ shapeProps, isSelected, onSelect, onChange, onStickerChange, selectedElement, setSelectedElement }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img] = useImage(shapeProps.image, 'Anonymous');

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <Group
      onClick={(e) => {
        onSelect();
        setSelectedElement({ type: 'grid', id: shapeProps.id });
      }}
      onTap={(e) => {
        onSelect();
        setSelectedElement({ type: 'grid', id: shapeProps.id });
      }}
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
        });
      }}
      x={shapeProps.x}
      y={shapeProps.y}
      draggable
    >
      <Rect
        ref={shapeRef}
        x={0}
        y={0}
        width={shapeProps.width}
        height={shapeProps.height}
        fill={shapeProps.image ? 'transparent' : 'rgba(240, 240, 240, 0.5)'}
        stroke="black"
        strokeWidth={2}
      />
      {img && (
        <Image
            image={img}
            x={0}
            y={0}
            width={shapeProps.width}
            height={shapeProps.height}
            />
      )}
      {shapeProps.stickers && shapeProps.stickers.map((sticker, i) => (
        <Sticker
          key={sticker.id}
          stickerProps={sticker}
          isSelected={selectedElement && selectedElement.type === 'sticker' && selectedElement.id === sticker.id}
          onSelect={() => setSelectedElement({ type: 'sticker', id: sticker.id, gridId: shapeProps.id })}
          onChange={(newAttrs) => onStickerChange(shapeProps.id, sticker.id, newAttrs)}
        />
      ))}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Group>
  );
};

const CalendarRightSide = ({ selectedBg, bgType, selectedSticker, setSelectedSticker }) => {
  const stageRef = useRef();
  const [grids, setGrids] = useState([{ x: 50, y: 50, width: 300, height: 200, id: "0", stickers: [] }]);
  const [selectedElement, setSelectedElement] = useState({ type: null, id: null, gridId: null });

  const gridTransformerRef = useRef();
  const stickerTransformerRef = useRef();

  useEffect(() => {
    if (selectedElement.type === 'grid' && selectedElement.id !== null) {
      const node = stageRef.current.findOne('#' + selectedElement.id);
      if (node && gridTransformerRef.current) {
        gridTransformerRef.current.nodes([node]);
        gridTransformerRef.current.getLayer().batchDraw();
      }
    } else if (selectedElement.type === 'sticker' && selectedElement.id !== null && selectedElement.gridId !== null) {
      const gridNode = stageRef.current.findOne('#' + selectedElement.gridId);
      const stickerNode = gridNode?.findOne('#' + selectedElement.id);
      if (stickerNode && stickerTransformerRef.current) {
        stickerTransformerRef.current.nodes([stickerNode]);
        stickerTransformerRef.current.getLayer().batchDraw();
      }
    } else {
      if (gridTransformerRef.current) gridTransformerRef.current.nodes([]);
      if (stickerTransformerRef.current) stickerTransformerRef.current.nodes([]);
    }
  }, [selectedElement]);

  useEffect(() => {
    if (selectedSticker && selectedElement.type === 'grid' && selectedElement.id !== null) {
      const newGrids = grids.map((grid) => {
        if (grid.id === selectedElement.id) {
          const newSticker = {
            id: nanoid(), // Generate unique ID for sticker
            text: selectedSticker,
            x: grid.width / 2 - 15, // Center sticker initially
            y: grid.height / 2 - 15,
            fontSize: 30,
          };
          return { ...grid, stickers: [...grid.stickers, newSticker] };
        }
        return grid;
      });
      setGrids(newGrids);
      setSelectedSticker(null); // Clear selected sticker after placing
    }
  }, [selectedSticker, selectedElement, grids, setSelectedSticker]);

  const style = {
    backgroundColor: bgType === 'plain' ? selectedBg : 'transparent',
    backgroundImage: bgType === 'image' ? `url(${selectedBg})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData('imageUrl');
    const stage = stageRef.current;
    
    // Calculate pointer position relative to the stage container
    const containerRect = stage.container().getBoundingClientRect();
    const point = {
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    };

    const targetGrid = grids.find(
        (grid) => 
        point.x > grid.x &&
        point.x < grid.x + grid.width &&
        point.y > grid.y &&
        point.y < grid.y + grid.height
    );

    if (targetGrid) {
        const newGrids = grids.map((grid) => {
            if (grid.id === targetGrid.id) {
                return {
                    ...grid,
                    image: imageUrl,
                };
            }
            return grid;
        });
        setGrids(newGrids);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleStickerChange = (gridId, stickerId, newAttrs) => {
    const newGrids = grids.map((grid) => {
      if (grid.id === gridId) {
        const updatedStickers = grid.stickers.map((sticker) => 
          sticker.id === stickerId ? { ...sticker, ...newAttrs } : sticker
        );
        return { ...grid, stickers: updatedStickers };
      }
      return grid;
    });
    setGrids(newGrids);
  };

  return (
    <div className="w-[400px] h-[700px] shadow-lg sticky top-0" style={style} onDrop={handleDrop} onDragOver={handleDragOver}>
      <Stage width={400} height={700} ref={stageRef}>
        <Layer>
          {grids.map((grid, i) => {
            return (
              <GridRect
                key={grid.id}
                shapeProps={grid}
                isSelected={selectedElement && selectedElement.type === 'grid' && selectedElement.id === grid.id}
                onSelect={() => {
                  setSelectedElement({ type: 'grid', id: grid.id });
                }}
                onChange={(newAttrs) => {
                  const rects = grids.slice();
                  const index = rects.findIndex(r => r.id === newAttrs.id);
                  if (index !== -1) {
                    rects[index] = newAttrs;
                    setGrids(rects);
                  }
                }}
                onStickerChange={handleStickerChange}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
              />
            );
          })}
          <Transformer ref={gridTransformerRef} keepRatio={false} />
          <Transformer ref={stickerTransformerRef} keepRatio={false} enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']} />
        </Layer>
      </Stage>
    </div>
  );
};

export default CalendarRightSide;
