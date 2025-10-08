import React from 'react';
import html2canvas from 'html2canvas';

const AlbumMenuBar = ({ onUndo, onRedo, onDownload }) => {
    const handleSave = () => {
        if (onDownload) {
            onDownload();
        }
    };

    return (
        <div className='px-[60px] py-[8px] bg-white flex items-center justify-between shadow-[0_2px_6px_0_rgba(0,0,0,0.5)] mb-1'>
            <div className='flex items-center justify-center gap-5'>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="30" rx="15" transform="matrix(-1 0 0 1 30 0)" fill="url(#paint0_linear_2472_7775)" />
                    <path d="M18.3873 19.8501L13.5373 15.0001L18.3873 10.1501C18.8748 9.6626 18.8748 8.8751 18.3873 8.3876C17.8998 7.9001 17.1123 7.9001 16.6248 8.3876L10.8873 14.1251C10.3998 14.6126 10.3998 15.4001 10.8873 15.8876L16.6248 21.6251C17.1123 22.1126 17.8998 22.1126 18.3873 21.6251C18.8623 21.1376 18.8748 20.3376 18.3873 19.8501Z" fill="white" />
                    <defs>
                        <linearGradient id="paint0_linear_2472_7775" x1="-6.06" y1="-6.04286" x2="23.1527" y2="59.746" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#10200B" />
                            <stop offset="1" stop-color="#558945" />
                        </linearGradient>
                    </defs>
                </svg>
                <img src="/23d53f7d1d878b83fe1116679f981dc99c5ae301.png" alt="" width={`70px`} height={`70px`} className='object-cover' />
                <div className='flex items-center justify-center flex-col cursor-pointer' onClick={onUndo}>
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 18.5H14.75C16.1424 18.5 17.4777 17.9469 18.4623 16.9623C19.4469 15.9777 20 14.6424 20 13.25C20 11.8576 19.4469 10.5223 18.4623 9.53769C17.4777 8.55312 16.1424 8 14.75 8H5M7.5 4.5L4 8L7.5 11.5" stroke="#A8C3A0" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p className='font-[600] font-sans text-[16px] text-center' style={{ color: "rgba(114, 114, 115, 1)" }}>Cancel</p>
                </div>
                <div className='flex items-center justify-center flex-col cursor-pointer' onClick={onRedo}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5 18.5H9.75C8.35761 18.5 7.02226 17.9469 6.03769 16.9623C5.05312 15.9777 4.5 14.6424 4.5 13.25C4.5 11.8576 5.05312 10.5223 6.03769 9.53769C7.02226 8.55312 8.35761 8 9.75 8L19.5 8M17 4.5L20.5 8L17 11.5" stroke="#A8C3A0" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p className='font-[600] font-sans text-[16px] text-center' style={{ color: "rgba(114, 114, 115, 1)" }}>Regularly</p>
                </div>
            </div>
            <div className='flex items-center justify-center gap-[10px]'>
                <p className='font-[600] font-sans text-[24px] text-[#727273] text-center'>My Design 1234</p>
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_2472_7796)">
                        <path d="M3.5 17.4601V20.5001C3.5 20.7801 3.72 21.0001 4 21.0001H7.04C7.17 21.0001 7.3 20.9501 7.39 20.8501L18.31 9.94006L14.56 6.19006L3.65 17.1001C3.55 17.2001 3.5 17.3201 3.5 17.4601ZM21.21 7.04006C21.6 6.65006 21.6 6.02006 21.21 5.63006L18.87 3.29006C18.48 2.90006 17.85 2.90006 17.46 3.29006L15.63 5.12006L19.38 8.87006L21.21 7.04006Z" fill="#A8C3A0" />
                    </g>
                    <defs>
                        <clipPath id="clip0_2472_7796">
                            <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                        </clipPath>
                    </defs>
                </svg>
            </div>
            <div className='flex items-center justify-center gap-[20px]'>
                <div className='flex items-center justify-center flex-col cursor-pointer' onClick={handleSave}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_2754_2554)">
                            <path d="M19.5 13.5V18.5C19.5 19.05 19.05 19.5 18.5 19.5H6.5C5.95 19.5 5.5 19.05 5.5 18.5V13.5C5.5 12.95 5.05 12.5 4.5 12.5C3.95 12.5 3.5 12.95 3.5 13.5V19.5C3.5 20.6 4.4 21.5 5.5 21.5H19.5C20.6 21.5 21.5 20.6 21.5 19.5V13.5C21.5 12.95 21.05 12.5 20.5 12.5C19.95 12.5 19.5 12.95 19.5 13.5ZM13.5 13.17L15.38 11.29C15.77 10.9 16.4 10.9 16.79 11.29C17.18 11.68 17.18 12.31 16.79 12.7L13.2 16.29C12.81 16.68 12.18 16.68 11.79 16.29L8.2 12.7C7.81 12.31 7.81 11.68 8.2 11.29C8.59 10.9 9.22 10.9 9.61 11.29L11.5 13.17V4.5C11.5 3.95 11.95 3.5 12.5 3.5C13.05 3.5 13.5 3.95 13.5 4.5V13.17Z" fill="#A8C3A0" />
                        </g>
                        <defs>
                            <clipPath id="clip0_2754_2554">
                                <rect width="24" height="24" fill="white" transform="translate(0.5 0.5)" />
                            </clipPath>
                        </defs>
                    </svg>
                    <p className='font-[600] font-sans text-[16px] text-center text-[#727273]'>Save</p>
                </div>



                <div className='px-[16px] py-[8px] rounded-[40px] flex items-center justify-center gap-[10px]' style={{ background: "linear-gradient(to right, #10200B, #558945)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_2472_7804)">
                            <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 3C1 3.55 1.45 4 2 4H3L6.6 11.59L5.25 14.03C4.52 15.37 5.48 17 7 17H18C18.55 17 19 16.55 19 16C19 15.45 18.55 15 18 15H7L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C21.25 4.82 20.77 4 20.01 4H5.21L4.54 2.57C4.38 2.22 4.02 2 3.64 2H2C1.45 2 1 2.45 1 3ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_2472_7804">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <p className='font-[600] text-[16px] font-sans text-white'>Order</p>
                </div>
            </div>
        </div>
    );
}

export default AlbumMenuBar;
