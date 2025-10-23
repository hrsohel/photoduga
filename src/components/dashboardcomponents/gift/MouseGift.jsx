import React, { useState } from 'react';

export default function MouseGift() {
    const [image, setImage] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const imageUrl = e.dataTransfer.getData('imageUrl');
        if (imageUrl) {
            setImage(imageUrl);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-[90vh]'>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className='w-[600px] h-[600px] border-2 border-dashed border-gray-400 flex items-center justify-center relative'
            >
                {image ? (
                    <img src={image} alt="dropped" className="w-full h-full object-cover" />
                ) : (
                    <p>Drag and drop an image here</p>
                )}
            </div>
        </div>
    );
}