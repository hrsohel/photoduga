import React, { useContext, useEffect, useRef } from 'react';
import { useHistory } from '../../../hooks/useHistory';
import HistoryContext from '../../../context/HistoryContext';

export default function ShopGift({ isActive }) {
    const [state, setState, undo, redo, canUndo, canRedo, saveState, isLoaded] = useHistory('ShopGift', { image: null });
    const { setHistoryFunctions, registerGiftRef } = useContext(HistoryContext);
    const giftRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            setHistoryFunctions({ undo, redo, canUndo, canRedo, saveState });
            registerGiftRef(giftRef);
        }
    }, [isActive, undo, redo, canUndo, canRedo, saveState, setHistoryFunctions, registerGiftRef]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        const imageUrl = e.dataTransfer.getData('text/uri-list');

        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Image = event.target.result;
                setState({ ...state, image: base64Image });
            };
            reader.readAsDataURL(file);
        } else if (imageUrl) {
            fetch(imageUrl)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64Image = event.target.result;
                        setState({ ...state, image: base64Image });
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(error => console.error("Error fetching image URL:", error));
        }
    };

    return (
        <div className="flex justify-center items-center h-[90vh] bg-gray-200" ref={giftRef}>
            <div className="relative">
                <img
                    src="/shopping-bag.png"
                    alt="Shopping Bag"
                    className="w-[600px] rounded-lg"
                />
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-dashed border-gray-400 flex items-center justify-center`}
                >
                    {state.image ? (
                        <img src={state.image} alt="dropped" className="w-full h-full object-cover" />
                    ) : (
                        <p>Drag and drop an image here</p>
                    )}
                </div>
            </div>
        </div>
    );
}