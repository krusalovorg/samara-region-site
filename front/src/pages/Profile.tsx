import React, { useState, useEffect, useRef, useContext } from 'react';
import Login from '../components/Login';
import Header from '../components/Header';
import UserContext from '../contexts/UserContext';
import { Place, Route, getItemsById, getUserData } from '../utils/backend';
import PlaceItem from '../components/PlaceItem';
import { getCookieToken } from '../utils/utils';

function Profile() {
    const { name, email, _id, favorites } = useContext(UserContext);
    const [places, setPlaces] = useState<Place[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);

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

    useEffect(() => {
        loadPlaces();
        loadRoutes();
    }, [favorites])

    return (
        <div className={` 'flex justify-center items-center`} style={{
            minHeight: 'calc(100vh - 277px)'
        }}>
            <Header />
            <div className='w-full max-w-lg px-10 py-8 mx-auto bg-white border rounded-lg shadow-2xl'>
                <h1>
                    Имя: {name}
                </h1>
                <h1>
                    email: {email}
                </h1>
                <h1>
                    _id: {_id}
                </h1>
            </div>
            <div className='w-[800px] px-5 py-8 mx-auto bg-white border rounded-lg shadow-2xl'>
                <h1 className='font-bold text-2xl text-[#2C2C2C] mb-2'>Избранные точки</h1>
                {
                    places.length > 0 && places.map((item, index) =>
                        <PlaceItem data={item} mini key={index} />
                    )
                }
            </div>
            <div className='w-[800px] px-5 py-8 mx-auto bg-white border rounded-lg shadow-2xl'>
                <h1 className='font-bold text-2xl text-[#2C2C2C] mb-2'>Избранные маршруты</h1>
                {
                    routes.length > 0 && routes.map((item, index) =>
                        <PlaceItem data={item} mini key={index} />
                    )
                }
            </div>
        </div>
    )
}

export default Profile;