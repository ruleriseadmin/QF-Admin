'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { BarChart, Pie, PieChart, CartesianGrid, XAxis, Cell, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts'
import CardToolTip from './CardToolTip'
import { subDays,endOfMonth } from 'date-fns';
import { DateRange } from "react-day-picker";
import renderCustomizedLabel from '@/components/analytics/CustomLabel'
import apiClient from '@/utils/apiClient';
import Notification from '@/components/Notification';
import { MdKeyboardArrowLeft,MdKeyboardArrowRight,MdKeyboardArrowDown } from "react-icons/md";
import LoadingPage from '@/app/loading';
import { formatMonthYear,formatValue } from '@/utils/loan';





const Growth = () => {
  const [selectedView, setSelectedView] = useState('year')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [toolPosition, setToolPosition] = useState<any>('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const today = new Date();
const currentYear = today.getFullYear();
const [year, setYear] = useState<number>(currentYear);
const [inputYear, setInputYear] = useState<string>(String(currentYear));
const maxYear = currentYear;


  
  

  //toggle notification
  const toggleNotification = () => {
    setOpenNotification(!openNotification);
  };


  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryObj: Record<string, string> = {}; 
  
        if (selectedView) {
          queryObj.chart = selectedView;
  
         if (year) {
      queryObj.start_date = year.toString() === '2025' ? '' : `${year}-01-01`;
      queryObj.end_date   = year.toString() === '2025' ? '' : `${year}-12-31`;   // ← last day of year
    }
          
        }
  
        const queryString = new URLSearchParams(queryObj).toString();
        const response = await apiClient.get(`/analytics/growth-rate?${queryString}`, {
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
  }, [selectedView, year]);
  




useEffect(() => {
  if(typeof window !== 'undefined'){
    setIsClient(true)
  }
},[])
 
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '₦ 0'
    return  amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

const CustomXAxisTick = ({ x, y, payload }: any) => {
  // Extract "Jan" from "Jan, 2025"
  const monthLabel = payload.value.split(",")[0].trim();
  // Get current month in short form (Jan, Feb, etc.)
  const currentMonth = new Date().toLocaleString("en-US", { month: "short" });

  const isCurrentMonth = monthLabel === currentMonth;

  return (
    <text
      x={x}
      y={y + 15}
      textAnchor="middle"
      style={{
        fontWeight: isCurrentMonth ? 700 : 600,
        fill: isCurrentMonth ? "#282828" : "#787878",
        fontSize: isCurrentMonth ? "16px" : "14px",
      }}
    >
      {monthLabel}
    </text>
  );
};


 


  // Handle mouse enter and leave for bars to track which is active
  const handleMouseEnter = (data: any, index: number) => {
    
    setActiveIndex(index)
    setToolPosition(data)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null) // Reset active index on mouse leave
  }
const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setInputYear(value); // Always update the input

  // Only commit when it's exactly 4 digits
  if (/^\d{4}$/.test(value)) {
    const newYear = Number(value);
    if (newYear <= maxYear && newYear >= 1900) {
      setYear(newYear);
    }
  }
};

const changeYear = (direction: 'prev' | 'next') => {
  if (direction === 'prev') {
    setYear((prev) => prev - 1);
  } else if (direction === 'next' && year < maxYear) {
    setYear((prev) => prev + 1);
  }
};




const formattedData = chartData.map(item => ({
  ...item,
  growth_rate: parseFloat(item.growth_rate), 
  first_time_loans_count: Math.abs(item.first_time_loans_count)
}));

const pieColor = ['#2AA81A', '#F3D55B'];
const names = ['FIRST TIME CUSTOMERS', 'GROWTH RATE'];

// Ensure chartData is defined and not empty
const validChartData = Array.isArray(formattedData) ? formattedData : [];


const growthUsers = validChartData.reduce(
  (acc, item) => acc + (item?.growth_rate || 0), 
  0
);

const firstUsers = validChartData.reduce(
  (acc, item) => acc + (item?.first_time_loans_count || 0), 
  0
);

