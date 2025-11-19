'use client';
import React, { useState ,useEffect} from 'react';
import Image from 'next/image';
import { IoSearchSharp } from "react-icons/io5";
import Paginate from '../dashboard/Paginate';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { RiArrowDownSLine } from "react-icons/ri";
import LoanSlide from '../allloans/LoanSlide';
import CustomerFilter from './CustomerFilter';
import { useSearchParams,useRouter } from 'next/navigation';
import apiClient from '@/utils/apiClient'
import Notification from '@/components/Notification'
import LoadingPage from '@/app/loading';
import { FaTimes } from 'react-icons/fa';
import { formatDate} from '@/utils/loan';




const MismatchTable: React.FC = () => {
const router = useRouter();
const [refetch,setRefetch] = useState(false);
const [error, setError] = useState('');
const [idToChange, setIdToChange] = useState('');
const [notificationOpen, setNotificationOpen] = useState(false);
const [searchLoading, setSearchLoading] = useState(false);
const [openLoanSlide, setOpenLoanSlide] = useState(false)
const [customer, setCustomer] = useState<any[]>([]);
const [loading, setLoading] = useState(false);
const [loanExiting, setLoanExiting] = useState(false)
const [downloadExcel, setDownloadExcel] = useState(false);
const [triggerSearch, setTriggerSearch] = useState(false);
const [bvnMisMatches, setBvnMisMatches] = useState<any>({});
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(0);
const [searchWord, setSearchWord] = useState('');

const [selectedSort, setSelectedSort] = useState('new');
const searchParams = useSearchParams();
const start = searchParams.get('start') 
const end = searchParams.get('end')
const [searchDate, setSearchDate] = useState({
  startDate: '',
  endDate: ''
});
const [openPassModal, setOpenPassModal] = useState(false);
const [markAsRead, setMarkAsRead] = useState(false);
const [resolved, setResolved] = useState(false);

const toggleOpenPassModal = () => {
  setOpenPassModal(!openPassModal);
};

const toggleMarkAsRead = () => {
  setMarkAsRead(!markAsRead);
};

const toggleResolved = () => {
  setResolved(!resolved);
};

useEffect(() => {
  if (start && end) {
    setSearchDate({
      startDate: start,
      endDate: end,
    });
  }
}, [start, end]);

//cleanup url
useEffect(() => {
  if(start && end ){
    router.replace(window.location.pathname)
  }

},[start,end])

 const toggleLoanSideSlide = () => {
    if (openLoanSlide) {
      setLoanExiting(true);
      setTimeout(() => {
        setOpenLoanSlide(false);
        setLoanExiting(false);
      }, 300); // Match animation duration
    } else {
      setOpenLoanSlide(true);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };

 useEffect(() => {
    const fetchBvnMisMatch = async () => {
       const controller = new AbortController();
        const queryObj: Record<string, string> = { 
          page: String(page), 
          per_page: String(itemsPerPage),
         
        };
         if (triggerSearch && searchWord ) {
          queryObj.search = searchWord;
        }
        if(downloadExcel){
          queryObj.download_excel = 'true';
        }
         if (searchDate.startDate && searchDate.endDate) {
          queryObj.search_date_range = `${searchDate.startDate}${' - '}${searchDate.endDate}`;
        }
         if (selectedSort === 'old') {
          queryObj.sort_direction = 'desc';
        }
        if (selectedSort === 'new') {
          queryObj.sort_direction = 'asc';
        }
        const queryString = new URLSearchParams(queryObj).toString();
      try {
        setLoading(true);
        const response = await apiClient.get(`/customer/verification_mismatches?${queryString}`);
        setBvnMisMatches(response?.data?.data || []);
        setTotalItems(response?.data?.data?.total_items || 0);
        setLastPage(response?.data?.data?.last_page || 0);
        
  
      } catch (error) {
        console.error('Error fetching bvn mismatch status:', error);
      }finally{
        setLoading(false);
      }
    };
  
    fetchBvnMisMatch();
  }, [page, itemsPerPage,triggerSearch,downloadExcel,searchDate, refetch,selectedSort]);


  const fetchCustomers = async (no: string) => {
  try {
    setSearchLoading(true);
    const response = await apiClient.get(`/customer?search=${no}`);
    setCustomer(response.data?.data?.customers[0] || []);
  } catch (error: any) {
    console.error('err from customer table', error);

    // Ignore cancelled requests properly
    if (error.message === 'canceled' || error.name === 'CanceledError') {
      return;
    }

    if (error?.status === 401) {
      setError('Unauthorized access. You do not have permission to view this resource.');
      setNotificationOpen(true);
    } else {
      setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
      setNotificationOpen(true);
    }
  }finally {
    setSearchLoading(false);
  }
};

  const toggleNotification = () => setNotificationOpen(!notificationOpen);

  const resolveOrMarkAsSeen = async () => {
  // Decide which endpoint to call based on markAsRead
  const url = markAsRead
    ? `/customer/verification_mismatches/mark_as_seen`
    : `/customer/manual-verification`;

  try {
    setLoading(true)
    const response = await apiClient.post(url, {
      user_id: idToChange
    });
    toggleOpenPassModal();
    setSuccess(response?.data?.message || 'Success');
    toggleNotification()
    setRefetch && setRefetch(true);


  } catch (error: any) {
    console.error('Error resolving or marking as seen:', error);
    if (error?.status === 401) {
      setError('Unauthorized access. You do not have permission to view this resource.');
      setNotificationOpen(true);
    } else {
      setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
      setNotificationOpen(true);
    }
  }finally{
    setLoading(false)
  }
};


 
  const columns = [
      { name: 'NAME', selector: 'name' },
      { name: 'REQUEST DATE', cell: (row: any) => `${formatDate(row?.registration_date)}` },
      { name: 'BANK ACC NAME', selector: 'account_name' },
       { name: 'PHONE NUMBER', selector: 'user_phone_number' },
      { name: 'BVN', selector: 'bvn' },
      { name: 'ACTIONS', selector: 'actions' },
    ];
  



  return (
    <div className="w-full mt-28 mb-10 md:ml-8  h-auto font-montserrat ">
      <div className="flex md:overflow-x-auto justify-between lg:overflow-hidden overflow-x-auto items-center gap-8 w-full h-auto mb-10  text-[#5A5A5A] text-[16px] ">
        <div className="flex items-center justify-start gap-6 md:gap-6 lg:gap-6 w-full md:mr-10 " >
           {loading && <LoadingPage />}
          {searchLoading && <LoadingPage />}

          {/* Filter Section */}
        
          <div className="relative">
                     <div
                      
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
                 </div>
                 </div>
               </div>
     
      <div className=" md:ml-4 lg:min-w-[1088px]  md:mr-10 lg:w-auto   lg:ml-0 ml-4  mr-2  font-montserrat lg:mr-8  h-auto rounded-[12px] lg:overflow-hidden bg-[#FFFFFF] shadow-customshadow4 border border-solid border-[#DCDCDC]">
      <div className="lg:overflow-x-hidden md:overflow-x-auto  overflow-x-auto mb-12 ">
  <table className="w-full   mt-2 ml-1">
    <thead className="bg-[#282828] w-full text-[#FFFFFF] h-[46px] font-bold text-[12px] text-left">
      <tr>
        {columns?.map((col, index) => (
          <th
            key={index}
            className={`pl-10 py-2 ${
              index === 0 ? 'rounded-tl-[18px] rounded-bl-[18px]' : ''
            } ${index === columns.length - 1 ? 'rounded-tr-[18px] rounded-br-[18px]' : ''}`}
          >
            {col.name}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {bvnMisMatches?.mismatches?.length > 0 &&
  bvnMisMatches.mismatches.map((row: any) => (
        <tr key={row.id} className="text-[15px]  font-medium text-left">
          {columns.map((col, index) => (
            <td
              key={index}
              className={`pl-10 pt-7 pb-4 border-b ${row.resolved ? 'bg-[#F4F4F4]' : 'bg-[#FFDDCA]'} font-montserrat border-[#FFFFFF] mb-1 relative text-left`}
            >
              {col.name === 'ACTIONS' ? (
                <div className="flex justify-start cursor-pointer items-center w-full gap-1">
                    <RiArrowDownSLine
                    onClick={() => {
                        setIdToChange(row.user_id);
                        toggleOpenPassModal();
                    }} 
                    className='text-3xl'/>
                  <Image
                    onClick={async () => {
                      if (searchLoading) return; // prevent double click
                      await fetchCustomers(row?.user_phone_number);
                      toggleLoanSideSlide();
                    }}
                    src="/images/blueuser.png"
                    width={14}
                    height={20}
                    alt="Action"
                    className={`cursor-pointer`}
                  />
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
 {openPassModal && (
  <>
    <div
      className="fixed inset-0 bg-black bg-opacity-20 z-40 w-full"
      onClick={(e) => {
        e.stopPropagation();
        setResolved(false);
        setMarkAsRead(false);
        setIdToChange('');
        toggleOpenPassModal();
      }}
    ></div>
    <div 
      onClick={(e) => e.stopPropagation()} 
      className="fixed top-1/2 right-[10px] transform -translate-x-1/2 -translate-y-1/2 p-4 w-[182px] min-h-[136px] bg-white text-[14px] rounded-[12px] shadow-lg z-50"

    >
      {/* radio + amount input */}
     
      <div className='flex justify-start gap-2 mb-2'>
        
      <div className="">
        <input
          type="radio"
          id="markAsRead"
          name="markAsRead"
          value="markAsRead"
          checked={markAsRead}
          onChange={() => {
            setResolved(false);
           toggleMarkAsRead();
          }}
          className="mr-2 accent-[#038FC1] w-[20px] h-[20px]"
        />
         </div>
          <label htmlFor="markAsRead" className=" text-[#5A5A5A] font-medium">Mark as seen</label>
      </div>
      {/* second */}
         <div className='flex justify-start gap-2'>
       
      <div className="">
        <input
          type="radio"
          id="resolved"
          name="resolved"
          value="resolved"
          checked={resolved}
          onChange={() => {
            setMarkAsRead(false);
          toggleResolved();
          }}
          className="mr-2 accent-[#038FC1] w-[20px] h-[20px]"
        />
         </div>
           <label htmlFor="markAsRead" className=" text-[#5A5A5A] mb-2 font-medium">Pass user</label>
      </div>
       <button
        onClick={resolveOrMarkAsSeen}
        className="bg-[#111111]  disabled:opacity-45 w-[161px] h-[37px] mt-2 items-center rounded-[22px] text-white font-semibold flex justify-center text-[15px] "
        disabled={!resolved && !markAsRead && !idToChange && loading}
      >
        {loading ? 'Updating...' : 'Update'}
      </button>
      </div>
  </>
)}

{lastPage > 1  && (
    <div className="lg:pl-14 md:pl-2 pl-4 pt-6 mb-8">
      <Paginate
        lastPage={lastPage}
        currentPage={page}
        onPageChange={handlePageChange}
       
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
            />
          </div>
        )}
        
      </div>
     

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
                        isOpen={!loanExiting}
                        toggleLoanSlide={toggleLoanSideSlide}
                        isExiting={loanExiting}
                        toggleType={'user'}
                        user={customer}
                        bvnSlide={true}
                
                
                        />
                      )}

       
    </div>
  );
};

export default MismatchTable;
