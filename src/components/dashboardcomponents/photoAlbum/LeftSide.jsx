import { leftSideData } from '@/data/photoAlbum/data'
import React from 'react'

export default function LeftSide({activeLeftBar, setActiveLeftBar}) {
    return (
        <div className='flex items-center justify-start flex-col w-[130px] bg-white h-[91vh] sticky top-0'>
            {
                leftSideData.map(data => (
                    <div onClick={() => setActiveLeftBar(data.label)} key={data.id} 
                        className={`p-6 py-8 flex items-center ${data.label === activeLeftBar ? "bg-[#A8C3A0]" : ""} hover:bg-slate-100 justify-start flex-col cursor-pointer`}>
                        {/* Render the icon only if it exists */}
                        {data.icon && <div>{data.icon}</div>}
                        {/* Render the label */}
                        <p className={`font-semibold text-[16px] ${data.label === activeLeftBar ? "text-[#ffffff]" : "text-[#727273]"} font-sans text-center`}>{data.label}</p>
                    </div>
                ))
            }

        </div>
    )
}