const pieData = names.map((item, index) => ({
  name: item,
  users: index === 0 ? growthUsers : firstUsers,
  color: pieColor[index],

}));



  return (
    <div className="lg:ml-8 ml-4 mr-2 lg:mr-0 md:ml-11 mt-12 h-auto w-full font-montserrat">
      <div className="lg:grid lg:grid-cols-12  lg:gap-3 w-auto lg:pr-10 md:pr-12 pr-4 mb-8">
         <div className='lg:overflow-visible lg:col-span-9 overflow-visible  overflow-x-auto md:overflow-visible'>
        <div className=" h-[516px] lg:w-full md:w-[810px] w-[810px]   bg-[#FFFFFF]  shadow-custom2 rounded-[22px]">
          <div className="flex justify-between items-center mt-8 px-4 md:pt-4 pt-4">
            <div className="flex items-center font-semibold text-[#282828] text-[16px] gap-2 ">
              <Image src="/images/chart.png" width={24} height={24} alt="line-chart" />
              <p>FIRST TIME CUSTOMER VS PERCENTAGE GROWTH</p>
            </div>
            <div className="flex items-center gap-4 text-[#464646] font-medium text-[14px]">
              <p className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#F3D55B]"></span>
                <span>First Time Customers</span>
              </p>
              <p className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#2AA81A]"></span>
                <span>Percentage Growth</span>
              </p>
              
            </div>
          </div>
           {loading && <LoadingPage />}
   <div className="flex items-center gap-4 mx-4 mt-8 text-[13px] w-full font-semibold">
  {/* Left Arrow */}
  <div
    className="w-[29px] cursor-pointer h-[29px] rounded-full bg-[#ECECEC] border flex items-center justify-center"
    onClick={() => changeYear('prev')}
  >
    <MdKeyboardArrowLeft className="text-[#282828] text-[18px]" />
  </div>

  {/* Display Selected Year */}
  <p className="text-[18px] text-[#282828] px-2">{year}</p>

  {/* Right Arrow */}
  <div
    className="w-[29px] h-[29px] cursor-pointer rounded-full bg-[#ECECEC] border flex items-center justify-center"
    onClick={() => changeYear('next')}
  >
    <MdKeyboardArrowRight className="text-[#282828] text-[18px]" />
  </div>

  {/* Calendar Dropdown */}
  <div
    onClick={() => setIsCalendarOpen((prev) => !prev)}
    className="w-[49px] h-[29px] rounded-full bg-[#ECECEC] border flex items-center justify-center"
  >
    {/* Year Dropdown */}
  <div className="w-[60px] h-[29px] rounded-full bg-[#ECECEC] border flex items-center justify-center">
    <input
       type="number"
        value={inputYear}
        onChange={handleYearChange}
        min="1900"
        max={maxYear}
      className="w-full h-full text-center bg-transparent border-none focus:outline-none"
    />
      <MdKeyboardArrowDown className="text-[#282828] text-[18px] absolute right-[6px] top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  </div>
</div>

          <ResponsiveContainer width="100%" height={350} className="mt-14 mb-8 ">
            <BarChart
              width={730}
              height={250}
              data={
                formattedData
              }
              margin={{
                top: 10,
                right: 14,
                left: 10,
                bottom: 10,
              }}
              barCategoryGap="1%"
              barGap={2}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid strokeDasharray="0" stroke="#E6E6E6" vertical={false} strokeOpacity={0.3} />
              <XAxis
  dataKey="period"
  height={60}
  axisLine={false}
  tickLine={false}
  tick={CustomXAxisTick} 
  interval={0} 
  onMouseEnter={(data, index) => handleMouseEnter(data, index)}
  onMouseLeave={handleMouseLeave}
/>
<YAxis
  tickFormatter={(tick) => {
    const formatted = formatCurrency(tick);
   
    return formatted; // For smaller numbers without commas
  }}
  type="number"
  
  tickCount={15}
  tickLine={false}
  axisLine={false}
  domain={['dataMin', 'dataMax']}
  
  style={{
    fontSize: '14px',
    fontWeight: 600,
    fill: '#282828',
  }}
  tick={{ fontSize: '15px', fontWeight: 600, fill: '#282828' }}
  interval={0} // Add this prop to remove duplicates
/>
               <Tooltip 
  formatter={(value: any) => formatCurrency(value)} 
  cursor={{ fill: 'transparent' }} 
  content={<CardToolTip toolPosition={toolPosition}  growth={true}/>}
  position={{ x: toolPosition.x , y: toolPosition.y  }}
 
/>
              
              <Bar
                dataKey="first_time_loans_count"
                stackId="a"
                
                fill="#F3D55B"
                barSize={10}
                onMouseEnter={(data, index) => handleMouseEnter(data, index)}
              />
              <Bar
                dataKey="growth_rate"
                stackId="a"
                fill="#2AA81A"
                barSize={10}

                radius={[10, 10, 0, 0]}
                
                fontWeight={500}
                onMouseEnter={(data, index) => handleMouseEnter(data, index)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        </div>
        <div className="lg:col-span-3 md:mt-6 w-full h-[516px] lg:mt-8 mt-8  bg-[#FFFFFF] shadow-custom2 rounded-[22px]">
          <p className='text-center text-[14px] font-semibold text-[#5A5A5A] px-4 pt-6'>FIRST TIME CUSTOMERS VS GROWTH RATE
         
          </p>

          <div className='flex justify-center items-center my-10 '>
          {isClient && (
            
        <PieChart width={195.18} height={195.18}>
          <Pie
            data={pieData}
            dataKey="users"
            
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {pieData?.map((entry:any, index:number) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
            ))}
          </Pie>
          
        </PieChart>
      )}
      </div>
      {pieData.map((item,index) => (
        <div key={index} className="flex items-center justify-start mx-4 mb-4 font-montserrat font-medium text-[15px] text-[#282828] ">
          {/* Amount Section */}
          <div className="flex items-center gap-1 font-semibold text-[16px] mr-2">
            <span className="w-[12px] h-[12px] rounded-[2px]" style={{ backgroundColor: item.color }}></span>
            
          </div>
          {/* Users Section */}
          <div className="flex items-center gap-1 font-semibold text-[16px]">
            <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
           <span className="text-[#828282]">
  {Number(item.users) % 1 !== 0 
    ? Number(item.users).toFixed(2) 
    : formatValue(item.users)}
</span>

          </div>
        </div>
      ))}
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
  )
}

export default Growth
