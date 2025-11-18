'use client';
import { useState, useEffect } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { HiMiniUsers } from 'react-icons/hi2';
import apiClient from '@/utils/apiClient';
import LoadingPage from '@/app/loading';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatValue } from '@/utils/loan';
import { Calendar as C } from "@/components/dashboard/DashboardCalender";
import Image from 'next/image';
import { subDays } from 'date-fns';
import { DateRange } from "react-day-picker";
import { FaEye } from "react-icons/fa6";

type WelcomeCardProps = {
  stats: any;
};

const WelcomeCard: React.FC<WelcomeCardProps> = ({ stats }) => {
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState('today');
  const [selectedDisbursedFilter, setSelectedDisbursedFilter] = useState('today');
  const [selectedCollectedFilter, setSelectedCollectedFilter] = useState('today');
  const [selectedUpfrontFilter, setSelectedUpfrontFilter] = useState('today');
  const router = useRouter();
  const searchParams = useSearchParams();
  const start = searchParams.get('start') || '';
  const end = searchParams.get('end') || '';
  const [searchDate, setSearchDate] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);

  const [customerNo, setCustomerNo] = useState(0);
  const [totalDisbursed, setTotalDisbursed] = useState(0);
  const [totalDisbursedCount, setTotalDisbursedCount] = useState('');
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalCollectedCount, setTotalCollectedCount] = useState('');
  const [totalUpfrontInterest, setTotalUpfrontInterest] = useState(0);
  const [totalUpfrontInterestCount, setTotalUpfrontInterestCount] = useState('');

  const [totalUniqueCustomers, setTotalUniqueCustomers] = useState(0);
  const [staticDisbursed, setStaticDisbursed] = useState(0);
  const [staticCollected, setStaticCollected] = useState(0);
  const [staticUpfrontInterest, setStaticUpfrontInterest] = useState(0);

  const [openUniqueCalender, setOpenUniqueCalender] = useState(false);
  const [openDisbursedCalender, setOpenDisbursedCalender] = useState(false);
  const [openCollectedCalender, setOpenCollectedCalender] = useState(false);
  const [openUpfrontCalender, setOpenUpfrontCalender] = useState(false);

  const [disbursedSearchDate, setDisbursedSearchDate] = useState({ startDate: '', endDate: '' });
  const [collectedSearchDate, setCollectedSearchDate] = useState({ startDate: '', endDate: '' });
  const [upfrontSearchDate, setUpfrontSearchDate] = useState({ startDate: '', endDate: '' });
  const [showUnique,setShowUnique] = useState(true)
  const [showDisbursed,setShowDisbursed] = useState(true)
  const [showCollected,setShowCollected] = useState(true)
  const [showUpfront,setShowUpfront] = useState(true)

  //toggle unique
  const toggleUnique = () => {
    setShowUnique(!showUnique)
  }

  //toggle disbursed
  const toggleDisbursed = () => {
    setShowDisbursed(!showDisbursed)
  }

  //toggle collected
  const toggleCollected = () => {
    setShowCollected(!showCollected)
  }
  // toggle upfront
  const toggleUpfront = () => {
    setShowUpfront(!showUpfront)
  }

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return '₦ ' + amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const selection = [
    { title: 'today', value: 'today' },
    { title: 'y.day', value: 'yesterday' },
    { title: 'week', value: 'this_week' },
    { title: 'month', value: 'this_month' },
    { title: 'year', value: 'this_year' },
  ];

  // Initial fetch: static + default ("today") stats
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Static stats
        const staticRes = await apiClient.get('/stats');
        const staticData = staticRes?.data?.data;
        setStaticDisbursed(staticData?.total_principal_disbursed);
        setStaticCollected(staticData?.total_principal_collected);
        setTotalUniqueCustomers(staticData?.unique_customers);
        setStaticUpfrontInterest(staticData?.total_upfront_interest);

        // Dynamic stats for "today"
        const today = formatDate(new Date());
        const dynamicRes = await apiClient.get(`/stats?filter=today&start_date=${today}&end_date=${today}`);
        const dynamicData = dynamicRes?.data?.data;
        setCustomerNo(dynamicData?.unique_customers);
        setTotalDisbursed(dynamicData?.total_principal_disbursed);
        setTotalDisbursedCount(dynamicData?.total_principal_disbursed_count);
        setTotalCollected(dynamicData?.total_principal_collected);
        setTotalCollectedCount(dynamicData?.total_principal_collected_count);
        setTotalUpfrontInterestCount(dynamicData?.total_upfront_interest_count);
        setTotalUpfrontInterest(dynamicData?.total_upfront_interest);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // When filter is changed (calendar or button)
  const fetchLoans = async (filter: any, type: string) => {
    try {
      setLoading(true);
      const startDate = type === 'customers' ? searchDate.startDate : type === 'disbursed' ? disbursedSearchDate.startDate : type === 'collected' ? collectedSearchDate.startDate : upfrontSearchDate.startDate;
      const endDate = type === 'customers' ? searchDate.endDate : type === 'disbursed' ? disbursedSearchDate.endDate : type === 'collected' ? collectedSearchDate.endDate : upfrontSearchDate.endDate;


      const response = await apiClient.get(`/stats?filter=${filter}&start_date=${startDate}&end_date=${endDate}`);
      const data = response?.data?.data;

      if (type === 'customers') setCustomerNo(data?.unique_customers);
      if (type === 'disbursed') {
        setTotalDisbursed(data?.total_principal_disbursed);
        setTotalDisbursedCount(data?.total_principal_disbursed_count);
      }
      if (type === 'collected') {
        setTotalCollected(data?.total_principal_collected);
        setTotalCollectedCount(data?.total_principal_collected_count);
      }
      if (type === 'upfront') {
        setTotalUpfrontInterest(data?.total_upfront_interest);
        setTotalUpfrontInterestCount(data?.total_upfront_interest_count);
      }
    } catch (error) {
      console.error('Error fetching loan stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only re-fetch when filter changes away from 'today'
  useEffect(() => {
    if (selectedCustomerFilter !== 'today' && selectedCustomerFilter !== 'calender') {
      fetchLoans(selectedCustomerFilter, 'customers');
    }
  }, [selectedCustomerFilter]);

  useEffect(() => {
    if (selectedDisbursedFilter !== 'today' && selectedDisbursedFilter !== 'calender') {
      fetchLoans(selectedDisbursedFilter, 'disbursed');
    }
  }, [selectedDisbursedFilter]);

  useEffect(() => {
    if (selectedCollectedFilter !== 'today' && selectedCollectedFilter !== 'calender') {
      fetchLoans(selectedCollectedFilter, 'collected');
    }
  }, [selectedCollectedFilter]);

  useEffect(() => {
    if (selectedUpfrontFilter !== 'today' && selectedUpfrontFilter !== 'calender') {
      fetchLoans(selectedUpfrontFilter, 'upfront');
    }
  }, [selectedUpfrontFilter]);

  // Set calendar dates from query params if present
  useEffect(() => {
    if (start) setSearchDate(prev => ({ ...prev, startDate: start }));
    if (end) setSearchDate(prev => ({ ...prev, endDate: end }));
  }, [start, end]);

  


  return (
    <div className="mt-12 h-auto font-montserrat ml-4 lg:ml-8 md:ml-11 mr-2">
       {loading && <LoadingPage />}
      <p className="leading-8 text-[#282828] font-bold text-[18px]">Dashboard</p>
     

      <div className="flex gap-5 mt-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        
       
        {/* Total Principal Disbursed Card */}
         <div className="snap-center flex-shrink-0 w-[33%] min-w-[350px]">
        <div className="w-full min-h-[207px] h-auto bg-[#282828] shadow-custom2 rounded-[8px]">
          <div className="md:ml-4 lg:mx-4 mx-4 mt-4">
            <div className="flex justify-between items-center">
              <div className='flex justify-start items-center'>
                <p className="text-[#ffffff] text-[18px] font-medium pt-2">Total Principal Disbursed</p>
              <IoIosInformationCircleOutline className="text-lg text-[#C3C3C3] ml-1" />
              </div>
              
              <div>
                 <Image
                                      src='/images/calendar.png'
                                      width={20}
                                      height={20}
                                      alt='img'
                                      className={`z-10 ${openDisbursedCalender || selectedDisbursedFilter === ''
                                        || selectedDisbursedFilter === 'calender'
                      ? 'bg-[#A6F4C5] rounded-sm '
                      : ''} cursor-pointer `}
                                      onClick={() => {
                                        setSelectedDisbursedFilter('calender')
                                        setOpenDisbursedCalender(!openDisbursedCalender)}}
                                    />
                                    {openDisbursedCalender && (
                                    <>
                                    {/* Background Overlay */}
                                    <div
                                      className="fixed inset-0   z-40"
                                      onClick={() => setOpenDisbursedCalender(!openDisbursedCalender)}
                                    ></div>
                                  
                                    {/* Calendar Dropdown */}
                                    <div className="absolute top-[220px] left-[620px]    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                    <C
                                  mode="range"
                                  selected={{ from: disbursedSearchDate.startDate, to: disbursedSearchDate.endDate }}
                                  onSelect={(range:any) => {
                                  setDisbursedSearchDate({startDate: formatDate(range.from),
                                    endDate: formatDate(range.to)})
                                  if (range.from && range.to) {
                                    setSelectedDisbursedFilter('');
                                  }
                                  
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
            <div className='flex items-center mb-6 mt-2 '>
            <p className="font-bold  text-[#FFFFFF] text-[24px]">{ showDisbursed ? formatCurrency(staticDisbursed) : '*****'}</p>
            <FaEye
            onClick={toggleDisbursed}
             className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] ml-2 cursor-pointer'/>
            </div>

            <div className="flex md:flex-wrap items-center text-[12px] gap-2">
              {selection.map((method,index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDisbursedFilter(method.value)}
                  className={`rounded-[18px] px-3 py-1 h-[30px] ${
                    selectedDisbursedFilter === method.value
                      ? 'bg-[#A6F4C5] text-[#282828] font-semibold'
                      : 'text-[#FFFDFD] bg-[#A6F4C51A]'
                  }`}
                >
                  {method.title}
                </button>
              ))}
              
                              
            </div>
            <div className="flex justify-start gap-5 items-center md:my-4 mb-6 ">
                <p className="text-[#BEBEBE] lg:text-[18px] text-[18px] md:text-[14px] font-bold mt-3 ml-1">{showDisbursed ? formatCurrency(totalDisbursed) : '*****'}</p>
                
                  <div className="flex justify-center items-center gap-1 pt-3 ">
                    <HiMiniUsers className="text-lg text-[#BEBEBE]" />
                    <p className="text-[#BEBEBE] text-[15px] font-bold ">
                     {totalDisbursedCount}
                    </p>
                  </div>
                
              </div>
          </div>
        </div>
      </div>

        {/* Total Principal Collected Card */}
         <div className="snap-center flex-shrink-0 w-[33%] min-w-[350px]">
        <div className="w-full min-h-[207px] h-auto bg-[#282828] shadow-custom2 rounded-[8px]">
          <div className="md:ml-4 lg:mx-4 mx-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center ">
                 <p className="text-[#ffffff] text-[18px] font-medium pt-2">Total Collected <span className='text-[10px]'>(principal+interest+penalty)</span></p>
              <IoIosInformationCircleOutline className="text-sm text-[#C3C3C3] ml-1" />
              </div>
             
              <div>
                <Image
                                        src='/images/calendar.png'
                                        width={20}
                                        height={20}
                                        alt='img'
                                        className={`z-10 ${openCollectedCalender || selectedCollectedFilter === ''
                                          || selectedCollectedFilter === 'calender'
                        ? 'bg-[#A6F4C5] rounded-sm '
                        : ''} cursor-pointer `}
                                        onClick={() => {
                                          setSelectedCollectedFilter('calender')
                                          setOpenCollectedCalender(!openCollectedCalender)}}
                                      />
                                      {openCollectedCalender && (
                                      <>
                                      {/* Background Overlay */}
                                      <div
                                        className="fixed inset-0   z-40"
                                        onClick={() => setOpenCollectedCalender(!openCollectedCalender)}
                                      ></div>
                                    
                                      {/* Calendar Dropdown */}
                                      <div className="absolute top-[220px] left-[850px]    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                      <C
                                    mode="range"
                                    selected={{ from: collectedSearchDate.startDate, to: collectedSearchDate.endDate }}
                                    onSelect={(range:any) => {
                                    setCollectedSearchDate({startDate: formatDate(range.from),
                                      endDate: formatDate(range.to)})
                                    if (range.from && range.to) {
                                      setSelectedCollectedFilter('');
                                    }
                                    
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
             <div className='flex items-center mb-6 mt-2 '>
            <p className="font-bold  text-[#FFFFFF] text-[24px]">{showCollected ? formatCurrency(staticCollected) : '*****'}</p>
            <FaEye 
            onClick={toggleCollected}
            className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] ml-2 cursor-pointer'/>
            </div>
            <div className="flex md:flex-wrap items-center text-[12px] gap-2">
              {selection.map((method,index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCollectedFilter(method.value)}
                  className={`rounded-[18px] px-3 py-1 h-[30px] ${
                    selectedCollectedFilter === method.value
                      ? 'bg-[#A6F4C5] text-[#282828] font-semibold'
                      : 'text-[#FFFDFD] bg-[#A6F4C51A]'
                  }`}
                >
                  {method.title}
                </button>
              ))}
                
              
            </div>
            <div className="flex justify-start gap-5 items-center md:my-4 mb-6 ">
                <p className="text-[#BEBEBE] lg:text-[18px] text-[18px] md:text-[14px] font-bold mt-3 ml-1">{showCollected ? formatCurrency(Math.abs(totalCollected)) : '*****'}</p>
                
                  <div className="flex justify-center items-center gap-1 pt-3 ">
                    <HiMiniUsers className="text-lg text-[#BEBEBE]" />
                    <p className="text-[#BEBEBE] text-[15px] font-bold ">
                     {totalCollectedCount}
                    </p>

                  </div>
                
              </div>
          </div>
        </div>
        </div>
    {/* upfront */}
     <div className="snap-center flex-shrink-0 w-[33%] min-w-[350px]">
        <div className="w-full min-h-[207px] h-auto bg-[#282828] shadow-custom2 rounded-[8px]">
          <div className="md:ml-4 lg:mx-4 mx-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center ">
                 <p className="text-[#ffffff] text-[18px] font-medium pt-2">Interest on upfront loans</p>
              <IoIosInformationCircleOutline className="text-sm text-[#C3C3C3] ml-1" />
              </div>
             
              <div>
                <Image
                                        src='/images/calendar.png'
                                        width={20}
                                        height={20}
                                        alt='img'
                                        className={`z-10 ${openUpfrontCalender || selectedUpfrontFilter === ''
                                          || selectedUpfrontFilter === 'calender'
                        ? 'bg-[#A6F4C5] rounded-sm '
                        : ''} cursor-pointer `}
                                        onClick={() => {
                                          setSelectedUpfrontFilter('calender')
                                          setOpenUpfrontCalender(!openUpfrontCalender)}}
                                      />
                                      {openUpfrontCalender && (
                                      <>
                                      {/* Background Overlay */}
                                      <div
                                        className="fixed inset-0   z-40"
                                        onClick={() => setOpenUpfrontCalender(!openUpfrontCalender)}
                                      ></div>
                                    
                                      {/* Calendar Dropdown */}
                                      <div className="absolute top-[220px] left-[850px]    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                      <C
                                    mode="range"
                                    selected={{ from: upfrontSearchDate.startDate, to: upfrontSearchDate.endDate }}
                                    onSelect={(range:any) => {
                                    setUpfrontSearchDate({startDate: formatDate(range.from),
                                      endDate: formatDate(range.to)})
                                    if (range.from && range.to) {
                                      setSelectedUpfrontFilter('');
                                    }
                                    
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
            <div className='flex items-center mb-6 mt-2 '>
            <p className="font-bold  text-[#FFFFFF] text-[24px]">{showUpfront ? formatCurrency(staticUpfrontInterest) : '*****'}</p>
            <FaEye 
            onClick={toggleUpfront}
            className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] ml-2 cursor-pointer'/>
            </div>
            <div className="flex md:flex-wrap items-center text-[12px] gap-2">
              {selection.map((method,index) => (
                <button
                  key={index}
                  onClick={() => setSelectedUpfrontFilter(method.value)}
                  className={`rounded-[18px] px-3 py-1 h-[30px] ${
                    selectedUpfrontFilter === method.value
                      ? 'bg-[#A6F4C5] text-[#282828] font-semibold'
                      : 'text-[#FFFDFD] bg-[#A6F4C51A]'
                  }`}
                >
                  {method.title}
                </button>
              ))}
            </div>
            <div className="flex justify-start gap-5 items-center md:my-4 mb-6">
                <p className="text-[#BEBEBE] lg:text-[18px] text-[18px] md:text-[14px] font-bold mt-3 ml-1">{showUpfront ? formatCurrency(Math.abs(totalUpfrontInterest)) : '*****'}</p>
                
                  <div className="flex justify-center items-center gap-1 pt-3">
                    <HiMiniUsers className="text-lg text-[#BEBEBE]" />
                    <p className="text-[#BEBEBE] text-[15px] font-bold">
                     {totalUpfrontInterestCount}
                    </p>
                  </div>
                </div>
              </div>
          </div>
        </div>
         {/* Unique Customers Card */}
         <div className="snap-center flex-shrink-0 w-[33%] min-w-[350px]">
        <div className="w-full min-h-[207px] h-auto bg-[#282828] shadow-custom2 rounded-[8px]">
          <div className="md:ml-4 lg:mx-4 mx-4 mt-4">
            <div className="flex justify-between items-center">
              <div className='flex justify-start items-center'>
                <p className="text-[#ffffff] text-[18px] font-medium pt-2">Unique Customers</p>
                <IoIosInformationCircleOutline className="text-lg text-[#C3C3C3] ml-1" />
              </div>
             
              <div>
                <Image
                                      src='/images/calendar.png'
                                      width={20}
                                      height={20}
                                      alt='img'
                                      className={`z-10 ${openUniqueCalender || selectedCustomerFilter === ''
                                        || selectedCustomerFilter === 'calender'
                      ? 'bg-[#A6F4C5] rounded-sm '
                      : ''} cursor-pointer `}
                                      onClick={() => {
                                        setSelectedCustomerFilter('calender')
                                        setOpenUniqueCalender(!openUniqueCalender)}}
                                    />
                                    {openUniqueCalender && (
                                    <>
                                    {/* Background Overlay */}
                                    <div
                                      className="fixed inset-0   z-40"
                                      onClick={() => setOpenUniqueCalender(!openUniqueCalender)}
                                    ></div>
                                  
                                    {/* Calendar Dropdown */}
                                    <div className="absolute top-[220px] left-[290px]    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                    <C
                                  mode="range"
                                  selected={{ from: searchDate.startDate, to: searchDate.endDate }}
                                  onSelect={(range:any) => {
                                  setSearchDate({startDate: formatDate(range.from),
                                    endDate: formatDate(range.to)})
                                  if (range.from && range.to) {
                                    setSelectedCustomerFilter('');
                                  }
                                  
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
            <div className='flex items-center mb-6 mt-2 '>
            <p className="font-bold  text-[#FFFFFF] text-[24px]">{showUnique ? formatValue(totalUniqueCustomers) : '*****'}</p>
            <FaEye 
            onClick={toggleUnique}
            className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] ml-2 cursor-pointer'/>
            </div>
            
            <div className="flex md:flex-wrap items-center text-[12px] gap-2">
              {selection.map((method,index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchDate({startDate: '', endDate: ''})
                    setSelectedCustomerFilter(method.value)
                  }}
                  className={`rounded-[18px] px-3 py-1 h-[30px] ${
                    selectedCustomerFilter === method.value
                      ? 'bg-[#A6F4C5] text-[#282828] font-semibold'
                      : 'text-[#FFFDFD] bg-[#A6F4C51A]'
                  }`}
                >
                  {method.title}
                </button>

              ))}
               
                              
                             
            </div>
            <div className="flex justify-start gap-5 items-center md:my-4 mb-6 ">
                  <div className="flex justify-center items-center gap-1 pt-3 ">
                    <HiMiniUsers className="text-lg text-[#BEBEBE]" />
                    <p className="text-[#BEBEBE] text-[15px] font-bold ">
                    {formatValue(customerNo)}
                    </p>
                  </div>
                
              </div>
          </div>
        </div>
      </div>


      </div>
    </div>
  );
};

export default WelcomeCard;
