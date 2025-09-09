'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { BarChart, Pie, PieChart, CartesianGrid, XAxis, Cell, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts'
import CustomToolTip from './CustomToolTip'
import { subDays, format, eachDayOfInterval,  } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import renderCustomizedLabel from '@/components/analytics/CustomLabel'
import apiClient from '@/utils/apiClient';
import Notification from '@/components/Notification';
import LoadingPage from '@/app/loading';



const Chart2 = () => {
  const [selectedView, setSelectedView] = useState('week')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [toolPosition, setToolPosition] = useState<any>('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
const [resetDate, setResetDate] = useState(false)
  
  

  //toggle notification
  const toggleNotification = () => {
    setOpenNotification(!openNotification);
  };

  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }


  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryObj: Record<string, string> = {}; // Initialize query object
  
        if (selectedView) {
          queryObj.chart = selectedView;
  
          if (endDate && startDate) {
            queryObj.start_date = formatDate(startDate);
            queryObj.end_date = formatDate(endDate);
          }
          if(resetDate){
            queryObj.start_date = '';
            queryObj.end_date = '';
            
          }
        }
  
        const queryString = new URLSearchParams(queryObj).toString();
        const response = await apiClient.get(`/analytics/penalty?${queryString}`, {
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
  }, [selectedView, endDate, startDate, resetDate]);
  




useEffect(() => {
  if(typeof window !== 'undefined'){
    setIsClient(true)
  }
},[])
 
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '₦ 0'
    return '₦ ' + amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const CustomXAxisTick = ({ x, y, payload, index }: any) => {
   
    const isActive = activeIndex === index;
    const textLabel = payload.value.split(' ')[0]; // Split words into an array

    return (
      <text
        x={x }
        y={y + 15} 
        textAnchor="middle"
        style={{
          fontWeight: isActive ? 700 : 600,
            fill: isActive ? '#282828' : '#787878',
          fontSize: '14px',
        }}
      >
        {textLabel}
      </text>
    )
  }

 


  // Handle mouse enter and leave for bars to track which is active
  const handleMouseEnter = (data: any, index: number) => {
    
    setActiveIndex(index)
    setToolPosition(data)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null) // Reset active index on mouse leave
  }

 // Handle the date range change from the calendar
 const handleDateRangeChange = (range: any) => {
  setResetDate(false)
  
  if (range?.from && range?.to) {
    
    if(range.from === 'reset' && range.to === 'reset'){
      setResetDate(true)
    }else{
      setStartDate(formatDate(range.from));
      setEndDate(formatDate(range.to));
      setDateRange(range);
    } 
    
  }
};



const formattedData = chartData.map(item => ({
  ...item,
  penalty_colected: Math.abs(item.penalty_colected), 
  penalty_due: Math.abs(item.penalty_due)
}));

const pieColor = ['#CB704E', '#DDA995'];
const names = ['COLLECTED', 'DUE'];

// Ensure chartData is defined and not empty
const validChartData = Array.isArray(formattedData) ? formattedData : [];

const penaltyDue = validChartData.reduce(
  (acc, item) => acc + (item?.penalty_due || 0), 
  0
);
const penaltyCollected = validChartData.reduce(
  (acc, item) => acc + (item?.penalty_colected || 0), 
  0
);

const collectedUsers = validChartData.reduce(
  (acc, item) => acc + (item?.penalty_colected_users_count || 0), 
  0
);

const dueUsers = validChartData.reduce(
  (acc, item) => acc + (item?.penalty_due_users_count || 0), 
  0
);

