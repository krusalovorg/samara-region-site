import React, { useEffect, useRef, useState } from 'react';
import GerbLogo from './assets/gerb.png';
import PlaceItem from './components/PlaceItem';
import SearchPanel from './components/SearchPanel';
import BlockSamara from './components/BlockSamara';
//import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

function App() {
  const [shipsData, setShipsData] = useState(null);
  const [search, setSearch] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { YMaps, Map, Placemark } = require("@pbe/react-yandex-maps")

  const fetchData = async () => {
    try {
      const headers = new Headers();

      const response = await fetch('https://nikoturs.ru/cruises/getShipsJSONruen/', {
        mode: 'no-cors',
        // headers: {
        //   "Content-Type": "application/json"
        // },
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': 'Authorization, Origin, X-Requested-With, Accept, X-PINGOTHER, Content-Type'
        },
      });
      console.log(response.text)

      const data = await response.json();
      setShipsData(data);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

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


  useEffect(() => {

    //fetchData();
  }, []);

  return (
    <div className="w-screen min-h-screen bg-[#FFFAF1]">
      <header className='w-full absolute top-0 left-0 py-[40px] flex flex-row justify-center items-center z-[1000] px-5'>
        <img className='absolute left-[5%]' width={64} height={64} src={GerbLogo} />
        <a className='text-black mx-5 font-[600] font-[Montserrat] cursor-pointer bg-[#D2F881] px-8 py-2 rounded-3xl'>
          Регион
        </a>
        <a className='text-black mx-5 px-8 py-2 font-[600] font-[Montserrat] cursor-pointer'>
          Маршруты
        </a>
        <a className='text-black mx-5 px-8 py-2 font-[600] font-[Montserrat] cursor-pointer'>
          Туры
        </a>
      </header>
      <div className='h-[120px]' />
      <SearchPanel setSearch={setSearch} />

      {search == 1 ? <div className='w-full px-[5%] flex justify-center items-center h-[20em]'>
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
        : search == 2 ?
          <div className='w-full px-[5%] overflow-x-auto h-fit grid grid-cols-3 gap-4 my-20'>
            <PlaceItem />
            <PlaceItem />
            <PlaceItem />
            <PlaceItem />
            <PlaceItem />
          </div>
          : <div className='h-[20em]'></div>
      }
      <BlockSamara />
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
      <YMaps>
        <section className='h-screen w-full px-[5%]'>
          <Map className='w-full h-1/2 mt-[100px]' defaultState={{ center: [53.195876, 50.100186], zoom: 9 }}>
            <Placemark defaultGeometry={[53.195876, 50.100186]} />
          </Map>
        </section>
      </YMaps>
      {/* <section className='h-screen' />
      <section className='h-screen' /> */}
    </div>
  );
}

export default App;
