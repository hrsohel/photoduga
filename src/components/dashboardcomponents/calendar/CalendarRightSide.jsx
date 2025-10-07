import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Transformer, Image, Group, Text } from 'react-konva';
import useImage from 'use-image';
import { nanoid } from 'nanoid';
import TextEditingTools from './TextEditingTools';

const DraggableText = ({ shapeProps, isSelected, onSelect, onChange, onDblClick }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={(e) => onDblClick(e, shapeProps)}
        onDblTap={(e) => onDblClick(e, shapeProps)}
        ref={shapeRef}
        {...shapeProps}
        draggable
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
    </React.Fragment>
  );
};

const GridRect = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img] = useImage(shapeProps.image, 'Anonymous');

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
    <Group
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
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
      </Group>
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
    </React.Fragment>
  );
};

const CalendarRightSide = ({ selectedBg, bgType, selectedSticker, setSelectedSticker, isAddingText, setIsAddingText, gridLayout, calendarContainerRef }) => {
  console.log('CalendarRightSide: gridLayout at component start', gridLayout);
  const stageRef = useRef();
  const [grids, setGrids] = useState(() => {
    if (Array.isArray(gridLayout)) {
      return gridLayout;
    }
    return [{ x: 50, y: 50, width: 300, height: 200, id: 'grid-0' }];
  });
  const [stickers, setStickers] = useState([]);
  const [texts, setTexts] = useState([]);
  const [selectedId, selectShape] = useState(null);

  useEffect(() => {
    console.log('CalendarRightSide: gridLayout inside useEffect', gridLayout);
    if (Array.isArray(gridLayout)) {
      setGrids(gridLayout);
    }
  }, [gridLayout]);

  useEffect(() => {
    if (selectedSticker) {
      const newSticker = {
        id: 'sticker-' + nanoid(),
        text: selectedSticker,
        x: 100,
        y: 100,
        fontSize: 50,
      };
      setStickers([...stickers, newSticker]);
      if (setSelectedSticker) {
        setSelectedSticker(null);
      }
    }
  }, [selectedSticker, setSelectedSticker, stickers]);

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
          setTexts([...texts, newText]);
          setIsAddingText(false);
    }
  }, [isAddingText, setIsAddingText, texts]);

  const generateMonthDates = (year, month) => {
    const dates = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const startingDay = firstDayOfMonth.getDay();

    for (let i = 0; i < startingDay; i++) {
      dates.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
    return dates;
  };

  const currentYear = 2025; 
  const currentMonth = 9; 
  const monthDates = generateMonthDates(currentYear, currentMonth);

  const selectedText = texts.find(text => text.id === selectedId && text.id.startsWith('text-'));

  console.log('CalendarRightSide: selectedId:', selectedId);
  console.log('CalendarRightSide: texts:', texts);
  console.log('CalendarRightSide: selectedText:', selectedText);

  const handleUpdateText = (updatedText) => {
    const newTexts = texts.map((text) =>
      text.id === updatedText.id ? updatedText : text
    );
    setTexts(newTexts);
  };

  const handleTextDblClick = (e, index, shapeProps) => {    const textNode = e.target;
    const currentSelectedId = selectedId;
    selectShape(null);
    textNode.hide();

    const stage = textNode.getStage();
    const stageRect = stage.container().getBoundingClientRect();
    const textNodeAbsolutePosition = textNode.absolutePosition();

    const area = document.createElement('textarea');
    document.body.appendChild(area);

    area.value = textNode.text();
    area.style.position = 'absolute';
    area.style.top = (stageRect.top + textNodeAbsolutePosition.y) + 'px';
    area.style.left = (stageRect.left + textNodeAbsolutePosition.x) + 'px';
    area.style.width = shapeProps.width + 'px';
    area.style.height = shapeProps.height + 'px';
    area.style.fontSize = textNode.fontSize() + 'px';
    area.style.border = 'none';
    area.style.padding = '0px';
    area.style.margin = '0px';
    area.style.overflow = 'hidden';
    area.style.background = 'none';
    area.style.outline = 'none';
    area.style.resize = 'none';
    area.style.lineHeight = textNode.lineHeight();
    area.style.fontFamily = textNode.fontFamily();
    area.style.transformOrigin = 'left top';
    area.style.textAlign = textNode.align();
    area.style.color = textNode.fill();
    let rotation = textNode.rotation();
    let transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }

    let px = 0;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';

    area.style.transform = transform;
    area.style.height = 'auto';
    area.style.height = area.scrollHeight + 3 + 'px';

    area.focus();

    function removeTextarea() {
      area.parentNode.removeChild(area);
      window.removeEventListener('click', handleOutsideClick);
      textNode.show();
      selectShape(currentSelectedId);
    }

    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        newWidth = textNode.placeholder.length * textNode.fontSize();
      }
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }

      const isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      area.style.width = newWidth + 'px';
    }

    area.addEventListener('keydown', function (e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        const newTexts = texts.slice();
        newTexts[index] = {
            ...newTexts[index],
            text: area.value,
        };
        setTexts(newTexts);
        removeTextarea();
      }
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });

    area.addEventListener('keydown', function (e) {
      const scale = textNode.getAbsoluteScale().x;
      setTextareaWidth(shapeProps.width); // Use shapeProps.width here
      area.style.height = 'auto';
      area.style.height = area.scrollHeight + textNode.fontSize() + 'px';
    });

    function handleOutsideClick(e) {
      if (e.target !== area) {
        const newTexts = texts.slice();
        newTexts[index] = {
            ...newTexts[index],
            text: area.value,
        };
        setTexts(newTexts);
        removeTextarea();
      }
    }
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    });
  };

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace' && selectedId) {
        if (selectedId.startsWith('sticker-')) {
          const newStickers = stickers.filter((sticker) => sticker.id !== selectedId);
          setStickers(newStickers);
          selectShape(null);
        } else if (selectedId.startsWith('text-')) {
          const newTexts = texts.filter((text) => text.id !== selectedId);
          setTexts(newTexts);
          selectShape(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId, stickers, texts]);

  return (
    <div ref={calendarContainerRef} className="w-[400px] h-[750px] shadow-lg sticky top-0" style={style} onDrop={handleDrop} onDragOver={handleDragOver}>

      <Stage width={400} height={700} ref={stageRef} onMouseDown={(e) => { 
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            selectShape(null);
          }
        }}>
        <Layer>
          {grids.map((grid, i) => {
            return (
              <GridRect
                key={i}
                shapeProps={grid}
                isSelected={grid.id === selectedId}
                onSelect={() => {
                  selectShape(grid.id);
                }}
                onChange={(newAttrs) => {
                  const rects = grids.slice();
                  rects[i] = newAttrs;
                  setGrids(rects);
                }}
              />
            );
          })}
          {stickers.map((sticker, i) => {
            return (
              <DraggableText
                key={i}
                shapeProps={sticker}
                isSelected={sticker.id === selectedId}
                onSelect={() => {
                  selectShape(sticker.id);
                }}
                onChange={(newAttrs) => {
                  const stks = stickers.slice();
                  stks[i] = newAttrs;
                  setStickers(stks);
                }}
              />
            );
          })}
          {texts.map((text, i) => {
            return (
              <DraggableText
                key={i}
                shapeProps={text}
                isSelected={text.id === selectedId}
                onSelect={() => {
                  selectShape(text.id);
                }}
                onChange={(newAttrs) => {
                  const txts = texts.slice();
                  txts[i] = newAttrs;
                  setTexts(txts);
                }}
                onDblClick={(e, shapeProps) => handleTextDblClick(e, i, shapeProps)}
              />
            );
          })}
                            </Layer>
                        </Stage>

                              {selectedText && stageRef.current && (
                                <div
                                  className="absolute"
                                  style={{
                                    top: `${stageRef.current.container().getBoundingClientRect().top + selectedText.y + selectedText.height + 10}px`,
                                    left: `50%`,
                                    transform: 'translateX(-50%)',
                                    zIndex: 100,
                                  }}
                                >
                                  <TextEditingTools
                                    selectedText={selectedText}
                                    onUpdateText={handleUpdateText}
                                  />
                                </div>
                              )}                  
      <div className="calendar-display mt-4 p-2 absolute bottom-0 left-1/2 -translate-x-1/2 w-[250px] bg-white/50">
        <h3 className="text-lg font-semibold text-center mb-2">October 2025</h3>
        <div className="grid grid-cols-7 gap-0 text-center font-bold text-xs mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div
              key={index}
              className={`w-8 h-8 flex items-center justify-center ${index === 0 ? 'text-red-500' : index === 5 ? 'text-green-500' : 'text-black'}`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0 text-center text-xs">
          {monthDates.map((date, index) => (
            <div key={index} className="w-8 h-8 flex items-center justify-center">
              {date ? (
                <span
                  className={`font-bold ${date.getDay() === 0 
                      ? 'text-red-500'
                      : date.getDay() === 5 
                      ? 'text-green-500'
                      : 'text-black'
                  }`}
                >
                  {date.getDate()}
                </span>
              ) : (
                ''
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarRightSide;