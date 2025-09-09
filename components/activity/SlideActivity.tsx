'use client';
import React, { useState,useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';
import apiClient from '@/utils/apiClient';
import Notification from '../Notification';
import LoadingPage from '@/app/loading';
import {formatDate,formatTime} from '@/utils/loan';

type SideModalProps = {
  isOpen: boolean;
  toggleActivity: () => void;
  isExiting: boolean;
};

const SlideActivity: React.FC<SideModalProps> = ({
  isOpen,
  toggleActivity,
  isExiting,
}) => {
  const [openSelection, setOpenSelection] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [fetchedActivity, setFetchedActivity] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [openFilter, setOpenFilter] = useState(false);
  const toggleFilter = () => setOpenFilter(!openFilter);
  const toggleSelection = () => setOpenSelection(!openSelection);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);



  //toggle notification
  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  }

  const selection = [
    { name: 'Overall',value:'' },
    { name: 'Last 7 days',value:'last_7_days' },
    {  name: 'Last 30 days',value:'last_30_days' },
    {  name: 'This quarter',value:'this_quarter' },
    {  name: 'Last quarter',value:'last_quarter'},
    {  name: 'This year',value:'this_year' },
  ]

   //get activities
   useEffect(() => {
    const fetchActivity = async () => {
      const controller = new AbortController();
        const queryObj: Record<string, string> = { 
          page: String(page), 
          per_page: String(itemsPerPage),
          filter: selectedFilter,
        };
        const queryString = new URLSearchParams(queryObj).toString();
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/activity_logs?${queryString}`, { signal: controller.signal });
          setTotalItems(response?.data?.data?.total_items);
        setFetchedActivity(response?.data?.data?.logs || []);
      } catch (error: any) {
        if (error.message !== 'canceled' || error.name !== 'CanceledError') {
          setError(error?.response?.data?.message  || error?.message || 'An error occurred, please try again');
          setNotificationOpen(true);
        }
      }finally{
        setLoading(false);
      }
    };

    fetchActivity();
  }, [page,itemsPerPage,selectedFilter]);


  // Handle page change
  const handleLoadMore = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage + 15);
  };

  //handle load less
  const handleLoadLess = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
  };


  const modalContent = (
    <div
      onClick={toggleActivity}
      className={`overlay fixed font-montserrat inset-0 z-50 ${
        isOpen ? 'opacity-100 bg-black' : 'opacity-0 pointer-events-none bg-transparent'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`sidebar-content fixed right-0 lg:ml-[233px] md:ml-[190px] lg:w-11/12 md:w-11/12 w-full overflow-y-auto ${
          isExiting ? 'sidebar-exit' : 'sidebar-enter'
        }`}
      >
        {/* Modal Content */}
        <div className="ml-6">
          <div className="flex justify-end items-center mt-2 mr-2">
            <button onClick={toggleActivity} className="">
              <IoClose className="text-navfont rounded-full bg-[#ECECEC] text-3xl mt-2 mr-2 p-1 font-bold" />
            </button>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <Image
              src="/images/element-4.png"
              alt="Activity"
              width={24}
              height={24}
              className="rounded-full"
            />
            <p className="font-bold text-[18px] text-[#323232]">
              Activity log <span className="font-medium text-[16px]">({fetchedActivity?.length})</span>
            </p>
          </div>
<div className='flex items-center gap-3'>
          {/* Dropdown Section */}
          <div className="relative">
            <div
              onClick={toggleSelection}
              className="flex items-center hover:cursor-pointer bg-[#E1E3E4] rounded-full lg:w-[269px] md:w-[221px] h-[48px] mt-6 md:ml-2 md:px-2"
            >
              {/* Left Section */}
              <div className="flex items-center flex-grow ml-3">
                <Image
                  src="/images/calendar-2.png"
                  alt="Logo"
                  width={18}
                  height={18}
                />
                <p className="ml-2 lg:text-[16px] md:text-[12px] text-[#282828] font-medium">
                {(selection.find((select) => select.value === selectedFilter)?.name) || 'Overall'}

                </p>
              </div>
              {/* Right Section */}
              <button>
                <TiArrowSortedDown className="text-[#828282] text-[18px] mr-3" />
              </button>
            </div>
            

            {openSelection && (
              <>
                <div
                  className="fixed inset-0 bg-black opacity-20 z-40"
                  onClick={() => setOpenSelection(false)}
                ></div>

                {/* Dropdown Content */}
                <div className="absolute top-full mt-2 left-3 w-[253px] h-[205px]  bg-[#FFFFFF] rounded-xl shadow-lg   font-montserrat font-medium  z-50">
                {selection?.map((select: any, index: number) => (
                    <button
                    key={index}
                    onClick={() => {
                      setSelectedFilter(select.value)
                      toggleSelection();
                    }}
                    className={`w-full text-start ml-4  text-[14px] text-[#464646] ${index === 0 ? 'mt-4' : 'mt-2'}`}
                    >
                        <div className='flex justify-start items-center gap-6'>
                            <p>{select.name}</p>
                            {select.value === selectedSelection ? <Image src='/images/good.png' alt='good' height={17} width={17}  /> : ''}

                        </div>
                    
                    </button>
                ))}
                </div>

              </>
            )}
          </div>
          <div className="relative">
            <div
              onClick={toggleFilter}
              className="flex items-center hover:cursor-pointer bg-[#E1E3E4] rounded-full lg:w-[168px] md:w-[241px] h-[48px] mt-6 md:ml-2 md:px-2"
            >
              {/* Left Section */}
              <div className="flex items-center flex-grow ml-3">
                <Image
                  src="/images/filter.png"
                  alt="Logo"
                  width={18}
                  height={18}
                />
                <p className="ml-2 lg:text-[16px] md:text-[12px] text-[#282828] font-medium font-euclid">
                 filter
                </p>
              </div>
              {/* Right Section */}
              <button>
                <TiArrowSortedDown className="text-[#828282] text-[18px] mr-3" />
              </button>
            </div>
           
            

          </div>
        </div>
        <div className='flex flex-col mt-8 font-montserrat'>
  {fetchedActivity?.map((activity:any) => (
    <div key={activity.id} className='flex justify-start items-center gap-3 mb-8'>
     
      <p className='text-[#282828] text-[15px] font-medium'>
        <span className='font-bold'>{activity.name}</span> {activity.log_description} <br />
        <span className='text-[12px] font-semibold text-[#5A5A5A]'>{formatDate(activity?.created_at?.split(' ')[0])} at {formatTime(activity?.created_at?.split(' ')[1]?.slice(0,5))}</span>
      </p>
    </div>
  ))}
</div>
{loading && <LoadingPage />}
{fetchedActivity.length !== totalItems && (
  
  <button 
  onClick={() => handleLoadMore(itemsPerPage)}
  className='w-[263px] h-[32px] bg-[#111111] text-[#FFFFFF] text-center mb-6 rounded-[22px] '>
    <p className='text-[13px]'>Load more</p>
  </button>

)}
{fetchedActivity.length > 15 && (
  <button 
  onClick={() => handleLoadLess(15)}
  className='w-[263px] h-[32px] bg-[#111111] text-[#FFFFFF] text-center mb-6 lg:ml-4 md:ml-4 rounded-[22px] '>
    <p className='text-[13px]'>Load less</p>
  </button>

) }


        </div>
        
      </div>
      
      {/* Notification */}
      {error && 
            <Notification 
            message={error} 
            toggleNotification={toggleNotification} 
            isOpen={notificationOpen}
            status='error'
     
            />}
    </div>
  );

  // Render modal content into the root of the document
  return ReactDOM.createPortal(modalContent, document.body);
};

export default SlideActivity;
