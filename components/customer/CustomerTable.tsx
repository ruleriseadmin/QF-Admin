'use client';
import React, { useState ,useEffect} from 'react';
import Image from 'next/image';
import { IoSearchSharp } from "react-icons/io5";
import Paginate from '../dashboard/Paginate';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { BsThreeDots } from 'react-icons/bs';
import LoanSlide from '../allloans/LoanSlide';
import CustomerFilter from './CustomerFilter';
import { useSearchParams,useRouter } from 'next/navigation';
import apiClient from '@/utils/apiClient'
import Notification from '@/components/Notification'
import LoadingPage from '@/app/loading';
import { FaTimes } from 'react-icons/fa';
import {LuRefreshCw} from 'react-icons/lu';
import { formatDate, formatTime} from '@/utils/loan';
import { saveToExcel } from '@/utils/loan';
import PushNotificationModal from '@/components/customer/PushNotificationModal';


const CustomerTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Items per page
   const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [customers, setCustomers] = useState<any>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState('');
   const [lastPage, setLastPage] = useState(0);
  const router = useRouter();
  const [selectedSort, setSelectedSort] = useState('new');
  const [searchWord, setSearchWord] = useState('');
  const [openSelection, setOpenSelection] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState('All customers');
  const [openFilter, setOpenFilter] = useState(false);
  const [isExiting, setIsExiting] = useState(false)
  const [openLoanSlide, setOpenLoanSlide] = useState(false)
  const [toggleType, setToggleType] = useState('');
  const [user, setUser] = useState<any>(null);
  const searchParams = useSearchParams();
  const start = searchParams.get('start') 
  const end = searchParams.get('end')
  const loanStat = searchParams.get('loanStatus')
  const creditScore = searchParams.get('creditScore')
  const source = searchParams.get('source')
  const ageFrom = searchParams.get('ageFrom')
  const loanCountTo = searchParams.get('loanCountTo');
  const loanCountFrom = searchParams.get('loanCountFrom');
  const ageTo = searchParams.get('ageTo')
  const employmentStatus = searchParams.get('employmentStatus')
  const blacklisted = searchParams.get('blacklisted')
  const defaulted = searchParams.get('defaulted')
  const neverDefaulted = searchParams.get('neverDefaulted')
  const fullyRegistered = searchParams.get('fullyRegistered')
 const partiallyRegistered = searchParams.get('partiallyRegistered')
 const unDefined = searchParams.get('unDefined')
  const loaned = searchParams.get('loaned')
  const noLoan = searchParams.get('noLoan')
  const dueStart = searchParams.get('dueStart')
  const dueEnd = searchParams.get('dueEnd')
  const reset = searchParams.get('reset')
  const crc = searchParams.get('crc')
  const [loading, setLoading] = useState(false)
  const [triggerSearch, setTriggerSearch] = useState(false)
  const [paginate,setPaginate] = useState(true)
  const [totalPerPage, setTotalPerPage] = useState(0)
  const [openPushNotification, setOpenPushNotification] = useState(false);
  const [usersId, setUsersId] = useState<any>([]);
   const [downloadExcel, setDownloadExcel] = useState(false)
  const pushStatus = searchParams.get('pushStatus') || '';
  const pushTitle = searchParams.get('pushTitle') || '';
  const pushBody = searchParams.get('pushBody') || '';
   const amountFrom = searchParams.get('amountFrom') || '';
  const amountTo = searchParams.get('amountTo') || '';
  const send_push_notification = searchParams.get('send_push_notification') || '';
  const [sendPushNotification, setSendPushNotification ] = useState(false)
  const closedLoansCustomers = searchParams.get('closedLoansCustomers') || '';
  const [success, setSuccess] = useState('');
  const [refetch,setRefetch] = useState<boolean>(false)

const [searchDate, setSearchDate] = useState({
  startDate: '',
  endDate: ''
})

