import React from 'react'
import Image from 'next/image'

const AnalyticHero = () => {
   return (
      <div className=" lg:ml-8 ml-4 mr-2 md:ml-11 mt-12 h-auto w-11/12 font-montserrat flex justify-between items-center">
        <p className="font-bold text-[24px]  text-[#282828] tracking-wide leading-8  ">
            <span>Analytics</span> <br/>
            <span className='font-normal text-[#5A5A5A] text-[15px] '>Report and metrics of loan activities, payments and customer management.</span>
        </p>
      
        <button>
        <Image src="/images/download.png" alt="download" width={40} height={40} />
        </button>
      </div>
    );
}

export default AnalyticHero