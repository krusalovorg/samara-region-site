import App from './App';
import Header from './components/Header';
import { BrowserRouter, Route, Router, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserData, getUserData } from './utils/backend';
import Place from './pages/Place';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import ItemsPage from './pages/Items';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { getCookieToken } from './utils/utils';
import UserContext from './contexts/UserContext';
import Cookies from 'js-cookie';

function RouterNav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [token, setToken] = useState<null | string>(null);

    async function loadData(token: string) {
        const data = await getUserData(token);
        console.log('get data user', data)
        if ((data as any)?.msg) {
            Cookies.remove('access_token')
            setUserData({ role: 'none' } as any)
        } else {
            setUserData(data);
        }
    }

    async function loadAll() {
        const get_token = getCookieToken();
        setIsLoggedIn(get_token ? true : false)
        if (get_token) {
            setToken(get_token);
            loadData(get_token);
        }
    }

    useEffect(() => {
        loadAll();
    }, [])

    return (
        <>
            <BrowserRouter>
                <UserContext.Provider value={{...(userData || {}) as UserData, setUserData}}>
                    <Routes>
                        {
                            (isLoggedIn && token && userData?.role != 'none') ?
                                <>
                                    <Route path='/user' element={<Profile />} />
                                </>
                                :
                                <></>
                        }
                        <Route path='/' element={<App />} />
                        <Route path='*' element={<App />} />

                        <Route path='/place/:id' element={<Place />} />
                        <Route path='/route/:id' element={<Place route />} />
                        <Route path='/all/:category' element={<ItemsPage />} />
                        {
                            (isLoggedIn && token && userData?.role == 'admin') ?
                                <Route path='/admin' element={<Admin />} />
                                : <></>
                        }
                        <Route path='/login' element={<Auth />} />
                        <Route path='/reg' element={<Auth reg />} />
                        <Route path='*' element={<App />} />
                    </Routes>
                </UserContext.Provider>
            </BrowserRouter>
        </>
    )
}

export default RouterNav;