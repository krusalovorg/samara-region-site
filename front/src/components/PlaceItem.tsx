import ImageCard2 from '../assets/buti2.jpg';
import { useNavigate } from "react-router-dom";
import Category from './Category';
import { Place, getItemById } from '../utils/backend';
import { declOfHours, getImage } from '../utils/utils';
import { useEffect, useState } from 'react';

function PlaceItem({ data, style, onClick }: { data?: Place, style?: any, onClick?: any }) {
    const navigate = useNavigate();
    const [categorys, setCategorys] = useState<any[]>([]);

    async function loadCategorys() {
        if (data?.category && data?.category?.split(',')?.length > 0) {
            console.log('data ',data.category)
            let all_data = [];
            for (const category_id of data?.category?.split(',')) {
                console.log('category id fetched', category_id)
                const data = await getItemById(category_id, 'category');
                console.log('result gert', data)
                if (data) {
                    all_data.push(data);
                }
            }
            setCategorys(all_data);
        }
    }

    useEffect(() => {
        loadCategorys();
    }, [])

    return (
        <div
            className='rounded-2xl min-w-[35%] h-[250px] relative bg-shadow-g snap-always snap-center cursor-pointer'
            style={{
                backgroundImage: `url(${data?.images ? getImage(data?.images) : ImageCard2})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                ...style
            }}
            onClick={() => {
                if (onClick) {
                    onClick()
                } else {
                    navigate(`/${data?.rate == undefined ? "route" : "place"}/${data?.id}`)
                }
            }}>
            {/* <div className='absolute bottom-0 w-full h-1/3 rounded-b-2xl z-[1]' style={{  }} /> */}
            <div className={`px-[5%] py-[20px] h-full w-full flex z-[10] relative flex flex-col`}>
                <div className='flex flex-row gap-x-[10px]'>
                    {categorys.map((item) =>
                        <Category text={item.name} />
                    )}
                    {data?.rate == undefined && <Category text={'Маршрут'} />}
                </div>

                <h2 className='text-white font-bold spacing-[0px] text-3xl mt-auto'>{data?.name || ""}</h2>
                <h3 className='text-white spacing-[0px] text-lg mt-1'>{data?.card_description || ""}</h3>
                {
                    data?.time ?
                    <h3 className='text-white spacing-[0px] text-md mt-1'>Продолжительность: {data?.time} {declOfHours(data?.time) || ""}</h3>
                    :
                    <></>
                }
            </div>
        </div>
    )
}

export default PlaceItem;