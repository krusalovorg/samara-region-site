import React, { useEffect, useRef, useState } from 'react';
import GerbLogo from '../assets/gerb.png';
import Header from '../components/Header';
import ImageCard2 from '../assets/buti2.jpg';
import Category from '../components/Category';

function Place() {
  return (
    <div className="w-screen min-h-screen bg-[#FFFAF1]">
      <Header />
      <section className='px-[5%]'>
        <div
          className='w-full min-h-[400px] bg-shadow-g relative'
          style={{
            backgroundImage: `url(${ImageCard2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 26
          }}
        >
          <div className='px-[5%] py-[20px] h-full w-full flex z-[100] flex flex-col absolute'>
            <h2 className='text-white font-bold spacing-[0px] text-3xl mt-auto'>Замок "Гарибальди"</h2>
            <h3 className='text-white spacing-[0px] text-lg mt-1'>20км от Ягодного · Длительность 1 час</h3>
          </div>
        </div>
        <div className='mt-[30px] gap-x-[10px] flex flex-row'>
          <Category text='Достопримечательность' color={"bg-[#D2F881]"} />
          <Category text='Достопримечательность' color={"bg-[#D2F881]"} />
          <Category text='Достопримечательность' color={"bg-[#D2F881]"} />
          <Category text='Достопримечательность' color={"bg-[#D2F881]"} />
        </div>
      </section>
      <section className='px-[5%]'>
        <div className='w-full bg-white rounded-[50px] h-screen mt-[30px]'>

        </div>
      </section>
    </div>
  );
}

export default Place;