useEffect(() => {
  if (start && end) {
    setSearchDate({
      startDate: start,
      endDate: end,
    });
  }
  if(send_push_notification){
   setSendPushNotification(true)
  }
  
  if(blacklisted){
    setSelectedSelection('blacklisted')
  }
  if(defaulted){
    setSelectedSelection('defaulted')
  }if(neverDefaulted){
    setSelectedSelection('neverDefaulted')
  }
  if(fullyRegistered){
    setSelectedSelection('fullyRegistered')
  }
 if(partiallyRegistered){
    setSelectedSelection('partiallyRegistered')
  }
  if(closedLoansCustomers)
    setSelectedSelection('closedLoan')
  if(loaned){
    setSelectedSelection('loan')
  }
  if(noLoan){
    setSelectedSelection('noloan')
  }if(reset){
    setSearchDate({
      startDate: '',
      endDate: ''
    })
  }
}, [start, end, pushBody, pushTitle, pushStatus, send_push_notification, blacklisted,closedLoansCustomers,defaulted, loaned, noLoan, reset, neverDefaulted,fullyRegistered,partiallyRegistered]);

//cleanup url
useEffect(() => {
  if(start && end ){
    router.replace(window.location.pathname)
  }

},[start,end])



  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const toggleFilter = () => setOpenFilter(!openFilter);

  const togglePushNotification = () => {
    setOpenPushNotification(!openPushNotification);
  }

    // Fetch customers
    useEffect(() => {
      const controller = new AbortController();
      setLoading(true);
        const queryObj: Record<string, string> = { 
          page: String(page), 
          per_page: String(itemsPerPage)
          
          
        };
        
        if (triggerSearch && searchWord ) {
          queryObj.search = searchWord;
        }
        if (creditScore) {
          queryObj.credit_score = creditScore;
        }
       
        if (loanCountFrom && loanCountTo) {
          queryObj.loan_count = `${loanCountFrom}${' - '}${loanCountTo}`;
        }
        
        if (searchDate.startDate && searchDate.endDate) {
          queryObj.search_date_range = `${searchDate.startDate}${' - '}${searchDate.endDate}`;
        }
        if(downloadExcel){
          queryObj.download_excel = 'true';
        }
  
       if(selectedSelection === 'blacklisted'){
          queryObj.blacklisted = 'true';
        }
         if (amountFrom && amountTo) {
          queryObj.amount_range = `${amountFrom}${' - '}${amountTo}`;
        }
        if(crc){
          queryObj.credit_status =crc;
        }
        if(selectedSelection === 'defaulted'){
          queryObj.defaulted = 'true';
        }if(selectedSelection === 'neverDefaulted'){
          queryObj.never_defaulted = 'true';
        }if(selectedSelection === 'closedLoan'){
          queryObj.last_loan_closed = 'true';
        }
        if(sendPushNotification){
          queryObj.send_push_notification = 'true';
          queryObj.title = pushTitle;
          queryObj.body = pushBody;
          
        }
        if(selectedSelection === 'fullyRegistered'){
          queryObj.fully_registered = 'true';
        }
        if(selectedSelection === 'partiallyRegistered'){
          queryObj.partially_registered = 'true';
        }
        if(selectedSelection === 'loan'){
          queryObj.loaned = 'true';
        }
        if(selectedSelection === 'noloan'){
          queryObj.no_loan = 'true';
        }
        if(loanStat){
          queryObj.loan_status = loanStat.toUpperCase();
        }
        if (selectedSort === 'old') {
          queryObj.sort_direction = 'asc';
        }else queryObj.sort_direction = 'desc';
        if (selectedSort === 'new') {
          queryObj.sort_direction = 'desc';
        }
        if (source) {
          queryObj.source = source;
        }
        if (ageFrom && ageTo) {
          queryObj.age_range = `${ageFrom}${' - '}${ageTo}`;
        }
        if (employmentStatus) {
          queryObj.employment_status = employmentStatus;
        }
        if (unDefined) {
          queryObj.undefined = 'true';
        }
        if (dueStart && dueEnd) {
          queryObj.due_date_range = `${dueStart}${' - '}${dueEnd}`;
        }
        const queryString = new URLSearchParams(queryObj).toString();
  
      const fetchCustomers = async () => {
       try {
         const response = await apiClient.get(`/customer?${queryString}`, 
          { 
            signal: controller.signal,
            responseType:  'json', 
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
        
         setCustomers(response.data?.data?.customers || []);
        setTotalPerPage(response?.data?.data?.total_items || 0);
         setLastPage(response?.data?.data?.last_page || 0);
         setRefetch(false)
       } catch (error:any) {
        console.error('err from customer table',error);
         if (error.message !== 'canceled' || error.name !== 'CanceledError') {
          if (error?.status === 401) {
            setError('Unauthorized access. You do not have permission to view this resource.');
            setNotificationOpen(true);
          }else {
          setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
          setNotificationOpen(true);
          }
        }
       }finally{
        setLoading(false);
       }
      }
       fetchCustomers();
        return () => controller.abort();
     }, [page, selectedSort,loanCountTo,amountFrom, sendPushNotification, amountTo,refetch,loanCountFrom,  paginate, crc, searchDate, selectedSelection,downloadExcel, triggerSearch, loanStat, creditScore, source,unDefined, ageFrom, ageTo, employmentStatus,  dueStart, dueEnd]);
  



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


    
const handleSelectAll = () => {
  const isAllSelected = selectedRows.length === customers.length;
  const updatedSelectedRows = isAllSelected ? [] : customers;

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
  

  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };



  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={selectedRows.length === customers.length}
          onChange={handleSelectAll}
          className="hover:cursor-pointer accent-[#F6011BCC]"
        />
      ),
      cell: (row: typeof customers[number]) => (
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
    { name: 'DATE REG', cell: (row: any) => `${formatDate(row.created_at.split(' ')[0])} ${formatTime(row.created_at.split(' ')[1])}` },
    { name: 'PHONE NO', selector: 'phone_number' },
    { name: 'EMAIL', cell: (row: any) => `${row?.profile?.email}` },
    { name: 'LOAN COUNT', selector: 'loan_count' },
    { name: 'DEFAULT', selector: 'default_count' },
    { name: 'SCORE', selector: 'credit_score' },
    { name: 'ACTIONS', selector: 'actions' },
  ];



  const toggleSelection = () => {
    setOpenSelection(!openSelection);
  };

  const selection = [
    { name: 'All', value: 'All' },
    { name: 'Loaned', value: 'loan' },
    { name: 'No loan', value: 'noloan' },
    { name: 'Blacklisted', value: 'blacklisted' },
    {name: 'Closed loan',value:'closedLoan'},
    { name: 'Defaulted', value: 'defaulted' },
    { name: 'Never Defaulted', value: 'neverDefaulted' },
    {name: 'Fully Registered',value: 'fullyRegistered'},
    {name: 'Partially Registered',value: 'partiallyRegistered'}
  ];

//toggle loan slide
const toggleLoanSlide = () => {
  setOpenLoanSlide(!openLoanSlide);
}

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
    <div className="w-full mt-28 mb-10 md:ml-8  h-auto font-montserrat ">
      <div className="flex md:overflow-x-auto justify-between lg:overflow-hidden overflow-x-auto items-center gap-8 w-full h-auto mb-10  text-[#5A5A5A] text-[16px] ">
        <div className="flex items-center justify-between gap-6 md:gap-6 lg:gap-0 w-full md:mr-10 " >
          {loading && <LoadingPage />}
          {/* Dropdown Section */}
          <div className="">
            <div
              onClick={toggleSelection}
              className="flex items-center hover:cursor-pointer bg-[#E1E3E4] rounded-full lg:min-w-[259px] lg:w-auto md:min-w-[241px] md:w-auto min-w-[249px] w-auto h-[48px]  md:ml-2 ml-4 lg:ml-0 md:px-2"
            >
              {/* Left Section */}
              <div className="flex items-center flex-grow ml-3">
                <Image
                  src="/images/calendar-2.png"
                  alt="Logo"
                  width={18}
                  height={18}
                />
                <p className="text-[15px] text-[#282828] font-medium ml-1">
                  Sortby : {selection.find((select) => select.value === selectedSelection)?.name || 'All' }
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
                  className="fixed inset-0 bg-black bg-opacity-50 z-50"
                  onClick={() => setOpenSelection(false)}
                ></div>
                  

                {/* Dropdown Content */}
                <div className="absolute lg:top-[457px] pb-3 lg:left-[258px] md:top-[592px] md:left-[232px] left-[51px] w-[269px] min-h-[138px] h-auto bg-white rounded-xl shadow-lg font-montserrat font-medium z-50">
                  {selection.map((select: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSelection(select.value);
                        setOpenSelection(false); // Close dropdown after selection
                      }}
                      className={`w-full text-start ml-4 text-[14px] text-[#282828] ${index === 0 ? 'mt-4' : 'mt-2'}`}
                    >
                      <div className="flex justify-start text-[#282828] items-center font-medium gap-3  z-50">
                        <p>{select.name} customers</p>
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
          <h1 className="text-[#282828] text-[18px] font-bold">{selectedSelection}</h1>
        </div>
        <div className='flex items-center justify-center md:mr-4'>
        <Image src="/images/blacksms.png" alt="Filter" width={24} height={24} className={`mr-4 ${selectedRows.length === customers.length ? '' : 'opacity-50'}`} />
        <Image
        onClick={() =>  setOpenPushNotification(true) }
        src="/images/newmsg.png" alt="Filter" width={24} height={24} className={`mr-4  cursor-pointer`} />
        <Image src="/images/redflag.png" alt="Filter" width={24} height={24} className={`mr-4 ${selectedRows.length === customers.length ? '' : 'opacity-50'}`} />
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
            style={
              col.name === 'EMAIL'
                ? { width: '140px', textAlign: 'left' }
                : col.name === 'DATE REG'
                ? { width: '125px', textAlign: 'left' }
                : col.name === 'FULL NAME'
                ? { width: '173px', textAlign: 'left' }
                : col.name === '#'
                ? { width: '60px', textAlign: 'left' }
                : col.name === 'LOAN CYCLE'
                ? { width: '113px', textAlign: 'left' }
                : { textAlign: 'left' }
            }
            className={`px-3 py-2 ${
              index === 0 ? 'rounded-tl-[18px] rounded-bl-[18px]' : ''
            } ${index === columns.length - 1 ? 'rounded-tr-[18px] rounded-br-[18px]' : ''}`}
          >
            {  selectedSelection === 'Blacklisted' && (col.name === 'LOAN CYCLE' || col.name === 'DEFAULT') ? 
              '' : col.name}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {customers?.map((row: any) => (
        <tr key={row.id} className="text-[15px] font-medium text-left">
          {columns.map((col, index) => (
            <td
              key={index}
              className="px-3 pt-7 pb-4 border-b font-montserrat border-[#E6E6E6] text-left"
            >
              {selectedSelection === 'Blacklisted' && (col.name === 'LOAN CYCLE' || col.name === 'DEFAULT') ? 
              "" : col.name === 'ACTIONS' ? (
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
                      className={`${
                        selectedRows.length === customers.length ? 'opacity-50' : ''
                      } cursor-pointer`}
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
                      className={`${
                        selectedRows.length === customers.length ? 'opacity-50' : ''
                      } cursor-pointer`}
                    />
                  </button>
                  {selectedSelection === 'Blacklisted' ? (
                    <button className='w-[122px] h-[30px] rounded-[18px] bg-[#DA3737] px-2  text-[#FFFFFF] text-[15px]'>
                      Remove
                    </button>
                  ) : (
                    <BsThreeDots
                    className={`text-[#282828] text-[24px] ${
                      selectedRows.length === customers.length ? 'opacity-50' : ''
                    }`}
                  />
                  )}
                 
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
        <CustomerFilter isOpen={openFilter} toggleCustomerFilter={toggleFilter} />
      )}

{error && 
            <Notification 
            message={error} 
            toggleNotification={toggleNotification} 
            isOpen={notificationOpen}
            status='error'
     
            />}
{success &&
  <Notification
    message={success}
    toggleNotification={toggleNotification}
    isOpen={notificationOpen}
    status='success'
  />}

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

export default CustomerTable;
