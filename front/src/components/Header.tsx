import React, { useEffect, useRef, useState } from 'react';
import GerbLogo from '../assets/gerb.png';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    return (
        <>
            <header className='w-full absolute top-0 left-0 py-[40px] flex flex-row justify-center items-center z-[1000] px-5'>
                <img className='absolute left-[5%] cursor-pointer' onClick={() => {
                    navigate("/")
                }} width={64} height={64} src={GerbLogo} />
                <a className='text-black mx-5 font-[600] font-[Montserrat] cursor-pointer bg-[#D2F881] px-8 py-2 rounded-3xl'
                    onClick={() => {
                        navigate("/")
                    }}>
                    Регион
                </a>
                <a className='text-black mx-5 px-8 py-2 font-[600] font-[Montserrat] cursor-pointer'>
                    Маршруты
                </a>
                <a className='text-black mx-5 px-8 py-2 font-[600] font-[Montserrat] cursor-pointer'>
                    Туры
                </a>
            </header>
            <div className='h-[120px] mb-[5em]' />
        </>
    );
}

export default Header;