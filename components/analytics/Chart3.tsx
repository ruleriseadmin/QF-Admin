'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';
import { BarChart,  XAxis, YAxis,  Bar, ResponsiveContainer } from 'recharts'
import apiClient from '@/utils/apiClient';
import Notification from '@/components/Notification';
import LoadingPage from '@/app/loading';
import {Calendar as C} from "@/components/dashboard/DashboardCalender"
import { subDays } from 'date-fns';
import { DateRange } from "react-day-picker";
import { formatDate,saveToExcel } from '@/utils/loan';
import { FiDownload } from "react-icons/fi";


const Chart3 = () => {
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [selectedSelection, setSelectedSelection] = useState<string>('overall');
  const [loading, setLoading] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [resetDate, setResetDate] = useState(false)
  const [error, setError] = useState('');
  const [customDays, setCustomDays] = useState(null);
  const [chartData, setChartData] = useState<any>();
  const [openCustomCalendar, setOpenCustomCalendar] = useState(false);
  const [queryStart, setQueryStart] = useState('');
  const [queryEnd, setQueryEnd] = useState('');
  const [success,setSuccess] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
              from: subDays(new Date(), 29),
              to: new Date(),
            })
  const [searchDate, setSearchDate] = useState({startDate: '', endDate: ''});
  const toggleSelection = () => {
    setOpenSelection(!openSelection);
  };
  const [downloadOffer, setDownloadOffer] = useState(false);
  
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
        if(downloadOffer){
          queryObj.download_see_offer_excel = 'true';
        }
        const queryString = new URLSearchParams(queryObj).toString();
        const response = await apiClient.get(`/analytics/reports?${queryString}`, {
          signal: controller.signal,
          responseType: 'json',
        });
        setChartData(response?.data?.data);
        if(downloadOffer){
             setSuccess(response?.data?.message || 'Report is being processed and will be emailed to you shortly.');
              setOpenNotification(true);
              setDownloadOffer(false);
              return;
      }
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
  }, [selectedSelection, resetDate, queryStart, queryEnd, downloadOffer]);

 


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



  const yes = chartData?.credit_bureau_checks?.crc?.eligible + chartData?.credit_bureau_checks?.credit_registry?.eligible + chartData?.credit_bureau_checks?.first_central?.eligible;
  const no = chartData?.credit_bureau_checks?.crc?.ineligible + chartData?.credit_bureau_checks?.credit_registry?.ineligible + chartData?.credit_bureau_checks?.first_central?.ineligible;
  const noData = chartData?.credit_bureau_checks?.crc?.no_data + chartData?.credit_bureau_checks?.credit_registry?.no_data + chartData?.credit_bureau_checks?.first_central?.no_data;
  const totalCRC = yes + no + noData;
  const filterData = 
     [
      { name: 'Gross Revenue', number1: chartData?.customers_report?.gross_revenue?.count, amount: chartData?.customers_report?.gross_revenue?.total_amount },
      { name: 'Fully Collected (INT + PEN)', number2: chartData?.customers_report?.fully_collected?.count, amount: chartData?.customers_report?.fully_collected?.total_amount  },
      { name: 'Total overdue loans', number4: chartData?.overdue_loans?.count, amount: chartData?.overdue_loans?.total_unpaid_amount },
      { name: 'Credit bureau check', crc:totalCRC },
      { name: 'See offer customers', number5: chartData?.see_offer_customers, },
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
        y={y + 4} 
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
    <div className="lg:ml-8 ml-4 mr-2 lg:mr-0 md:ml-11 mt-12 h-auto w-full font-montserrat">
      {loading && <LoadingPage />}
      <div className="w-full pr-10 mb-8">
      <div className='lg:overflow-hidden md:overflow-x-auto overflow-x-auto  '>
        <div className="min-h-[514px] lg:w-full md:w-[810px] w-[810px] h-auto bg-[#FFFFFF] shadow-custom2 rounded-[22px]">
          <div className="flex justify-start items-center mt-8 pt-6 px-6 relative gap-6">
            <div className="flex items-center font-semibold text-[#282828] text-[16px] gap-2 pt-6">
              <Image src="/images/chart.png" width={24} height={24} alt="line-chart" />
              <p>REPORT BY ACTIVITIES</p>
            </div>
          
          <div className="flex items-center gap-3">
            {/* Dropdown Section */}
            <div className="">
              <div
                onClick={toggleSelection}
                className="flex items-center hover:cursor-pointer bg-[#E1E3E4] rounded-full lg:w-[289px] md:w-[241px] h-[48px] mt-6 md:ml-2 md:px-2"
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
          <div className='relative '>



               <ResponsiveContainer width="100%" height={450} className="mb-8 z-30">
  <BarChart
    data={filterData}
    layout="vertical"
    barGap={-28}
    margin={{ top: 0, right: 10, left: 0, bottom: 90 }}
  >
    <YAxis
      type="category"
      dataKey="name"
      axisLine={false}
      tickLine={false}
      padding={{ top: 40, bottom: 0 }}
      width={180}
      tick={<CustomXAxisTick />}
    />
    <XAxis
      type="number"
      axisLine={false}
      tickLine={false}
      padding={{ left: 50, right:390 }}
      hide={true}
    />
    <defs>
      <linearGradient id="gradientFill0" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="50%" stopColor="#5C59EA" stopOpacity={1} />
        <stop offset="100%" stopColor="rgba(92, 89, 234, 0)" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="gradientFill1" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="50%" stopColor="#148920" stopOpacity={1} />
        <stop offset="100%" stopColor="rgba(92, 89, 234, 0)" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="gradientFill2" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="50%" stopColor="#AA261E" stopOpacity={1} />
        <stop offset="100%" stopColor="rgba(92, 89, 234, 0)" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="gradientFill3" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="50%" stopColor="#8592C3" stopOpacity={1} />
        <stop offset="100%" stopColor="rgba(92, 89, 234, 0)" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="gradientFill4" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="50%" stopColor="#D2863F" stopOpacity={1} />
        <stop offset="100%" stopColor="rgba(92, 89, 234, 0)" stopOpacity={0} />
      </linearGradient>
      
    </defs>
  
      <Bar
       
        dataKey='number1'
        fill="url(#gradientFill0)"
        barSize={28}
        radius={[0, 22, 22, 0]}
        label={({ x, y, width, value }) => {
        const amount = filterData[0]?.amount ;

          // Conditionally render value only if it's greater than 0
          return value >= 0 ? (
            <text
              x={x + width + 10}
              y={y + 15}
              fill="#282828"
              fontSize={18}
              fontWeight={700}
              textAnchor="start"
            >
              {` ${value}`}
              &nbsp;
              <tspan style={{ fontWeight: "700", fontSize: "36px", fill: "#D9D9D9" ,fontFamily:""}}> . </tspan>
              &nbsp;
              {formatCurrency(amount)}
            </text>
          ) :(null as any); // Don't render anything if value is 0 or less
        }}
      />
       <Bar
       
        dataKey="number2"
        fill="url(#gradientFill1)"
        barSize={28}
        radius={[0, 22, 22, 0]}
        label={({ x, y, width, value }) => {
          
        const amount = filterData[1]?.amount ;

          // Conditionally render value only if it's greater than 0
          return value >= 0 ? (
            <text
              x={x + width + 10}
              y={y + 15}
              fill="#282828"
              fontSize={18}
              fontWeight={700}
              textAnchor="start"
            >
              {` ${value}`}
              &nbsp;
              <tspan style={{ fontWeight: "700", fontSize: "36px", fill: "#D9D9D9" ,fontFamily:""}}> . </tspan>
              &nbsp;
              {formatCurrency(amount)}
            </text>
          ) :(null as any); // Don't render anything if value is 0 or less
        }}
      />
     <Bar
       
       dataKey="number4"
       fill="url(#gradientFill2)"
       barSize={28}
       radius={[0, 22, 22, 0]}
       label={({ x, y, width, value }) => {
       const amount = filterData[2]?.amount ;

         // Conditionally render value only if it's greater than 0
         return value >= 0 ? (
           <text
             x={x + width + 10}
             y={y + 15}
             fill="#282828"
             fontSize={18}
             fontWeight={700}
             textAnchor="start"
           >
             {` ${value}`}
             &nbsp;
             <tspan style={{ fontWeight: "700", fontSize: "36px", fill: "#D9D9D9" ,fontFamily:""}}> . </tspan>
             &nbsp;
             {formatCurrency(amount)}
           </text>
         ) :(null as any); // Don't render anything if value is 0 or less
       }}
     />
     <Bar
       
       dataKey="crc"
       fill="url(#gradientFill3)"
       barSize={28}
       radius={[0, 22, 22, 0]}
       label={({ x, y, width, value }) => {
        
     
         // Conditionally render value only if it's greater than 0
         return value >= 0 ? (
           <text
             x={x + width + 10}
             y={y + 15}
             fill="#282828"
             fontSize={18}
             fontWeight={700}
             textAnchor="start"
           >
             {`YES(${yes})`}
             &nbsp;
             <tspan style={{ fontWeight: "700", fontSize: "36px", fill: "#D9D9D9" ,fontFamily:""}}> . </tspan>
             &nbsp;
             {`NO(${no})`}
             <tspan style={{ fontWeight: "700", fontSize: "36px", fill: "#D9D9D9" ,fontFamily:""}}> . </tspan>
             &nbsp;
             {`NO Data(${noData})`}
           </text>
         ) :(null as any); // Don't render anything if value is 0 or less
       }}
     />
   <Bar
  dataKey="number5"
  fill="url(#gradientFill4)"
  barSize={28}
  radius={[0, 22, 22, 0]}
  label={({ x, y, width, value }) => (
    <g>
      {value >= 0 && (
        <text
          x={x + width + 10}
          y={y + 15}
          fill="#282828"
          fontSize={18}
          fontWeight={700}
          textAnchor="start"
        >
          {`${value}`}
        </text>
      )}
      {value >= 0 && (
        <foreignObject x={x + width + 80} y={y} width={20} height={20}>
          <div
            className="cursor-pointer"
            onClick={() => setDownloadOffer(true)}
          >
            <Image
              src="/images/downloadChart.png"
              alt="download"
              width={18}
              height={18}
            />
          </div>
        </foreignObject>
      )}
    </g>
  )}
/>
   
    
  </BarChart>
</ResponsiveContainer>


          </div>
        
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

       {success &&
              <Notification
                message={success}
                toggleNotification={toggleNotification}
                isOpen={openNotification}
                status='success'
              />}
    </div>
  );
};

export default Chart3;