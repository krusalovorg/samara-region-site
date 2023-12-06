import React, { useEffect, useRef, useState } from 'react';
import GerbLogo from '../assets/gerb.png';
import { useNavigate } from 'react-router-dom';

function AdminHeader({ setFragment, fragment }: { setFragment: any, fragment: any }) {
    const navigate = useNavigate();

    const navigateWithFragment = (newFragment: string) => {
        setFragment(newFragment);
        window.history.pushState(null, "",`#${ newFragment }`);
    }

    return (
        <>
            <header className='w-full absolute top-0 left-0 py-[40px] flex flex-row justify-center items-center z-[1000] px-5'>
                <img className='absolute left-[5%] cursor-pointer' onClick={() => {
                    navigate("/")
                }} width={64} height={64} src={GerbLogo} />
                <a className={`text-black mx-5 font-[600] font-[Montserrat] cursor-pointer px-8 py-2 rounded-3xl ${fragment == 'all' ? 'bg-[#D2F881]' : ''}`}
                    onClick={() => {
                        navigateWithFragment('all')
                    }}>
                    Всё
                </a>
                <a className={`text-black mx-5 font-[600] font-[Montserrat] cursor-pointer px-8 py-2 rounded-3xl ${fragment == 'place' ? 'bg-[#D2F881]' : ''}`}
                    onClick={() => {
                        navigateWithFragment('place')
                    }}>
                    Точки
                </a>
                <a className={`text-black mx-5 font-[600] font-[Montserrat] cursor-pointer px-8 py-2 rounded-3xl ${fragment == 'category' ? 'bg-[#D2F881]' : ''}`}
                    onClick={() => {
                        navigateWithFragment('category')
                    }}>
                    Категории
                </a>
                <a className={`text-black mx-5 font-[600] font-[Montserrat] cursor-pointer px-8 py-2 rounded-3xl ${fragment == 'routes' ? 'bg-[#D2F881]' : ''}`}
                    onClick={() => {
                        navigateWithFragment('routes')
                    }}>
                    Маршруты
                </a>
                <a className={`text-black mx-5 font-[600] font-[Montserrat] cursor-pointer px-8 py-2 rounded-3xl ${fragment == 'logout' ? 'bg-[#D2F881]' : ''}`}
                    onClick={() => {
                        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        window.location.reload();
                        navigateWithFragment('/')
                    }}>
                    Выйти
                </a>
            </header>
            <div className='h-[120px] mb-[5em]' />
        </>
    );
}

export default AdminHeader;