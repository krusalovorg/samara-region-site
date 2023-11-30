import React, { useEffect, useRef, useState } from 'react';
import GerbLogo from '../assets/gerb.png';
import { useNavigate } from 'react-router-dom';
import { getCookieToken } from '../utils/utils';

function Header() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(false);

    const url = window.location.pathname;
    
    useEffect(()=>{
        setAdmin(getCookieToken() ? true : false);
    },[])

    return (
        <>
            <header className='w-full absolute top-0 left-0 py-[40px] flex flex-row justify-center items-center z-[1000] px-5'>
                <img className='absolute left-[5%] cursor-pointer' onClick={() => {
                    navigate("/")
                }} width={64} height={64} src={GerbLogo} />
                <a className={`text-black mx-5 font-[600] font-[Montserrat] cursor-pointer px-8 py-2 rounded-3xl ${url == '/' ? 'bg-[#D2F881]' : ''}`}
                    onClick={() => {
                        navigate("/")
                    }}>
                    Регион
                </a>
                <a className={`text-black mx-5 font-[600] font-[Montserrat] cursor-pointer px-8 py-2 rounded-3xl ${url == '/routes' ? 'bg-[#D2F881]' : ''}`}>
                    Маршрут
                </a>
                <a className={`text-black mx-5 font-[600] font-[Montserrat] cursor-pointer px-8 py-2 rounded-3xl ${url == '/place' ? 'bg-[#D2F881]' : ''}`}>
                    Точка
                </a>
                <a className={`text-black mx-5 font-[600] font-[Montserrat] cursor-pointer px-8 py-2 rounded-3xl ${url == '/admin' ? 'bg-[#D2F881]' : ''}`}
                onClick={() => {
                    navigate("/admin")
                }}>
                    Админ
                </a>
            </header>
            <div className='h-[120px] mb-[5em]' />
        </>
    );
}

export default Header;