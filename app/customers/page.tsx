'use client'
import React,{useState,useEffect} from 'react'
import SideBar from '@/components/SideBar'
import Header from '@/components/dashboard/Header'
import SmallScreenSidebar from '@/components/SlideSideBar'
import CustomerHero from '@/components/customer/CustomerHero'
import CustomerTable from '@/components/customer/CustomerTable'
import { withAuth } from '@/components/auth/EnsureLogin'
import Notification from '@/components/Notification';
import LoadingPage from '@/app/loading';
import { useRouter,useSearchParams } from 'next/navigation';



const Page = () => {
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
       
    }, [status, title, message, subMessage, router]);
    
  //clear query params
  useEffect(() => {
    if (status || title || message || subMessage ) { 
      router.replace(window.location.pathname);
    }
  }, [status, title, message]);
    
    
      //toggle notification
      const toggleNotification = () => {
        setNotificationOpen(!notificationOpen);
      };
    
    

 
 
  return (
    <div className="grid grid-cols-12 min-h-screen w-full h-auto overflow-y-auto overflow-x-hidden bg-[#F8F8F8]">
      {/* Sidebar - Hidden on small screens */}
      <div className="hidden lg:block md:block lg:col-span-2 md:col-span-3 lg:w-[238px] h-auto bg-white shadow-custom1">
        <SideBar />
      </div>
      <div className="block lg:hidden md:hidden col-span-1 h-full bg-white shadow-custom1">
        <SmallScreenSidebar />
      </div>
    {/* Main Content */}
    <div className="lg:col-span-10 w-full  md:col-span-9 col-span-11">
        <Header />
        <CustomerHero />
      <CustomerTable 
      />
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