// Modified PhotoAlbum.jsx
import AlbunMenuBar from '@/components/dashboardcomponents/photoAlbum/AlbunMenuBar';
import LeftSide from '@/components/dashboardcomponents/photoAlbum/LeftSide';
import MiddleSide from '@/components/dashboardcomponents/photoAlbum/MiddleSide';
import PageNavigation from '@/components/dashboardcomponents/photoAlbum/PageNavigation';
import RightSide from '@/components/dashboardcomponents/photoAlbum/RightSide';
import React, { useState } from 'react';

export default function PhotoAlbum() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [bgType, setBgType] = useState('plain');
  const [selectedBg, setSelectedBg] = useState('#D81B60');
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedPhotoLayout, setSelectedPhotoLayout] = useState(null);
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...newImages]);
  };
  const [activeLeftBar, setActiveLeftBar] = useState("Frames");

  const handleStickerSelect = (sticker) => {
    setSelectedSticker(sticker);
  };

  const handleTextSelect = (text) => {
    setSelectedText(text);
  };

  const handleLayoutSelect = (layout) => {
    setSelectedPhotoLayout(layout);
  };

  return (
    <section className='bg-[#F0F1F5] p-0'>
      <AlbunMenuBar />
      <div className='flex items-start justify-center'>
        <LeftSide activeLeftBar={activeLeftBar} setActiveLeftBar={setActiveLeftBar} />
        <MiddleSide 
          uploadedImages={uploadedImages} 
          handleImageUpload={handleImageUpload} 
          bgType={bgType} 
          setBgType={setBgType}
          selectedBg={selectedBg} 
          setSelectedBg={setSelectedBg}
          activeLeftBar={activeLeftBar} 
          setActiveLeftBar={setActiveLeftBar}
          onSelectSticker={handleStickerSelect}
          onSelectText={handleTextSelect}
          onSelectLayout={handleLayoutSelect} // Changed to onSelectLayout
        />
        <RightSide 
          bgType={bgType} 
          setBgType={setBgType}
          selectedBg={selectedBg} 
          setSelectedBg={setSelectedBg}
          selectedSticker={selectedSticker}
          onStickerPlaced={() => setSelectedSticker(null)}
          selectedText={selectedText}
          onTextPlaced={() => setSelectedText(null)}
          selectedPhotoLayout={selectedPhotoLayout}
          onLayoutApplied={() => setSelectedPhotoLayout(null)}
        />
      </div>
      
    
      {/* <PageNavigation /> */}
    </section>
  );
}