import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import { getCookieToken } from '../utils/utils';

function Login({ children }: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [fragment, setFragment] = useState('all');

    useEffect(() => {
        const cookieToken = getCookieToken();
        if (cookieToken) {
            setToken(cookieToken.split('=')[1]);
        }
    }, []);

    const handleLogin = () => {
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
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
                document.cookie = `access_token = ${data.access_token}`;
                setToken(data.access_token)
            })
            .catch(error => {
                setError(error.message);
            });
    }

    return (
        <>
            <div className={` ${!token && 'flex justify-center items-center'}`} style={{
                minHeight: 'calc(100vh - 277px)'
            }}>
                {token ? (
                    <>
                        <AdminHeader setFragment={setFragment} fragment={fragment} />
                        {children}
                    </>
                ) : (
                    <>
                        <div className='w-full max-w-lg px-10 py-8 mx-auto bg-white border rounded-lg shadow-2xl'>
                            <div className='max-w-md mx-auto space-y-3'>
                                <h3 className="text-lg font-semibold">Вход</h3>
                                <div>
                                    <label className="block py-1">Логин</label>
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        type="email"
                                        className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono" />
                                    <p className="text-sm mt-2 px-2 hidden text-gray-600">Text helper</p>
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
                                        onClick={handleLogin}
                                        className="border hover:border-indigo-600 px-4 py-2 rounded-lg shadow ring-1 ring-inset ring-gray-300">Войти</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Login;