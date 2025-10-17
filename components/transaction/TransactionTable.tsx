'use client';
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import { IoSearchSharp } from "react-icons/io5";
import Paginate from '../dashboard/Paginate';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import TransactionFilter from './TransactionFilter';
import DetailedTransaction from './DetailedTransactions';
import apiClient from '@/utils/apiClient';
import Notification from '../Notification';
import { useSearchParams,useRouter } from 'next/navigation';
import LoadingPage from '@/app/loading';
import { FaTimes } from 'react-icons/fa';
import {LuRefreshCw} from 'react-icons/lu';
import PushNotificationModal from '@/components/customer/PushNotificationModal';
import { formatDate,saveToExcel,formatTime } from '@/utils/loan';



const TransactionTable = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 15; // Items per page
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSort, setSelectedSort] = useState('new');
  const [searchWord, setSearchWord] = useState('');
  const [openSelection, setOpenSelection] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState('All');
  const [openFilter, setOpenFilter] = useState(false);
  const [usersId, setUsersId] = useState<any>([]);
  const [openDetailedTransaction, setOpenDetailedTransaction] = useState(false);
  const [detailedData, setDetailedData] = useState<any>(null);
  const [transactionData, setTransactionData] = useState<any>([]);
  const [error, setError] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const searchParams = useSearchParams();
  const start = searchParams.get('start') || '';
  const end = searchParams.get('end') || '';
  const amountFrom = searchParams.get('amountFrom') || '';
  const amountTo = searchParams.get('amountTo') || '';
  const type = searchParams.get('type') || '';
  const reset = searchParams.get('reset') || '';
  const id = searchParams.get('id') || '';
  const status = searchParams.get('status') || '';
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [paginate,setPaginate] = useState(true)
  const [totalPerPage, setTotalPerPage] = useState(0)
  const [downloadExcel, setDownloadExcel] = useState(false)
const [searchDate, setSearchDate] = useState({
  startDate: '',
  endDate: ''
})
const pushStatus = searchParams.get('pushStatus') || '';
  const pushTitle = searchParams.get('pushTitle') || '';
  const pushBody = searchParams.get('pushBody') || '';
  const send_push_notification = searchParams.get('send_push_notification') || '';
  
  const [sendPushNotification, setSendPushNotification] = useState(false);
  const [success, setSuccess] = useState('');
  const [openPushNotification, setOpenPushNotification] = useState(false);


// Update search date
  useEffect(() => {
    if(start)
    setSearchDate((prev) => ({...prev, startDate: start}));
    if(end)
      setSearchDate((prev) => ({...prev, endDate: end}));
    if(type)
     setSelectedSelection(type);
    if(reset){
      setSearchDate({
        startDate: '',
        endDate: ''
      })
    }
      if(send_push_notification ){
       setSendPushNotification(true)
  }
    
  }, [start, end, type, reset,send_push_notification,pushBody,pushTitle,]);

