import { useEffect, useRef, useState } from 'react';
import ImageCard1 from '../assets/buti1.jpg';
import ImageCard2 from '../assets/buti2.jpg';
import ImageCard3 from '../assets/buti3.jpg';
import ImageCard4 from '../assets/buti4.jpg';
import ImageCard5 from '../assets/buti5.jpg';
import ImageCard6 from '../assets/buti6.jpg';
import useIsMobile from './isMobile';
// import ImageCard7 from './assets/buti7.jpg';
// import ImageCard8 from './assets/buti8.jpg'
;
const facts = [
    "12 апреля 1961 года первый космонавт Земли Юрий Гагарин совершил космический полет на корабле «Восток», выведенном в космос ракетой-носителем «Р-7», на 2/3 созданной в Самаре.",
    "В ходе Великой Отечественной войны (1941-1945) Куйбышев на некоторое время стал запасной столицей страны.",
    "В годы Великой Отечественной войны в Куйбышеве в эвакуации жил и работал величайший композитор двадцатого столетия Дмитрий Шостакович. Здесь была закончена и впервые исполнена его знаменитая Седьмая «Ленинградская» симфония.",
    "Пивной завод, построенный в 1881 году в Самаре австрийским дворянином Альфредом фон Вакано, работает до сих пор и является одним из символов города.",
    "Кумысолечебница Нестора Постникова - второе в мире кумысолечебное заведение (первое открыли в 1854 году тоже в Самарской губернии - в селе Богдановка).",
    "Самым крупным и красивым парком дореволюционной Самары считался Струковский сад, в котором впервые был исполнен вальс «На сопках Маньчжурии» (русский вальс начала XX века, посвящённый погибшим в русско-японской войне воинам 214-го резервного Мокшанского пехотного полка. Автор - военный капельмейстер полка Илья Шатров).",
    "Уникальный монумент ракета-носитель «Союз» музея «Самара Космическая» имени Дмитрия Козлова был установлен в Самаре в 2001 году в честь юбилея полета Юрия Гагарина в космос и ракеты Р-7 выпускаемой в Самаре с 1958 года на предприятии ЦСКБ-Прогресс."
];

function BlockSamaraFacts() {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [ImageCard1, ImageCard2, ImageCard3, ImageCard4, ImageCard5, ImageCard6];

    const goToPreviousSlide = () => {
        const index = (activeIndex - 1 + images.length) % images.length;
        setActiveIndex(index);
    };

    const goToNextSlide = () => {
        const index = (activeIndex + 1) % images.length;
        setActiveIndex(index);
    }; const isMobile = useIsMobile();

    return (
        <>
            <section
                className='w-full min-h-[50vh] bg-white py-[3%] px-[5%] flex max-md:flex-col flex-row'
            >
                <div className='max-md:w-full w-1/2 mb-6 max-md:min-h-[250px] md:pr-[5%] h-auto flex flex-col'>
                    <h1 style={{
                        color: "#2C2C2C",
                        fontWeight: "bold",
                        fontSize: isMobile ? 48 : 'calc(70px + 7 * ((100vw - 720px) / 1280))',
                        width: "auto",
                        letterSpacing: isMobile ? 1 : -4
                    }}
                    className='max-md:mb-4'
                    >
                        {"Самарская Область"}
                    </h1>

                    {/* <h1 className='font-bold text-2xl text-[#2C2C2C] mb-2'>Интересные факты</h1> */}
                    {/* <ul className='list-disc max-w-2/3 max-md:w-full w-2/3 '>
                        <li>{"12 апреля 1961 года первый космонавт Земли Юрий Гагарин совершил космический полет на корабле «Восток», выведенном в космос ракетой-носителем «Р-7», на 2/3 созданной в Самаре."}</li>
                        <li>{"В ходе Великой Отечественной войны (1941-1945) Куйбышев на некоторое время стал запасной столицей страны."}</li>
                        <li>{"В годы Великой Отечественной войны в Куйбышеве в эвакуации жил и работал величайший композитор двадцатого столетия Дмитрий Шостакович. Здесь была закончена и впервые исполнена его знаменитая Седьмая «Ленинградская» симфония. "}</li>
                        <li>{"Пивной завод, построенный в 1881 году в Самаре австрийским дворянином Альфредом фон Вакано, работает до сих пор и является одним из символов города."}</li>
                        <li>{"Кумысолечебница Нестора Постникова - второе в мире кумысолечебное заведение (первое открыли в 1854 году тоже в Самарской губернии - в селе Богдановка)."}</li>
                        <li>{"Самым крупным и красивым парком дореволюционной Самары считался Струковский сад, в котором впервые был исполнен вальс «На сопках Маньчжурии» (русский вальс начала XX века, посвящённый погибшим в русско-японской войне воинам 214-го резервного Мокшанского пехотного полка. Автор - военный капельмейстер полка Илья Шатров)."}</li>
                        <li>{"Уникальный монумент ракета-носитель «Союз» музея «Самара Космическая» имени Дмитрия Козлова был установлен в Самаре в 2001 году в честь юбилея полета Юрия Гагарина в космос и ракеты Р-7 выпускаемой в Самаре с 1958 года на предприятии ЦСКБ-Прогресс."}</li>
                    </ul> */}
                    <p>
                        {facts[activeIndex]}
                    </p>
                </div>
                <div className='max-md:w-full relative max-md:h-[500px] w-1/2 '>
                    {/* <div className="relative w-full"> */}
                        <div className="relative h-56 overflow-hidden rounded-[47px] md:h-96">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`duration-700 ease-in-out ${activeIndex === index ? '' : 'hidden'}`}
                                    data-carousel-item={activeIndex === index ? 'active' : ''}
                                >
                                    <img src={image} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="Чудеса Самарского Края" />
                                </div>
                            ))}
                        {/* </div> */}
                    </div>

                    <div className='flex flex-row justify-end items-center mt-[24px] ml-auto'>
                        <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={goToPreviousSlide}>{'<'}</button>
                        <h2 className='text-[#2C2C2C] font-medium text-md mx-[30px] min-w-[30px]'>{activeIndex+1}/{images?.length}</h2>
                        <button className='rounded-full w-[64px] h-[64px] border-2 border-[#B7B7B6]' onClick={goToNextSlide}>{'>'}</button>
                    </div>
                </div>
            </section>
        </>
    )
}

export default BlockSamaraFacts;