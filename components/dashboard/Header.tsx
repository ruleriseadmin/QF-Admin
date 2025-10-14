'use client'
import {useState,useEffect} from 'react'
import Image from 'next/image'
import { TiArrowSortedDown } from "react-icons/ti";
import { LuRefreshCw } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import LoadingPage from '@/app/loading';
import apiClient from '@/utils/apiClient';
import {  clearToken } from '../../utils/protect';
import Notification from '../Notification';
import { useRouter } from 'next/navigation';
import SlideActivity from '../activity/SlideActivity';
import { subDays } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import BvnMismatchModal from './BvnMismatchModal';




const Header = () => {
    const [openProfile, setOpenProfile] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [disburse,setDisburse] = useState('');
    const [openActivity, setOpenActivty] = useState(false)
    const [openMismatch, setOpenMismatch] = useState(false)
    const [bvnExiting, setBvnExiting] = useState(false)
    const [isExiting, setIsExiting] = useState(false)
    const profile: any = JSON.parse(localStorage.getItem('profile') || '{}');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [bvnMisMatches, setBvnMisMatches] = useState<any>({});
  const [isMismatch, setIsMismatch] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  })

  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

 // Handle the date range change from the calendar
 const handleDateRangeChange = (range: any) => {
  if (range?.from && range?.to) {
    if(range.from === 'reset' && range.to === 'reset'){
      setStartDate('');
      setEndDate('');
    
      router.push(`${window.location.pathname}?reset=true`);
     
    }else{
      setStartDate(formatDate(range.from));
    setEndDate(formatDate(range.to));
    setDateRange(range);
    if(dateRange && window.location.pathname !== '/analytics'){
    router.push(`${window.location.pathname}?start=${formatDate(startDate)}&end=${formatDate(endDate)}`);
  

    }
    
    }
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
        const queryString = new URLSearchParams(queryObj).toString();
      try {
        setLoading(true);
        const response = await apiClient.get(`/customer/verification_mismatches?${queryString}`);
        setBvnMisMatches(response?.data?.data|| '');
        setTotalItems(response?.data?.data?.total_items || 0);
        setLastPage(response?.data?.data?.last_page || 0);
        if(response?.data?.data?.mismatches.length > 0){
          setIsMismatch(true)
        }
  
      } catch (error) {
        console.error('Error fetching bvn mismatch status:', error);
      }finally{
        setLoading(false);
      }
    };
  
    fetchBvnMisMatch();
  }, [page]);


//always send the date range to the URL
 useEffect(() => {
    if (startDate && endDate && window.location.pathname === '/dashboard') {
      router.push(`${window.location.pathname}?start=${formatDate(startDate)}&end=${formatDate(endDate)}&all=true`);
    }

    else if(startDate && endDate && window.location.pathname !== '/analytics'){
      router.push(`${window.location.pathname}?start=${formatDate(startDate)}&end=${formatDate(endDate)}`);
      
    }
  },[startDate,endDate])




