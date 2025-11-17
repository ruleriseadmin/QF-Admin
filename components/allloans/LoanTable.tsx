'use client';
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import { IoSearchSharp } from "react-icons/io5";
import apiClient from '@/utils/apiClient';
import Paginate from '../dashboard/Paginate';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { BsThreeDots } from 'react-icons/bs';
import LoanSlide from './LoanSlide';  
import AdvanceFilter from './AdvanceFilter';
import { useRouter,useSearchParams } from 'next/navigation';
import Notification from '../Notification';
import LoadingPage from '@/app/loading';
import { LuRefreshCw } from "react-icons/lu";
import {FaTimes} from 'react-icons/fa';
import PushNotificationModal from '@/components/customer/PushNotificationModal';
import { formatDate ,formatTime,saveToExcel,calculateClosedDaysBetween} from '@/utils/loan';
import LoanHistory from './LoanHistory';



type LoanTableProps = {
  toggleDropDown: () => void;
};
const LoanTable: React.FC<LoanTableProps> = ({toggleDropDown}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 20; // Items per page
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedSort, setSelectedSort] = useState('new');
  const [searchWord, setSearchWord] = useState('');
  const [openSelection, setOpenSelection] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState('All');
  const [openFilter, setOpenFilter] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false)
  const [openLoanSlide, setOpenLoanSlide] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState('');
  const [toggleType, setToggleType] = useState('');
  const [lastPage, setLastPage] = useState(0);
  const searchParams = useSearchParams();
  const start = searchParams.get('start') || '';
  const source = searchParams.get('source') || '';
  const end = searchParams.get('end') || '';
  const dpd = searchParams.get('dpd') || '';
  const amountFrom = searchParams.get('amountFrom') || '';
  const amountTo = searchParams.get('amountTo') || '';
  const due_start = searchParams.get('due_start') || '';
  const due_end = searchParams.get('due_end') || '';
  const loanStatus = searchParams.get('loanStatus') || '';
const [loanTypes, setLoanTypes] = useState<string>('');
  const createdToday = searchParams.get('createdToday') || '';
const dueToday = searchParams.get('dueToday') || '';
const reset = searchParams.get('reset') || '';
const router = useRouter();
const [loans, setLoans] = useState<any[]>([]);
const [user, setUser] = useState<any>(null);
const [triggerSearch, setTriggerSearch] = useState(false);
const [paginate,setPaginate] = useState(true)
const [totalPerPage, setTotalPerPage] = useState(0)
const [downloadExcel, setDownloadExcel] = useState(false)
const [openPushNotification, setOpenPushNotification] = useState(false);
const pushStatus = searchParams.get('pushStatus') || '';
const pushTitle = searchParams.get('pushTitle') || '';
const pushBody = searchParams.get('pushBody') || '';
const send_push_notification = searchParams.get('send_push_notification') || '';
const PaymentType = searchParams.get('paymentType') || '';
const [sendPushNotification, setSendPushNotification] = useState(false);
const [loanHistory, setLoanHistory] = useState<any[]>([]);
const [success, setSuccess] = useState('');
const [usersId, setUsersId] = useState<any>([]);
const [searchDate, setSearchDate] = useState({
    startDate: '',
    endDate: ''
  })
const loanCountTo = searchParams.get('loanCountTo') || '';
const loanCountFrom = searchParams.get('loanCountFrom') || '';
const [openHistory, setOpenHistory] = useState(false);
const [refetch, setRefetch] = useState<boolean>(false);


  //toggle loan history
