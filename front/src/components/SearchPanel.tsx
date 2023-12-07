import React, { useEffect, useState } from 'react';

import { Dropdown } from "flowbite-react";
import CustomRangeInput from "./CustomRangeInput";
import { Category, Place, Route, getData } from '../utils/backend';
import PlaceItem from './PlaceItem';
import useIsMobile from './isMobile';

function SearchPanel() {
    const [timeToure, setTimeToure] = useState(6);
    const [searchCategory, setSearchCategory] = useState<string | null>(null);
    const [categoryId, setCategoryId] = useState<number>(-1);

    const [categorys, setCategorys] = useState<Category[]>([]);

    const [offset, setOffset] = useState(10);
    const [search, setSearch] = useState(0);
    const [data, setData] = useState<Route[] | Place[]>([]);
    const [objectsSearch, setObjectsSearch] = useState<string[]>([]);
    const isMobile = useIsMobile();

    async function loadCategorys() {
        const data = await getData('category');
        if (data) {
            setCategorys(data);
        }
    }

    function handleUpdateCheckbox(value: string) {
        if (objectsSearch.includes(value)) {
            setObjectsSearch(objectsSearch.filter(item => item !== value))
        } else {
            setObjectsSearch([...objectsSearch, value])
        }
    }

    async function getDataCategory(type: "places" | "routes") {
        let new_data: any = await getData(type as any, categoryId, timeToure);
        return new_data
    }

    async function SearchE() {
        setSearch(1);
        let new_data: any = [];
        if (objectsSearch.includes('places')) {
            const places_data = await getDataCategory('places');
            new_data = places_data
        }
        if (objectsSearch.includes('routes')) {
            const route_data = await getDataCategory('routes');
            new_data = [...new_data, ...route_data]
        }
        console.log('get new data', new_data, objectsSearch)
        setData(new_data)
        setSearch(2);
    }

    useEffect(() => {
        loadCategorys();
    }, [])

    useEffect(() => {
        if (objectsSearch.length > 0 && search == 2) {
            SearchE();
        }
    }, [categoryId])

    return (
        <>
            <div className='w-full px-[5%]'>
                <div className='bg-[#2C2C2C] px-[40px] py-[35px] rounded-3xl flex h-fit max-md:gap-y-2 flex-col md:flex-row items-strech'>
                    <CustomRangeInput label={"Продолжительность"} value={timeToure} setValue={setTimeToure} />
                    {/* searchCategory == "Места" ? "Отдаленость" : "Продолжительность" */}
                    <Dropdown
                        style={{
                            fontWeight: "medium",
                            background: "#FEEFD7",
                            padding: "0 27px",
                            color: "black",
                            borderRadius: "16px",
                            marginLeft: isMobile ? 0 : 20,
                            width: isMobile ? "100%" : 160,
                            zIndex: 1000,
                            height: isMobile ? 60 : ""
                        }}
                        className='bg-[#D2F881] px-10 py-3 font-medium rounded-xl z-[1000] w-fit'
                        label={searchCategory || "Категория"} dismissOnClick={true}>
                        {/* <Dropdown.Item onClick={() => setSearchCategory("Места")}>Места</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchCategory("Маршруты")}>Маршруты</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchCategory("Круизы")}>Круизы</Dropdown.Item>
 */}
                        <Dropdown.Item className='flex justify-center items-center' onClick={() => {
                            setCategoryId(-1)
                            setSearchCategory("Все")
                        }}>Все</Dropdown.Item>

                        {categorys.map((item: Category) =>
                            <Dropdown.Item className='flex justify-center items-center' onClick={() => {
                                setCategoryId(item?.id)
                                setSearchCategory(item.name)
                            }}>{item.name}</Dropdown.Item>
                        )}
                    </Dropdown>
                    {/* <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium ml-[20px]' onClick={SearchE}>Поиск</button> */}
                    <div className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium md:ml-[20px] flex justify-center items-center'>
                        <input
                            checked={objectsSearch.includes("routes")}
                            onChange={(event) => handleUpdateCheckbox('routes')}
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Маршруты</label>
                    </div>
                    <div className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium md:ml-[20px] flex justify-center items-center'>
                        <input
                            checked={objectsSearch.includes("places")}
                            onChange={(event) => handleUpdateCheckbox('places')}
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Туристические точки</label>
                    </div>

                    <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium md:ml-auto'
                        onClick={SearchE}
                    >
                        Поиск
                    </button>
                </div>
            </div>
            {search == 1 ? <div className='w-full px-[5%] flex justify-center items-center h-[20em]'>
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
                : search == 2 ?
                    <>
                        <div className='max-md:grid-cols-1 w-full px-[5%] overflow-x-auto h-fit grid grid-cols-3 gap-4 my-20 relative transition-all'>
                            {data.length > 0 ?
                                data.slice(0, offset).map((item) => (
                                    <PlaceItem data={item as any} />
                                ))
                                :
                                <>
                                    <div />
                                    <h1 className='m-auto z-10 text-2xl'>
                                        Результаты не найдены
                                    </h1>
                                    <div />
                                </>
                            }
                        </div>
                        {data.length >= offset &&
                            <div className='w-full flex justify-center items-center px-[5%] mb-[20px]'>
                                <button className='border border-[#595959] w-[200px] bg-[#FFFDFB] rounded-xl py-[10px]' onClick={() => { setOffset(offset + 10) }}>
                                    Раскрыть →
                                </button>
                            </div>
                        }
                    </>
                    : <div className='h-[5em]'></div>
            }

        </>
    )
}

export default SearchPanel;