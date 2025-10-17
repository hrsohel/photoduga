import React from 'react';

const CalendarPageThumbnail = ({ monthName, isSelected, monthData, monthIndex, thumbWidth = 96, thumbHeight = 180 }) => {
  const canvasWidth = 350; // Original canvas width from CalendarRightSide
  const canvasHeight = 720; // Original canvas height from CalendarRightSide

  const scaleX = thumbWidth / canvasWidth;
  const scaleY = thumbHeight / canvasHeight;

  const backgroundStyle = {
    width: `${thumbWidth}px`,
    height: `${thumbHeight}px`,
    position: 'relative',
    overflow: 'hidden',
    border: isSelected ? '2px solid #3B82F6' : '1px solid #D1D5DB',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };

  if (monthData.bgType === 'plain') {
    backgroundStyle.backgroundColor = monthData.selectedBg;
  } else if (monthData.bgType === 'image') {
    backgroundStyle.backgroundImage = `url(${monthData.selectedBg})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
  }

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
  const monthDates = generateMonthDates(currentYear, monthIndex);

  return (
    <div style={backgroundStyle} className='mx-auto'>
      {monthData.stickers.map((sticker, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${sticker.x * scaleX}px`,
            top: `${sticker.y * scaleY}px`,
            fontSize: `${sticker.fontSize * scaleY}px`,
            transform: `scaleX(${sticker.scaleX || 1}) scaleY(${sticker.scaleY || 1}) rotate(${sticker.rotation || 0}deg)`,
            transformOrigin: 'top left',
            whiteSpace: 'nowrap',
          }}
          className='mx-auto flex items-center justify-center'
        >
          {sticker.text}
        </div>
      ))}
      {monthData.texts.map((text, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${text.x * scaleX}px`,
            top: `${text.y * scaleY}px`,
            width: `${text.width * scaleX}px`,
            height: `${text.height * scaleY}px`,
            fontSize: `${text.fontSize * scaleY}px`,
            fontFamily: text.fontFamily,
            color: text.fill,
            textAlign: text.align,
            transform: `scaleX(${text.scaleX || 1}) scaleY(${text.scaleY || 1}) rotate(${text.rotation || 0}deg)`,
            transformOrigin: 'top left',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {text.text}
        </div>
      ))}
      {monthData.pages[0].layout && monthData.pages[0].layout.map((grid, index) => {
        const gridStyle = {
          position: 'absolute',
          left: `${grid.x * scaleX}px`,
          top: `${grid.y * scaleY}px`,
          width: `${grid.width * scaleX}px`,
          height: `${grid.height * scaleY}px`,
          backgroundColor: 'rgba(240, 240, 240, 0.7)',
          border: '1px solid rgba(221, 221, 221, 0.7)',
          borderRadius: '2px',
        };
        return <div key={index} style={gridStyle}></div>;
      })}
      <div
        style={{
          position: 'absolute',
          left: `${75 * scaleX}px`,
          top: `${500 * scaleY}px`,
          width: `${250 * scaleX}px`,
          height: `${200 * scaleY}px`,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          transformOrigin: 'top left',
        }}
        className=''
      >
        <div
          style={{
            fontSize: `${18 * scaleY}px`,
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
            paddingTop: `${10 * scaleY}px`,
          }}
        >
          {monthName} {currentYear}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            fontSize: `${10 * scaleY}px`,
            textAlign: 'center',
            paddingTop: `${40 * scaleY}px`,
          }}
        >
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <span key={index} style={{ fontWeight: 'bold', color: index === 0 ? 'red' : index === 5 ? 'green' : 'black' }}>{day}</span>
          ))}
          {monthDates.map((date, index) => (
            <span key={index} style={{ color: date && date.getDay() === 0 ? 'red' : date && date.getDay() === 5 ? 'green' : 'black' }}>
              {date ? date.getDate() : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPageThumbnail;