const toggleLoanHistory = () => {
  setOpenHistory(!openHistory);
}


  

  // Update search date
  useEffect(() => {
    if(start)
    setSearchDate((prev) => ({...prev, startDate: start}));
    if(end)
      setSearchDate((prev) => ({...prev, endDate: end}));
    if(loanStatus)
      setSelectedSelection(loanStatus);
    if(send_push_notification ){
       setSendPushNotification(true)
  }
  if(PaymentType){
    setLoanTypes(PaymentType)
  }
    if(reset){
      setSearchDate({
        startDate: '',
        endDate: ''
      })
    }
    
  }, [start, end, pushBody, pushTitle,  send_push_notification,PaymentType,  loanStatus, reset]);
  


  //cleanup url
  useEffect(() => {
    if(start && end){
      router.replace(window.location.pathname)
    }
  },[start,end])

  const toggleFilter = () => setOpenFilter(!openFilter);



  const handleRowSelect = (row: any) => {
      setSelectedRows((prevSelected) => {
        const isSelected = prevSelected.some((selectedRow:any) => selectedRow.id === row.id);
        const updatedSelectedRows = isSelected
          ? prevSelected.filter((selectedRow) => selectedRow.id !== row.id)
          : [...prevSelected, row];
    
        // Update usersId based on the new selectedRows state
        const idArray = updatedSelectedRows.map((selectedRow) => selectedRow.id);
        setUsersId(idArray);
        return updatedSelectedRows;
      });
    };


  // Handle select all rows
  
 const handleSelectAll = () => {
  const isAllSelected = selectedRows.length === loans.length;
  const updatedSelectedRows = isAllSelected ? [] : loans;

  setSelectedRows(updatedSelectedRows);
  setUsersId(updatedSelectedRows.map((row:any) => row.id));
};


  const toggleLoanSideSlide = () => {
    if (openLoanSlide) {
      setIsExiting(true);
      setTimeout(() => {
        setOpenLoanSlide(false);
        setIsExiting(false);
      }, 300); // Match animation duration
    } else {
      setOpenLoanSlide(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return '₦ ' + amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  

  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

   const togglePushNotification = () => {
    setOpenPushNotification(!openPushNotification);
  }

  useEffect(() => {
    const controller = new AbortController();
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const queryObj: Record<string, string> = { 
          page: String(page), 
          per_page: String(itemsPerPage) 
        };
  
        if (triggerSearch && searchWord ) {
          queryObj.search = searchWord;
        }
        if(downloadExcel){
          queryObj.download_excel = 'true';
        }
        if(loanTypes){
          queryObj.interest_payment_type = loanTypes;
        }
        if (searchDate.startDate && searchDate.endDate) {
          queryObj.search_date_range = `${searchDate.startDate}${' - '}${searchDate.endDate}`;
        }
        if(source){
          queryObj.source = source;
        }
        if (selectedSelection && selectedSelection !== 'All') {
          if (selectedSelection === 'Partially Paid' || selectedSelection === 'partially_paid') {
            queryObj.partially_paid = 'true';
          } else if (selectedSelection === 'Fully Paid' || selectedSelection === 'fully_paid') {
            queryObj.fully_paid = 'true';
          } else {
            queryObj.status = selectedSelection;
          }
        }
  
        if (selectedSort === 'old') {
          queryObj.sort_direction = 'asc';
        }
        if (selectedSort === 'new') {
          queryObj.sort_direction = 'desc';
        }
        if (due_start && due_end) {
          queryObj.due_date_range = `${due_start}${' - '}${due_end}`;
        }
        if (dpd) {
          queryObj.dpd = dpd;
        }
        if (amountFrom && amountTo) {
          queryObj.amount_range = `${amountFrom}${' - '}${amountTo}`;
        }
        if (loanCountFrom && loanCountTo) {
          queryObj.loan_count = `${loanCountFrom}${' - '}${loanCountTo}`;
        }
        
        if(sendPushNotification){
          queryObj.send_push_notification = 'true';
          queryObj.title = pushTitle;
          queryObj.body = pushBody;
          queryObj.status = pushStatus;
        }
        
        if (createdToday) {
          queryObj.created_today = createdToday;
        }
        if (dueToday) {
          queryObj.due_today = dueToday;
        }
        
  
        const queryString = new URLSearchParams(queryObj).toString();
        
  
        const response = await apiClient.get(`/loan?${queryString}`, {
          signal: controller.signal,
          responseType:'json',
        }
      );
        
      if(downloadExcel){
              setSuccess(response?.data?.message || 'Report is being processed and will be emailed to you shortly.');
              setNotificationOpen(true);
              setDownloadExcel(false);
              return;
      }if(sendPushNotification){
             setSuccess(response?.data?.message || 'Notification sent successfully');
              setNotificationOpen(true);
              resetQuery();
              return;
          }
        setLoans(response?.data?.data?.loans || []);
        setTotalPerPage(response?.data?.data?.total_items || 0);
        setLastPage(response?.data?.data?.last_page || 0);
        setRefetch(false)
      } catch (error: any) {
        console.error('err from loan table',error);
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
  
    fetchLoans();
    return () => controller.abort();

  }, [page, triggerSearch, loanTypes, sendPushNotification,refetch,  searchDate.startDate,source,downloadExcel,  searchDate.endDate, selectedSelection, itemsPerPage, selectedSort, due_start, loanCountTo,loanCountFrom, due_end, dpd, amountFrom, amountTo, createdToday, dueToday]);
  
  
  // reset

  const resetQuery = () => {
    setSearchWord('');
    setSearchDate({ startDate: '', endDate: '' });
    setSelectedSelection('All');
    setDownloadExcel(false);
    setSelectedSort('new');
    setTriggerSearch(false);
    setPaginate(true);
    setSendPushNotification(false);
    // Reset query parameters in the URL
    router.replace(window.location.pathname);
    
    // Trigger re-fetch of data
    setPage(1);
  };

  const fetchLoanHistory = async (phone_number:string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/loan?search=${ phone_number}&page=1&per_page=10000`);
     
      setLoanHistory(response?.data?.data?.loans);
      toggleLoanHistory();
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  


  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={selectedRows.length === loans.length}
          onChange={handleSelectAll}
          className="hover:cursor-pointer accent-[#F6011BCC]"
        />
      ),
      cell: (row: typeof loans[number]) => (
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
    { name: 'LOAN SOURCE', selector: 'source' },
    { name: 'STATUS', selector: (row: any) => row.status },
    { name: 'FULL NAME', cell: (row: any) => `${row?.profile?.first_name} ${row?.profile?.last_name}` },
    { name: 'PHONE NO', cell: (row: any) => row?.profile?.phone_number },
    { name: 'LOAN DATE', cell: (row: any) => `${formatDate(row.created_at.split(' ')[0])} ${formatTime(row.created_at.split(' ')[1])}` },
    { name: 'DUE DATE', cell: (row: any) => formatDate(row.expiry_date) },
    {name: 'LOAN TENURE', cell: (row: any) => row?.interest?.period    },
    { name: 'LOAN AMT.', cell: (row: any) => `${formatCurrency(row?.amount)}` },
    { name: 'DUE AMT.', cell: (row: any) => `${formatCurrency(row?.amount_remaining)}` },
    { name: 'DPD', selector: 'dpd' },
    { name: 'ACTIONS', selector: (row: any) => row.actions },
  ];


  const toggleSelection = () => {
    toggleDropDown();
    setOpenSelection(!openSelection);
  };

  const selection = [
    { name: 'All' },
    { name: 'Open' },
    { name: 'Closed' },
    { name: 'Overdue' },
    { name: 'Failed' },
    {name: 'Processing' },
    {name:'Partially Paid'},
    {name:'Fully Paid'},
    {name:'Upfront'},
    {name:'Installment'},
  ];

//toggle loan slide
const toggleLoanSlide = () => {
  setOpenLoanSlide(!openLoanSlide);
}


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
      <p className="lg:text-[15px] md:text-[13px] text-[13px] text-[#282828] font-medium ml-1 font-euclid">
        Sortby : {selectedSelection || loanTypes || 'All'}
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
  if (select.name === 'Upfront' || select.name === 'Installment') {
    setLoanTypes(select.name.toLowerCase()); // 'upfront' or 'installment'
    setSelectedSelection(''); // Clear status filter
  } else {
    setSelectedSelection(select.name);
    setLoanTypes(''); // Clear loanTypes filter
  }
  setOpenSelection(false); // Close dropdown after selection
}}
            className={`w-full text-start ml-4 text-[14px] text-[#282828] ${index === 0 ? 'mt-4' : 'mt-2'}`}
          >
            <div className="flex justify-start text-[#282828] items-center font-medium gap-6">
              <p>{select.name} loans</p>
              {(select.name === selectedSelection || select.name.toLowerCase() === loanTypes) && (
  <Image src="/images/good.png" alt="good" height={17} width={17} />
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
     
     
      <div className="flex items-center justify-between w-full md:pl-6 pl-4  lg:pl-0 mb-10">
        <div className="flex items-center">
          <Image src="/images/loanuser.png" alt="Loan" width={24} height={24} />
          <h1 className="text-[#282828] lg:text-[18px] md:text-[16px] text-[16px] font-bold">{selectedSelection || loanTypes} loans</h1>
        </div>
        <div className='flex items-center justify-center md:mr-4'>
        <Image src="/images/blacksms.png" alt="Filter" width={24} height={24} className={`mr-4 ${selectedRows.length ===loans?.length ? '' : 'opacity-50'}`} />
        <Image 
         onClick={() =>  setOpenPushNotification(true) }
        src="/images/newmsg.png" alt="Filter" width={24} height={24} className={`mr-4  cursor-pointer`} />
        <Image src="/images/redflag.png" alt="Filter" width={24} height={24} className={`mr-4 ${selectedRows.length ===loans.length ? '' : 'opacity-50'}`} />
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
              {loans?.map((row:any) => (
                <tr key={row.id} className="text-[15px] font-medium">
                  {columns.map((col, index) => (
                    <td key={index} className="px-3 pt-7  pb-4 border-b font-montserrat border-[#E6E6E6]">
                      {col.name === 'STATUS' && row.status === 'OPEN' ? (
                       
                           <span className={`bg-[#5E8D35] rounded-full text-[#FFFFFF] ${row?.has_upfront_interest ? 'pl-3 pr-3 flex gap-1' : 'px-3'}  py-1 `}> 
                           {row?.has_upfront_interest ? <Image src="/images/upfront.png" alt="Loan" width={20} height={12} /> : null}
                          {row.status}
                        </span>
                      ): col.name === 'STATUS' && row.status === 'FAILED' ? (
                           <span className={`bg-[#9D8814] rounded-full text-[#FFFFFF] ${row?.has_upfront_interest ? 'pl-3 pr-6 flex gap-1' : 'px-5'}  py-1 `}> 
                           {row?.has_upfront_interest ? <Image src="/images/upfront.png" alt="Loan" width={20} height={12} /> : null}
                          {row.status}
                        </span>
                      ) :  col.name === 'STATUS' && row.status === 'CLOSED' ? (
                          <span className={`bg-[#2290DF] rounded-full text-[#FFFFFF] ${row?.has_upfront_interest ? 'pl-3 pr-6 flex gap-1' : 'px-3'}  py-1 `}> 
                          {row?.has_upfront_interest ? <Image src="/images/upfront.png" alt="Loan" width={20} height={12} /> : null}
                          {row.status}
                        </span>
                      ) :  col.name === 'STATUS' && row.status === 'OVERDUE' ? (
                        <span className={`bg-[#DA3737] rounded-full text-[#FFFFFF] ${row?.has_upfront_interest ? 'pl-3 pr-6 flex gap-1' : 'px-5'}  py-1 `}>
                           {row?.has_upfront_interest ? <Image src="/images/upfront.png" alt="Loan" width={20} height={12} /> : null}
                          {row.status}
                        </span>
                      ):  col.name === 'STATUS' && row.status === 'PROCESSING' ? (
                        <span className={`bg-[#9D8814] rounded-full text-[#FFFFFF] ${row?.has_upfront_interest ? 'pl-3 pr-6 flex gap-1' : 'px-5'}  py-1 `}> 
                           {row?.has_upfront_interest ? <Image src="/images/upfront.png" alt="Loan" width={20} height={12} /> : null}
                          {row.status}
                        </span>
                        ): col.name === 'ACTIONS' ? (
                        <div className="flex justify-between items-center w-full gap-1">
                          <button
                          onClick={() => {
                            setToggleType('loan');
                            setUser(row);
                            
                            toggleLoanSlide();
                          }}
                          >
                          <Image
                            src="/images/receipt-item.png"
                            width={24}
                            height={24}
                            alt="Hold"
                            className={` ${selectedRows.length ===loans.length ? 'opacity-50' : ''} cursor-pointer`}
                          />

                          </button>
                          <button
                          onClick={() => {
                            setToggleType('user');
                            setUser(row);
                            toggleLoanSlide();
                          }}
                          >
                          <Image
                            src="/images/blueuser.png"
                            width={14}
                            height={20}
                            alt="Hold"
                            className={` ${selectedRows.length ===loans.length ? 'opacity-50' : ''} cursor-pointer`}
                          />
                          </button>
                          
                          <p 
                          onClick={() => fetchLoanHistory(row?.profile?.phone_number)}
                          className={` text-[24px] cursor-pointer text-[#2290DF]`}>{row.loan_count}</p>
                        </div>
                      ) : col.cell ? (
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
  <AdvanceFilter 
    isOpen={openFilter} 
    toggleAdvanceFilter={toggleFilter} 
  />
)}
 {openHistory && (
        <LoanHistory 
        isOpen={openHistory} 
        toggleLoanHistory={toggleLoanHistory}  
        loanHistory={loanHistory}
        />
      )}

      {openLoanSlide && (
        <LoanSlide
        isOpen={!isExiting}
        toggleLoanSlide={toggleLoanSideSlide}
        isExiting={isExiting}
        toggleType={toggleType}
        user={user}
        setRefetch={setRefetch}
        />
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
   {openPushNotification && (
          <PushNotificationModal
          isOpen={openPushNotification}
          togglePushNotification={togglePushNotification}
          usersId={usersId}
          />
        )}
       
    </div>
  );
};

export default LoanTable;
