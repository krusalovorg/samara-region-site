import { useEffect, useRef, useState } from "react";
import PlaceItem from "./PlaceItem";
import { Place, getData } from "../utils/backend";

function PlacesList({ }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [scrolled, setScrolled] = useState(0);

    async function loadPlaces() {
        const data = await getData("places");

        if (data) {
            setPlaces(data as Place[]);
        }
    }

    useEffect(() => {
        loadPlaces();
    }, [])

    const scrollLeft = () => {
        if (scrollRef.current) {
            const item_width = scrollRef.current.lastElementChild?.clientWidth as any
            const new_scroll = scrollRef.current.scrollLeft - (item_width || 250);
            scrollRef.current.scrollLeft = new_scroll;
            console.log(scrollRef.current.scrollLeft, new_scroll)
            if ((scrolled - 1) >= 2) {
                setScrolled(scrolled - 1)
            }
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            const item_width = scrollRef.current.lastElementChild?.clientWidth as any
            const new_scroll = scrollRef.current.scrollLeft + (item_width || 250);
            scrollRef.current.scrollLeft = new_scroll;
            if ((scrolled + 1) <= places.length) {
                setScrolled(scrolled + 1)
            }
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
                {places && places.length > 0 && places.map((item) => (
                    <PlaceItem data={item} />
                ))}
            </div>
            <div className='flex flex-row justify-center items-center mt-[24px]'>
                <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={scrollLeft}>{'<'}</button>
                <h2 className='text-[#2C2C2C] font-medium text-md mx-[30px]'>{scrolled}/{places.length || 1}</h2>
                <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={scrollRight}>{'>'}</button>
            </div>
        </section>
    )
}

export default PlacesList;