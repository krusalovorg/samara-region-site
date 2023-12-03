import React, { useEffect, useRef, useState } from 'react';
import GerbLogo from '../assets/gerb.png';
import Header from '../components/Header';
import ImageCard2 from '../assets/buti2.jpg';
import Category from '../components/Category';
import { getData, getPlaceById, Place } from '../utils/backend';
import { getImage } from '../utils/utils';
import { useParams } from 'react-router-dom';

function PlacePage() {
  const [place, setPlace] = useState<Place | null>(null);
  const { id } = useParams();

  async function loadPlaces() {
    const data = await getPlaceById(id || "1");

    if (data) {
      setPlace(data);
    }
  }

  useEffect(() => {
    loadPlaces();
  }, [])

  if (place == null) {
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
            backgroundImage: `url(${getImage(place?.images)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 26
          }}
        >
          <div className='px-[5%] py-[20px] h-full w-full flex z-[100] flex flex-col absolute'>
            <h2 className='text-white font-bold spacing-[0px] text-3xl mt-auto'>{place.name}</h2>
            <h3 className='text-white spacing-[0px] text-lg mt-1'>{place.card_description}</h3>
          </div>
        </div>
        <div className='mt-[30px] gap-x-[10px] flex flex-row'>
          <Category text={place.category} color={"bg-[#D2F881]"} />
        </div>
      </section>
      <section className='px-[5%]'>
        <div className='w-full bg-white rounded-[50px] h-screen mt-[30px] px-[20px] pt-[25px]'>
          <p className='text-xl'>
          {place.description}
          </p>
        </div>
      </section>
    </div>
  );
}

export default PlacePage;