import React from 'react';


const PageThumbnail = ({ page }) => {
  const canvasWidth = 1280;
  const canvasHeight = 650;
  const thumbWidth = 96; // w-24
  const thumbHeight = 80; // h-20

  const scaleX = thumbWidth / canvasWidth;
  const scaleY = thumbHeight / canvasHeight;

  const backgroundStyle = {
    width: `${thumbWidth}px`,
    height: `${thumbHeight}px`,
    position: 'relative',
    overflow: 'hidden',
  };

  if (page.bgType === 'plain') {
    backgroundStyle.backgroundColor = page.selectedBg;
  } else if (page.bgType === 'image') {
    backgroundStyle.backgroundImage = `url(${page.selectedBg})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
  }

  return (
    <>
    <div style={backgroundStyle}>
      {page.gridPositions && page.gridPositions.map((grid, index) => {
        if (grid.shape !== 'rect') return null; // Don't render the middle lines

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
      {page.canvasTexts && page.canvasTexts.map((text, index) => {
        const textStyle = {
          position: 'absolute',
          left: `${text.x * scaleX}px`,
          top: `${text.y * scaleY}px`,
          width: `${text.width * scaleX}px`,
          height: `${text.height * scaleY}px`,
          fontSize: `${text.fontSize * scaleY}px`,
          fontFamily: text.fontFamily,
          color: text.fill,
          textAlign: text.align,
          textDecoration: text.textDecoration,
          whiteSpace: 'nowrap',
        };

        return <div key={index} style={textStyle}>{text.text}</div>;
      })}
    </div>
    </>
  );
};

export default PageThumbnail;
