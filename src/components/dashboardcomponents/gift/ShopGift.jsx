import React, { useRef, useEffect } from 'react';

export default function ShopGift() {
    
    return (
        <div className="flex justify-center items-center h-[90vh] bg-gray-200">
            <div className="relative">
                <img
                    src="/shopping-bag.png"
                    alt="Shopping Bag"
                    className="w-[600px] rounded-lg"
                />
                <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-gray-300 `}
                >
                </div>
            </div>
        </div>
    );
}