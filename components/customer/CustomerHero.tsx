import React from 'react';
import Image from 'next/image';
import apiClient from '@/utils/apiClient';
import { formatValue } from '@/utils/loan';
import { useState,useEffect } from 'react';


const CustomerHero = () => {

   const [notificationOpen, setNotificationOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [customerData, setCustomerData] = useState<any>([]);


  //get customer stat
  useEffect(() => {
    const fetchCustomerStat = async () => {
      try {
        const response = await apiClient.get(
          `/customer/stats`
        );

        setCustomerData(response?.data?.data || []);

      } catch (error: any) {
        setError(error?.response?.data?.message || 'An error occurred, please try again');
        setNotificationOpen(true);
      }
    };

    fetchCustomerStat();
  }, []);


  //toggle notification
  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  
  const colors = ['#E6EAE8', "#FFFFFF", "#F5EBDD"];
  const cust = ["All customers", "Loaned customer", "No loan customer", "Blacklisted"];
  const displayData = customerData
    ? [
        { key: cust[0], value: customerData.customer_count || 0, color: colors[0] },
        { key: cust[1], value: customerData.loaned_customers || 0, color: colors[1] },
        { key: cust[2], value: customerData.no_loan_customers || 0, color: colors[2] },
        { key: cust[3], value: customerData.blacklisted_customers || 0, color: colors[3] },
      ]
    : [];



  return (
    <div className=" lg:ml-8 ml-4 mr-2 md:ml-11 mt-12 h-auto font-montserrat ">
      <p className="font-bold text-[24px]  text-[#282828] tracking-wide ">All Customers</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 w-full h-auto mt-6">
  {displayData?.map((customer,index) => (
    <div
      key={index}
      className="min-h-[123px]  w-full flex flex-col gap-6 h-auto shadow-customshadow5 rounded-[12px] px-5 py-3"
      style={{ backgroundColor: customer.color }}
    >
        <div className='flex justify-between items-center'>
            <>
            <p className="text-[16px] text-[#5A5A5A] font-medium">
                {customer.key} 
                </p>
        <Image
      src="/images/calendar.png"
      alt="Logo"
      width={18}
      height={18}
    />
            </>
       

        </div>
      
      <p className="text-[22px] text-[#323232] font-black">{formatValue(customer.value)}</p>
    </div>
  ))}
</div>

    </div>
  );
};

export default CustomerHero;
