import React, { useEffect, useRef, useState } from 'react';
import PlaceItem from './components/PlaceItem';
import SearchPanel from './components/SearchPanel';
import BlockSamara from './components/BlockSamara';
import Header from './components/Header';
//import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import ExcursionList from './components/ExcursionList';
import PlacesList from './components/PlacesList';

function App() {
  const [shipsData, setShipsData] = useState([
    { 'name': 'А. Матросов', 'alt_name': 'a_matrosov', 'id': 463, 'image': 'https://booking.infoflot.com/Uploads/8/0/7/807ad1ad7fb1c8612d5e23476822851adfeeadd6.jpg', 'rivers_assignment': ['77361'], 'region': ['669769'], 'provider_id': 192251 }
  ]);
  const [search, setSearch] = useState(0);

  const { YMaps, Map, Placemark } = require("@pbe/react-yandex-maps")

  const fetchData = async () => {
    try {
      const url = 'https://nikoturs.ru/cruises/getShipsJSONruen/';
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + url;

      const response = await fetch(proxyUrl);
      const data = await response.json();
      console.log('Полученные данные:', data);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className="w-screen min-h-screen bg-[#FFFAF1]">
      <Header />
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
          : <div className='h-[5em]'></div>
      }
      <BlockSamara />
      <PlacesList />
      <YMaps>
        <section className='w-full px-[5%] mb-[100px]'>
          <Map className='w-full h-1/2 mt-[100px]' defaultState={{ center: [53.195876, 50.100186], zoom: 9 }}>
            <Placemark defaultGeometry={[53.195876, 50.100186]} />
          </Map>
        </section>
      </YMaps>
      <ExcursionList />

      {/* <section className='h-screen' />
      <section className='h-screen' /> */}
    </div>
  );
}

export default App;
