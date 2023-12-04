import React, { useState, useEffect, useRef } from 'react';
import Login from '../components/Login';
import { getCookieToken } from '../utils/utils';
import { YMaps, Map, Placemark, SearchControl, Clusterer } from '@pbe/react-yandex-maps';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';
import { Category, Place, getData } from '../utils/backend';

function FragmentRoutes({ setFragment }: { setFragment?: any }) {
    const [formData, setFormData] = useState<{
        name: string;
        cardDescription: string;
        description: string;
        category: number[];
        images: File[];
        points: number[]
    }>({
        name: '',
        cardDescription: '',
        description: '',
        category: [],
        images: [] as File[],
        points: []
    });

    const [places, setPlaces] = useState<Place[]>([]);
    const map = useRef<any>(null);
    const [categorys, setCategorys] = useState<Category[]>([]);

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
                formDataToSend.append('image', formData.images[0], formData.images[0].name);
                formDataToSend.append("type", "routes");
                const response = await fetch('http://127.0.0.1:5000/add', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
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


    async function load() {
        const places = await getData("places");
        const category = await getData("category");

        if (category) {
            setCategorys(category);
        }
        if (places) {
            setPlaces(places as Place[]);
        }
    }

    useEffect(() => {
        load();
    }, [])

    return (
        <>
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
                        <a className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Категории</a>
                        {
                            categorys.map((item) => (
                                <button className={`bg-[#FEEFD7] px-10 py-3 mb-[10px] rounded-2xl font-medium mt-auto w-full ${formData.category.includes(item.id) ? " bg-white" : ""}`} onClick={() => {
                                    if (formData.category.includes(item.id)) {
                                        const new_cat = formData.category.filter(cat => cat !== item.id);
                                        setFormData({ ...formData, category: new_cat })
                                    } else {
                                        setFormData({ ...formData, category: [...formData.category, item.id] })
                                    }
                                }}>{item.name}</button>
                            ))
                        }

                        <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium mt-auto w-full' onClick={() => { setFragment("category") }}>Добавить</button>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                        <input
                            onChange={handleImageChange}
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
                                {/* {points &&
                                    <Placemark geometry={points[0]} onClick={() => alert('Hello!!!')} />
                                } */}
                                {places && places.length > 0 && places.map((place) =>
                                    <Placemark geometry={place?.coordinates?.split(",")} />
                                )}
                            </Clusterer>
                        </Map>
                    </section>
                </YMaps>
            </div>
        </>
    )
}

export default FragmentRoutes;