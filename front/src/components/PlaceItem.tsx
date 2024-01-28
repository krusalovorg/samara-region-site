import ImageCard2 from '../assets/buti2.jpg';
import { useNavigate } from "react-router-dom";
import Category from './Category';
import { Category as CategoryType, Place, getItemById } from '../utils/backend';
import { declOfHours, getImage } from '../utils/utils';
import { useEffect, useState } from 'react';

function PlaceItem({ data, style, onClick, mini, grid }: { data?: any, style?: any, onClick?: any, mini?: boolean, grid?: boolean }) {
    const navigate = useNavigate();
    const [categorys, setCategorys] = useState<any[]>([]);

    async function loadCategorys() {
        if (data?.category && typeof data?.category == 'string' && data?.category?.split(',')?.length > 0) {
            // console.log('data ',data.category)
            // let all_data = [];
            // for (const category_id of data?.category?.split(',')) {
            //     console.log('category id fetched', category_id)
            //     const data = await getItemById(category_id, 'category');
            //     console.log('result gert', data)
            //     if (data) {
            //         all_data.push(data);
            //     }
            // }
            // setCategorys(all_data);
        } else {
            setCategorys(data?.category as any)
        }

        console.log(getImage(data?.image as any))
    }

    useEffect(() => {
        loadCategorys();
    }, [])

    return (
        <div
            className='rounded-2xl relative bg-shadow-g snap-always snap-center cursor-pointer'
            style={{
                backgroundImage: `url(${data?.image ? getImage(data?.image) : ImageCard2})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: mini ? 250 : 450,
                minWidth: mini ? "35%" : (grid ? 'auto' : 600),
                ...style
            }}
            onClick={() => {
                if (onClick) {
                    onClick()
                } else {
                    navigate(`/${data?.rate == undefined ? "route" : "place"}/${data?._id}`)
                }
            }}>
            {/* <div className='absolute bottom-0 w-full h-1/3 rounded-b-2xl z-[1]' style={{  }} /> */}
            <div className={`px-[5%] py-[20px] h-full w-full flex z-[10] relative flex flex-col`}>
                <div className='flex flex-row gap-x-[10px] z-[100]'>
                    {categorys && categorys?.length > 0 && categorys?.map((item: any) =>
                        <Category text={item?.name} description={item?.description}/>
                    )}
                    {data?.rate == undefined && data?.points && <Category description={"В этой категории вы найдете увлекательные маршруты, составленные специально для путешественников, включающие несколько точек туристического интереса."} text={'Маршрут'} />}
                </div>

                <h2 className='text-white font-bold spacing-[0px] text-3xl mt-auto'>{data?.name || ""}</h2>
                <h3 className='text-white spacing-[0px] text-lg mt-1'>{data?.card_description || ""}</h3>
                {
                    data?.time && data?.time > 0 ?
                    <h3 className='text-white spacing-[0px] text-md mt-1'>Продолжительность: {data?.time} {declOfHours(data?.time) || ""}</h3>
                    :
                    <></>
                }
            </div>
        </div>
    )
}

export default PlaceItem;