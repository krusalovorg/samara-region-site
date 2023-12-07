import React, { useState, useEffect, useRef } from 'react';
import Login from '../components/Login';
import { getCookieToken } from '../utils/utils';
import { YMaps, Map, Placemark, SearchControl, Clusterer } from '@pbe/react-yandex-maps';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';
import { Category, deleteById, getData } from '../utils/backend';
import Alert from '../components/Alert';

function FragmentCategory() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        id: -1
    });
    const [type, setType] = useState("add");
    const [selectId, setSelectId] = useState(-1);

    const [categorys, setCategorys] = useState<Category[]>([]);

    const [alertShow, setAlertShow] = useState(false);
    const [alertContent, setAlertContent] = useState("Успешно!");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as any;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    function alert(text: string) {
        setAlertShow(true);
        setAlertContent(text);
        setTimeout(() => {
            setAlertShow(false);
        }, 1500)
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
                formDataToSend.append("type", "category");
                formDataToSend.append("name", formData.name);
                formDataToSend.append("description", formData.description);
                formDataToSend.append("id", formData.id + '');
                console.log(formDataToSend.get('type'))
                const response = await fetch(`http://127.0.0.1:5000/${type == 'edit' ? 'edit' : "add"}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        //'Content-Type': 'multipart/form-data'
                    },
                    body: formDataToSend,
                });
                loadCategorys();

                if (response.ok) {
                    console.log('Data added successfully');
                    alert("Успешно!");
                    loadCategorys();
                } else {
                    alert("Произошла ошибка");
                    console.error('Failed to add data');
                }
            } catch (error) {
                alert("Произошла ошибка");
                console.error('Error:', error);
            }
        }
    };

    async function handleDelete() {
        const result = await deleteById(formData?.id, 'category');
        alert("Успешно");
        loadCategorys();
    }

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
            {alertShow && <Alert content={alertContent}/>}
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
                        <button className='bg-[#ff6f6f] text-white px-10 py-5 rounded-2xl font-medium mt-2 w-full' onClick={handleDelete}>Удалить</button>
                    }
                </div>
                <section className='w-1/2 h-inherit px-[5%]'>
                    <div className="mb-6">
                        <a className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Категории</a>
                        {
                            categorys.map((item) => (
                                <button className={`bg-[#FEEFD7] px-10 py-3 mb-[10px] rounded-2xl font-medium mt-auto w-full ${selectId == item.id ? "bg-white" : ""}`} onClick={() => {
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