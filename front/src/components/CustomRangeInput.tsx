import React, { useState } from 'react';

const CustomRangeInput = ({ value, setValue, label }: { value: number, setValue: any, label: string }) => {
    const handleChange = (event: any) => {
        setValue(event.target.value);
    };

    return (
        <div className="py-[20px] min-h-[64px] px-[20px] bg-[#FEEFD7] rounded-2xl flex flex-row justify-start items-center relative">
            {/* absolute top-[10px] left-[10px] */}
            <input
                type="range"
                min={1}
                max={6}
                value={value}
                step={1}
                onChange={handleChange}
            />
            <h2 className='font-medium text-[16px] ml-5'>{label}: {value}ч</h2>
        </div>
    );
};

export default CustomRangeInput;