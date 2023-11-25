import { useRef } from "react";
import ExcursionItem from "./ExcursionItem";
import ImageCard2 from '../assets/buti2.jpg';
import ImageCard3 from '../assets/buti3.jpg';
import ImageCard4 from '../assets/buti4.jpg';

function ExcursionList({ }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft -= ((scrollRef.current.lastElementChild?.clientWidth || 250) * 2);
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += ((scrollRef.current.lastElementChild?.clientWidth || 250) * 2);
        }
    };

    return (
        <section className='px-[5%] w-full'>
            <h2 style={{
                color: "#2C2C2C",
                fontWeight: "bold",
                fontSize: 'calc(30px + 7 * ((100vw - 720px) / 1280))',
                width: "auto",
                letterSpacing: -2
            }}>
                Лучшие экскурсии
            </h2>
            <div
                ref={scrollRef}
                className='w-full mt-[30px] gap-[30px] overflow-x-hidden h-fit flex flex-row scroll-smooth'>
                <ExcursionItem data={{ image: ImageCard2, title: `Замок "Гарибальди"`, price: 1000 }} />
                <ExcursionItem data={{ image: ImageCard3, title: `Прогулка по лугам`, price: 5000 }} />
                <ExcursionItem data={{ image: ImageCard4, title: `Замок "Гарибальди"`, categorys: ["Музей"] }} />
                <ExcursionItem data={{ image: ImageCard3, title: `Прогулка по лугам`, price: 0, categorys: ["Активно", "Природа"] }} />
                <ExcursionItem data={{ image: ImageCard4, title: `Замок "Гарибальди"`, categorys: ["Музей"] }} />
                <ExcursionItem data={{ image: ImageCard3, title: `Прогулка по лугам`, price: 0, categorys: ["Активно", "Природа"] }} />
                <ExcursionItem data={{ image: ImageCard4, title: `Замок "Гарибальди"`, categorys: ["Музей"] }} />
                <ExcursionItem data={{ image: ImageCard3, title: `Прогулка по лугам`, price: 0, categorys: ["Активно", "Природа"] }} />
                <ExcursionItem data={{ image: ImageCard4, title: `Замок "Гарибальди"`, categorys: ["Музей"] }} />
                <ExcursionItem data={{ image: ImageCard3, title: `Прогулка по лугам`, price: 0, categorys: ["Активно", "Природа"] }} />
                <ExcursionItem data={{ image: ImageCard4, title: `Замок "Гарибальди"`, categorys: ["Музей"] }} />
                <ExcursionItem data={{ image: ImageCard3, title: `Прогулка по лугам`, price: 0, categorys: ["Активно", "Природа"] }} />
            </div>
            <div className='flex flex-row justify-center items-center mt-[24px]'>
                <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={scrollLeft}>{'<'}</button>
                <h2 className='text-[#2C2C2C] font-medium text-md mx-[30px]'>1/16</h2>
                <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={scrollRight}>{'>'}</button>
            </div>
        </section>
    )
}

export default ExcursionList;