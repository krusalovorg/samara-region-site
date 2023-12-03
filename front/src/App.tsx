import React, { useEffect, useRef, useState } from 'react';
import PlaceItem from './components/PlaceItem';
import SearchPanel from './components/SearchPanel';
import BlockSamara from './components/BlockSamara';
import Header from './components/Header';
//import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import ExcursionList from './components/ExcursionList';
import PlacesList from './components/PlacesList';

function App() {
  const [shipsData, setShipsData] = useState([{}]);
  const [offset, setOffset] = useState(10);
  const [search, setSearch] = useState(0);

  const { YMaps, Map, Placemark } = require("@pbe/react-yandex-maps")

  // const fetchData = async () => {
  //   try {
  //     const url = 'https://nikoturs.ru/cruises/getShipsJSONruen/';
  //     const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + url;

  //     const response = await fetch(proxyUrl);
  //     const data = await response.json();
  //     console.log('Полученные данные:', data);
  //   } catch (error) {
  //     console.error('Ошибка при получении данных:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className="w-screen min-h-screen h-full bg-[#FFFAF1]">
      <Header />
      <SearchPanel setSearch={setSearch} />

      {search == 1 ? <div className='w-full px-[5%] flex justify-center items-center h-[20em]'>
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
        : search == 2 ?
          <>
            <div className='w-full px-[5%] overflow-x-auto h-fit grid grid-cols-3 gap-4 my-20'>
              {/* {
                shipsData.slice(0, offset).map((item) => (
                  <PlaceItem data={item} />
                ))
              } */}
            </div>
            <div className='w-full flex justify-center items-center px-[5%] mb-[20px]'>
            <button className='border border-[#595959] w-[200px] bg-[#FFFDFB] rounded-xl py-[10px]' onClick={()=>{setOffset(offset+10)}}>
              Раскрыть →
            </button>
            </div>
          </>
          : <div className='h-[5em]'></div>
      }
      <BlockSamara />
      <PlacesList />
      <YMaps>
        <section className='w-full min-h-[50vh] px-[5%]'>
          <Map className='w-full h-[50vh] my-[100px]' defaultState={{ center: [53.195876, 50.100186], zoom: 9 }}>
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
