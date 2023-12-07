import { useEffect, useRef, useState } from "react";
import PlaceItem from "./PlaceItem";
import { Place, Route, getData } from "../utils/backend";
import useIsMobile from "./isMobile";
import { useNavigate } from "react-router-dom";

function PlacesList({ places }: { places: Place[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    // const [places, setPlaces] = useState<Place[]>([]);
    const [scrolled, setScrolled] = useState(2);
    // const [routes, setRoutes] = useState<Route[]>([]);
    const [data, setData] = useState<any[]>([]);
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const [offset, setOffset] = useState(3);

    async function loadPlaces() {
        // const places = await getData("places") as any;
        const routes = await getData("routes") as any;
        console.log('places', places)
        const mergedList = places.map((place: any, index: any) => {
            if (index < routes.length) {
                return [place, routes[index]];
            } else {
                return [place];
            }
        }).flat();
        setData(mergedList)
    }

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
            if ((scrolled + 1) <= data.length) {
                setScrolled(scrolled + 1)
            }
        }
    };

    useEffect(() => {
        loadPlaces();
    }, [places])

    return (
        <section className='px-[5%] mt-[100px]'>
            <h2 style={{
                color: "#2C2C2C",
                fontWeight: "bold",
                fontSize: 'calc(30px + 7 * ((100vw - 720px) / 1280))',
                width: "auto",
                letterSpacing: -1
            }}>
                Лучшее в окрестностях Самарской области
            </h2>
            <div
                ref={scrollRef}
                className='w-full mt-[30px] gap-[30px] overflow-x-hidden h-fit flex max-md:flex-col md:flex-row scroll-smooth'>
                {data && data.length > 0 && data.slice(0, isMobile ? offset : 1000).map((item) => (
                    <PlaceItem data={item} />
                ))}
            </div>
            {isMobile ?
                offset < data.length ?
                    <div className="w-full flex justify-center mt-[20px]">
                        <button className='border border-[#595959] w-[200px] bg-[#FFFDFB] rounded-xl py-[10px]' onClick={() => { setOffset(offset + 3) }}>
                            Раскрыть →
                        </button>
                    </div>
                    : <></>
                :
                <div className='flex flex-row justify-center items-center mt-[24px]'>
                    <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={scrollLeft}>{'<'}</button>
                    <h2 className='text-[#2C2C2C] font-medium text-md mx-[30px]'>{scrolled}/{data.length || 1}</h2>
                    <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={scrollRight}>{'>'}</button>
                </div>
            }
        </section>
    )
}

export default PlacesList;