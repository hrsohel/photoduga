import { frameCategories } from '@/data/imagesForPhotoAlbum';
import React, { useState } from 'react'

export default function CalendarFrames() {
    const [selectedCategory, setSelectedCategory] = useState('Simple');

    return (
        <div className='w-[300px] bg-white p-6 h-[91vh] sticky top-0 border-l-[1px] border-[#98989833]'>
            <p className='font-[600] text-center text-[22px] text-[#727273] font-sans'>Frames</p>
            <div className='mt-[40px]'>
                <div className="mt-2">
                    {Object.keys(frameCategories).map(category => (
                        <div key={category}>
                            <button
                                onClick={() => setSelectedCategory(category)}
                                className={`w-full text-left px-6 py-3 flex items-center justify-between rounded-[8px] text-[16px] font-[600] font-sans ${selectedCategory === category ? 'bg-[#A8C3A0]' : 'text-[#727273CC]'}`}
                            >
                                <span>{category}</span>
                                {selectedCategory === category && <span className="float-right">▼</span>}
                            </button>
                            {selectedCategory === category && (
                                <div className="mt-2 flex items-center justify-center flex-wrap gap-2 w-full">
                                    {frameCategories[category].map((option, index) => (
                                        <div
                                            key={index}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('frameUrl', option);
                                            }}
                                            style={{
                                                backgroundImage: `url(${option})`,
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                            className="w-20 h-20 border border-gray-300 rounded cursor-pointer hover:border-[#A8C3A0] transition-all duration-200"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}