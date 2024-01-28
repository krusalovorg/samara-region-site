import React, { useContext, useEffect, useRef, useState } from 'react';
import GerbLogo from '../assets/gerb.png';
import { useNavigate } from 'react-router-dom';
import { getCookieToken } from '../utils/utils';
import useIsMobile from './isMobile';
import UserContext from '../contexts/UserContext';

function Header() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(false);
    const isMobile = useIsMobile();
    const {role, _id} = useContext(UserContext);
    const [loggedIn, setLoggedIn] = useState(false);

    const url = window.location.pathname;

    function init() {
        console.log(getCookieToken(), role)
        setLoggedIn(_id && _id?.length > 5 ? true : false)
        setAdmin((getCookieToken() && role == 'admin') ? true : false);
    }

    useEffect(()=>{
        init()
    },[_id])

    useEffect(() => {
        init()
    }, [])

    return (
        <>
            <header className='w-full bg-white absolute top-0 left-0 max-md:pl-[100px] py-[40px] flex flex-row max-md:justify-around md:justify-center items-center z-[1000] md:px-5'>
                <img className='absolute left-[5%] cursor-pointer' onClick={() => {
                    navigate("/")
                }} width={64} height={64} src={GerbLogo} />
                {!isMobile &&
                <a className={`mx-5 font-[600] font-[Montserrat] cursor-pointer px-8 py-2 rounded-3xl ${(url == '/' || url == '') ? 'text-[#62D572]' : 'text-black'}`}
                    onClick={() => {
                        navigate("/")
                    }}>
                    Регион
                </a>}
                <a className={`md:mx-5 font-[600] font-[Montserrat] cursor-pointer max-md:px-3 md:px-8 py-2 rounded-3xl ${url == '/all/routes' ? 'text-[#62D572]' : 'text-black'}`}
                    onClick={() => {
                        navigate("/all/routes")
                    }}>
                    Маршруты
                </a>
                <a className={`md:mx-5 font-[600] font-[Montserrat] cursor-pointer max-md:px-3 md:px-8 py-2 rounded-3xl ${url == '/all/places' ? 'text-[#62D572]' : 'text-black'}`}
                    onClick={() => {
                        navigate("/all/places")
                    }}>
                    Места
                </a>
                <a className={`md:mx-5 font-[600] font-[Montserrat] cursor-pointer max-md:px-3 md:px-8 py-2 rounded-3xl ${url == ((role != 'none' && loggedIn)? "/user" : '/login') ? 'text-[#62D572]' : ''}`}
                    onClick={() => {
                        navigate((role != 'none' && loggedIn) ? "/user" : '/login')
                    }}>
                    {(role != 'none' && loggedIn) ? "Профиль" : "Войти"}
                </a>
                {admin &&
                    <a className={`text-black md:mx-5 font-[600] font-[Montserrat] cursor-pointer max-md:px-3 md:px-8 py-2 rounded-3xl ${url == '/admin' ? 'text-[#62D572]' : ''}`}
                        onClick={() => {
                            navigate("/admin")
                        }}>
                        Админ
                    </a>
                }
            </header>
            {url != '/' && <div className='h-[120px] mb-[5em]' />}
        </>
    );
}

export default Header;