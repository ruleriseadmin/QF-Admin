'use client';
import React, { useState ,useEffect} from 'react';
import Image from 'next/image';
import { IoSearchSharp } from "react-icons/io5";
import Paginate from '../dashboard/Paginate';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { RiArrowDownSLine } from "react-icons/ri";
import LoanSlide from '../allloans/LoanSlide';
import { useSearchParams,useRouter } from 'next/navigation';
import apiClient from '@/utils/apiClient'
import Notification from '@/components/Notification'
import LoadingPage from '@/app/loading';
import { FaTimes } from 'react-icons/fa';
import { formatDate} from '@/utils/loan';
import { BsThreeDots } from 'react-icons/bs';




const ViewOfferTable: React.FC = () => {
const router = useRouter();
const [refetch,setRefetch] = useState(false);
const [error, setError] = useState('');
const [idToChange, setIdToChange] = useState('');
const [notificationOpen, setNotificationOpen] = useState(false);
const [searchLoading, setSearchLoading] = useState(false);
const [openLoanSlide, setOpenLoanSlide] = useState(false)
const [loading, setLoading] = useState(false);
const [loanExiting, setLoanExiting] = useState(false)
const [downloadExcel, setDownloadExcel] = useState(false);
const [triggerSearch, setTriggerSearch] = useState(false);
const [toggleType, setToggleType] = useState('');
  const [user, setUser] = useState<any>(null);
   const [selectedRows, setSelectedRows] = useState<any[]>([]);
const [views, setViews] = useState<any>({});
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(0);
const [searchWord, setSearchWord] = useState('');
const [openSelection, setOpenSelection] = useState(false);
const [selectedSelection, setSelectedSelection] = useState('All');
const [selectedSort, setSelectedSort] = useState('new');
const searchParams = useSearchParams();
const start = searchParams.get('start') 
const end = searchParams.get('end')
const [searchDate, setSearchDate] = useState({
  startDate: '',
  endDate: ''
});


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
    const fetchViews = async () => {
    
       const controller = new AbortController();
        const queryObj: Record<string, string> = { 
          page: String(page), 
          per_page: String(itemsPerPage),
         
        };
         if (triggerSearch && searchWord ) {
          queryObj.search = searchWord;
        }
       
        if(selectedSelection && selectedSelection !== 'All'){
            queryObj.search_date_range = selectedSelection
        }
         if (searchDate.startDate && searchDate.endDate) {
          queryObj.search_date_range = `${searchDate.startDate}${' - '}${searchDate.endDate}`;
        }
         if (selectedSort === 'old') {
          queryObj.sort_direction = 'asc';
        }
        if (selectedSort === 'new') {
          queryObj.sort_direction = 'desc';
        }
        const queryString = new URLSearchParams(queryObj).toString();
      try {
        setLoading(true);
        const response = await apiClient.get(`/loan/see_offer_views?${queryString}`);
        setViews(response?.data?.data || []);
        setTotalItems(response?.data?.data?.total_items || 0);
        setLastPage(response?.data?.data?.last_page || 0);
       
  
      } catch (error) {
        console.error('Error fetching offer:', error);
      }finally{
        setLoading(false);
      }
    };
  
    fetchViews();
  }, [page, itemsPerPage,triggerSearch,searchDate,selectedSelection, refetch,selectedSort]);


  

  const toggleNotification = () => setNotificationOpen(!notificationOpen);

  
 
  const columns = [
      { name: 'OFFER CREATED AT', cell: (row: any) => `${formatDate(row.offer_created_at)}` },
      { name: 'FULL NAME', selector: 'full_name' },
      { name: 'PHONE NO', selector: 'phone_number' },
       { name: 'HIGHEST POSSIBLE OFFER', selector: 'loan_offer' },
      { name: 'MANDATE', cell: (row: any) => row.mandate ? 'COMPLETE' : 'PENDING' },
      { name: 'ACTIONS', selector: 'actions' },
    ];
const toggleSelection = () => {
    setOpenSelection(!openSelection);
  };
 const selection = [
    { name: 'All', value: 'All' },
    { name: 'Today',value: 'today' },
    { name: 'Yesterday',value: 'yesterday' },
    { name: 'This week',value: 'this_week' },
    { name: 'This month',value: 'this_month' },
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
            Sortby : {selection.find((select) => select.value === selectedSelection)?.name || 'All' }
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
            className="absolute lg:top-[230px] lg:left-[258px] md:top-[592px] md:left-[232px] left-[51px] w-[229px] min-h-[138px] h-auto bg-white rounded-xl shadow-lg font-montserrat font-medium z-50" // Ensure dropdown appears above the overlay
          >
            {selection.map((select: any, index: number) => (
              <button
                key={index}
                onClick={() => {
       setSelectedSelection(select.value);
      setOpenSelection(false); // Close dropdown after selection
    }}
                className={`w-full text-start ml-4 text-[14px] text-[#282828] ${index === 0 ? 'mt-4' : 'mt-2'}`}
              >
                <div className="flex justify-start text-[#282828] items-center font-medium gap-6">
                  <p>{select.name} Views</p>
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
      {views?.loan_offer?.length > 0 &&
  views.loan_offer.map((row: any,index:number) => (
        <tr key={index} className="text-[15px]  font-medium text-left">
          {columns.map((col, index) => (
            <td
              key={index}
              className={`pl-10 pt-7 pb-4 border-b  font-montserrat  relative text-left`}
            >
              {col.name === 'ACTIONS' ? (
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
                                        selectedRows.length === views.length ? 'opacity-50' : ''
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
                                        selectedRows.length === views.length ? 'opacity-50' : ''
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
                                      selectedRows.length === views.length ? 'opacity-50' : ''
                                    }`}
                                  />
                                  )}
                                 
                                </div>
              )  : col.cell ? (
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
                         toggleType={toggleType}
                        user={user}
                        
                
                
                        />
                      )}

       
    </div>
  );
};

export default ViewOfferTable;
