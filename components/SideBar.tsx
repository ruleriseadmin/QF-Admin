'use client'
import React , {useEffect} from 'react'
import Image from 'next/image'
import { usePathname,useRouter } from 'next/navigation'
import Link from 'next/link'
import SlideActivity from './activity/SlideActivity'
import { useState } from 'react'
import { TiArrowSortedDown,TiArrowSortedUp } from "react-icons/ti";
import DisputeModal from './dispute/DisputeModal'
import apiClient from '@/utils/apiClient';

const SideBar = () => {
  const [openActivity, setOpenActivty] = useState(false)
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [showCreditBureauDropdown, setShowCreditBureauDropdown] = useState(false)
  const [displaySettings, setDisplaySettings] = useState('website-cms')
  const [disputes, setDisputes] = useState([])
  const path = usePathname()
  const [isDispute,setIsDispute] = useState(false)
  const [openDisputeModal,setOpenDisputeModal] = useState(false)
  const isActive = (pathname:string) => {
    return pathname === path ? 'bg-[#E1E3E442] font-bold border border-[#E1E3E442] w-11/12 mx-auto rounded-[8px] h-[35px]' :  ''
  }

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
 

  //toggle open dispute modal
   const toggleOpenDisputeModal = () => {
    if (openDisputeModal) {
      setIsExiting(true);
      setTimeout(() => {
        setOpenDisputeModal(false);
        setIsExiting(false);
      }, 300); // Match animation duration
    } else {
      setOpenDisputeModal(true);
    }
  };

  useEffect(() => {
    const fetchDispute = async () => {
      try {
        const response = await apiClient.get('/paystack/disputes');
        setDisputes(response?.data?.data?.disputes || ''); 
        response?.data?.data?.disputes.find((item:any) => item.status === 'awaiting-merchant-feedback') ? setIsDispute(true) : setIsDispute(false)
  
      } catch (error) {
        console.error('Error fetching dispute status:', error);
      }
    };
  
    fetchDispute();
  }, []);
  
  

  return (
    <div className=' h-screen  fixed    overflow-hidden  font-montserrat z-10'>
      <div className='z-10 h-full '>
  <div className="lg:w-[223px] md:w-[223px] rounded-[12px] my-1 ml-1 mr-3 min-h-[191px] h-auto pb-2   bg-[#282828]">
  <div className="flex ml-3 pt-4 justify-start items-center">
    <Image src="/images/icon.png" alt="Logo" width={114} height={46}  />
    
  </div>
  <div className="mt-6">
    <button
  onClick={() => {
   toggleOpenDisputeModal()
  }}
  className={`flex items-center w-10/12 rounded-[32px] ${isDispute ? 'bg-[#D06F20]' : 'bg-[#E1E3E442]'} border border-solid border-[#FFFFFF26] h-[48px]  justify-start mx-4 mb-4 `}
>
    <Image 
      src={`/images/${isDispute ? 'opendispute.png' : 'closeddispute.png'}`}
      alt="dispute" 
      width={44} 
      height={44} 
      className=""
    />
 
  <p className="text-[#EEEEEE] text-[15px] leading-none">{isDispute ? 'New Dispute' : 'No Dispute'}</p>
</button>

  <button
  onClick={toggleActivity}
  className={`flex items-center h-[30px] gap-2 justify-start mx-4 mb-4 ${openActivity ? 'bg-[#E1E3E442] font-bold border border-[#E1E3E442] w-11/12 mx-auto rounded-[8px] h-[35px]' : ''}`}
>
<div
  className={`${
    openActivity ? 'bg-[#E1E3E442]' : 'bg-[#E1E3E442]'
  } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
>
    <Image 
      src="/images/activity.png" 
      alt="Sidebar" 
      width={20} 
      height={20} 
      className=""
    />
  </div>
  <p className="text-[#EEEEEE] text-[15px] leading-none">Activity log</p>
</button>
  <Link
  href="/user"
  className={`flex items-center h-[30px] gap-2 justify-start mx-4 mb-4 ${isActive('/user')}`}
>
<div
  className={`${
    path === '/user' ? 'bg-[#E1E3E442]' : 'bg-[#E1E3E442]'
  } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
>
    <Image 
      src="/images/user.png" 
      alt="Sidebar" 
      width={20} 
      height={20} 
      className=""
    />
  </div>
  <p className="text-[#EEEEEE] text-[15px] leading-none">User Management</p>
</Link>
</div>

</div>

<div className="lg:w-[223px] md:w-[223px] h-[390px] overflow-y-auto   rounded-t-[12px]   my-1 ml-1 mr-3 bg-[#282828]">
  <div className='h-[8px]'></div>
  <Link
  href="/dashboard"
  className={`flex items-center h-[30px] gap-2 justify-start mx-4 mb-4 ${isActive('/dashboard')}`}
>
<div
  className={`${
    path === '/dashboard' ? 'bg-[#E1E3E442]' : 'bg-[#E1E3E442]'
  } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
>
    <Image 
      src="/images/dashboard.png" 
      alt="Sidebar" 
      width={20} 
      height={20} 
      className=""
    />
  </div>
  <p className="text-[#EEEEEE] text-[15px] leading-none">Dashboard</p>
</Link>

<Link
  href="/loans"
  className={`flex items-center h-[30px] gap-2 justify-start mx-4 mb-4 ${isActive('/loans')}`}
>
<div
  className={`${
    path === '/loans' ? 'bg-[#E1E3E442]' : 'bg-[#E1E3E442]'
  } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
>
    <Image 
      src="/images/loan.png" 
      alt="Sidebar" 
      width={20} 
      height={20} 
      className=""
    />
  </div>
  <p className="text-[#EEEEEE] text-[15px] leading-none">All Loans</p>
</Link>

<Link
  href="/analytics"
  className={`flex items-center h-[30px] gap-2 justify-start mx-4 mb-4 ${isActive('/analytics')}`}
>
<div
  className={`${
    path === '/analytics' ? 'bg-[#E1E3E442]' : 'bg-[#E1E3E442]'
  } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
>
    <Image 
      src="/images/analytics.png" 
      alt="Sidebar" 
      width={20} 
      height={20} 
      className=""
    />
  </div>
  <p className="text-[#EEEEEE] text-[15px] leading-none">Analytics</p>
</Link>


<div
  className={`flex flex-col mx-4 mb-4 ${ !showCustomerDropdown && (isActive('/customers') || isActive('/kyc'))}  ${showCustomerDropdown && 'bg-[#E1E3E442] rounded-[8px] '}`}
>
  {/* Top-level toggle row */}
  <div
    className={`flex  items-center h-[30px] gap-2 justify-start cursor-pointer`}
    onClick={() => setShowCustomerDropdown(prev => !prev)}
  >
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${
          path === '/customers' ||  path === '/kyc'||  showCustomerDropdown   ? 'bg-[#E1E3E442]' : 'bg-[#E1E3E442]'
        } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
      >
        <Image 
          src="/images/customer.png" 
          alt="Sidebar" 
          width={20} 
          height={20} 
        />
      </div>
    </div>

    <p className="text-[#EEEEEE] text-[14px] leading-none text-wrap">Customer Mgt.</p>

    {showCustomerDropdown ? (
      <TiArrowSortedUp className="text-[#EEEEEE] text-[18px] ml-auto" />
    ) : (
      <TiArrowSortedDown className="text-[#EEEEEE] text-[18px] ml-auto" />
    )}
  </div>

  {/* Dropdown section */}
  {showCustomerDropdown && (
    <div className="flex flex-col gap-1 font-normal pb-5 pl-10 pt-2">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/customers`);
          setShowCustomerDropdown(false);
        }}
        className={`text-[#EEEEEE] text-[14px] hover:font-bold text-start ${
          path === '/customers' ? 'font-bold' : ''
        }`}
      >
        All Customers
      </button>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/kyc`);
          setShowCustomerDropdown(false);
        }}
        className={`text-[#EEEEEE] hover:font-bold text-[14px] text-start mt-2 ${
         path === 'kyc' ? 'font-bold' : ''
        }`}
      >
        Manage KYC
      </button>
       <button 
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/blacklisted`);
          setShowCustomerDropdown(false);
        }}
        className={`text-[#EEEEEE] hover:font-bold text-[14px] text-start mt-2 ${
         path === 'blacklisted' ? 'font-bold' : ''
        }`}
      >
        Blacklisted
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/mismatch`);
          setShowCustomerDropdown(false);
        }}
        className={`text-[#EEEEEE] hover:font-bold text-[14px] text-start mt-2 ${
         path === 'mismatch' ? 'font-bold' : ''
        }`}
      >
        Bvn Mismatch
      </button>
    </div>
  )}
</div>


<Link
  href="/transactions"
  className={`flex items-center h-[30px] gap-2 justify-start mx-4 mb-4 ${isActive('/transactions')}`}
>
<div
  className={`${
    path === '/transactions' ? 'bg-[#E1E3E442]' : 'bg-[#E1E3E442]'
  } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
