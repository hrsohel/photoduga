import React from 'react';


const PageThumbnail = ({ page, thumbWidth = 96, thumbHeight = 80 }) => {
  const canvasWidth = 1180;
  const canvasHeight = 620;

  const scale = Math.min(thumbWidth / canvasWidth, thumbHeight / canvasHeight);

  const scaledContentWidth = canvasWidth * scale;
  const scaledContentHeight = canvasHeight * scale;

  const offsetX = (thumbWidth - scaledContentWidth) / 2;
  const offsetY = (thumbHeight - scaledContentHeight) / 2;

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
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: `${canvasWidth}px`, // Use original canvas dimensions for the inner div
        height: `${canvasHeight}px`, // Use original canvas dimensions for the inner div
        transform: `translate(-50%, -50%) scale(${scale})`,
        overflow: 'hidden', // Ensure content inside this scaled div is also clipped
      }}>
        {page.gridPositions && page.gridPositions.map((grid, index) => {
          if (grid.shape !== 'rect') return null; // Don't render the middle lines

          const gridStyle = {
            position: 'absolute',
            left: `${grid.x}px`, // Use original x
            top: `${grid.y}px`, // Use original y
            width: `${grid.width}px`, // Use original width
            height: `${grid.height}px`, // Use original height
            backgroundColor: 'rgba(240, 240, 240, 0.7)',
            border: '1px solid rgba(221, 221, 221, 0.7)',
            borderRadius: '2px',
          };

          return <div key={index} style={gridStyle}></div>;
        })}
        {page.canvasTexts && page.canvasTexts.map((text, index) => {
          const textStyle = {
            position: 'absolute',
            left: `${text.x}px`, // Use original x
            top: `${text.y}px`, // Use original y
            width: `${text.width}px`, // Use original width
            height: `${text.height}px`, // Use original height
            fontSize: `${text.fontSize}px`, // Use original fontSize
            fontFamily: text.fontFamily,
            color: text.fill,
            textAlign: text.align,
            textDecoration: text.textDecoration,
          };

          return <div key={index} style={textStyle}>{text.text}</div>;
        })}
      </div>
    </div>
    </>
  );
};

export default PageThumbnail;