const pieData = names.map((item, index) => ({
  name: item,
  value: index === 0 ? penaltyCollected : penaltyDue,
  color: pieColor[index],
  users: index === 0 ? collectedUsers : dueUsers,
}));



  return (
    <div className="lg:ml-8 ml-4 mr-2 lg:mr-0 md:ml-11 mt-12 h-auto z-10 w-full font-montserrat">
      <div className="lg:grid lg:grid-cols-12  lg:gap-3 w-auto lg:pr-10 md:pr-12 pr-4 mb-8">
        <div className='lg:overflow-visible lg:col-span-9  overflow-x-auto overflow-visible md:overflow-visible'>
        <div className=" h-[516px] lg:w-full md:w-[810px] w-[810px]   bg-[#FFFFFF]  shadow-custom2 rounded-[22px]">
          <div className="flex justify-between items-center mt-8 px-4 md:pt-4 pt-4">
            <div className="flex items-center font-semibold text-[#282828] text-[16px] gap-2 ">
              <Image src="/images/chart.png" width={24} height={24} alt="line-chart" />
              <p>PENAL CHARGES REPORT</p>
            </div>
            <div className="flex items-center gap-4 text-[#464646] font-medium text-[14px]">
              <p className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#CB704E]"></span>
                <span>Penalty collected</span>
              </p>
              <p className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#DDA995]"></span>
                <span>Penalty due</span>
              </p>
              
            </div>
          </div>
          <div className="flex items-center gap-4 mx-4 mt-8 text-[13px] w-full font-semibold">
            <button
               onClick={() => {
                setSelectedView('week')
                setStartDate('')
                setEndDate('')
              }}
              disabled={loading}
              className={`w-[95px] h-[34px] shadow-custom2 ${
                selectedView === 'week' ? 'bg-[#282828] text-[#FFFFFF]' : 'text-[#787878] bg-[#FFFFFF]'
              }  px-2 py-2 rounded-[12px]`}
            >
              This week
            </button>
            <button
              onClick={() => {
                setSelectedView('month')
                setStartDate('')
                setEndDate('')
              }}
              disabled={loading}
              className={`w-[95px] h-[34px] shadow-custom2 ${
                selectedView === 'month' ? 'bg-[#282828] text-[#FFFFFF]' : 'text-[#787878] bg-[#FFFFFF]'
              }  px-2 py-2 rounded-[12px]`}
            >
              This month
            </button>
            <button
              onClick={() => {
                setSelectedView('year')
                setStartDate('')
                setEndDate('')
              }}
              disabled={loading}
              className={`w-[95px] h-[34px] shadow-custom2 ${
                selectedView === 'year' ? 'bg-[#282828] text-[#FFFFFF]' : 'text-[#787878] bg-[#FFFFFF]'
              }  px-2 py-2 rounded-[12px]`}
            >
              This year
            </button>
      <button
  onClick={() => setIsCalendarOpen((prev) => !prev)}
  
  className="w-[34px] h-[30px] rounded-[8px] border border-solid border-[#A5A5A5] flex items-center justify-center"
>
  <Image src="/images/calendar.png" width={20} height={20} alt="calendar" />
</button>
{isCalendarOpen && (
  <>
    {/* Background Overlay */}
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
    ></div>

    {/* Calendar Dropdown */}
    <div className="absolute top-[980px]  left-96 bg-[#FFFFFF]  shadow-md rounded-md p-4 z-50">
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
    
    const tickToDisplay = Math.abs(tick); 
    const formatted = formatCurrency(tickToDisplay);
    const parts = formatted.split(',');
    if (parts.length === 3) {
      const extra = formatted.split(',')[1] === '000'? '' : `,${formatted.split(',')[1].toString().slice(0, 1)}`;
      return formatted.split(',')[0] + extra + 'M';
    } else if (parts.length === 2) {
      // This means the number is in thousands
      return formatted.split(',')[0] + 'K';
    }
    return formatted; // For smaller numbers without commas
  }}
  type="number"
  domain={['dataMin', 'dataMax']}
  tickCount={8}
  tickLine={false}
  axisLine={false}
  
  
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
  content={<CustomToolTip toolPosition={toolPosition} />}
  position={{ x: toolPosition.x , y: toolPosition.y  }}
/>
              
              <Bar
                dataKey="penalty_due"
                stackId="a"
                fill="#DDA995"
                barSize={25}
                onMouseEnter={(data, index) => handleMouseEnter(data, index)}
              />
              <Bar
                dataKey="penalty_colected"
                barSize={25}
                radius={[10, 10, 0, 0]}
                stackId="a"
                fill="#CB704E"
                fontWeight={500}
                onMouseEnter={(data, index) => handleMouseEnter(data, index)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        </div>
        <div className="lg:col-span-3 md:mt-6 w-full h-[516px] lg:mt-8 mt-8  bg-[#FFFFFF] shadow-custom2 rounded-[22px]">
          <p className='text-center text-[14px] font-semibold text-[#5A5A5A] px-4 pt-6'>TOTAL PENAL COLLECTED & PENAL DUE
          ( P & I )
          </p>

          <div className='flex justify-center items-center my-10 '>
          {isClient && (
            
        <PieChart width={195.18} height={195.18}>
          <Pie
            data={pieData}
            dataKey="value"
            
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
        <div key={index} className="flex items-center justify-between mx-4 mb-4 font-montserrat font-medium text-[15px] text-[#282828] ">
          {/* Amount Section */}
          <div className="flex items-center gap-1 font-semibold text-[16px]">
            <span className="w-[12px] h-[12px] rounded-[2px]" style={{ backgroundColor: item.color }}></span>
            <span>{formatCurrency(item.value)}</span>
          </div>
          {/* Users Section */}
          <div className="flex items-center gap-1 font-semibold text-[16px]">
            <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
            <span className='text-[#828282]'>{item.users}</span>
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

export default Chart2
