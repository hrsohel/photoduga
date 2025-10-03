
import React, { useRef, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { ItemTypes } from '@/components/dashboardcomponents/photoAlbum/ItemTypes';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import html2canvas from 'html2canvas';
import { nanoid } from 'nanoid';

const DraggableText = ({ id, text, left, top, onMove, onEnd, onDoubleClick }) => {
  const ref = useRef(null);
  const [, drag] = useDrag({
    type: ItemTypes.TEXT,
    item: { id, left, top, text, type: ItemTypes.TEXT },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newLeft = Math.round(item.left + delta.x);
        const newTop = Math.round(item.top + delta.y);
        onEnd(id, newLeft, newTop);
      }
    },
  });

  drag(ref);

  return (
    <div
      ref={ref}
      style={{ left, top, position: 'absolute', cursor: 'move' }}
      onDoubleClick={() => onDoubleClick(id, text)}
    >
      {text}
    </div>
  );
};

const CalendarRightSide = ({ currentPage, pages, setPages, addText }) => {
  const calendarRef = useRef();
  const [editingText, setEditingText] = useState(null);

  const [, drop] = useDrop(() => ({ 
    accept: [ItemTypes.IMAGE, ItemTypes.TEXT],
    drop: (item, monitor) => {
      if (item.type === ItemTypes.TEXT) {
        const delta = monitor.getDifferenceFromInitialOffset();
        const newLeft = Math.round(item.left + delta.x);
        const newTop = Math.round(item.top + delta.y);
        moveText(item.id, newLeft, newTop);
      }
    }
  }));

  const moveText = (id, left, top) => {
    const newPages = pages.map((p) => {
      if (p.id === currentPage.id) {
        const newElements = p.elements.map((el) => {
          if (el.id === id) {
            return { ...el, left, top };
          }
          return el;
        });
        return { ...p, elements: newElements };
      }
      return p;
    });
    setPages(newPages);
  };

  const handleAddText = () => {
    const newText = {
      id: nanoid(),
      type: 'text',
      text: 'New Text',
      left: 50,
      top: 50,
    };
    const newPages = pages.map((p) => {
      if (p.id === currentPage.id) {
        return { ...p, elements: [...p.elements, newText] };
      }
      return p;
    });
    setPages(newPages);
  };

  const handleDoubleClick = (id, text) => {
    setEditingText({ id, text });
  };

  const handleTextChange = (e) => {
    setEditingText({ ...editingText, text: e.target.value });
  };

  const handleSaveText = () => {
    const newPages = pages.map((p) => {
      if (p.id === currentPage.id) {
        const newElements = p.elements.map((el) => {
          if (el.id === editingText.id) {
            return { ...el, text: editingText.text };
          }
          return el;
        });
        return { ...p, elements: newElements };
      }
      return p;
    });
    setPages(newPages);
    setEditingText(null);
  };

  const handleDateClick = (date) => {
    const newPages = pages.map((p) => {
      if (p.id === currentPage.id) {
        const selectedDates = p.selectedDates || [];
        const dateIndex = selectedDates.findIndex(
          (d) => d.getTime() === date.getTime()
        );
        if (dateIndex > -1) {
          return {
            ...p,
            selectedDates: selectedDates.filter((_, i) => i !== dateIndex),
          };
        } else {
          return { ...p, selectedDates: [...selectedDates, date] };
        }
      }
      return p;
    });
    setPages(newPages);
  };

  const handleSave = () => {
    if (calendarRef.current) {
      html2canvas(calendarRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'calendar.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  return (
    <div className="w-[400px] h-[600px] bg-white shadow-lg relative" ref={drop}>
        <div ref={calendarRef} className='w-full h-full'>
      {currentPage.layout.type === 'cover' ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-full h-3/4 bg-gray-200"></div>
          <h1 className="text-4xl font-bold mt-4">{currentPage.layout.text}</h1>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col">
          <div className={`grid grid-cols-${currentPage.layout.cols} grid-rows-${currentPage.layout.rows} gap-2 p-2 flex-1`}>
            {currentPage.layout.grid.map((cell, index) => (
              <div key={index} className="bg-gray-200 w-full h-full"></div>
            ))}
          </div>
          <div className="p-2">
            <Calendar
              selected={currentPage.selectedDates}
              onDayClick={handleDateClick}
            />
          </div>
        </div>
      )}
      {currentPage.elements.map((el) => {
        if (el.type === 'text') {
          return <DraggableText key={el.id} {...el} onMove={moveText} onEnd={moveText} onDoubleClick={handleDoubleClick} />;
        }
        return null;
      })}
      </div>
      {editingText && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <input type="text" value={editingText.text} onChange={handleTextChange} />
            <Button onClick={handleSaveText}>Save</Button>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 right-4">
        <Button onClick={handleSave}>Save as PNG</Button>
      </div>
      <div className="absolute top-4 right-4">
        <Button onClick={handleAddText}>Add Text</Button>
      </div>
    </div>
  );
};

export default CalendarRightSide;
