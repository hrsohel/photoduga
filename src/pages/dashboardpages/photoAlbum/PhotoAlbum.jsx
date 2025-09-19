import AlbunMenuBar from '@/components/dashboardcomponents/photoAlbum/AlbunMenuBar';
import LeftSide from '@/components/dashboardcomponents/photoAlbum/LeftSide';
import MiddleSide from '@/components/dashboardcomponents/photoAlbum/MiddleSide';
import RightSide from '@/components/dashboardcomponents/photoAlbum/RightSide';
import React, { useState } from 'react';

export default function PhotoAlbum() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [bgType, setBgType] = useState('plain');
  const [selectedBg, setSelectedBg] = useState('#D81B60');
  const [selectedSticker, setSelectedSticker] = useState(null); // Manage sticker state at the top level
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...newImages]);
  };
  const [activeLeftBar, setActiveLeftBar] = useState("Frames");

  const handleStickerSelect = (sticker) => {
    setSelectedSticker(sticker); // Update sticker state when selected
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
          onSelectSticker={handleStickerSelect} // Pass sticker selection handler
        />
        <RightSide 
          bgType={bgType} 
          setBgType={setBgType}
          selectedBg={selectedBg} 
          setSelectedBg={setSelectedBg}
          selectedSticker={selectedSticker} // Pass the selected sticker
          onStickerPlaced={() => setSelectedSticker(null)} // Reset sticker after placement
        />
      </div>
    </section>
  );
}