'use client';
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import { IoSearchSharp } from "react-icons/io5";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { BsThreeDots } from 'react-icons/bs';
import MessageCard from './MessageCard';
import apiClient from '@/utils/apiClient';
import Notification from '../Notification';
import { useSearchParams,useRouter } from 'next/navigation';
import LoadingPage from '@/app/loading';
import { FaTimes } from 'react-icons/fa';





const DisputeTable = () => {
  const [searchWord, setSearchWord] = useState('');
  const [openSelection, setOpenSelection] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState('All');
  const [openFilter, setOpenFilter] = useState(false);
  const toggleFilter = () => setOpenFilter(!openFilter);
  const [messagesData, setMessagesData] = useState([]);
   const [page, setPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(1);
   const [triggerSearch, setTriggerSearch] = useState(false);
    const [error, setError] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastPageNew, setLastPageNew] = useState(0);
    const [lastPagePending, setLastPagePending] = useState(0);
    const [lastPageCompleted, setLastPageCompleted] = useState(0);
const [fetchNewData, setFetchNewData] = useState(false);
const[fetchPendingData, setFetchPendingData] = useState(false);
const [fetchCompletedData, setFetchCompletedData] = useState(false);
const [newMessages, setNewMessages] = useState([]);
const [pendingMessages, setPendingMessages] = useState([]);
const [completedMessages, setCompletedMessages] = useState([]);
const [status, setStatus] = useState('');
    
// Fetch All Disputes on Page Load
    useEffect(() => {
      const fetchAllDisputes = async () => {
        try {
          setLoading(true);
          const queryObj: Record<string, string> = { 
            page: String(page), 
            per_page: String(itemsPerPage) 
          };
          if (triggerSearch && searchWord ) {
            queryObj.search = searchWord;
          }
          const queryString = new URLSearchParams(queryObj).toString();
          const [newRes, pendingRes, completedRes] = await Promise.all([
            apiClient.get(`/messages?${queryString}&new=true`),
            apiClient.get(`/messages?${queryString}&status=pending`),
            apiClient.get(`/messages?${queryString}&status=completed`),
          ]);
          
  
          setNewMessages(newRes.data?.data?.messages );
          setPendingMessages(pendingRes.data?.data?.messages );
          setCompletedMessages(completedRes.data?.data?.messages);
  
          setLastPageNew(newRes?.data?.data?.last_page || 0);
          setLastPagePending(pendingRes?.data?.data?.last_page || 0);
          setLastPageCompleted(completedRes?.data?.data?.last_page || 0);
        } catch (error: any) {
          console.error(error);
          setError(error?.response?.data?.message || 'An error occurred, please try again');
          setShowNotification(true);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAllDisputes();
    }, [triggerSearch]);

  


    //update status
    useEffect(() => {
      if (fetchNewData) setStatus('new');
      if (fetchPendingData) setStatus('pending');
      if (fetchCompletedData) setStatus('completed');
    }, [fetchNewData, fetchPendingData, fetchCompletedData]);

    
  
    // Fetch Disputes by Specific Status
    useEffect(() => {
      const fetchDisputesByStatus = async () => {
       if(!status) return;      
        setLoading(true);
  
        try {
          setLoading(true);
          const response = await apiClient.get(`/messages?page=1&per_page=${itemsPerPage}&status=${status === 'new' ? '' : status}&new=${status === 'new'}`);
          console.log(response.data)
          setMessagesData(response.data?.data?.messages || []);
          status === 'new' && (
            setNewMessages(response?.data?.data?.messages || []),
            setLastPageNew(response?.data?.data?.last_page || 0))
          
          status === 'pending' && (
            setPendingMessages(response?.data?.data?.messages || []),
            setLastPagePending(response?.data?.data?.last_page || 0));
          status === 'completed' && (
            setCompletedMessages(response?.data?.data?.messages || []),
            setLastPageCompleted(response?.data?.data?.last_page || 0));
        } catch (error: any) {
          console.error(error);
          setError(error?.response?.data?.message || 'An error occurred, please try again');
          setShowNotification(true);
        } finally {
          setLoading(false);
        }
      };
  
        fetchDisputesByStatus();
      
    }, [status, fetchNewData, fetchPendingData, fetchCompletedData]);

 

  const isToday = (dateString: string) => {
    const inputDate = new Date(dateString);
    const today = new Date();
  
    return (
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getDate() === today.getDate()
    );
  };

 
  
// Handle page change
const handlePageChange = (itemsPerPage: number) => {
  setItemsPerPage(itemsPerPage + 1);
};


  // Selection Data
  const selection = [
    { name: 'All' },
    { name: 'New' },
    { name: 'In Progress' },
    { name: 'Resolved' },
  ];

  //toggle selection
  const toggleSelection = () => setOpenSelection(!openSelection);

  //toggle notification
  const toggleNotification = () => setShowNotification(!showNotification);


  return (
    <div className="w-full mt-10 mb-10 md:ml-8  h-auto font-montserrat ">
         <p className="font-bold text-[24px]  text-[#282828] tracking-wide ">Dispute Resolution</p>
      <div className="flex md:overflow-x-auto lg:overflow-hidden overflow-x-auto items-center gap-8 w-full h-auto mb-10  text-[#5A5A5A] text-[16px] mt-10">
        <div className="flex items-center gap-3">
          {/* Dropdown Section */}
  <div className=" ">
  {/* Dropdown Toggle Button */}
  <div
   onClick={toggleSelection}
    className="flex items-center hover:cursor-pointer  bg-[#E1E3E4] rounded-full lg:w-[229px] md:w-[221px] w-[229px] h-[48px]  md:ml-2 ml-4 lg:ml-0 md:px-2 z-50" // Ensure z-index here
  >
    {/* Left Section */}
    <div className="flex items-center flex-grow ml-3">
      <Image
        src="/images/calendar-2.png"
        alt="Logo"
        width={18}
        height={18}
      />
      <p className="text-[15px] text-[#282828] font-euclid font-medium ml-1">
      Sortby: {selectedSelection || 'All'}
      </p>
    </div>
    {/* Right Section */}
    <button>
      <TiArrowSortedDown className="text-[#828282] text-[18px] mr-3" />
    </button>
  </div>

  {/* Dropdown and Overlay */}
  {openSelection && (
    <>
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={() => {
          
          setOpenSelection(false);
        }}
      ></div>

      {/* Dropdown Content */}
      <div
       className="absolute font-euclid lg:top-[231px] lg:left-[276px] md:top-[232px] md:left-[240px] left-[60px] w-[229px] h-[160px] bg-white rounded-xl shadow-lg  font-medium z-50"
      >
        {selection.map((select: any, index: number) => (
          <button
            key={index}
            onClick={() => {
              setSelectedSelection(select.name);
              setOpenSelection(false); // Close dropdown after selection
            }}
            className={`w-full text-start ml-4 text-[14px] text-[#282828] ${index === 0 ? 'mt-4' : 'mt-2'}`}
          >
            <div className="flex justify-start text-[#282828] items-center font-medium gap-6">
              <p>{select.name} </p>
              {select.name === selectedSelection && (
                <Image
                  src="/images/good.png"
                  alt="good"
                  height={17}
                  width={17}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </>
  )}
</div>

          <div className="relative font-euclid">
            <div
              onClick={toggleFilter}
              className="flex items-center hover:cursor-pointer bg-[#E1E3E4] rounded-full lg:w-[110px] md:w-[241px] h-[48px] md:ml-2 md:px-2"
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
                  Filter
                </p>
              </div>
              {/* Right Section */}
              <button>
                <TiArrowSortedDown className="text-[#828282] text-[18px] mr-3" />
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search ID"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="w-[306px] h-[48px] bg-[#FFFFFF] pl-6 pr-6 border border-solid border-[#E6E6E6] rounded-[32px] focus:outline-none shadow-customshadow5"
          />
          <button
          onClick={() =>
          {
            if(triggerSearch) setSearchWord('')
              setTriggerSearch(!triggerSearch)
            }}>
                {triggerSearch ? 
              <FaTimes className="absolute inset-y-4 right-6 text-[20px] font-bold" />
              :
              <IoSearchSharp className="absolute inset-y-4 right-6 text-[20px] font-bold" />
            }
          </button>
        </div>
        
       
      </div>
      {loading && <LoadingPage />}
      <div className='bg-[#EBEBEB] md:ml-4 lg:ml-0 ml-4 w-[1000px] min-h-[569px]   lg:mr-8 md:mr-10 h-auto rounded-[12px] overflow-hidden '>
        <div className='grid grid-cols-3 w-full  my-6 mx-2'>
          {(selectedSelection === 'All' || selectedSelection === 'New')&& (
             <div className='flex justify-between items-center w-11/12 h-[52px] bg-[#FFFFFF] border border-solid border-[#2D51D0] rounded-[12px]'>
             <div className='flex justify-start items-center mx-3 gap-2'>
                 <Image src='/images/menu.png' width={11} height={18} alt='credit' />
                 <p className='text-[#2D51D0] font-semibold '>New({newMessages?.length})</p>

             </div>
             <div className='flex justify-start items-center mx-3 gap-2'>
                 <Image src='/images/thumbtack.png' width={15} height={15} alt='credit' />
                  <BsThreeDots className={`text-[#5A5A5A] text-[24px]  `} />

             </div>

         </div>

          )}
            {(selectedSelection === 'All' || selectedSelection === 'In Progress' )&& (
            <div className='flex justify-between items-center w-11/12  h-[52px] bg-[#FFFFFF] border border-solid border-[#9E34A0] rounded-[12px]'>
                <div className='flex justify-start items-center mx-3 gap-2'>
                    <Image src='/images/menu.png' width={11} height={18} alt='credit' />
                    <p className='text-[#9E34A0] font-semibold '>In progress({pendingMessages?.length})</p>

                </div>
                <div className='flex justify-start items-center mx-3 gap-2'>
                    
                     <BsThreeDots className={`text-[#5A5A5A] text-[24px]  `} />

                </div>

            </div>
            )}
           {(selectedSelection === 'All' || selectedSelection === 'Resolved') && (
            <div className='flex justify-between items-center w-11/12  h-[52px] bg-[#FFFFFF] border border-solid border-[#2F7A23] rounded-[12px]'>
                <div className='flex justify-start items-center mx-3 gap-2'>
                    <Image src='/images/menu.png' width={11} height={18} alt='credit' />
                    <p className='text-[#2F7A23] font-semibold '>Resolved({completedMessages?.length})</p>

                </div>
                <div className='flex justify-start items-center mx-3 gap-2'>
                    
                     <BsThreeDots className={`text-[#5A5A5A] text-[24px]  `} />

                </div>

            </div>
            )}

        </div>
        <div className='grid grid-cols-3 w-full  my-6 mx-2 h-auto '>
        {(selectedSelection === 'All' || selectedSelection === 'New')&& (
        <div className='flex flex-col w-11/12 min-h-[472px] h-auto bg-[#FFFFFF] border border-solid border-[#2D51D0] rounded-[12px]'>
        {newMessages?.map((msg, index) => (
          <MessageCard key={index} data={msg} />

        ))}
        {lastPageNew > 1 && (
          <>
          <button className='w-[263px] h-[32px] bg-[#111111] block mx-auto text-[#FFFFFF] text-center my-3 rounded-[22px] '>
          <p 
          onClick={() => {
            setFetchNewData(true)
            handlePageChange(itemsPerPage);
            setTimeout(() => {
              setFetchNewData(false);
            }, 500)
            
          }}
          className='text-[13px] hover:cursor-pointer'>see more</p>
          </button>
         
           </>
        )}
        {status === 'new' && !loading && (
              <button className='w-[263px] h-[32px] bg-[#111111] block mx-auto text-[#FFFFFF] text-center my-3 rounded-[22px] '>
              <p 
              className='text-[13px] hover:cursor-pointer'
              onClick={() => {
                setFetchNewData(true);
                setItemsPerPage(1);
                setTimeout(() => {
                  setFetchNewData(false);
                  setStatus('');
                }, 500)
              }}>
                see less</p>
            </button>
        )}
        </div>
        )}
        {(selectedSelection === 'All' || selectedSelection === 'In Progress')&& (
        <div className='flex flex-col w-11/12 min-h-[472px] h-auto bg-[#FFFFFF] border border-solid border-[#9E34A0] rounded-[12px]'>
        {pendingMessages?.map((msg, index) => (
          <MessageCard key={index} data={msg} />

        ))}
        {lastPagePending > 1 && (
          <>
          <button className='w-[263px] h-[32px] bg-[#111111] block mx-auto text-[#FFFFFF] text-center my-3 rounded-[22px] '>
          <p 
          className='text-[13px] hover:cursor-pointer'
          onClick={() => {
            setFetchPendingData(true);
            handlePageChange(itemsPerPage);
            setTimeout(() => {
              setFetchPendingData(false);
            }, 500)
          }}>
            see more</p>
        </button>
          
        </>
       
       
        )}
        {!loading && status === 'pending'  && (
          <button className='w-[263px] h-[32px] bg-[#111111] block mx-auto text-[#FFFFFF] text-center my-3 rounded-[22px] '>
          <p 
          className='text-[13px] hover:cursor-pointer'
          onClick={() => {
            setFetchPendingData(true);
           setItemsPerPage(1);
            setTimeout(() => {
              setFetchPendingData(false);
              setStatus('');
            }, 500)
           
           
          }}>
            see less</p>
        </button>
        )}
        
        </div>
        )}
        {(selectedSelection === 'All' || selectedSelection === 'Resolved')&& (
        <div className='flex flex-col w-11/12  min-h-[472px] h-auto bg-[#FFFFFF] border border-solid border-[#2F7A23] rounded-[12px]'>
        {completedMessages?.map((msg, index) => (
          <MessageCard key={index} data={msg} />

        ))}
        {lastPageCompleted > 1 && (
          <>
          <button className='w-[263px] h-[32px] bg-[#111111] block mx-auto text-[#FFFFFF] text-center my-3 rounded-[22px] '>
          <p 
          onClick={() => {
            setFetchCompletedData(true)
            handlePageChange(itemsPerPage);
             setTimeout(() => {
              setFetchCompletedData(false);
             }, 500)
          }}
          className='text-[13px] hover:cursor-pointer'>see more</p>
        </button>
        
       
          
         </>
        )}
         {!loading && status === 'completed' && (
           <button className='w-[263px] h-[32px] bg-[#111111] block mx-auto text-[#FFFFFF] text-center my-3 rounded-[22px] '>
           <p 
           className='text-[13px] hover:cursor-pointer'
           onClick={() => {
             setFetchCompletedData(true);
             setItemsPerPage(1);
             setTimeout(() => {
               setFetchCompletedData(false);
               setStatus('');
             }, 500)
           }}>
             see less</p>
         </button>

        )}
        </div>
        )}

        </div>
        
      </div>
     
      {showNotification && (
        <Notification
          message={error}
          isOpen={showNotification}
          status='error'
          toggleNotification={toggleNotification}
        />
      )}

       
    </div>
  );
};

export default DisputeTable;