//reset the date range to the default 7 days
const resetDateRange = () => {
  if (window.location.pathname === '/dashboard') {
    router.push(`${window.location.pathname}?reset=true`)
    return;
    }
  const newStartDate = new Date(2024, 0, 1);
  const newEndDate = new Date();

  setDateRange({
    from: newStartDate,
    to: newEndDate,
  });

  setStartDate(formatDate(newStartDate));
  setEndDate(formatDate(newEndDate));

  // Reset the query params in the URL
  const queryParams = new URLSearchParams();
 
    queryParams.set('start', formatDate(newStartDate));
    queryParams.set('end', formatDate(newEndDate));
  router.push(`${window.location.pathname}?${queryParams.toString()}`);
};




      const toggleActivity = () => {
        if (openActivity) {
          setIsExiting(true);
          setTimeout(() => {
            setOpenActivty(false);
            setIsExiting(false);
          }, 300); // Match animation duration
        } else {
          setOpenActivty(true);
        }
      };

     const toggleMismatch = () => {
        if (openMismatch) {
          setBvnExiting(true);
          setTimeout(() => {
            setOpenMismatch(false);
            setBvnExiting(false);
          }, 300); // Match animation duration
        } else {
          setOpenMismatch(true);
        }
      };
    

    // Toggle contact form
  const toggleContact = () => {
    setOpenProfile(!openProfile);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);

     const res =  await apiClient.post(
        `/auth/admin/logout`,
        {}
      );
      clearToken();
      router.push('/');
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setError(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'An error occurred, please try again'
      );
      setNotificationOpen(true);
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchDisbursementStatus = async () => {
    try {
      const response = await apiClient.get('/settings');

      const disbursementSetting = response?.data?.data?.find(
  (setting: any) => setting.key === 'disbursment'
);
      setDisburse(disbursementSetting.value || 'off'); 

    } catch (error) {
      console.error('Error fetching disbursement status:', error);
    }
  };

  fetchDisbursementStatus();
}, []);


  const handleSubmit = async () => {
        try {
          setLoading(true);
          const response = await apiClient.post('/settings', {
           key:'disbursment',
           value: disburse === 'on' ? 'off' : 'on',
           type:'string'
          });
         const disbursementSetting = response?.data?.data?.value
         
        setDisburse(disbursementSetting);
        setLoading(false)
        } catch (error:any) {
          console.error(error);
          setError(error?.response?.data?.message || 'An error occurred, please try again');
          setNotificationOpen(true);
          setLoading(false);
        }
      };
    

      
  return (
    <div className='mt-4 font-montserrat md:ml-8 lg:mx-6 mr-2 ml-3'>
        <div className='flex justify-between  items-center '>
            <div className='flex justify-center  items-center'>
<div className="flex items-center bg-[#E1E3E4] rounded-full lg:w-[411px] md:w-[331px] w-[260px] h-[48px]  md:ml-2 md:px-2">
  {/* Left Section */}
  <div className="flex items-center flex-grow lg:ml-4 ml-2">
    <Image
      src="/images/calendar-2.png"
      alt="Logo"
      width={18}
      height={18}
    />
   <p className="ml-2 lg:text-[16px] md:text-[14px] text-[12px] text-[#282828] font-medium">
  <span className='font-semibold'>Lifetime - </span>
  {formatDate(startDate || new Date(2024, 0, 1))} - {formatDate(endDate || new Date())}
</p>

  </div>
  {/* Right Section */}
  <button
   onClick={() => setIsCalendarOpen((prev) => !prev)}
   disabled={window.location.pathname === '/analytics'}
  >
    <TiArrowSortedDown className="text-[#828282] text-[18px] lg:mr-4" />
  </button>
</div>
<button
disabled={window.location.pathname === '/analytics'}
onClick={resetDateRange}
>
<LuRefreshCw className="text-[#282828] text-[16px] lg:ml-6 md:ml-1" />
</button>
</div>
{isCalendarOpen && (
  <>
    {/* Background Overlay */}
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
    ></div>

    {/* Calendar Dropdown */}
    <div className="absolute top-24  lg:left-96  bg-[#FFFFFF]  shadow-md rounded-md p-4 z-50">
    <Calendar
      mode="range"
      selected={dateRange}
      onSelect={handleDateRangeChange}
      defaultMonth={dateRange?.from || new Date()}
      numberOfMonths={2}
      className="" // You can add a class name here if needed
      classNames={{}} // You can also pass custom classNames if required
    />
                  
    </div>
  </>
)}


{/* Right Section */}
{loading && <LoadingPage />}
<div className="flex items-center justify-between gap-6 h-[48px]  ">
  {/* Left Section */}
 
    <div 
  onClick={() => setOpenMismatch(true)}
  className=" items-center cursor-pointer text-nowrap lg:w-7/12 md:w-[115px] lg:flex md:hidden hidden">
    <Image
      src={`${isMismatch ? '/images/misMatch.png' : '/images/noMisMatch.png'}`}
      alt="Logo"
      width={20}
      height={20}
    />
    <p className={`lg:ml-2 lg:text-[15px] font-semibold md:text-[14px] ${isMismatch ? 'text-[#C73802]' : 'text-[#828282]'}`}>{`You have (${bvnMisMatches?.mismatches?.length}) mismatch case${bvnMisMatches?.mismatches?.length > 1 ? 's' : ''}`}</p>

  </div>
  
  <div className=" items-center lg:w-[123px] md:w-[115px] lg:flex md:hidden hidden">
    <Image
      src="/images/lang.png"
      alt="Logo"
      width={36}
      height={36}
    />
    <p className="lg:ml-2 lg:text-[16px] md:text-[14px]">English</p>
    <button>
    <TiArrowSortedDown className="text-[#828282] text-[18px]" />
  </button>
  </div>

 <div className='flex justify-center items-center lg:gap-3 md:gap-1'>
   
    <button
    onClick={toggleContact}
    >
    <BsThreeDots className="text-[#5A5A5A] text-[28px]" />
  </button>

 </div>
</div>
{openProfile && (
          <>
            <div
              className="fixed inset-0 bg-black opacity-20 z-40"
              onClick={() => setOpenProfile(false)}
            ></div>

            <div className=" absolute top-[65px] right-3 w-[243px] min-h-[207px] h-auto bg-[#FFFFFF] rounded-xl shadow-lg flex flex-col items-start font-outfit font-medium py-4 z-50">
            <div className='mx-4'>
            <div className='flex items-center gap-1'>
           
<p className='text-[#282828] text-[15px] leading-4 font-semibold'>{profile ? profile.first_name : '' } <br/> <span className='text-[13px] font-light text-[#5A5A5A] '>{profile ? profile.email : '' }</span></p>
</div>
<div className='mt-6'>
  
  <button className='flex items-center gap-2 mb-4'>
            <Image
      src="/images/profile.png"
      alt="Logo"
      width={30}
      height={30}
    />
<p className='text-[#282828] text-[15px] '>My profile </p>
  </button>

<button 
className='flex items-center gap-2 mb-4'
onClick={() => {
  toggleActivity();
  setOpenProfile(false);
}}
>
    <Image
      src="/images/log.png"
      alt="Logo"
      width={30}
      height={30}
    />
<p className='text-[#282828] text-[15px]  '>Activity log </p>
</button>
<button>
<div 
className='flex items-center gap-2 mb-4'
onClick={handleLogout}
>
            <Image
      src="/images/logout.png"
      alt="Logo"
      width={30}
      height={30}
    />
<p className='text-[#282828] text-[15px] leading-4 '>Log out </p>
</div>

</button>
<div className={`flex items-center gap-2 mb-4 `}>
  <div
    className={`relative w-[44px] h-[24px] rounded-full cursor-pointer transition-colors ${
      disburse === 'on' ? 'bg-[#3173F3]' : 'bg-[#5A5A5A]'
    } `}
    onClick={() => {
        handleSubmit();
    }}
  >
    <button
      className={`absolute disabled:cursor-not-allowed top-1 left-1 h-[18px] w-[18px] bg-[#FFFFFF] rounded-full transition-transform ${
        disburse === 'on' ? 'translate-x-5' : ''
      }`}
    ></button>
  </div>

  <p className='text-[#282828] text-[15px] leading-4'>Disburse</p>
</div>



</div>

            </div>
             
             
            </div>
          </>
        )}

</div>
{notificationOpen && (
        <Notification
          status="error"
          title="Oops!"
          message={error}
          toggleNotification={toggleNotification}
          isOpen={notificationOpen}
          
        />
      )}

{
  openActivity && (
    <SlideActivity 
    isOpen={!isExiting}
    toggleActivity={toggleActivity}
    isExiting={isExiting}
    />
  )
}
{  openMismatch && (
    <BvnMismatchModal 
    isOpen={!bvnExiting}
    toggleMismatch={toggleMismatch}
    isExiting={bvnExiting}
    bvnArray={bvnMisMatches}
    lastPage={lastPage}
    page={page}
    handlePageChange={handlePageChange}
    itemsPerPage={itemsPerPage}
    totalItems={totalItems || 0}
    loading={loading}
    />
  )
}


        </div>

    
  )
}

export default Header