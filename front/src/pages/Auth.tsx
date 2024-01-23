import React, { useState, useEffect, useRef } from 'react';
import Login from '../components/Login';
import Header from '../components/Header';
import { getCookieToken } from '../utils/utils';
import { URL_SERVER } from '../utils/backend';
import { useNavigate } from 'react-router-dom';

function Auth({reg}: {reg?: boolean}) {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    const [isReg, setIsReg] = useState(reg ? reg : false);

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

    const handleLogin = (login: boolean) => {
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
                if (data?.status && !login) {
                    handleLogin(true);
                } else {
                    document.cookie = `access_token = ${data.access_token}`;
                    setToken(data.access_token)
                    navigate('/profile')
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
            <div className='w-full max-w-lg px-10 py-8 mx-auto bg-white border rounded-lg shadow-2xl'>
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
                                        className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono" />
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
                            className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono" />
                    </div>
                    <div>
                        <label className="block py-1">Пароль</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono" />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="flex gap-3 pt-3 items-center">
                        <button
                            onClick={()=>handleLogin(isReg)}
                            className="border hover:border-indigo-600 px-4 py-2 rounded-lg shadow ring-1 ring-inset ring-gray-300">{!isReg ? "Войти" : "Регистрация"}</button>
                    </div>

                    <button
                        onClick={() => {
                            setIsReg(!isReg)
                        }}
                        className="border hover:border-indigo-600 px-4 py-2 rounded-lg shadow ring-1 ring-inset mx-auto ring-gray-300">{isReg ? "У вас уже есть аккаунт?" : "У вас нет аккаунта? Создать аккаунт"}</button>
                </div>
            </div>
        </div>
    )
}

export default Auth;