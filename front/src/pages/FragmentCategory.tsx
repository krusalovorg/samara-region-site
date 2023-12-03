import React, { useState, useEffect, useRef } from 'react';
import Login from '../components/Login';
import { getCookieToken } from '../utils/utils';
import { YMaps, Map, Placemark, SearchControl, Clusterer } from '@pbe/react-yandex-maps';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';
import { Category, getData } from '../utils/backend';

function FragmentCategory() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [type, setType] = useState("add");
    const [selectId, setSelectId] = useState(-1);

    const [categorys, setCategorys] = useState<Category[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as any;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        const cookieToken = getCookieToken();
        let token = null;
        if (cookieToken) {
            token = cookieToken.split('=')[1];
        }

        if (token) {
            try {
                const formDataToSend = new FormData();
                formDataToSend.append("type", "category");
                formDataToSend.append("name", formData.name);
                formDataToSend.append("description", formData.description);
                console.log(formDataToSend.get('type'))
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
                    loadCategorys();
                } else {
                    console.error('Failed to add data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };


    async function loadCategorys() {
        const data = await getData("category");

        if (data) {
            setCategorys(data);
        }
    }

    useEffect(() => {
        loadCategorys();
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
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Описание</label>
                        <textarea id="message"
                            value={formData.description} onChange={handleInputChange}
                            name="description"
                            className="block p-2.5 w-full text-sm h-96 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Гора стрельная..."></textarea>
                    </div>

                    <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium mt-auto w-full' onClick={handleSubmit}>{type == "edit" ? "Обновить" : "Добавить"}</button>
                    {
                        type == "edit" &&
                        <button className='bg-[#ff6f6f] text-white px-10 py-5 rounded-2xl font-medium mt-2 w-full' onClick={handleSubmit}>Удалить</button>
                    }
                </div>
                <section className='w-1/2 h-inherit px-[5%]'>
                    <div className="mb-6">
                        <a className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Категории</a>
                        {
                            categorys.map((item) => (
                                <button className={`bg-[#FEEFD7] px-10 py-3 mb-[10px] rounded-2xl font-medium mt-auto w-full ${selectId == item.id ? "bg-white" : ""}`} onClick={()=>{
                                    setFormData(item)
                                    if (selectId == item.id) {
                                        setSelectId(-1)
                                        setType("add")
                                    } else {
                                        setType("edit")
                                        setSelectId(item.id)
                                    }
                                }}>{item.name}</button>
                            ))
                        }
                    </div>
                </section>
            </div>
        </>
    )
}

export default FragmentCategory;