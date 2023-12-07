import { useEffect, useRef, useState } from 'react';
import ImageCard1 from '../assets/buti1.jpg';
import ImageCard2 from '../assets/buti2.jpg';
import ImageCard3 from '../assets/buti3.jpg';
import ImageCard4 from '../assets/buti4.jpg';
import ImageCard5 from '../assets/buti5.jpg';
import ImageCard6 from '../assets/buti6.jpg';
import { YMaps, Map, Placemark, Polyline } from '@pbe/react-yandex-maps';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';
import { Place, Route, getData } from '../utils/backend';
import Category from './Category';
import { declOfHours } from '../utils/utils';
import useIsMobile from './isMobile';
// import ImageCard7 from './assets/buti7.jpg';
// import ImageCard8 from './assets/buti8.jpg';

function BlockSamara({ places }: { places: Place[] }) {
    // const { YMaps, Map, Placemark } = require("@pbe/react-yandex-maps")
    const map = useRef<any>(null);
    const [yamap, setYampas] = useState<YMapsApi | null>(null);
    const [loaded, setLoaded] = useState(false);
    const isMobile = useIsMobile();
    const [information, setInformation] = useState<any>({
        name: "",
        description: "",
        category: []
    });

    const [search, setSearch] = useState(0);
    const [routes, setRoutes] = useState<Route[]>([]);
    const form = {
        one: "Активный",
        two: "Спокойный",
        quest: "Вид отдыха"
    };

    console.log('key', process.env.REACT_APP_YANDEX_KEY)


    const addRoute = (ymaps: any) => {
        setYampas(ymaps)
    };

    function loadRouters(route: Route) {
        if (yamap == null) return

        const extractedCoordinates: any[] = (route?.points as Place[])?.map((item) => item.coordinates);

        const multiRoute = new yamap.multiRouter.MultiRoute(
            {
                referencePoints: extractedCoordinates,
                // params: {
                //     routingMode: "masstransit"
                // }
            } as any,
            {
                boundsAutoApply: true,
                routeActiveStrokeWidth: 6,
                routeActiveStrokeColor: "#fa6600",
            }
        );
        console.log('multiRoute', multiRoute)

        multiRoute.events.add("click", () => {
            // var yandexWayPoint = multiRoute.getWayPoints().get(1);
            setInformation({
                ...route,
                name: route.name,
                //category: [],
                description: route.description
            })
        });

        const res = map?.current.geoObjects?.add(multiRoute);
        console.log(res)
        //getRegions();
    }

    async function StartSearch(event?: any) {
        if (search == 1 && event) {
            const data_route = await getData('routes', event) as Route[];
            if (data_route) {
                setRoutes(data_route as Route[])
                for (const route of data_route) {
                    await loadRouters(route as Route);
                }
            }
            // setSearch(0);
            // return
        }
        if (search < 3) {
            setSearch(search + 1)
        }
    }

    useEffect(() => {
        if (yamap !== null) {
            //loadRouters()
        }
    }, [yamap])

    // useEffect(() => {
    //     loadPlaces()
    // }, [])

    return (
        <>
            <section
                className='w-full min-h-[80vh] bg-[#D2F881] max-md:rounded-[16px] md:rounded-[50px] py-[3%] px-[5%] flex max-md:flex-col flex-row'
            >
                <div className='max-md:w-full max-md:h-[500px] w-1/2 md:pr-[5%]'>
                    {/* {[ImageCard1, ImageCard2, ImageCard3, ImageCard4, ImageCard5, ImageCard6,].map((image) => (
                        <img
                            className='w-auto rounded-3xl'
                            src={image}
                        />
                    ))} */}
                    <YMaps query={{ apikey: "dd278cf2-bbc1-4819-8232-fbba0d13289a" }}>
                        <Map
                            instanceRef={map}
                            className='w-full h-full max-md-[500px] max-h-[75vh]'
                            onLoad={addRoute}
                            modules={["multiRouter.MultiRoute"]}
                            defaultState={{ center: [53.2415041, 50.2212463], zoom: 7 }}
                        >
                            {
                                places.map((place) => {
                                    if (place.coordinates.split(",").length == 2) {
                                        return <Placemark
                                            options={{
                                                iconColor: "red"
                                            }}
                                            defaultGeometry={place.coordinates.split(",")} onClick={() => {
                                                setInformation(place as any)
                                            }} />
                                    }
                                })
                            }
                            {/* <Polyline query={{ apikey: "dd278cf2-bbc1-4819-8232-fbba0d13289a" }}
                                geometry={[
                                    { 
                                        id: 155491399,
                                        latitude: "53.202025",
                                        longitude: "50.096821",
                                    },
                                    {
                                        id: 155491404,
                                        latitude: "53.513222",
                                        longitude: "49.410331",
                                    },
                                ]}
                                options={{
                                    //balloonCloseButton: true,
                                    strokeColor: "#333333",
                                    strokeWidth: 5,
                                    strokeOpacity: 0.9,
                                    //editorMaxPoints: 6,
                                    // Adding a new item to the context menu that allows deleting the polyline.
                                    // editorMenuManager => {
                                    //     // PreParedData.push({
                                    //     //     title: "Delete line",
                                    //     //     onClick: () => console.log(...arguments)
                                    //     // });
                                    //     // return PreParedData;
                                    // }
                                }}
                            /> */}

                        </Map>
                    </YMaps>

                </div>
                <div className='max-md:w-full w-1/2 h-auto flex flex-col'>
                    <h1 style={{
                        color: "#2C2C2C",
                        fontWeight: "bold",
                        fontSize: isMobile ? 48 : 'calc(70px + 7 * ((100vw - 720px) / 1280))',
                        width: "auto",
                        letterSpacing: isMobile ? 1 : -4
                    }} onClick={() => {
                        addRoute(yamap)
                    }}>
                        {information?.name || "Самарская Область"}
                    </h1>
                    <div className='flex flex-row my-[10px] gap-x-2'>
                        {
                            information?.category && information?.category?.length > 0 && information?.category?.map((item: any) => {
                                return <Category text={item?.name} description={item?.description} />
                            })
                        }
                    </div>

                    {
                        information?.description ?
                            <>
                                <h2 style={{
                                    color: "#2C2C2C",
                                    fontWeight: "normal",
                                    maxWidth: "75%"
                                }} className='md:text-2xl max-md:text-xl'>
                                    {information?.description}
                                </h2>
                                {information.time}
                                {information.time ? <h3 className='md:text-2xl max-md:text-xl text-[#2C2C2C] my-[15px] leading-[150%]'>Продолжительность: {information?.time} {declOfHours(information.time)}</h3> : <></>}
                                {information.points ?

                                    <>
                                        <h3 className='md:text-2xl max-md:text-xl text-[#2C2C2C] my-[15px] leading-[150%]'>Точек: {information?.points.length}</h3>
                                        <h3 className='md:text-2xl max-md:text-xl text-[#2C2C2C] leading-[150%]'>Города: {information?.points?.map((item: any) => item?.city).filter((value: any, index: any, self: any) => self.indexOf(value) === index).join(", ")}</h3>
                                    </>
                                    : <></>
                                }
                            </>
                            :
                            <>
                                <h1 className='font-bold text-2xl text-[#2C2C2C] mb-2'>Интересные факты</h1>
                                <ul className='list-disc max-w-2/3 max-md:w-full w-2/3 '>
                                    <li>{"12 апреля 1961 года первый космонавт Земли Юрий Гагарин совершил космический полет на корабле «Восток», выведенном в космос ракетой-носителем «Р-7», на 2/3 созданной в Самаре."}</li>
                                    <li>{"В ходе Великой Отечественной войны (1941-1945) Куйбышев на некоторое время стал запасной столицей страны."}</li>
                                    <li>{"В годы Великой Отечественной войны в Куйбышеве в эвакуации жил и работал величайший композитор двадцатого столетия Дмитрий Шостакович. Здесь была закончена и впервые исполнена его знаменитая Седьмая «Ленинградская» симфония. "}</li>
                                    <li>{"Пивной завод, построенный в 1881 году в Самаре австрийским дворянином Альфредом фон Вакано, работает до сих пор и является одним из символов города."}</li>
                                    <li>{"Кумысолечебница Нестора Постникова - второе в мире кумысолечебное заведение (первое открыли в 1854 году тоже в Самарской губернии - в селе Богдановка)."}</li>
                                    <li>{"Самым крупным и красивым парком дореволюционной Самары считался Струковский сад, в котором впервые был исполнен вальс «На сопках Маньчжурии» (русский вальс начала XX века, посвящённый погибшим в русско-японской войне воинам 214-го резервного Мокшанского пехотного полка. Автор - военный капельмейстер полка Илья Шатров)."}</li>
                                    <li>{"Уникальный монумент ракета-носитель «Союз» музея «Самара Космическая» имени Дмитрия Козлова был установлен в Самаре в 2001 году в честь юбилея полета Юрия Гагарина в космос и ракеты Р-7 выпускаемой в Самаре с 1958 года на предприятии ЦСКБ-Прогресс."}</li>
                                </ul>
                            </>
                    }
                    <div className='mt-auto w-full flex flex-col justify-end items-center' style={isMobile ? {marginTop: 12} : {}}>

                        {search == 0 && <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium mt-auto w-full' onClick={() => StartSearch()}>Подобрать маршрут</button>}
                        {search == 1 &&
                            <>
                                <h1 className='text-[#2C2C2C] font-medium text-2xl mb-[20px]'>{form.quest}</h1>
                                <div className='w-full flex flex-row justify-between'>
                                    <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium w-[49%]' onClick={() => StartSearch(1)}>{form.one}</button>
                                    <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium w-[49%]' onClick={() => StartSearch(2)}>{form.two}</button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default BlockSamara;