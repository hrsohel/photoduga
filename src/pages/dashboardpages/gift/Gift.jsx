import React, { useState } from 'react';
import AlbumMenuBar from '@/components/dashboardcomponents/gift/AlbumMenuBar';
import LeftSide from '@/components/dashboardcomponents/gift/LeftSide';
import RightSide from '@/components/dashboardcomponents/gift/RightSide';
import CardGift from '@/components/dashboardcomponents/gift/CardGift';
import CupGift from '@/components/dashboardcomponents/gift/CupGift';
import MouseGift from '@/components/dashboardcomponents/gift/MouseGift';
import ShopGift from '@/components/dashboardcomponents/gift/ShopGift';
import TshirtGift from '@/components/dashboardcomponents/gift/TshirtGift';

export default function Gift() {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [selectedGift, setSelectedGift] = useState('Shop'); // Default component

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setUploadedImages(prevImages => [...prevImages, ...newImages]);
    };

    const renderGiftComponent = () => {
        switch (selectedGift) {
            case 'Card':
                return <CardGift />;
            case 'Cup':
                return <CupGift />;
            case 'Mouse':
                return <MouseGift />;
            case 'T-Shirt':
                return <TshirtGift />;
            case 'Shop':
                return <ShopGift />;
            default:
                return <RightSide />;
        }
    };

    const tabs = ['Shop', 'T-Shirt', 'Cup', 'Card', 'Mouse'];

    return (
        <section>
            <AlbumMenuBar />
            <div className="flex">
                <div className="w-[25%]">
                    <LeftSide uploadedImages={uploadedImages} handleImageUpload={handleImageUpload} />
                </div>
                <div className="w-[75%]">
                    {renderGiftComponent()}
                </div>
            </div>
            <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0.5rem', backgroundColor: '#e5e7eb'}}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setSelectedGift(tab)}
                        className={`px-4 py-2 mx-2 rounded ${selectedGift === tab ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </section>
    )
}