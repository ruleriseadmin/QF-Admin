'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { BarChart, Pie, PieChart, CartesianGrid, XAxis, Cell, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts'
import CardToolTip from './CardToolTip'
import { subDays,endOfMonth  } from 'date-fns';
import { DateRange } from "react-day-picker";
import renderCustomizedLabel from '@/components/analytics/CustomLabel'
import apiClient from '@/utils/apiClient';
import Notification from '@/components/Notification';
import { MdKeyboardArrowLeft,MdKeyboardArrowRight,MdKeyboardArrowDown } from "react-icons/md";
import LoadingPage from '@/app/loading';
import { formatMonthYear,formatValue } from '@/utils/loan';



const CustomerChart = () => {
  const [selectedView, setSelectedView] = useState('day')
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
const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  const currentYear = today.getFullYear();
  const defaultMonthYear = `${currentYear}-${currentMonth}`;

  const [monthYear, setMonthYear] = useState<string>(defaultMonthYear);
  const maxMonthYear = defaultMonthYear;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthYear(e.target.value);
  };

  // Format for display
  const formattedMonthYear = formatMonthYear(monthYear);
  
  

  //toggle notification
  const toggleNotification = () => {
    setOpenNotification(!openNotification);
  };

  
    // Returns YYYY-MM-DD
  const formatDate = (date: Date) =>
    date.toISOString().split('T')[0];      // quick ISO helper
  
  const getRangeForMonth = (yyyyMm: string) => {
    const base = new Date(`${yyyyMm}-01`); // first day of that month
    return {
      start: base,       
      end:   endOfMonth(base),       
    };
  };
  
  
  
    useEffect(() => {
      const controller = new AbortController();
      const fetchData = async () => {
        setLoading(true);
        try {
          const queryObj: Record<string, string> = {}; 
    
          if (selectedView) {
            queryObj.chart = selectedView;
    
           if (monthYear) {
        const { start, end } = getRangeForMonth(monthYear);
        queryObj.start_date = formatDate(start);
        queryObj.end_date   = formatDate(end);   // ← last day of month
      }
            
          }
    
          const queryString = new URLSearchParams(queryObj).toString();
          const response = await apiClient.get(`/analytics/customer-loans?${queryString}`, {
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
    }, [selectedView, monthYear]);




useEffect(() => {
  if(typeof window !== 'undefined'){
    setIsClient(true)
  }
},[])
 
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '₦ 0'
    return '₦ ' + amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

 const CustomXAxisTick = ({ x, y, payload }: any) => {
  // Find the index of the current tick
  const index = chartData?.findIndex((item) => item.period === payload.value);

  // Get today's date (e.g., 20)
  const today = new Date();
  const todayDate = today.getDate(); // e.g., 20

  const isToday = index + 1 === todayDate;

  return (
    <text
      x={x}
      y={y + 15}
      textAnchor="middle"
      style={{
        fontWeight: isToday ? 700 : 600,
        fill: isToday ? '#282828' : '#787878',
        fontSize: '14px',
      }}
    >
      {index + 1}
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
const changeMonth = (direction: 'prev' | 'next') => {
  const [year, month] = monthYear.split('-').map(Number);
  const date = new Date(year, month - 1); // JS months are 0-based

  if (direction === 'prev') {
    date.setMonth(date.getMonth() - 1);
  } else if (direction === 'next') {
    date.setMonth(date.getMonth() + 1);
  }

  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  const newYear = date.getFullYear();
  const newMonthYear = `${newYear}-${newMonth}`;

  // Prevent going into the future
  if (newMonthYear <= maxMonthYear) {
    setMonthYear(newMonthYear);
  }
};



const formattedData = chartData?.map(item => ({
  ...item,
  new_customer: Math.abs(item.new_customer), 
  existing_customer: Math.abs(item.existing_customer),
  returning_customers: Math.abs(item.returning_customer),
}));

const pieColor = ['#30353E', '#DE8832','#3BA8BA'];
const names = ['New Customer', 'Existing Customer','Returning Customer'];


// Ensure chartData is defined and not empty
const validChartData = Array.isArray(formattedData) ? formattedData : [];

const new_customer = validChartData.reduce(
  (acc, item) => acc + (item?.new_customer || 0), 
  0
);
const existing_customer = validChartData.reduce(
  (acc, item) => acc + (item?.existing_customer || 0), 
  0
);
const returning_customers = validChartData.reduce(
  (acc, item) => acc + (item?.returning_customers || 0), 
  0
);

const newUsers = validChartData.reduce(
  (acc, item) => acc + (item?.new_customer_count || 0), 
  0
);

const existingUsers = validChartData.reduce(
  (acc, item) => acc + (item?.existing_customer_count || 0), 
  0
);
const returningUsers = validChartData.reduce(
  (acc, item) => acc + (item?.returning_customer_count || 0), 
  0
);

const pieData = names?.map((item, index) => ({
  name: item,
  value: index === 0 ? new_customer : index === 1 ? existing_customer : returning_customers,
  color: pieColor[index],
  users: index === 0 ? newUsers : index === 1 ? existingUsers : returningUsers,
}));


console.log('chartData', chartData)

  return (
    <div className="lg:ml-8 ml-4 mr-2 lg:mr-0 md:ml-11 mt-12 h-auto w-full font-montserrat">
      <div className="lg:grid lg:grid-cols-12  lg:gap-3 w-auto lg:pr-10 md:pr-12 pr-4 mb-8">
         <div className='lg:overflow-visible lg:col-span-9  overflow-x-auto overflow-visible md:overflow-visible'>
        <div className=" h-[516px] lg:w-full md:w-[810px] w-[810px]   bg-[#FFFFFF]  shadow-custom2 rounded-[22px]">
          <div className="flex justify-start items-center mt-8 px-4 md:pt-4 pt-4">
            <div className="flex items-center font-semibold text-[#282828] text-[16px] gap-2 pr-4">
              <Image src="/images/chart.png" width={24} height={24} alt="line-chart" />
            </div>
            <div className="flex items-center gap-4 text-[#464646] font-medium text-[14px]">
              <p className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#30353E]"></span>
                <span>New Customer (Reg + Loan)</span>
              </p>
              <p className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#DE8832]"></span>
                <span>Existing Customer (First loan)</span>
              </p>
              <p className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#3BA8BA]"></span>
                <span>Returning Customer</span>
              </p>
              
            </div>
          </div>
           {loading && <LoadingPage />}
   <div className="flex items-center gap-4 mx-4 mt-8 text-[13px] w-full font-semibold">
  {/* Left Arrow */}
  <div
    className="w-[29px] cursor-pointer h-[29px] rounded-full bg-[#ECECEC] border flex items-center justify-center"
    onClick={() => changeMonth('prev')}
  >
    <MdKeyboardArrowLeft className="text-[#282828] text-[18px]" />
  </div>

  {/* Display Selected Month-Year */}
  <p className="text-[18px] text-[#282828] px-2">{formattedMonthYear}</p>

  {/* Right Arrow */}
  <div
    className="w-[29px] h-[29px] cursor-pointer rounded-full bg-[#ECECEC] border flex items-center justify-center"
    onClick={() => changeMonth('next')}
  >
    <MdKeyboardArrowRight className="text-[#282828] text-[18px]" />
  </div>

  {/* Calendar Dropdown */}
  <div
    onClick={() => setIsCalendarOpen((prev) => !prev)}
    className="w-[29px] h-[29px] rounded-full bg-[#ECECEC] border flex items-center justify-center"
  >
    <div className="relative w-full h-full">
      <input
        type="month"
        value={monthYear}
        onChange={handleChange}
        min="2020-01"
        max={maxMonthYear}
        className="w-full h-full opacity-0 absolute left-0 top-0 cursor-pointer"
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
  content={<CardToolTip toolPosition={toolPosition} />}
  position={{ x: toolPosition.x , y: toolPosition.y  }}
/>
              <Bar
                dataKey="returning_customers"
                stackId="a"
                fill="#3BA8BA"
                barSize={10}
                onMouseEnter={(data, index) => handleMouseEnter(data, index)}
              />
              
              <Bar
                dataKey="existing_customer"
                stackId="a"
                fill="#DE8832"
                barSize={10}
                onMouseEnter={(data, index) => handleMouseEnter(data, index)}
              />
              <Bar
                dataKey="new_customer"
                barSize={10}
                radius={[10, 10, 0, 0]}
                stackId="a"
                fill="#30353E"
                fontWeight={500}
                onMouseEnter={(data, index) => handleMouseEnter(data, index)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        </div>
        <div className="lg:col-span-3 md:mt-6 w-full h-[516px] lg:mt-8 mt-8 bg-[#FFFFFF] shadow-custom2 rounded-[22px]">
          <p className='text-center text-[14px] font-semibold text-[#5A5A5A] px-4 pt-6'>TOTAL DISBURSEMENT & COLLECTION
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
                  <span className='text-[#828282]'>{formatValue(item.users)}</span>
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

export default CustomerChart
