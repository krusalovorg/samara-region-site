import React, { useEffect, useState } from 'react';
import CustomRangeInput from './components/CustomRangeInput';
import ImageCard1 from './assets/buti1.jpg';
import ImageCard2 from './assets/buti2.jpg';
import ImageCard3 from './assets/buti3.jpg';
import ImageCard4 from './assets/buti4.jpg';
import ImageCard5 from './assets/buti5.jpg';
import ImageCard6 from './assets/buti6.jpg';
import ImageCard7 from './assets/buti7.jpg';
import ImageCard8 from './assets/buti8.jpg';
import GerbLogo from './assets/gerb.png';
import PlaceItem from './components/PlaceItem';
import { Dropdown } from 'flowbite-react';

const userAgentHeader = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36' };

function App() {
  const [shipsData, setShipsData] = useState(null);
  const [timeToure, setTimeToure] = useState(6);
  const [searchCategory, setSearchCategory] = useState<string | null>(null);
  const [search, setSearch] = useState(0);

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

  function SearchE() {
    setSearch(1);
    setTimeout(() => {
      setSearch(2);
    }, 2000)
  }

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
      <div className='w-full px-[5%]'>
        <div className='bg-[#2C2C2C] px-[40px] py-[35px] rounded-3xl flex flex-row items-strech'>
          <CustomRangeInput label={"Продолжительность"} value={timeToure} setValue={setTimeToure} />
          {/* searchCategory == "Места" ? "Отдаленость" : "Продолжительность" */}
          <Dropdown style={{
            fontWeight: "medium",
            background: "#FEEFD7",
            padding: "0 27px",
            color: "black",
            borderRadius: "16px",
            marginLeft: 20,
            width: 160
          }}
            className='bg-[#D2F881] px-10 py-3 font-medium rounded-xl'
            label={searchCategory || "Категория"} dismissOnClick={true}>
            <Dropdown.Item onClick={() => setSearchCategory("Места")}>Места</Dropdown.Item>
            <Dropdown.Item onClick={() => setSearchCategory("Маршруты")}>Маршруты</Dropdown.Item>
          </Dropdown>
          <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium ml-[20px]' onClick={SearchE}>Поиск</button>

          <button className='bg-[#FEEFD7] px-10 py-5 rounded-2xl font-medium ml-auto'>Все маршруты</button>
        </div>
      </div>

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
      <section
        className='w-full min-h-screen bg-[#D2F881] rounded-[50px] py-[3%] px-[5%] flex flex-row'
      >
        <div className='w-1/2 h-full'>
          <h1 style={{
            color: "#2C2C2C",
            fontWeight: "bold",
            fontSize: 'calc(90px + 7 * ((100vw - 720px) / 1280))',
            width: "auto",
            letterSpacing: -4
          }}>
            Самарская Область
          </h1>
          <h2 style={{
            color: "#2C2C2C",
            fontWeight: "normal",
            fontSize: 'calc(30px + 7 * ((100vw - 720px) / 1280))',
            maxWidth: "75%"
          }}>
            текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст
          </h2>
        </div>
        <div className='w-1/2 grid grid-cols-2 gap-x-10 gap-y-10'>
          {[ImageCard1, ImageCard2, ImageCard3, ImageCard4, ImageCard5, ImageCard6,].map((image) => (
            <img
              className='w-auto rounded-3xl'
              src={image}
            />
          ))}
        </div>
      </section>
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
        <div className='w-full mt-[30px] gap-[30px] overflow-x-auto h-fit flex flex-row snap-x snap-mandatory'>
          <PlaceItem />
          <PlaceItem />
          <PlaceItem />
          <PlaceItem />
          <PlaceItem />
        </div>
      </section>
      <section className='h-screen'>
        {shipsData && (
          <pre>{JSON.stringify(shipsData, null, 2)}</pre>
        )}
      </section>
      {/* <section className='h-screen' />
      <section className='h-screen' /> */}
    </div>
  );
}

export default App;
