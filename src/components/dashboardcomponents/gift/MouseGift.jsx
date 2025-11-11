import React, { useContext, useEffect, useRef } from 'react';
import { useHistory } from '../../../hooks/useHistory';
import HistoryContext from '../../../context/HistoryContext';

export default function MouseGift({ isActive }) {
    const [state, setState, undo, redo, canUndo, canRedo, saveState, isLoaded] = useHistory('MouseGift', { image: null });
    const { setHistoryFunctions } = useContext(HistoryContext);
    const giftRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            setHistoryFunctions({ undo, redo, canUndo, canRedo, saveState });
        }
    }, [isActive, undo, redo, canUndo, canRedo, saveState, setHistoryFunctions]);

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
        <div className='flex items-center justify-center min-h-[90vh]' ref={giftRef}>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className='w-[600px] h-[600px] border-2 border-dashed border-gray-400 flex items-center justify-center relative'
            >
                {state.image ? (
                    <img src={state.image} alt="dropped" className="w-full h-full object-cover" />
                ) : (
                    <p>Drag and drop an image here</p>
                )}
            </div>
        </div>
    );
}