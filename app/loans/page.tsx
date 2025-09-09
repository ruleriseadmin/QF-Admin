'use client'
import {useState,useEffect} from 'react'
import SideBar from '@/components/SideBar'
import Header from '@/components/dashboard/Header'
import LoanHero from '@/components/allloans/LoanHero'
import LoanTable from '@/components/allloans/LoanTable'
import SmallScreenSidebar from '@/components/SlideSideBar'
import { withAuth } from '@/components/auth/EnsureLogin'
import Notification from '@/components/Notification';
import LoadingPage from '@/app/loading';
import { useRouter,useSearchParams } from 'next/navigation';



 const Page = () => {
  const [openDropdown, setOpenDropdown] = useState(false)
  const [error, setError] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const title = searchParams.get('title') || '';
  const message = searchParams.get('message') || '';
  const subMessage = searchParams.get('subMessage') || '';
  const status = searchParams.get('status') || '';

  const [notificationData, setNotificationData] = useState({
    status: '',
    title: '',
    message: '',
    subMessage: '',
  });

  useEffect(() => {
    if (message || subMessage) {
      setNotificationData({ status, title, message, subMessage });
      setNotificationOpen(true);
    }
       // Delay clearing query params
    const timeout = setTimeout(() => {
      router.replace(window.location.pathname);
    }, 1000); // Delay for 1 second
  
    // Cleanup timeout on unmount or rerender
    return () => clearTimeout(timeout);
  }, [status, title, message, subMessage, router]);
  

  
  
    //toggle notification
    const toggleNotification = () => {
      setNotificationOpen(!notificationOpen);
    };
  
  
  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown)
  }

  return (
    <div className={`grid grid-cols-12  w-full  ${openDropdown ? '' : 'min-h-screen h-auto'} overflow-y-auto bg-[#F8F8F8] overflow-x-hidden`}>
      {/* Sidebar - Hidden on small screens */}
      <div className="hidden lg:block md:block lg:col-span-2 md:col-span-3 lg:w-[238px] h-auto bg-white shadow-custom1">
        <SideBar />
      </div>
      <div className="block lg:hidden md:hidden col-span-1 h-full bg-white shadow-custom1">
        <SmallScreenSidebar />
      </div>
    {/* Main Content */}
    <div className="lg:col-span-10 md:col-span-9 col-span-11">
        <Header />
        <LoanHero />
        <LoanTable toggleDropDown={toggleDropdown}/>
      </div>

      {notificationOpen && (
        <Notification
          toggleNotification={toggleNotification}
          isOpen={notificationOpen}
          status={notificationData.status || 'error'}
          title={notificationData.title || ''}
          message={notificationData.message || error}
          subMessage={notificationData.subMessage}
        />
      )}
    </div>
  )
}

export default withAuth(Page);