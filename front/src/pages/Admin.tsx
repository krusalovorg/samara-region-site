import React, { useState, useEffect, useRef } from 'react';
import Login from '../components/Login';
import { getCookieToken } from '../utils/utils';
import { YMaps, Map, Placemark, SearchControl, Clusterer } from '@pbe/react-yandex-maps';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';

function Admin() {
    const [formData, setFormData] = useState({
        name: '',
        cardDescription: '',
        description: '',
        category: [],
        images: [] as File[],
        coordinates: '',
        rate: 0,
        price: 0,
        city: '',
        location: '',
        walk: false,
        time: 0,
    });

    const [point, setPoint] = useState();
    const map = useRef<any>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as any;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setFormData((prevState) => ({
                ...prevState,
                images: [...prevState.images, ...Array.from(files)],
            }));
        }
    };

    function loadMap(yamap: YMapsApi) {
        console.log(yamap.map?.GeoObjects)
        // yamap.map.GeoObjects.events.add("click", (e: any) => {
        //     console.log(e)
        //     var coords = e.get('coords');
        //     alert(coords.join(', '));
        // });
    }

    const handleSubmit = async () => {
        const cookieToken = getCookieToken();
        let token = null;
        if (cookieToken) {
            token = cookieToken.split('=')[1];
        }

        if (token) {
            try {
                const formDataToSend = new FormData();
                Object.keys(formData).forEach((key) => {
                    if (key !== 'images') {
                        formDataToSend.append(key, (formData as any)[key]);
                    }
                });
                console.log("formData.images", formData.images[0])
                formDataToSend.append('image', formData.images[0], formData.images[0].name);
                const response = await fetch('http://127.0.0.1:5000/add', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        //'Content-Type': 'multipart/form-data'
                    },
                    body: formDataToSend,
                });

                if (response.ok) {
                    console.log('Data added successfully');
                } else {
                    console.error('Failed to add data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <Login>
            <div className='px-[5%] w-full h-full'>
                <div className="flex flex-row w-[100%] justify-between">
                    <div className='flex flex-col w-[50%]'>
                        <div className="mb-6">
                            <label
                                htmlFor="default-input"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Название
                            </label>
                            <input
                                type="text"
                                name='name'
                                id="default-input"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Краткое описание</label>
                            <textarea id="message"
                                value={formData.cardDescription} onChange={handleInputChange}
                                name='cardDescription'
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Гора стрельная..."></textarea>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Описание</label>
                            <textarea id="message"
                                value={formData.description} onChange={handleInputChange}
                                name="description"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Гора стрельная..."></textarea>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Город</label>
                            <input
                                type="text"
                                name='city'
                                id="default-input"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Локация (местность где находится)</label>
                            <input
                                type="text"
                                name='location'
                                id="default-input"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>


                        <div className="mb-6">
                            <a className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Категории</a>

                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                            <input
                                multiple onChange={handleImageChange}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                aria-describedby="file_input_help" id="file_input" type="file" />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                        </div>
                        <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium mt-auto w-full' onClick={handleSubmit}>Добавить</button>
                    </div>
                    <YMaps>
                        <section className='w-1/2 h-inherit px-[5%]'>
                            <Map
                                className='w-full h-full'
                                onLoad={loadMap}
                                instanceRef={map}
                                defaultState={{ center: [53.195876, 50.100186], zoom: 9 }}>
                                <Clusterer
                                    options={{
                                        preset: 'islands#invertedVioletClusterIcons',
                                        groupByCoordinates: false,
                                    }}
                                >
                                    {point &&
                                        <Placemark geometry={point} onClick={() => alert('Hello!!!')} />
                                    }
                                </Clusterer>
                            </Map>
                        </section>
                    </YMaps>
                </div>
            </div>
        </Login>
    )
}

export default Admin;