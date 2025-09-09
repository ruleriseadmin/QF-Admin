'use client';
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import { IoSearchSharp } from "react-icons/io5";
import Paginate from '../dashboard/Paginate';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import CreditFilter from './CreditFilter';
import { useRouter,useSearchParams,usePathname } from 'next/navigation';
import {FaTimes} from 'react-icons/fa';
import apiClient from '@/utils/apiClient';
import { LuRefreshCw } from "react-icons/lu";
import { formatDate,formatTime,saveToExcel,formatCurrency } from '@/utils/loan';
import Notification from '@/components/Notification';
import LoadingPage from '@/app/loading';



const CreditTable = () => {
  const [page, setPage] = useState(1);
  const pathName = usePathname()
  const itemsPerPage = 20; // Items per page
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedSort, setSelectedSort] = useState('new');
  const [searchWord, setSearchWord] = useState('');
  const [openSelection, setOpenSelection] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState('All');
  const [openFilter, setOpenFilter] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const searchParams = useSearchParams();
  const start = searchParams.get('start') || '';
  const end = searchParams.get('end') || '';
const reset = searchParams.get('reset') || '';
const deliquency = searchParams.get('deliquency') || '';
const expiry_start = searchParams.get('expiry_start') || '';
const expiry_end = searchParams.get('expiry_end') || '';
const [success, setSuccess] = useState('');
const creditType = searchParams.get('creditType') || '';
const creditStatus = searchParams.get('creditStatus') || '';
const router = useRouter();
const [credits, setCredits] = useState<any[]>([]);
const [error, setError] = useState('');
const [triggerSearch, setTriggerSearch] = useState(false);
const [totalPerPage, setTotalPerPage] = useState(0)
const [loading, setLoading] = useState(false);
const [downloadExcel, setDownloadExcel] = useState(false);
  const [searchDate, setSearchDate] = useState({
    startDate: '',
    endDate: ''
  })


  
  

  
    // Update search date
    useEffect(() => {
      if(start)
      setSearchDate((prev) => ({...prev, startDate: start}));
      if(end)
        setSearchDate((prev) => ({...prev, endDate: end}));
      if(creditType)
        setSelectedSelection(creditType);
      if(reset){
        setSearchDate({
          startDate: '',
          endDate: ''
        })
      }
      
    }, [start, end, reset, creditType]);
    
    //cleanup url
    useEffect(() => {
      if(start && end){
        router.replace(window.location.pathname)
      }
    },[start,end])
        
    
  
    const toggleFilter = () => setOpenFilter(!openFilter);
  
  
  
    const handleRowSelect = (row: any) => {
      setSelectedRows((prevSelected) =>
        prevSelected.some((selectedRow) => selectedRow.id === row.id)
          ? prevSelected.filter((selectedRow) => selectedRow.id !== row.id)
          : [...prevSelected, row]
      );
    };
    
   
    
    const handleSelectAll = () => {
      setSelectedRows(
        selectedRows.length === credits.length ? [] : credits
      );
    };
  


  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchCredit = async () => {
      try {
        setLoading(true);
        const queryObj: Record<string, string> = { 
          page: String(page), 
          per_page: String(itemsPerPage) 
        };
  
        if (triggerSearch && searchWord ) {
          queryObj.search = searchWord;
        }
  
        if (searchDate.startDate && searchDate.endDate) {
          queryObj.search_date_range = `${searchDate.startDate}${' - '}${searchDate.endDate}`;
        }
  
        if (selectedSelection && selectedSelection !== 'All' ) {
          selectedSelection === 'CRC' ? queryObj.source = 'crc' : selectedSelection === 'Credit Registry' ? queryObj.source = 'credit_registry' : queryObj.source = 'first_central';
        }
        if (deliquency) {
          queryObj.deliquency = deliquency;
        }
        if(creditStatus){
          queryObj.credit_status = creditStatus;
        }
        if(downloadExcel){
          queryObj.download_excel = 'true';
        }
        if(expiry_start && expiry_end){
          queryObj.expiry_date_range = `${expiry_start}${' - '}${expiry_end}`;
        }
  
        if (selectedSort === 'old') {
          queryObj.sort_direction = 'asc';
        }
        if (selectedSort === 'new') {
          queryObj.sort_direction = 'desc';
        }
        const queryString = new URLSearchParams(queryObj).toString();
        const url = pathName === '/history' ? 'cached_credit_reports' : 'credit_reports';
        const response = await apiClient.get(`/${url}?${queryString}`, {
          signal: controller.signal,
          responseType: 'json',
        });
      if(downloadExcel){
              setSuccess(response?.data?.message || 'Report is being processed and will be emailed to you shortly.');
              setNotificationOpen(true);
              setDownloadExcel(false);
              return;
              }
        
  
        setCredits(response?.data?.data?.reports || []);
        setTotalPerPage(response?.data?.data?.total_items || 0);
        setLastPage(response?.data?.data?.last_page || 0);
      } catch (error: any) {
        console.error(error);
        if (error.message !== 'canceled' || error.name !== 'CanceledError') {
         if (error?.status === 401) {
            setError('Unauthorized access. You do not have permission to view this resource.');
            setNotificationOpen(true);
          }else {
          setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
          setNotificationOpen(true);
          }
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchCredit();
  
    return () => controller.abort();
  }, [page, triggerSearch, searchDate.startDate,downloadExcel,  searchDate.endDate, selectedSelection, itemsPerPage, selectedSort, creditStatus, deliquency]);
  

  const resetQuery = () => {
    setSearchWord('');
    setSearchDate({ startDate: '', endDate: '' });
    setSelectedSelection('All');
    setDownloadExcel(false);
    setSelectedSort('new');
    setTriggerSearch(false);
    
    // Reset query parameters in the URL
    router.replace(window.location.pathname);
    
    // Trigger re-fetch of data
    setPage(1);
  };

    
  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={selectedRows.length === credits.length}
          onChange={handleSelectAll}
          className="hover:cursor-pointer accent-[#F6011BCC]"
        />
      ),
      cell: (row: typeof credits[number]) => (
        <input
          type="checkbox"
          checked={selectedRows.some((selectedRow) => selectedRow.id === row.id)}
          onChange={() => handleRowSelect(row)}
          className="hover:cursor-pointer accent-[#F6011BCC]"
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '50px',
    },
  { name: 'ID', selector: 'id' },
  { name: 'FULL NAME', selector: 'name' },
  { name: 'PHONE NO', selector: 'phone_number' },
  { name: 'CREDIT STATUS', selector: 'credit_status' },
  { name: 'DELINQUENCY', cell:(row:any) => row.delinquencies ? row.delinquencies : 0 },
  { name: 'DATE CREATED', cell: (row: any) => `${formatDate(row.created_at.split(' ')[0])} ${formatTime(row.created_at.split(' ')[1])}` },
  { name: 'STATUS', selector: 'type'  },
  { name: 'EXPIRY DATE', cell: (row: any) => `${formatDate(row.expiry_date.split(' ')[0])} ${formatTime(row.expiry_date.split(' ')[1])}` },
];
  
  const toggleSelection = () => {
    setOpenSelection(!openSelection);
  };


  const selection = [
    { name: 'All' },
    { name: 'CRC' },
    { name: 'First Central' },
    { name: 'Credit Registry' },
  ];

  
  

  return (
    <div className="w-full mt-28 mb-10 md:ml-8  h-auto font-montserrat ">
      <div className="flex md:overflow-x-auto justify-between lg:overflow-hidden overflow-x-auto items-center gap-8 w-full h-auto mb-10  text-[#5A5A5A] text-[16px] ">
        <div className="flex items-center justify-between gap-6 md:gap-6 lg:gap-0 w-full md:mr-10 " >
          {/* Dropdown Section */}
  <div className=" ">
  {/* Dropdown Toggle Button */}
  <div
    onClick={toggleSelection}
    className="flex items-center hover:cursor-pointer bg-[#E1E3E4] rounded-full min-w-[229px]  w-auto h-[48px]  md:ml-2 ml-4 lg:ml-0 md:px-2 z-50" // Ensure z-index here
  >
    {/* Left Section */}
    <div className="flex items-center flex-grow ml-3 font-euclid">
      <Image
        src="/images/calendar-2.png"
        alt="Logo"
        width={18}
        height={18}
      />
      <p className="text-[15px] text-[#282828] font-medium ml-1 font-euclid">
        Sortby : {selectedSelection || 'All'}
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
        className="fixed inset-0 bg-black bg-opacity-50 z-30" // Ensure overlay is behind the dropdown toggle
        onClick={() => {
          toggleSelection();
          setOpenSelection(false);
        }}
      ></div>

      {/* Dropdown Content */}
      <div
        className="absolute lg:top-[457px] lg:left-[258px] md:top-[592px] md:left-[232px] left-[51px] w-[229px] min-h-[138px] h-auto bg-white rounded-xl shadow-lg font-montserrat font-medium z-50" // Ensure dropdown appears above the overlay
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
              <p>{select.name} credits</p>
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

 <div className="relative">
            <div
              onClick={toggleFilter}
              className="flex items-center hover:cursor-pointer  bg-[#E1E3E4] rounded-full w-[130px]  h-[48px] md:ml-2 md:px-2"
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
          <div className="relative font-euclid">
          <input
            type="text"
            placeholder="Search ID"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="w-[306px] placeholder:text-[#5A5A5A] placeholder:text-[15px] h-[48px] bg-[#FFFFFF] pl-6 pr-6 border border-solid border-[#E6E6E6] rounded-[32px] focus:outline-none shadow-customshadow5"
          />
         <FaTimes 
            onClick={() => {
            setSearchWord('')
            setTriggerSearch(false)
                                       
              }}
          className={`${searchWord === '' ? 'hidden' : 'absolute'}  inset-y-4 hover:cursor-pointer right-14 text-[16px] font-thin`} />
                                     
          <button
            onClick={() =>
              {
                if(triggerSearch) setSearchWord('')
                setTriggerSearch(!triggerSearch)
             }}>
                                                   
            <IoSearchSharp className="absolute inset-y-4 right-6 text-[20px] font-bold" />
                                                  
                                                    
          </button>
        </div>
         <button
          onClick={() => setDownloadExcel(true)}
            className='block min-w-[40px] flex-shrink-0 z-30'
          >
                  <Image src="/images/download.png" alt="download" width={40} height={40} className='block'/>
                </button>
        <div className="flex md:min-w-[200px]  md:max-w-full   min-w-[200px] items-center justify-start gap-1 font-euclid">
          <p className="font-medium text-[15px] text-[#5A5A5A]">
            {selectedSort === 'new' ? 'Newest to Oldest' : 'Oldest to Newest'}
          </p>
          <div className="flex flex-col items-center leading-none">
            <button className="h-3" onClick={() => setSelectedSort('new')}>
              <TiArrowSortedUp className="text-[20px] text-[#5A5A5A]" />
            </button>
            <button onClick={() => setSelectedSort('old')}>
              <TiArrowSortedDown className="text-[20px] text-[#5A5A5A]" />
            </button>
          
          </div>
          <button
        onClick={resetQuery
        }
        >
        <LuRefreshCw className="text-[#282828] text-[16px] lg:ml-6 md:ml-1 ml-6" />
        </button>
          
        </div>
       
        </div>
        
       
      </div>
     
     
      <div className="flex items-center justify-between md:pl-6 pl-4  lg:pl-0 mb-10">
        <div className="flex items-center">
          <Image src="/images/loanuser.png" alt="Loan" width={24} height={24} />
          <h1 className="text-[#282828] text-[18px] font-bold">{selectedSelection} Checks</h1>
        </div>
        <div className='flex items-center justify-center md:mr-4'>
        <Image src="/images/blacksms.png" alt="Filter" width={24} height={24} className={`mr-4 ${selectedRows.length === credits.length ? '' : 'opacity-50'}`} />
        <Image src="/images/newmsg.png" alt="Filter" width={24} height={24} className={`mr-4 ${selectedRows.length === credits.length ? '' : 'opacity-50'}`} />
        <Image src="/images/redflag.png" alt="Filter" width={24} height={24} className={`mr-4 ${selectedRows.length === credits.length ? '' : 'opacity-50'}`} />
        </div>
        
      </div>
      <div className=" md:ml-4 lg:min-w-[1088px]  md:mr-10 lg:w-auto   lg:ml-0 ml-4  mr-2  font-montserrat lg:mr-8  h-auto rounded-[12px] lg:overflow-hidden bg-[#FFFFFF] shadow-customshadow4 border border-solid border-[#DCDCDC]">
      <div className="lg:overflow-x-hidden md:overflow-x-auto  overflow-x-auto mb-12 ">
  <table className="w-full   mt-2 ml-1">
    <thead className="bg-[#282828] w-full text-[#FFFFFF] h-[46px] font-bold text-[12px] text-left">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                   
                    className={`px-3 py-2 ${
                      index === 0 ? 'rounded-tl-[18px] rounded-bl-[18px]' : ''
                    } ${index === columns.length - 1 ? 'rounded-tr-[18px] rounded-br-[18px]' : ''}`}
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {credits.map((row:any) => (
                <tr key={row.id} className="text-[15px] font-medium text-left">
                  {columns.map((col, index) => (
                    <td key={index} className="px-3 pt-7  pb-4 border-b font-montserrat border-[#E6E6E6]">
                      {col.name === 'CREDIT STATUS' && row.credit_status === 'YES' ? (
                        <span className="bg-[#5E8D35] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                          {row.credit_status}
                        </span>
                      ): col.name === 'CREDIT STATUS' && row.credit_status === 'NO' ? (
                        <span className="bg-[#DA3737] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                          {row.credit_status}
                        </span>
                      ) : col.name === 'CREDIT STATUS' && row.credit_status === 'NO_DATA' ? (
                        <span className="bg-[#155661] rounded-full text-[#FFFFFF] px-2 text-[14px] w-auto py-1 inline-block">
                          NO DATA
                        </span>
                      ): col.name === 'STATUS' && row.type === 'cached' ? (
                        <span className="border-[#827F1A] border rounded-full text-[#827F1A] px-2 text-[14px] w-auto py-1 inline-block">
                          Cache
                        </span>
                      ): col.name === 'STATUS' ? (
                        <span className="border-[#3B66E8] border rounded-full text-[#3B66E8] px-2 text-[14px] w-auto py-1 inline-block">
                          New
                        </span>
                      ):  col.cell ? (
                        col.cell(row)
                      ) : (
                        row[col.selector as keyof typeof row]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
         {loading && <LoadingPage />}
        {lastPage > 1  && (
    <div className="lg:pl-14 md:pl-2 pl-4 pt-6 mb-8">
      <Paginate
        lastPage={lastPage}
        currentPage={page}
        onPageChange={handlePageChange}
        
        itemsPerPage={itemsPerPage}
        totalItems={totalPerPage}
            />
          </div>
        )}
      </div>
      {openFilter && (
        <CreditFilter isOpen={openFilter} toggleCreditFilter={toggleFilter} />
      )}

      {success &&
              <Notification
                message={success}
                toggleNotification={toggleNotification}
                isOpen={notificationOpen}
                status='success'
    />}
 {error && 
            <Notification 
            message={error} 
            toggleNotification={toggleNotification} 
            isOpen={notificationOpen}
            status='error'
     
            />}
       
    </div>
  );
};

export default CreditTable;