>
    <Image 
      src="/images/wallet.png" 
      alt="Sidebar" 
      width={20} 
      height={20} 
      className=""
    />
  </div>
  <p className="text-[#EEEEEE] text-[15px] leading-none">Transactions</p>
</Link>

<div
  className={`flex flex-col mx-4 mb-4 ${ !showCreditBureauDropdown && (isActive('/credit') || isActive('/history'))}  ${showCreditBureauDropdown && 'bg-[#E1E3E442] rounded-[8px] '}`}
>
  {/* Top-level toggle row */}
  <div
    className={`flex  items-center h-[30px] gap-2 justify-start cursor-pointer`}
    onClick={() => setShowCreditBureauDropdown(prev => !prev)}
  >
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${
          path === '/credit' ||  path === '/history'|| showCreditBureauDropdown   ? 'bg-[#E1E3E442]' : 'bg-[#E1E3E442]'
        } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
      >
        <Image 
          src="/images/credit.png" 
          alt="Sidebar" 
          width={20} 
          height={20} 
        />
      </div>
    </div>

    <p className="text-[#EEEEEE] text-[14px] leading-none text-wrap">Credit Bureau</p>

    {showCreditBureauDropdown ? (
      <TiArrowSortedUp className="text-[#EEEEEE] text-[18px] ml-auto" />
    ) : (
      <TiArrowSortedDown className="text-[#EEEEEE] text-[18px] ml-auto" />
    )}
  </div>

  {/* Dropdown section */}
  {showCreditBureauDropdown && (
    <div className="flex flex-col gap-1 font-normal pb-5 pl-10 pt-2">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/credit`);
          setShowCreditBureauDropdown(false);
        }}
        className={`text-[#EEEEEE] text-[14px] hover:font-bold text-start ${
          path === '/credit' ? 'font-bold' : ''
        }`}
      >
        New Hit
      </button>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/history`);
          setShowCreditBureauDropdown(false);
        }}
        className={`text-[#EEEEEE] hover:font-bold text-[14px] text-start mt-2 ${
         path === 'history' ? 'font-bold' : ''
        }`}
      >
        History
      </button>
    </div>
  )}
