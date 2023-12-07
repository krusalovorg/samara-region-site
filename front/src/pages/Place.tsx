import React, { useEffect, useRef, useState } from 'react';
import GerbLogo from '../assets/gerb.png';
import Header from '../components/Header';
import ImageCard2 from '../assets/buti2.jpg';
import Category from '../components/Category';
import { Category as CategoryType, getItemsById, getData, getItemById, Place, Route } from '../utils/backend';
import { declOfHours, getImage } from '../utils/utils';
import { useNavigate, useParams } from 'react-router-dom';
import PlaceItem from '../components/PlaceItem';
import { Placemark, YMaps, Map } from '@pbe/react-yandex-maps';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';

function PlacePage({ route }: { route?: boolean }) {
  const [data, setData] = useState<any>(null);
  const [points, setPoints] = useState<Place[]>([]);
  const map = useRef<any>(null);
  const [yamap, setYampas] = useState<YMapsApi | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();
  const [offset, setOffset] = useState(3);
  const navigate = useNavigate();

  async function loadPlaces() {
    try {
      const data: any = await getItemById(id || "1", route ? "routes" : 'places');
      console.log('set data', data, route ? "routes" : 'places')

      if (data) {
        if (data?.points) {
          // const result = await getItemsById(data?.points?.split(','), 'places');
          setPoints(data?.points);
        } else {
          const places_all = await getData("places") as Place[]
          console.log('places alll', places_all)
          setPoints(places_all);
        }
        console.log('set data', data)
        setData(data);
      }
    } catch (err) {
      navigate('/')
    }
  }

  useEffect(() => {
    loadPlaces();
    window.scrollTo(0, 0);
  }, [id])

  const addRoute = (ymaps: any) => {
    setYampas(ymaps)
    console.log("loaded ymaps", points)
    if (points) {
      console.log('points add obne time wisn now')
      if (data?.points) {
        setTimeout(() => loadRouters(data?.points, ymaps), 1200)
      }
    }
  };

  function loadRouters(points: any[], yamap?: YMapsApi) {
    if (yamap == null) return
    console.log("loadddsadedse")
    const extractedCoordinates: any[] = points.map((item) => item.coordinates);
    //console.log(extractedCoordinates)
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

    const res = map?.current.geoObjects?.add(multiRoute);
    console.log('trwsugoil', res)
    setLoaded(true)
  }

  // useEffect(() => {
  //   if (points.length > 0) {
  //     setTimeout(()=>loadRouters(), 200)
  //   }
  // }, [points])


  if (data == null) {
    return <div className='min-h-screen w-screen flex justify-center items-center'>
      <div className='w-full px-[5%] flex justify-center items-center h-[20em]'>
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  }

  return (
    <div className="w-screen min-h-screen bg-[#FFFAF1]">
      <Header />
      <section className='px-[5%]'>
        <div
          className='w-full min-h-[400px] bg-shadow-g relative'
          style={{
            backgroundImage: `url(${getImage(data?.images)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 26
          }}
        >
          <div className='px-[5%] py-[20px] h-full w-full flex z-[100] flex flex-col absolute'>
            <h2 className='text-white font-bold spacing-[0px] text-3xl mt-auto'>{data.name}</h2>
            <h3 className='text-white spacing-[0px] text-lg mt-1'>{data.card_description}</h3>
          </div>
        </div>
        <div className='mt-[30px] gap-x-[10px] flex flex-row'>
          {data?.category && data?.category?.map((item: any) => <Category text={item?.name} description={item?.description} color={"bg-[#D2F881]"} />)}
        </div>
      </section>
      <section className={'px-[5%] flex max-md:flex-col md:flex-row mt-[30px] items-stretch'}>
        <div className={`w-full md:w-[70%] bg-white rounded-[50px] h-auto px-[36px] py-[30px]`}>
          <p className='text-xl mb-[30px] leading-[150%]'>
            {data.description}
          </p>

          {data.time ? <h3 className='text-xl text-[#2C2C2C] mb-[15px] leading-[150%]'>Продолжительность: {data?.time} {declOfHours(data.time)}</h3> : <></>}
          {data.points ?

            <>
              <h3 className='text-xl text-[#2C2C2C] mb-[15px] leading-[150%]'>Точек: {data.points.length}</h3>
              <h3 className='text-xl text-[#2C2C2C] mb-[30px] leading-[150%]'>Города: {data.points.map((item: any) => item?.city).join(", ")}</h3>
            </>
            : <></>
          }

          <YMaps query={{ apikey: "dd278cf2-bbc1-4819-8232-fbba0d13289a" }}>
            <Map
              instanceRef={map}
              className='w-full h-[500px] rounded-lg'
              onLoad={addRoute}
              modules={["multiRouter.MultiRoute"]}
              defaultState={{ center: [53.2415041, 50.2212463], zoom: 7 }}
            >
              {data?.points ?
                points && points.length > 0 && points.map((point) => {
                  if (point.coordinates.split(",").length == 2) {
                    return <Placemark
                      options={{
                        iconColor: "red"
                      }}
                      defaultGeometry={point.coordinates.split(",")} />
                  }
                })
                :
                <Placemark
                  options={{
                    iconColor: "red"
                  }}
                  defaultGeometry={data?.coordinates.split(",")} />
              }
            </Map>
          </YMaps>

        </div>
        <div className='md:w-[30%] max-md:mt-[20px] md:ml-[20px] gap-[20px] flex flex-col'>
          <h1 className='text-2xl font-medium text-[#2C2C2C]'>{data?.points ? "Все точки маршрута" : "Другие места"}</h1>
          {points?.slice(0, offset).map((item: any) => {
            return <PlaceItem data={item} />
          })}
          {offset < points.length &&
            <button className='border border-[#595959] w-[200px] bg-[#FFFDFB] rounded-xl py-[10px] mx-auto' onClick={() => { setOffset(offset + 3) }}>
              Раскрыть →
            </button>
          }
        </div>
      </section>
    </div>
  );
}

export default PlacePage;