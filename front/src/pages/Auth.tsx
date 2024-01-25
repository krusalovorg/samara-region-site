import React, { useState, useEffect, useRef, useContext } from 'react';
import Login from '../components/Login';
import Header from '../components/Header';
import { getCookieToken } from '../utils/utils';
import { URL_SERVER, getUserData } from '../utils/backend';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

function Auth({reg = false}: {reg?: boolean}) {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    const [isReg, setIsReg] = useState(reg);

    const {setUserData} = useContext(UserContext)

    useEffect(() => {
        const cookieToken = getCookieToken();
        if (cookieToken) {
            setToken(cookieToken);
        }
    }, []);

    useEffect(() => {
        const currentFragment = window.location.hash.substr(1);
        if (currentFragment) {
            // setFragment(currentFragment);
        }
    }, []);

    async function openUser(access_token: string) {
        const data_user = await getUserData(access_token);
        setUserData(data_user)
        navigate('/profile')
    }

    const handleLogin = (login: boolean) => {
        console.log(login,login ? '/register' : '/login_user')
        fetch(URL_SERVER + (login ? '/register' : '/login_user'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                login ?
                    { name: username, password, email }
                    :
                    {
                        password, email
                    }
            )
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Неверный логин или пароль');
                }
            })
            .then(data => {
                // Сохраняем токен в куки
                console.log('statusstatusstatus ',data, data?.status)
                if (data?.status) {
                    if (login) {
                        console.log('handel register ', login)
                        handleLogin(false);
                    } else {
                        document.cookie = `access_token = ${data.access_token}`;
                        setToken(data.access_token)
                        openUser(data.access_token)
                    }    
                }
                if (data?.message) {
                    //console.error(data?.message)
                    setError(data?.message)
                }
            })
            .catch(error => {
                setError(error.message);
            });
    }

    return (
        <div className={` 'flex justify-center items-center`} style={{
            minHeight: 'calc(100vh - 277px)'
        }}>
            <Header />
            <div className='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg'>
                <div className='max-w-md mx-auto space-y-3'>
                    <h3 className="text-lg font-semibold">{!isReg ? "Войти" : "Регистрация"}</h3>
                    {
                        isReg ?
                            <>
                                <div>
                                    <label className="block py-1">Логин</label>
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        type="name"
                                        className="w-full py-2 px-2 rounded hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono" />
                                </div>
                            </>
                            : <></>
                    }
                    <div>
                        <label className="block py-1">Почта</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="w-full py-2 px-2 rounded hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono" />
                    </div>
                    <div>
                        <label className="block py-1">Пароль</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="w-full py-2 px-2 rounded hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono" />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="flex gap-3 pt-3 items-center">
                        <button
                            onClick={()=>handleLogin(isReg)}
                            className="hover:border-indigo-600 px-4 py-2 rounded-lg ring-1 ring-inset ring-gray-300">{!isReg ? "Войти" : "Регистрация"}</button>
                    </div>

                    <button
                        onClick={() => {
                            setIsReg(!isReg)
                        }}
                        className="hover:border-indigo-600 px-4 py-2 rounded-lg ring-1 ring-inset mx-auto ring-gray-300">{isReg ? "У вас уже есть аккаунт?" : "У вас нет аккаунта? Создать аккаунт"}</button>
                </div>
            </div>
        </div>
    )
}

export default Auth;