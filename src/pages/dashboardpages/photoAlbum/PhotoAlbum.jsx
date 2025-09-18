import LeftSide from '@/components/dashboardcomponents/photoAlbum/LeftSide'
import MiddleSide from '@/components/dashboardcomponents/photoAlbum/MiddleSide'
import RightSide from '@/components/dashboardcomponents/photoAlbum/RightSide'
import React, { useState } from 'react'

export default function PhotoAlbum() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...newImages]);
  };
  return (
    <section className='flex items-center justify-center bg-[#F0F1F5] p-0'>
      <LeftSide />
      <MiddleSide uploadedImages={uploadedImages} handleImageUpload={handleImageUpload} />
      <RightSide />
    </section>
  )
}
