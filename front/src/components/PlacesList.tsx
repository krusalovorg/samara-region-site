import { useRef } from "react";
import PlaceItem from "./PlaceItem";

function PlacesList({ }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft -= (scrollRef.current.lastElementChild?.clientWidth || 250);
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += (scrollRef.current.lastElementChild?.clientWidth || 250);
        }
    };

    return (
        <section className='px-[5%] mt-[100px]'>
            <h2 style={{
                color: "#2C2C2C",
                fontWeight: "bold",
                fontSize: 'calc(30px + 7 * ((100vw - 720px) / 1280))',
                width: "auto",
                letterSpacing: -2
            }}>
                Лучшее в окрестностях Самарской области
            </h2>
            <div
                ref={scrollRef}
                className='w-full mt-[30px] gap-[30px] overflow-x-hidden h-fit flex flex-row scroll-smooth'>
                <PlaceItem />
                <PlaceItem />
                <PlaceItem />
                <PlaceItem />
                <PlaceItem />
                <PlaceItem />
                <PlaceItem />
                <PlaceItem />
            </div>
            <div className='flex flex-row justify-center items-center mt-[24px]'>
                <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={scrollLeft}>{'<'}</button>
                <h2 className='text-[#2C2C2C] font-medium text-md mx-[30px]'>1/16</h2>
                <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={scrollRight}>{'>'}</button>
            </div>
        </section>
    )
}

export default PlacesList;