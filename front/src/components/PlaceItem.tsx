import ImageCard2 from '../assets/buti2.jpg';
import { useNavigate } from "react-router-dom";

function PlaceItem({}: {}) {
    const navigate = useNavigate();

    return (
        <div
            className='rounded-2xl min-w-[35%] h-[250px] relative bg-shadow-g snap-always snap-center cursor-pointer'
            style={{
                backgroundImage: `url(${ImageCard2})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
            onClick={()=>{
                navigate("/place/1")
            }}>
            {/* <div className='absolute bottom-0 w-full h-1/3 rounded-b-2xl z-[1]' style={{  }} /> */}
            <div className='px-[5%] py-[20px] h-full w-full flex z-[100] relative flex flex-col'>
                <h3 className='text-[#2C2C2C] font-medium text-md mt-1 px-[10px] py-[7px] rounded-2xl bg-[#FFEED5] w-fit'>Достопримечательность</h3>
                <h2 className='text-white font-bold spacing-[0px] text-3xl mt-auto'>Замок "Гарибальди"</h2>
                <h3 className='text-white spacing-[0px] text-lg mt-1'>20км от Ягодного · Длительность 1 час</h3>
            </div>
        </div>
    )
}

export default PlaceItem;