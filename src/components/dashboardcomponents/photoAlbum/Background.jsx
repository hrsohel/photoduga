import { backgroundCategories } from '@/data/imagesForPhotoAlbum';
import React, { useState } from 'react'

export default function Background({ bgType, selectedBg, setBgType, setSelectedBg, uploadedImages, handleImageUpload }) {
    const [selectedCategory, setSelectedCategory] = useState('Plain Backgrounds');
    const setBackground = (category, optionIndex) => {
        const options = backgroundCategories[category];
        const newBg = options[optionIndex];
        setSelectedBg(newBg);
        setBgType(newBg.startsWith('#') ? 'plain' : 'image');
    };
    return (
        <div className='w-[300px] bg-white p-6 h-[91vh] sticky top-0 border-l-[1px] border-[#98989833]'>
            <p className='font-[600] text-center text-[22px] text-[#727273] font-sans'>Background</p>
            <div className='mt-[40px]'>
                <div className="mt-2">
                    {Object.keys(backgroundCategories).map(category => (
                        <div key={category}>
                            <button
                                onClick={() => setSelectedCategory(category)}
                                className={`w-full text-left px-6 py-3 flex items-center justify-between rounded-[8px] text-[16px] font-[600] font-sans ${selectedCategory === category ? 'bg-[#A8C3A0] text-[#ffffff]' : 'text-[#727273CC]'}`}
                            >
                                <span>{category}</span>
                                {selectedCategory === category && <span className="float-right">▼</span>}
                            </button>
                            {selectedCategory === category && (
                                <div className="mt-2 ml-2 grid grid-cols-2 gap-2">
                                    {backgroundCategories[category].map((option, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setBackground(category, index)}
                                            style={{
                                                backgroundColor: option.startsWith('#') ? option : 'transparent',
                                                backgroundImage: option.startsWith('http') ? `url(${option})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                            className="w-12 h-12 border border-gray-300 rounded cursor-pointer hover:border-[#A8C3A0] transition-all duration-200"
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