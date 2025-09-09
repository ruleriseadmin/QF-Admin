'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';
import { BarChart,  XAxis,  YAxis,  Bar, ResponsiveContainer } from 'recharts'
import apiClient from '@/utils/apiClient';
import Notification from '@/components/Notification';
import LoadingPage from '@/app/loading';
import {Calendar as C} from "@/components/dashboard/DashboardCalender"
import { subDays } from 'date-fns';
import { DateRange } from "react-day-picker";
import { formatDate } from '@/utils/loan';


const Chart4 = () => {
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [selectedSelection, setSelectedSelection] = useState<string>('overall');
  const [loading, setLoading] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [resetDate, setResetDate] = useState(false)
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState<any>();
  const [openCustomCalendar, setOpenCustomCalendar] = useState(false);
  const [customDays, setCustomDays] = useState(null);
  const [queryStart, setQueryStart] = useState('');
  const [queryEnd, setQueryEnd] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
              from: subDays(new Date(), 29),
              to: new Date(),
            })
  const [searchDate, setSearchDate] = useState({startDate: '', endDate: ''});
  
  const toggleSelection = () => {
    setOpenSelection(!openSelection);
  };
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '₦ 0'
    return '₦' + amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

   //toggle notification
   const toggleNotification = () => {
    setOpenNotification(!openNotification);
  };

 
  


  
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryObj: Record<string, string> = {}; // Initialize query object
  
        if (selectedSelection && selectedSelection !== 'overall') {
          queryObj.filter = selectedSelection;
        }
        if(queryStart && queryEnd){
          queryObj.filter_date_range = `${queryStart}${' - '}${queryEnd}`;
        }
        const queryString = new URLSearchParams(queryObj).toString();
        const response = await apiClient.get(`/analytics/reports?${queryString}`, {
          signal: controller.signal,
        });
        
        setChartData(response?.data?.data);
      } catch (error: any) {
        if (error.message !== 'canceled' || error.name !== 'CanceledError') {
          setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
          setOpenNotification(true);
        }
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
    return () => controller.abort();
  }, [selectedSelection, resetDate, queryStart, queryEnd]);

  

  
  useEffect(() => {
    if( queryStart && queryEnd){
      setOpenCustomCalendar(false);
      setSelectedSelection('');
      setOpenSelection(false);
    }else if(selectedSelection){
      setQueryEnd('');
      setQueryStart('');
      
    }
  },[queryEnd,queryStart, selectedSelection])

  
 
  const filterData = 
     [
      {name: 'Direct debit', number1: chartData?.payment_methods_report?.direct_debits},
      {name: 'Virtual account', number2: chartData?.payment_methods_report?.virtual_accounts},
      {name:"Debit card",number3: chartData?.payment_methods_report?.debit_card},
      {name: "Paystack link", number4: chartData?.payment_methods_report?.payment_link}
    ];



    const selection = [
      { name: 'Overall',value: 'overall' },
      { name: 'Last 7 days', value: 'last_7_days' },
      {name: 'This month', value: 'this_month' },
      { name: 'Last month', value: 'last_month' },
      { name: 'This year', value: 'this_year' },
    ];

  const CustomXAxisTick = ({ x, y, payload, index }: any) => {
   
    return (
      <text
        x={x - 150}
        y={y - 13} 
        style={{
            fontSize: '14px',
            fontWeight: 500,
            fill: '#282828',
            textAnchor: 'start', 
        }}
      >
        {payload.value}
      </text>
    )
  }

  
  
  return (
    <div className="lg:ml-8 ml-4 mr-2 lg:mr-0 md:ml-11 mt-2 h-auto w-full font-montserrat">
      {loading && <LoadingPage />}
      <div className='lg:overflow-hidden md:overflow-x-auto overflow-x-auto'>
          <div className="flex justify-start items-center mb-8 pt-6 px-6 relative gap-6">
            <div className="flex items-center font-semibold text-[#282828] text-[16px] gap-2 pt-6">
              <Image src="/images/chart.png" width={24} height={24} alt="line-chart" />
              <p>REPORT BY OTHERS</p>
            </div>
          
          <div className="flex items-center gap-3">
            {/* Dropdown Section */}
            <div className="">
              <div
                onClick={toggleSelection}
                className="flex items-center hover:cursor-pointer bg-[#E1E3E4] rounded-full lg:w-[294px] md:w-[241px] h-[48px] mt-6 md:ml-2 md:px-2"
              >
                {/* Left Section */}
    <div className="flex items-center flex-grow ml-3">
                     <Image
                       src="/images/calendar-2.png"
                       alt="Logo"
                       width={18}
                       height={18}
                     />
                     <p className="ml-2 lg:text-[16px] md:text-[12px] font-euclid text-[#282828] font-medium">
                     {selection.find((select) => select.value === selectedSelection)?.name || `${queryStart} - ${queryEnd} ` }
   
                     </p>
                   </div>
                   {/* Right Section */}
                   <button>
                     <TiArrowSortedDown className="text-[#828282] text-[18px] mr-3" />
                   </button>
                 </div>
                 </div>
   
                 {openSelection && (
                   <>
                     <div
                       className="fixed inset-0 bg-black opacity-20 z-40"
                       onClick={() => setOpenSelection(false)}
                     ></div>
   
                     {/* Dropdown Content */}
                     <div className="absolute top-full mt-2 left-[283px] w-[253px] min-h-[221px] h-auto bg-[#FFFFFF] rounded-xl shadow-lg font-montserrat font-medium z-50">
                       {selection.map((select, index) => (
                         <button
                           key={index}
                           onClick={() => {
                             setSelectedSelection(select.value);
                             setQueryStart('');
                             setQueryEnd('');
                             setSearchDate({startDate: '', endDate: ''});
                             setOpenSelection(false);
                           }}
                           className={`w-full text-start ml-4 text-[14px] text-[#464646] ${
                             index === 0 ? 'mt-4' : 'mt-2'
                           }`}
                         >
                           <div className="flex justify-start items-center gap-6">
                             <p>{select.name}</p>
                             {select.value === selectedSelection && (
                               <Image src="/images/good.png" alt="good" height={17} width={17} />
                             )}
                           </div>
                         </button>
                       ))}
                       <div className='flex w-5/12 ml-2 h-[38px] px-2  items-center justify-between   rounded-[12px]'>
                       <p className=" text-[16px] lg:text-[14px] md:text-[10px] text-[#282828] ">Custom</p>
                                           
                         <TiArrowSortedDown 
                         onClick={() => setOpenCustomCalendar(true)}
                         className="text-[#828282] text-[20px]  cursor-pointer " />
                   
                           {openCustomCalendar && (
                                                                             <>
                                                                                {/* Background Overlay */}
                                                                                <div
                                                                                  className="fixed inset-0   z-40"
                                                                                  onClick={() => setOpenCustomCalendar(false)}
                                                                                ></div>
                                                                            
                                                                                {/* Calendar Dropdown */}
                                                                                <div className="absolute top-10 right-1    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                                                                <C
                                                                            mode="range"
                                                                            selected={{ from: searchDate.startDate, to: searchDate.endDate }}
                                                                            onSelect={(range:any) => {
                                                                             setSearchDate({startDate: formatDate(range.from), endDate: formatDate(range.to)});
                                                                             setQueryStart(formatDate(range.from));
                                                                             setQueryEnd(formatDate(range.to));
                                                                            }}
                                                                            defaultMonth={dateRange?.from || new Date()}
                                                                            numberOfMonths={2}
                                                                            className=" w-full h-full" // You can add a class name here if needed
                                                                            classNames={{}} // Yo
                                                                          />
                                                                                              
                                                                                </div>
                                                                              </>
                                                                          )}
                       
                                       </div>
                        
                     </div>
                   </>
                 )}
                 
                
               </div>
            
          </div>
      <div className=" mb-8  mr-10 ">
        <div className="min-h-[358px] col-span-1 lg:w-full md:w-[810px] w-[810px] h-auto bg-[#FFFFFF] shadow-custom2 rounded-[22px]">
            <p className='text-[#828282] text-[16px] font-semibold mx-6  pt-6'>Collection channel report</p>
        
          <ResponsiveContainer width="60%" height={300} className="mt-8 mb-12 z-30">
  <BarChart
    data={filterData}
    layout="vertical"
    margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
    barGap={-13} 
    
  >
  {/* Y-axis configuration */}
  <YAxis
    type="category"
    dataKey="name"
    axisLine={false}
    tickLine={false}
    padding={{ top: 0, bottom: 40 }}
    width={180}
    tick={<CustomXAxisTick />}
  />

  {/* X-axis hidden */}
  <XAxis
    type="number"
    
    padding={{ left: -160, right: 150 }}
    axisLine={false}
    tickLine={false}
    hide={true} 
  />


  {/* Render bars with different gradients */}
  <Bar dataKey="number1" fill="#2AA81A" barSize={12}  label={{fill: '#323232', 
    fontSize: 18 ,
    fontWeight: 700,
    position:"right"
    
    }}  radius={[22, 22, 22, 22]}/>
  <Bar dataKey="number2" fill="#AE1CA7" barSize={12}
  label={{fill: '#323232', 
    fontSize: 18 ,
    fontWeight: 700,
    position:"right"
    
    }} 
  radius={[22, 22, 22, 22]} />
  <Bar dataKey="number3" fill="#00BCD4" barSize={12} 
  label={{fill: '#323232', 
    fontSize: 18 ,
    fontWeight: 700,
    position:"right"
    
    }} 
  radius={[22, 22, 22, 22]} />
  <Bar dataKey="number4" fill="#282828" barSize={12}  
  label={{fill: '#323232', 
    fontSize: 18 ,
    fontWeight: 700,
    position:"right"
    
    }}
  radius={[22, 22, 22, 22]}  />
</BarChart>
</ResponsiveContainer>


        </div>
        </div>
       
      </div>
      {openNotification && (
        <Notification
          isOpen={openNotification}
         toggleNotification={toggleNotification}
         message={error}
         status='error'
        />
      )}
    </div>
  );
};

export default Chart4;