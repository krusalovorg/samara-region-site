import React, { useEffect, useState } from 'react';

import { Dropdown } from "flowbite-react";
import CustomRangeInput from "./CustomRangeInput";

function SearchPanel({setSearch}: any) {
    const [timeToure, setTimeToure] = useState(6);
    const [searchCategory, setSearchCategory] = useState<string | null>(null);

    function SearchE() {
        setSearch(1);
        setTimeout(() => {
            setSearch(2);
        }, 2000)
    }

    return (
        <>
            <div className='w-full px-[5%]'>
                <div className='bg-[#2C2C2C] px-[40px] py-[35px] rounded-3xl flex flex-row items-strech'>
                    <CustomRangeInput label={"Продолжительность"} value={timeToure} setValue={setTimeToure} />
                    {/* searchCategory == "Места" ? "Отдаленость" : "Продолжительность" */}
                    <Dropdown style={{
                        fontWeight: "medium",
                        background: "#FEEFD7",
                        padding: "0 27px",
                        color: "black",
                        borderRadius: "16px",
                        marginLeft: 20,
                        width: 160
                    }}
                        className='bg-[#D2F881] px-10 py-3 font-medium rounded-xl'
                        label={searchCategory || "Категория"} dismissOnClick={true}>
                        <Dropdown.Item onClick={() => setSearchCategory("Места")}>Места</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchCategory("Маршруты")}>Маршруты</Dropdown.Item>
                    </Dropdown>
                    <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium ml-[20px]' onClick={SearchE}>Поиск</button>

                    <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium ml-auto'>Все маршруты</button>
                </div>
            </div>

        </>
    )
}

export default SearchPanel;