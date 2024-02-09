import React, { useState, useEffect, useRef, useContext } from 'react';
import Login from '../components/Login';
import Header from '../components/Header';
import UserContext from '../contexts/UserContext';
import { Place, Route, getItemsById, getUserData } from '../utils/backend';
import PlaceItem from '../components/PlaceItem';
import { getCookieToken } from '../utils/utils';
import RightIcon from '../assets/icons/RightIcon';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '../assets/icons/LogoutIcon';
import Cookies from 'js-cookie';

function Profile() {
    const { name, email, _id, favorites, setUserData } = useContext(UserContext);
    const [places, setPlaces] = useState<Place[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const navigate = useNavigate();

    async function loadPlaces() {
        console.log('favorites', favorites)
        if (favorites?.places?.length > 0) {
            const result = await getItemsById(favorites.places, 'places');
            setPlaces(result)
            console.log('result:::::::::::::::::::::::::', result)
        }
    }

    async function loadRoutes() {
        console.log('favorites', favorites)
        if (favorites?.routes?.length > 0) {
            const result = await getItemsById(favorites.routes, 'routes');
            setRoutes(result)
            console.log('result:::::::::::::::::::::::::', result)
        }
    }

    async function loadUser() {
        const token = getCookieToken()
        if (token) {
            const data = await getUserData(token);
            setUserData(data);
        }
    }

    useEffect(() => {
        loadPlaces();
        loadRoutes();
    }, [favorites])

    useEffect(() => {
        loadPlaces();
        loadRoutes();
        loadUser()
    }, [])

    return (
        <div className={` 'flex justify-center items-center`} style={{
            minHeight: 'calc(100vh - 277px)'
        }}>
            <Header />
            <div
                className={`w-full md:w-[70%] mx-auto flex flex-row justify-between items-center mb-5 bg-[#f5f5f58c] rounded-[50px] h-auto px-[36px] py-[30px]`}
            >
                <div>
                    <h1 className='text-2xl text-[#2C2C2C] font-medium'>
                        {name}
                    </h1>
                    <h1>
                        Почта: {email}
                    </h1>
                </div>

                <LogoutIcon
                    className="cursor-pointer"
                    onClick={() => {
                        setUserData({})
                        Cookies.remove("access_token")
                        navigate("/")
                        window.location.reload()
                    }}
                />
            </div>

            <div
                className={`w-full md:w-[70%] mx-auto bg-[#f5f5f58c] rounded-[50px] h-auto px-[36px] py-[30px]`}
            >
                <div className='px-5 py-8'>
                    <h1 className='font-bold text-2xl text-[#2C2C2C] mb-2 flex items-center w-full'>
                        {places.length > 0 ? "Избранные точки" : "Пока нет избранных точек"}
                        <RightIcon className="ml-auto cursor-pointer" onClick={() => {
                            navigate("/all/places");
                        }} />
                    </h1>
                    <div className='grid max-md:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full h-full gap-5 mt-7'>
                        {
                            places.length > 0 && places.map((item, index) =>
                                <PlaceItem data={item} mini key={index} />
                            )
                        }
                    </div>
                </div>
                <div className='w-full px-5 py-8'>
                    <h1 className='font-bold text-2xl text-[#2C2C2C] mb-2 flex items-center w-full'>
                        {routes.length > 0 ? "Избранные маршруты" : "Пока нет избранных маршрутов"}
                        <RightIcon className="ml-auto cursor-pointer" onClick={() => {
                            navigate("/all/routes");
                        }} />
                    </h1>
                    <div className='grid max-md:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full h-full gap-5 mt-7'>
                        {
                            routes.length > 0 && routes.map((item, index) =>
                                <PlaceItem data={item} mini key={index} />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;