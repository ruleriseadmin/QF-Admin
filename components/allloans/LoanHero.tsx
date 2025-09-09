import React from 'react';
import Image from 'next/image';
import apiClient from '@/utils/apiClient';
import Notification from '../Notification';
import { useState,useEffect } from 'react';
import { formatValue } from '@/utils/loan';

const LoanHero = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loanData, setLoanData] = useState([]);


  //get loan stat
  useEffect(() => {
    const fetchLoanStat = async () => {
      try {
        const response = await apiClient.get(
          `/loan/stats`
        );

        setLoanData(response?.data?.data || []);

      } catch (error: any) {
        setError(error?.response?.data?.message || 'An error occurred, please try again');
        setNotificationOpen(true);
      }
    };

    fetchLoanStat();
  }, []);


  //toggle notification
  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const colors = ['#E6EAE8','#EEDADA','#FFFDEF','#FFFFFF'];

// Define your preferred custom order
const preferredOrder = ['OPEN', 'OVERDUE', 'CLOSED', 'FAILED'];

const displayData = Object.entries(loanData)
  .filter(([key]) => preferredOrder.some(status => key.includes(status)))
  .sort(([aKey], [bKey]) => {
    const aIndex = preferredOrder.findIndex(status => aKey.includes(status));
    const bIndex = preferredOrder.findIndex(status => bKey.includes(status));
    return aIndex - bIndex;
  })
  .map(([key, value], index) => {
    const formattedKey = key.charAt(0) + key.slice(1).toLowerCase();
    return {
      key: formattedKey,
      value,
      color: colors[index % colors.length]
    };
  });






  return (
    <div className=" lg:ml-8 ml-4 mr-2 md:ml-11 mt-12 h-auto font-montserrat ">
      <p className="font-bold text-[24px]  text-[#282828] tracking-wide ">All Loans</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 w-full h-auto mt-6">
  {displayData.map((loan,index) => (
    <div
      key={index}
      className="min-h-[123px]  w-full flex flex-col gap-6 h-auto shadow-customshadow5 rounded-[12px] px-5 py-3"
      style={{ backgroundColor: loan.color }}
    >
        <div className='flex justify-between items-center'>
            <>
            <p className="text-[16px] text-[#5A5A5A] font-medium">{loan.key} loans</p>
        <Image
      src="/images/calendar.png"
      alt="Logo"
      width={18}
      height={18}
    />
            </>
       

        </div>
      
      <p className="text-[22px] text-[#323232] font-black">{formatValue(loan.value)}</p>
    </div>
  ))}
</div>
 {/* Error notification */}
 {notificationOpen && (
            <Notification
            message={error} 
            toggleNotification={toggleNotification} 
            isOpen={notificationOpen}
            status='error'
            />
          )}

    </div>
  );
};

export default LoanHero;
