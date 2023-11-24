import React, { useEffect, useState } from 'react';
import GerbLogo from './assets/gerb.png';
import PlaceItem from './components/PlaceItem';
import SearchPanel from './components/SearchPanel';
import BlockSamara from './components/BlockSamara';
// import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

function App() {
  const [shipsData, setShipsData] = useState(null);
  const [search, setSearch] = useState(0);

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
      <BlockSamara/>
      <section className='px-[5%] mt-[30px]'>
        <h2 style={{
          color: "#2C2C2C",
          fontWeight: "bold",
          fontSize: 'calc(30px + 7 * ((100vw - 720px) / 1280))',
          width: "auto",
          letterSpacing: -2
        }}>
          Лучшее в окрестностях Самарской области
        </h2>
        <div className='w-full mt-[30px] gap-[30px] overflow-x-none h-fit flex flex-row snap-x snap-mandatory'>
          <PlaceItem />
          <PlaceItem />
          <PlaceItem />
          <PlaceItem />
          <PlaceItem />
        </div>
      </section>
      <section className='h-screen w-full px-[5%]'>
        <YMaps>
          <div>
            <Map defaultState={{ center: [55.75, 37.57], zoom: 9 }}>
              <Placemark defaultGeometry={[55.751574, 37.573856]} />
            </Map>
          </div>
        </YMaps>
      </section>
      {/* <section className='h-screen' />
      <section className='h-screen' /> */}
    </div>
  );
}

export default App;
