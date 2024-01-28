import { useEffect, useRef, useState } from 'react';
import { YMaps, Map, Placemark, Polyline } from '@pbe/react-yandex-maps';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';
import { Place, Route, getData } from '../utils/backend';
import Category from './Category';
import { declOfHours } from '../utils/utils';
import useIsMobile from './isMobile';
import SearchPanelUpdated from './SearchPanelUpdated';
import PlaceItem from './PlaceItem';

function BlockSamaraScreen() {
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
    const [places, setPlaces] = useState<Place[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const form = {
        one: "Активный",
        two: "Спокойный",
        quest: "Вид отдыха"
    };


    async function loadPlaces() {
        const data = await getData("places");

        if (data) {
            setPlaces(data as Place[]);
        }
    }

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

    useEffect(() => {
        if (yamap !== null) {
            //loadRouters()
        }
    }, [yamap])

    useEffect(() => {
        loadPlaces()
    }, [])

    return (
        <>
            <section
                className='w-full relative min-h-screen max-md:rounded-[16px] md:rounded-[50px] flex max-md:flex-col flex-row'
            >
                <div className='max-md:w-screen max-md:h-[100vh - 120px] w-[100vw]'>
                    <YMaps query={{ apikey: "dd278cf2-bbc1-4819-8232-fbba0d13289a" }}>
                        <Map
                            instanceRef={map}
                            className='w-full max-md-[500px] h-full'
                            onLoad={addRoute}
                            style={{
                                width: "100%",
                                minHeight: "100vh"
                            }}
                            modules={["multiRouter.MultiRoute"]}
                            defaultState={{ center: [53.2415041, 50.2212463], zoom: 8 }}
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
                                                console.log('set place',place)
                                            }} />
                                    }
                                })
                            }
                        </Map>
                    </YMaps>
                    <div className='absolute h-full flex items-end pb-[300px] max-md:pl-[5%] max-md:pb-[400px] z-[100] right-[5%] bottom-0'>
                        {
                            information?.name && <PlaceItem mini={isMobile} data={information}/>
                        }
                    </div>
                    <div className='absolute w-full bottom-[5%]'>
                        <SearchPanelUpdated setRoutes={(routes: any) => {
                            for (const route of routes) {
                                console.log('route load')
                                loadRouters(route);
                            }
                            setRoutes(routes);
                        }} setPlaces={setPlaces} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default BlockSamaraScreen;