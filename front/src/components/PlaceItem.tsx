import ImageCard2 from '../assets/buti2.jpg';
import { useNavigate } from "react-router-dom";
import Category from './Category';
import { Place } from '../utils/backend';
import { getImage } from '../utils/utils';

function PlaceItem({ data }: { data?: Place }) {
    const navigate = useNavigate();

    return (
        <div
            className='rounded-2xl min-w-[35%] h-[250px] relative bg-shadow-g snap-always snap-center cursor-pointer'
            style={{
                backgroundImage: `url(${data?.images ? getImage(data?.images) : ImageCard2})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
            onClick={() => {
                navigate("/place/"+data?.id)
            }}>
            {/* <div className='absolute bottom-0 w-full h-1/3 rounded-b-2xl z-[1]' style={{  }} /> */}
            <div className='px-[5%] py-[20px] h-full w-full flex z-[100] relative flex flex-col'>
                <div className='flex flex-row gap-x-[10px]'>
                    <Category text={data?.category || 'Достопримечательность'} />
                    <Category text={data?.category || 'Достопримечательность'} />
                </div>

                <h2 className='text-white font-bold spacing-[0px] text-3xl mt-auto'>{data?.name || ""}</h2>
                <h3 className='text-white spacing-[0px] text-lg mt-1'>{data?.card_description || ""}</h3>
            </div>
        </div>
    )
}

export default PlaceItem;