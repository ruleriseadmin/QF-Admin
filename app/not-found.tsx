'use client'
import {useRouter} from 'next/navigation';
import Image from 'next/image';

const NotFoundPage = () => {
  const router = useRouter();
  return (
    <section className='bg-background min-h-screen my-10 font-roboto'>
      < main className="w-full h-full overflow-auto scrollbar-hide">
     
      <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 min-h-[624-px] w-full mx-auto mt-24 mb-36'>
        <div className='h-full w-full flex flex-col justify-center items-center md:ml-8 '>
          <p className='text-[48.1px] md:text-[40.1px] leading-[50px] font-semibold text-[#000000]'>Uh oh, Page not <br/>
          found.</p>
          <p className='text-[24px] md:text-[20px] text-[#282828] ml-4 mt-10 font-roboto font-normal tracking-wide'>We are sorry the page you <br/> requested for could not be found</p>
          <button
          className='bg-[#2632386E] mb-20 md:mb-0 lg:mb-0 tracking-wide font-normal text-[24.05px] text-[#ffff] w-[300.62px] h-[60.12px] rounded-[100.21px] mt-10 border border-solid  px-6 py-2'
          onClick={() => router.push('/')}
          >
           Return to Home page
          </button>

        </div>
        <div className=''>
          <Image
            className=''
            src='/images/404.png'
            alt='Not Found Page'
            width={504}
            height={463}
          />

        </div>

      </div>
     
      </main>
      
    </section>
  );
};
export default NotFoundPage;