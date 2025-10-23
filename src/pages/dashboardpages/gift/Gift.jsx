import AlbumMenuBar from '@/components/dashboardcomponents/gift/AlbumMenuBar'
import LeftSide from '@/components/dashboardcomponents/gift/LeftSide'
import RightSide from '@/components/dashboardcomponents/gift/RightSide'
import React, { useState } from 'react'

export default function Gift() {
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setUploadedImages(prevImages => [...prevImages, ...newImages]);
    };

    return (
        <section>
            <AlbumMenuBar />
            <div className="flex">
                <div className="w-[25%]">
                    <LeftSide uploadedImages={uploadedImages} handleImageUpload={handleImageUpload} />
                </div>
                <div className="w-[75%]">
                    <RightSide />
                </div>
            </div>
        </section>
    )
}
