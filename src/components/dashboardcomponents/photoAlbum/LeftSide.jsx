import { leftSideData } from '@/data/photoAlbum/data'
import React from 'react'

export default function LeftSide() {
    return (
        <div className='flex items-center justify-start flex-col w-[130px] bg-white min-h-screen sticky top-0'>
            {
                leftSideData.map(data => (
                    <div key={data.id} className='p-6 py-8 flex items-center justify-start flex-col'>
                        {/* Render the icon only if it exists */}
                        {data.icon && <div>{data.icon}</div>}
                        {/* Render the label */}
                        <p className='font-semibold text-[16px] text-[#727273] font-sans text-center'>{data.label}</p>
                    </div>
                ))
            }

        </div>
    )
}
