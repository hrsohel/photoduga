import React, { useState, useRef, useCallback } from 'react';
import AlbumMenuBar from '@/components/dashboardcomponents/gift/AlbumMenuBar';
import LeftSide from '@/components/dashboardcomponents/gift/LeftSide';
import RightSide from '@/components/dashboardcomponents/gift/RightSide';
import CardGift from '@/components/dashboardcomponents/gift/CardGift';
import CupGift from '@/components/dashboardcomponents/gift/CupGift';
import MouseGift from '@/components/dashboardcomponents/gift/MouseGift';
import ShopGift from '@/components/dashboardcomponents/gift/ShopGift';
import TshirtGift from '@/components/dashboardcomponents/gift/TshirtGift';
import HistoryContext from '../../../context/HistoryContext';

export default function Gift() {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [selectedGift, setSelectedGift] = useState('Shop'); // Default component
    const [historyFunctions, setHistoryFunctions] = useState({ undo: null, redo: null, canUndo: false, canRedo: false, saveState: null });
    const [activeGiftRef, setActiveGiftRef] = useState(null);

    const registerGiftRef = useCallback((ref) => {
        setActiveGiftRef(ref);
    }, []);


    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setUploadedImages(prevImages => [...prevImages, ...newImages]);
    };

    const renderGiftComponent = () => {
        return (
            <>
                <div style={{ display: selectedGift === 'Card' ? 'block' : 'none' }}><CardGift isActive={selectedGift === 'Card'} /></div>
                <div style={{ display: selectedGift === 'Cup' ? 'block' : 'none' }}><CupGift isActive={selectedGift === 'Cup'} /></div>
                <div style={{ display: selectedGift === 'Mouse' ? 'block' : 'none' }}><MouseGift isActive={selectedGift === 'Mouse'} /></div>
                <div style={{ display: selectedGift === 'T-Shirt' ? 'block' : 'none' }}><TshirtGift isActive={selectedGift === 'T-Shirt'} /></div>
                <div style={{ display: selectedGift === 'Shop' ? 'block' : 'none' }}><ShopGift isActive={selectedGift === 'Shop'} /></div>
            </>
        );
    };

    const tabs = ['Shop', 'T-Shirt', 'Cup', 'Card', 'Mouse'];

    return (
        <HistoryContext.Provider value={{ ...historyFunctions, setHistoryFunctions, activeGiftRef, registerGiftRef }}>
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
                <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0.5rem', backgroundColor: '#e5e7eb' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                setSelectedGift(tab);
                            }}
                            className={`px-4 py-2 mx-2 rounded ${selectedGift === tab ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </section>
        </HistoryContext.Provider>
    )
}