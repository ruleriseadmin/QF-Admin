'use client';
import { useEffect, useState } from 'react';
import SideBar from '@/components/SideBar';
import Header from '@/components/dashboard/Header';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import MainCards from '@/components/dashboard/MainCards';
import MainCards2 from '@/components/dashboard/MainCard2';
import LastCards from '@/components/dashboard/LastCards';
import MainCards3 from '@/components/dashboard/MainCards3';
import MainCards4 from '@/components/dashboard/MainCards4';
import BlackCards from '@/components/dashboard/BlackCard';
import Table from '@/components/dashboard/LoanUsers';
import SmallScreenSidebar from '@/components/SlideSideBar';
import { withAuth } from '@/components/auth/EnsureLogin';
import Notification from '@/components/Notification';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingPage from '../loading';
import apiClient from '@/utils/apiClient';

const Page = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
const [stats,setStats] = useState([])
  const title = searchParams.get('title') || '';
  const message = searchParams.get('message') || '';
  const subMessage = searchParams.get('subMessage') || '';
  const status = searchParams.get('status') || '';
  const startSearch = searchParams.get('start') || '';
  const endSearch = searchParams.get('end') || '';
  const reset = searchParams.get('reset') || '';
  const all = searchParams.get('all') || '';
  const [cardView, setCardView] = useState('none');
  const [welcomeStats,setWelcomeStat] = useState({})


  const [notificationData, setNotificationData] = useState({
    status: '',
    title: '',
    message: '',
    subMessage: '',
  });

  // Notification logic
  useEffect(() => {
    if (message || subMessage) {
      setNotificationData({ status, title, message, subMessage });
      setNotificationOpen(true);
    }
  }, [status, title, message, subMessage, router]);

  useEffect(() => {
    if (status || title || message || subMessage) {
      router.replace(window.location.pathname);
    }
  }, [status, title, message]);

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  useEffect(() => {
    if(all) setCardView('none')
    if (reset ) {
        setCardView('none');
        router.replace(window.location.pathname);
      }
    }, [ reset,all]);
  
  

  // Trigger fetch when startSearch or endSearch changes
useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/stats?start_date=${startSearch}&end_date=${endSearch}`
      );
      setStats(response?.data?.data?.subsection_cards || []);
      setWelcomeStat(response?.data?.data)
    } catch (error:any) {
      console.error(error);
      if (error.message !== 'canceled' || error.name !== 'CanceledError') {
          setError(error?.response?.data?.message ||error?.message || 'An error occurred, please try again');
          setNotificationOpen(true);
        }
      
    } finally {
      setLoading(false);
    }
  };
    fetchStats();
}, [startSearch, endSearch]);

  return (
    <div className="grid grid-cols-12 min-h-screen w-full  h-auto  bg-[#F8F8F8]">
      <div className=" hidden lg:block  md:block lg:col-span-2 md:col-span-3 lg:w-[238px] md:w-[230px] h-screen  bg-white shadow-custom1">
        <SideBar />
      </div>
      <div className="block lg:hidden md:hidden col-span-1 h-full bg-white shadow-custom1">
        <SmallScreenSidebar />
      </div>
     

      <div className="col-span-11 lg:col-span-10 md:col-span-9">
        <Header />
       <WelcomeCard stats={welcomeStats}/>
        <MainCards stats={stats} setCardView={setCardView} cardView={cardView} loading={loading}/>
        <MainCards2 stats={stats} setCardView={setCardView} cardView={cardView} loading={loading}/>
        <MainCards3 stats={stats} setCardView={setCardView} cardView={cardView} loading={loading}/>
        <MainCards4 stats={stats} setCardView={setCardView} cardView={cardView} loading={loading}/>
        <BlackCards stats={stats} setCardView={setCardView} cardView={cardView} loading={loading}/>
        <LastCards stats={stats} setCardView={setCardView} cardView={cardView} loading={loading}/>
        <Table />
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
  );
};

export default withAuth(Page);