</div>

{/* <Link
  href="/dispute"
  className={`flex items-center h-[30px] gap-2 justify-start mx-4 mb-4 ${isActive('/dispute')}`}
>
<div
  className={`${
    path === '/dispute' ? 'bg-[#E1E3E442]' : 'bg-[#E1E3E442]'
  } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
>
    <Image 
      src="/images/settings.png" 
      alt="Sidebar" 
      width={20} 
      height={20} 
      className=""
    />
  </div>
  <p className="text-[#EEEEEE] text-[15px] leading-none">Dispute resolution</p>
</Link> */}


<button
  onClick={() => {
    router.push('/settings');
  }}
  className={`${
    showSettingsDropdown && path === '/settings'
      ? 'h-[110px]'
      : 'h-[30px]'
  } ${isActive('/settings')} flex flex-col gap-2 justify-start mx-4  relative`}
>
  <div className="flex items-center gap-2">
    <div
      className={`${
        path === '/settings' ? 'bg-[#E1E3E442]' : 'bg-[#E1E3E442]'
      } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
    >
      <Image 
        src="/images/settings.png" 
        alt="Sidebar" 
        width={20} 
        height={20} 
      />
    </div>  
    <p className="text-[#EEEEEE] text-[15px] leading-none">Settings</p>
    {!showSettingsDropdown ? (
      <TiArrowSortedDown
        onClick={(e) => {
          e.stopPropagation();
          setShowSettingsDropdown((prev) => !prev);
        }}
        className="text-[#EEEEEE] text-[18px] ml-10"
      />
    ) : (
      <TiArrowSortedUp
        onClick={(e) => {
          e.stopPropagation();
          setShowSettingsDropdown((prev) => !prev);
        }}
        className="text-[#EEEEEE] text-[18px] ml-10"
      />
    )}
  </div>
  {showSettingsDropdown && (
    <div className="flex flex-col gap-1 font-normal pb-5 pl-9">
      <button 
       onClick={(e) =>{ 
        e.stopPropagation();
        setDisplaySettings('loan-offers')
        router.push(`/settings?set=${encodeURIComponent('loan-offers')}`);
      }}
      className={`text-[#EEEEEE] mb-2 text-[13px] text-start ${displaySettings === 'loan-offers' ? 'font-bold' : ''}`}>
        Loan offers
      </button>
      <button 
      onClick={(e) =>{ 
        e.stopPropagation(); // Prevent the outer onClick from firing
        setDisplaySettings('app-configuration')
        router.push(`/settings?set=${encodeURIComponent('app-configuration')}`);
      }}
      className={`text-[#EEEEEE] mb-2 text-[13px] text-start ${displaySettings === 'app-configuration' ? 'font-bold' : ''}`}>
      App configuration
      </button>
      <button 
       onClick={(e) =>{ 
        e.stopPropagation();
        setDisplaySettings('website-cms')
        router.push(`/settings?set=${encodeURIComponent('website-cms')}`);} } 
      className={`text-[#EEEEEE] mb-2 text-[13px] text-start  ${displaySettings === 'website-cms' ? 'font-bold' : ''}`}>
      Website CMS
      </button>
    </div>
  )}
</button>


{/* Dropdown Links */}


</div>
{
  openActivity && (
    <SlideActivity 
    isOpen={!isExiting}
    toggleActivity={toggleActivity}
    isExiting={isExiting}
    />
  )
}

    </div>
      {openDisputeModal && (
            <DisputeModal
            isOpen={!isExiting}
            toggleLoanSlide={toggleOpenDisputeModal}
            isExiting={isExiting}
            disputes={disputes}
            />
          )}
    
    </div>
  )
}

export default SideBar