//cleanup url
useEffect(() => {
  if(start && end){
    router.replace(window.location.pathname)
  }
},[start,end])
    


  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  
  const togglePushNotification = () => {
    setOpenPushNotification(!openPushNotification);
  }




  const toggleFilter = () => setOpenFilter(!openFilter);
  const toggleDetailedTransaction = (row?: any) => {
    setDetailedData(row || null); 
    setOpenDetailedTransaction(!openDetailedTransaction);
  };


  const handleRowSelect = (row: any) => {
    setSelectedRows((prevSelected) =>
      prevSelected.some((selectedRow) => selectedRow.id === row.id)
        ? prevSelected.filter((selectedRow) => selectedRow.id !== row.id)
        : [...prevSelected, row]
    );
  };
  
  
  
  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === transactionData.length ? [] : transactionData
    );
  };

   //get loan transactions
   useEffect(() => {
    const controller = new AbortController();
    const fetchTransactions = async () => {
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
  
        if (selectedSelection && selectedSelection !== 'All') {
          queryObj.payment_type = selectedSelection;
        }
        if(status){
          queryObj.status = status;
        }
          if(sendPushNotification){
          queryObj.send_push_notification = 'true';
          queryObj.title = pushTitle;
          queryObj.body = pushBody;
          queryObj.status = pushStatus;
        }
        if(downloadExcel){
          queryObj.download_excel = 'true';
        }
        if (selectedSort === 'old') {
          queryObj.sort_direction = 'asc';
        }
        if (selectedSort === 'new') {
          queryObj.sort_direction = 'desc';
        }
        if (id) {
          queryObj.transaction_id = id;
        }
        if (amountFrom && amountTo) {
          queryObj.amount_range = `${amountFrom}${' - '}${amountTo}`;
        }
  
        const queryString = new URLSearchParams(queryObj).toString();
        
  
        const response = await apiClient.get(
          `/loan/transactions?${queryString}`, {
          signal: controller.signal,
          responseType: 'json',
        });
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
        
        setTransactionData(response?.data?.data?.transactions || []);
        setTotalPerPage(response?.data?.data?.total_items || 0);
        setLastPage(response?.data?.data?.last_page || 0);
      }
        catch (error: any) {
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

    fetchTransactions();
     return () => controller.abort();
  }, [page, triggerSearch,paginate, searchDate,sendPushNotification, selectedSelection, selectedSort, id, downloadExcel, amountFrom, amountTo, status]);


  

  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={selectedRows.length === transactionData.length}
          onChange={handleSelectAll}
          className="hover:cursor-pointer accent-[#F6011BCC]"
        />
      ),
      cell: (row: typeof transactionData[number]) => (
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
    { name: 'FULL NAME', cell: (row: any) => `${row?.profile?.first_name} ${row?.profile?.last_name}`},
    { name: 'PHONE NO', cell: (row: any) => row?.profile?.phone_number  },
    { name: 'AMOUNT', selector: 'amount' },
    { name: 'TYPE', selector: 'type' },
    { name: 'STATUS', selector: 'status' },
    {name: 'DATE CREATED', cell: (row: any) => `${formatDate(row?.transaction_date?.split(' ')[0])} ${formatTime(row?.transaction_date?.split(' ')[1])}` },
    { name: 'ACTIONS', selector: 'actions' },
  ];



  const toggleSelection = () => {
    setOpenSelection(!openSelection);
  };

  const selection = [
    { name: 'All',value:'All' },
    { name: 'Disbursement',value:'loan' },
    { name: 'Collection',value:'payment' },
    { name: 'Refund',value:'refund' },
    {name:'Penalty',value:'penalty'},
    {name: 'Card Tokenization', value:'card_tokenization'},
    {name: 'Unapplied Payment', value:'unapplied_payment'},
  ];

  const resetQuery = () => {
    setSearchWord('');
    setSearchDate({ startDate: '', endDate: '' });
    setSelectedSelection('All');
    setSelectedSort('new');
    setTriggerSearch(false);
    setDownloadExcel(false);
    setSendPushNotification(false);
   
    setPaginate(true);
    // Reset query parameters in the URL
    router.replace(window.location.pathname);
    
    // Trigger re-fetch of data
    setPage(1);
  };

  

  return (
    <div className="w-full mt-10  md:ml-8   h-auto font-montserrat ">
       <p className='text-[24px] font-bold ml-4 mb-10 text-[#282828]'>Payments & Invoice</p>
      <div className="flex md:overflow-x-auto justify-between lg:overflow-hidden overflow-x-auto items-center gap-8 w-full h-auto mb-10  text-[#5A5A5A] text-[16px] ">
        <div className="flex items-center justify-between gap-6 md:gap-6 lg:gap-0 w-full md:mr-10 " >
          {/* Dropdown Section */}
          <div className="">
            <div
              onClick={toggleSelection}
               className="flex items-center hover:cursor-pointer bg-[#E1E3E4] rounded-full min-w-[229px]  w-auto h-[48px]  md:ml-2 ml-4 lg:ml-0 md:px-2 z-50"
            >

             
              {/* Left Section */}
              <div className="flex items-center flex-grow ml-3 ">
                <Image
                  src="/images/calendar-2.png"
                  alt="Logo"
                  width={18}
                  height={18}
                />
                <p className="text-[15px] text-[#282828] font-medium ml-1 font-euclid">
                Sortby: {selection.find((select) => select.value === selectedSelection)?.name || 'All'}
                </p>
              </div>
              {/* Right Section */}
              <button>
                <TiArrowSortedDown className="text-[#828282] text-[18px] mr-3" />
              </button>
            </div>

            {openSelection && (
              <>
                {/* Background Overlay */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setOpenSelection(false)}
                >
                  </div>
                  

                {/* Dropdown Content */}
                <div className="absolute lg:top-[231px] lg:left-[276px] md:top-[232px] md:left-[240px] left-[60px] w-[259px]  min-h-[138px] h-auto bg-white rounded-xl shadow-lg font-montserrat font-medium z-50">
                  {selection.map((select: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSelection(select.value);
                        setOpenSelection(false); // Close dropdown after selection
                      }}
                      className={`w-full text-start ml-4 text-[14px] text-[#282828] ${index === 0 ? 'mt-4' : 'mt-2'}`}
                    >
                      <div className="flex justify-start text-[#282828] items-center font-medium gap-4 z-50">
                        <p>{select.name} Payments</p>
                        {select.value === selectedSelection && (
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
          <h1 className="text-[#282828] text-[18px] font-bold">{selection.find((select) => select.value === selectedSelection)?.name} Payments</h1>
        </div>
        <div className='flex items-center justify-center md:mr-4'>
        <Image src="/images/blacksms.png" alt="Filter" width={24} height={24} className={`mr-4 ${selectedRows.length === transactionData.length ? '' : 'opacity-50'}`} />
          <Image
                onClick={() =>  setOpenPushNotification(true) }
                src="/images/newmsg.png" alt="Filter" width={24} height={24} className={`mr-4  cursor-pointer`} />
        <Image src="/images/redflag.png" alt="Filter" width={24} height={24} className={`mr-4 ${selectedRows.length === transactionData.length ? '' : 'opacity-50'}`} />
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
              {transactionData.map((row:any) => (
                <tr key={row.id} className="text-[15px] font-medium text-left">
                  {columns.map((col, index) => (
                    <td key={index} className="px-3 pt-7  pb-4 border-b font-montserrat border-[#E6E6E6]">
                      {col.name === 'STATUS'  ? (row.status.toUpperCase())
                       : col.name === 'TYPE' && row?.transaction_type === 'refund' ? (
                        <span className="bg-[#656862] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                         Refund
                        </span>
                      ) : col.name === 'TYPE' && row?.transaction_type === 'penalty' ? (
                        <span className="bg-[#DA3737] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                          Penalty
                        </span>
                      ): col.name === 'TYPE' && row?.transaction_type === 'card_tokenization' ? (
                        <span className="bg-[#155661] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                          Card Tokenization
                        </span>
                      ):  col.name === 'TYPE' &&  row?.transaction_type === 'loan' ? (
                        <span className="bg-[#5E8D35] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                          Disbursement
                        </span>
                      ) : col.name === 'AMOUNT' ? (
                        row.amount.toString().includes('-') 
                          ? `₦${row.amount.toString().split('-')[1]}` 
                          : `₦${row.amount}`
                      ) 
                       :  col.name === 'TYPE' &&  row?.transaction_type === 'payment' ? (
                        <span className="bg-[#3173F3] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                         Collection
                        </span>
                      ) :  col.name === 'TYPE' &&  row?.transaction_type === 'unapplied_payment' ? (
                        <span className="bg-[#9D8814] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                         UNAPPLIED 
                        </span>
                      ): col.name === 'ACTIONS' ? (
                        <div className="flex justify-between items-center w-full gap-1">
                          <button
                            onClick={() => toggleDetailedTransaction(row)}
                          className='bg-[#282828] w-[75px] h-[30px] text-[#FFFFFF] rounded-[18px] px-3 py-1 text-[15px] font-medium'
                          >
                            View

                          </button>
                          
                          
                        </div>
                      ) 
                      : col.cell ? (
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
      {openFilter && 
      <TransactionFilter
      isOpen={openFilter}
      toggleTransactionFilter={toggleFilter}
      />}
      {success &&
                    <Notification
                      message={success}
                      toggleNotification={toggleNotification}
                      isOpen={notificationOpen}
                      status='success'
          />}

      {openDetailedTransaction && (
        <DetailedTransaction
          isOpen={openDetailedTransaction}
          toggleDetailedTransaction={toggleDetailedTransaction}
          row={detailedData}
        />
      )}
       {openPushNotification && (
              <PushNotificationModal
              isOpen={openPushNotification}
              togglePushNotification={togglePushNotification}
              usersId={usersId}
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
       
    </div>
  );
};

export default TransactionTable;
