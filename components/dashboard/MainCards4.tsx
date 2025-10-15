import React, {useRef,useState,useEffect} from 'react';
import Image from 'next/image';
import { FaEye } from "react-icons/fa6";
import { useRouter,usePathname } from 'next/navigation';
import LoadingPage from '@/app/loading';
import { subDays } from 'date-fns';
import { DateRange } from "react-day-picker";
import {Calendar as C} from "@/components/dashboard/DashboardCalender"
import { Dispatch, SetStateAction } from 'react';
import { formatCurrency } from '@/utils/loan';


type MainCards4Props = {
  stats: any;
  cardView:string;
  setCardView: Dispatch<SetStateAction<string>>;
  loading:boolean
};

const MainCards4: React.FC<MainCards4Props> = ({ stats,cardView,setCardView,loading }) => {
  const router = useRouter();
  const pathname = usePathname();
    const [queryStart, setQueryStart] = useState('');
    const [queryEnd, setQueryEnd] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
          from: subDays(new Date(), 29),
          to: new Date(),
        })
  const [lastUpdatedField, setLastUpdatedField] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState({startDate: '', endDate: ''});
  const [overdueLoanCount, setOverdueLoanCount] = useState(0);
  const [overdueLoanCountDate, setOverdueLoanCountDate] = useState({
    start: '',
    end: ''
  });
  const [showOverdueLoanCount, setShowOverdueLoanCount] = useState(true)
  const [openOverDueLoanCountCalendar, setOpenOverDueLoanCountCalendar] = useState(false);
  const [disbursementToday, setDisbursementToday] = useState(0);
  const [disbursementTodayDate, setDisbursementTodayDate] = useState({
    start: '',
    end: ''
  });
  const [showDisbursementToday, setShowDisbursementToday] = useState(true)
  const [openDisbursementTodayCalendar, setOpenDisbursementTodayCalendar] = useState(false);
  const [loanProvidedCount, setLoanProvidedCount] = useState(0);
  const [loanProvidedCountDate, setLoanProvidedCountDate] = useState({
    start: '',
    end: ''
  });
  const [showLoanProvidedCount, setShowLoanProvidedCount] = useState(true)
  const [openLoanProvidedCountCalendar, setOpenLoanProvidedCountCalendar] = useState(false);
  

  const formatDate = (dateString:string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
    
useEffect(() => {
  if (!stats) return;

  if (lastUpdatedField === 'overdueLoanCount' && cardView === 'maincard4') {
    setOverdueLoanCount(stats.total_overdue_loans_count || 0);
  } else if (lastUpdatedField === 'disbursementToday' && cardView === 'maincard4') {
    setDisbursementToday(stats.total_loans_disbursed_today || 0);
  } else if (lastUpdatedField === 'loanProvidedCount' && cardView === 'maincard4') {
    setLoanProvidedCount(stats.total_loans_provided_count || 0);
  } else if (cardView === 'none') {
    setOverdueLoanCount(stats.total_overdue_loans_count || 0);
    setDisbursementToday(stats.total_loans_disbursed_today || 0);
    setLoanProvidedCount(stats.total_loans_provided_count || 0);
  }
}, [stats, lastUpdatedField, cardView]);


useEffect(() => {
  if (queryStart && queryEnd) {
    router.replace(`${pathname}?start=${queryStart}&end=${queryEnd}`, { scroll: false });
  }
}, [queryStart, queryEnd]);



  
    
    
  return (
    <div className=" mt-12  h-auto font-montserrat lg:ml-8 z-10  ml-4  md:ml-11 mr-2">
      <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-3">
        {loading && <LoadingPage />}
        
         
            {/* Card 1 */}
           <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#9D88145E] relative rounded-[12px] shadow-custom3 border border-[#C2861F]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total Overdue loans (count) </p>
                    <Image
                      src='/images/calendar.png'
                      width={20}
                      height={20}
                      alt=''
                      className='z-10 cursor-pointer '
                      onClick={() => setOpenOverDueLoanCountCalendar(!openOverDueLoanCountCalendar)}
                    />
                  
                  {openOverDueLoanCountCalendar && (
                     <>
                        {/* Background Overlay */}
                        <div
                          className="fixed inset-0   z-40"
                          onClick={() => setOpenOverDueLoanCountCalendar(false)}
                        ></div>
                    
                        {/* Calendar Dropdown */}
                        <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                        <C
                    mode="range"
                    selected={{ from: overdueLoanCountDate.start, to: overdueLoanCountDate.end }}
                    onSelect={(range:any) => {
                      setSearchDate({startDate: '', endDate: ''});
                     setOverdueLoanCountDate({start: formatDate(range.from) ,end: formatDate(range.to)   });
                     setCardView('maincard4'); 
                     setLastUpdatedField('overdueLoanCount');
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
               
                <div className='flex items-center m-6 lg:m-6 md:mx-2 gap-3 lg:gap-3 md:gap-2 md:my-5'>
                <img
                src={`/images/disbursed4.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showOverdueLoanCount ? overdueLoanCount : "*****"}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowOverdueLoanCount(prev => !prev)}/>
                </div>
            </div>

            {/* Card 2 */}
           <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#C5F1D8] relative rounded-[12px] shadow-custom3 border border-[#1FB2C2]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Disbursements Today</p>
                      <Image
                                            src='/images/calendar.png'
                                            width={20}
                                            height={20}
                                            alt=''
                                            className='z-10 cursor-pointer '
                                            onClick={() => setOpenDisbursementTodayCalendar(!openDisbursementTodayCalendar)}
                                          />
                                        
                                        {openDisbursementTodayCalendar && (
                                           <>
                                              {/* Background Overlay */}
                                              <div
                                                className="fixed inset-0   z-40"
                                                onClick={() => setOpenDisbursementTodayCalendar(false)}
                                              ></div>
                                          
                                              {/* Calendar Dropdown */}
                                              <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                              <C
                                          mode="range"
                                          selected={{ from: disbursementTodayDate.start, to: disbursementTodayDate.end }}
                                          onSelect={(range:any) => {
                                            setSearchDate({startDate: '', endDate: ''});
                                            setDisbursementTodayDate({start: formatDate(range.from) ,end: formatDate(range.to)   });
                                            setCardView('maincard4'); 
                                            setLastUpdatedField('disbursementToday');
                                            setQueryStart(formatDate(range.from));
                                            setQueryEnd(formatDate(range.to));
                                          }}
                                          defaultMonth={dateRange?.from || new Date()}
                                          numberOfMonths={2}
                                          className=" w-full h-full" 
                                          classNames={{}} 
                                        />
                                                            
                                              </div>
                                            </>
                                        )}
                </div>
               
                <div className='flex items-center m-6 lg:m-6 md:mx-2 gap-3 lg:gap-3 md:gap-2 md:my-5'>
                <img
                src={`/images/disbursed4.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showDisbursementToday ? formatCurrency(disbursementToday || 0) : "*****"}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer'
                     onClick={() => setShowDisbursementToday(prev => !prev)}/>
                </div>
            </div>
            

  {/* Card 3 */}
  <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#C73802]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total Loans provided (count)</p>
                     <Image
                                           src='/images/calendar.png'
                                           width={20}
                                           height={20}
                                           alt=''
                                           className='z-10 cursor-pointer '
                                           onClick={() => setOpenLoanProvidedCountCalendar(!openLoanProvidedCountCalendar)}
                                         />
                                       
                                       {openLoanProvidedCountCalendar && (
                                          <>
                                             {/* Background Overlay */}
                                             <div
                                               className="fixed inset-0   z-40"
                                               onClick={() => setOpenLoanProvidedCountCalendar(false)}
                                             ></div>
                                         
                                             {/* Calendar Dropdown */}
                                             <div className="absolute top-10 right-1    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                             <C
                                         mode="range"
                                         selected={{ from: loanProvidedCountDate.start, to: loanProvidedCountDate.end }}
                                         onSelect={(range:any) => {
                                           setSearchDate({startDate: '', endDate: ''});
                                            setLoanProvidedCountDate({start: formatDate(range.from) ,end: formatDate(range.to)   });
                                           setCardView('maincard4'); 
                                            setLastUpdatedField('loanProvidedCount');
                                           setQueryStart(formatDate(range.from));
                                           setQueryEnd(formatDate(range.to));
                                         }}
                                         defaultMonth={dateRange?.from || new Date()}
                                         numberOfMonths={2}
                                         className=" w-full h-full" 
                                         classNames={{}} 
                                       />
                                                           
                                             </div>
                                           </>
                                       )}
                </div>
               
                <div className='flex items-center m-6 lg:m-6 md:mx-2 gap-3 lg:gap-3 md:gap-2 md:my-5'>
                <img
                src={`/images/disbursed5.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showLoanProvidedCount ? loanProvidedCount : "*****"}</p>
                    <FaEye 
                    onClick={() => setShowLoanProvidedCount(prev => !prev)}
                    className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer'/>
                </div>
            </div>

  

      </div>
    </div>
  );
};


export default MainCards4;
