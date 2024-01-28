import React, { useState } from 'react';

const CustomRangeInput = ({ value, setValue, label }: { value: number, setValue: any, label: string }) => {
    const handleChange = (event: any) => {
        setValue(event.target.value);
    };

    return (
        <div className="max-md:flex-col-reverse py-[20px] min-h-[64px] px-[20px] bg-white rounded-l-2xl md:border-r-black md:border-r-[1px] flex flex-row justify-start items-center relative">
            {/* absolute top-[10px] left-[10px] */}
            <input
                type="range"
                min={1}
                max={6}
                value={value}
                step={1}
                onChange={handleChange}
            />
            <h2 className='max-md:ml-0 max-md:mb-[10px] font-medium text-[16px] md:ml-5 min-w-[189px]'>{label}: {value}ч</h2>
        </div>
    );
};

export default CustomRangeInput;