import React, {useRef,useState,useEffect} from 'react';
import Image from 'next/image';
import { FaEye } from "react-icons/fa6";
import { formatCurrency } from '@/utils/loan';
import { useRouter,usePathname } from 'next/navigation';
import LoadingPage from '@/app/loading';
import { subDays } from 'date-fns';
import { DateRange } from "react-day-picker";
import {Calendar as C} from "@/components/dashboard/DashboardCalender"
import { Dispatch,SetStateAction } from 'react';

type LastCardsProps = {
  stats: any
   cardView:string;
    setCardView: Dispatch<SetStateAction<string>>;
  loading:boolean
};

const LastCards: React.FC<LastCardsProps> = ({ stats,cardView,setCardView,loading}) => {
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
  const [totalPenalty, setTotalPenalty] = useState(0);
  const [totalPenaltyDate, setTotalPenaltyDate] = useState({
    start:'',
    end:''
  });
  const [showTotalPenalty, setShowTotalPenalty] = useState(false);
  const [openTotalPenaltyCalender, setOpentotalPenaltyCalender] = useState(false);
  const [penaltyDue, setPenaltyDue] = useState(0);
  const [penaltyDueDate, setPenaltyDueDate] = useState({
    start:'',
    end:''
  });
  const [showPenaltyDue, setShowPenaltyDue] = useState(false);
  const [openPenaltyDueCalender, setOpenPenaltyDueCalender] = useState(false);
  const [penaltyCollected, setPenaltyCollected] = useState(0);
  const [penaltyCollectedDate, setPenaltyCollectedDate] = useState({
    start:'',
    end:''
  });
  const [showPenaltyCollected, setShowPenaltyCollected] = useState(false);
  const [openPenaltyCollectedCalender, setOpenPenaltyCollectedCalender] = useState(false);
  const [penaltyCount, setPenaltyCount] = useState(0);
  const [penaltyCountDate, setPenaltyCountDate] = useState({
    start:'',
    end:''
  });
  const [showPenaltyCount, setShowPenaltyCount] = useState(false);
  const [openPenaltyCountCalender, setOpenPenaltyCountCalender] = useState(false);
  const [penaltyDueCount, setPenaltyDueCount] = useState(0);
  const [penaltyDueCountDate, setPenaltyDueCountDate] = useState({
    start:'',
    end:''
  });
  const [showPenaltyDueCount,setShowPenaltyDueCount] = useState(false);
  const [openPenaltyDueCountCalender, setOpenPenaltyDueCountCalender] = useState(false);
  const [totalOpenLoanInterest, setTotalOpenLoanInterest] = useState(0);
  const [totalOpenLoanInterestDate, setTotalOpenLoanInterestDate] = useState({
    start:'',
    end:''
  });
  const [showTotalOpenLoanInterest, setShowTotalOpenLoanInterest] = useState(false);
  const [openTotalOpenLoanInterestCalender, setOpenTotalOpenLoanInterestCalender] = useState(false);
  
 
  


   const formatDate = (dateString:string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    }
    

// Fetch data based on search dates and other date conditions
useEffect(() => {
  if (!stats) return;

  const data = stats;

  if (lastUpdatedField === 'totalPenalty' && cardView === 'lastcards') {
    setTotalPenalty(data?.total_penalty || 0);
  } else if (lastUpdatedField === 'penaltyDue' && cardView === 'lastcards') {
    setPenaltyDue(data?.total_penalty_due || 0);
  } else if (lastUpdatedField === 'penaltyCollected' && cardView === 'lastcards') {
    setPenaltyCollected(data?.total_penalty_collected || 0);
  } else if (lastUpdatedField === 'penaltyCount' && cardView === 'lastcards') {
    setPenaltyCount(data?.total_penalty_count || 0);
  } else if (lastUpdatedField === 'penaltyDueCount' && cardView === 'lastcards') {
    setPenaltyDueCount(data?.total_penalty_due_count || 0);
  } else if (lastUpdatedField === 'totalOpenLoanInterest' && cardView === 'lastcards') {
    setTotalOpenLoanInterest(data?.total_open_loan_interest || 0);
  } else if (cardView === 'none') {
    setTotalPenalty(data?.total_penalty || 0);
    setPenaltyDue(data?.total_penalty_due || 0);
    setPenaltyCollected(data?.total_penalty_collected || 0);
    setPenaltyCount(data?.total_penalty_count || 0);
    setPenaltyDueCount(data?.total_penalty_due_count || 0);
    setTotalOpenLoanInterest(data?.total_open_loan_interest || 0);
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
           <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FDD1D138] relative rounded-[12px] shadow-custom3 border border-[#C73802]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total Penalty </p>
                    <Image
                                         src='/images/calendar.png'
                                         width={20}
                                         height={20}
                                         alt=''
                                         className='z-10 cursor-pointer '
                                         onClick={() => setOpentotalPenaltyCalender(true)}
                                       />
                                     
                                     {openTotalPenaltyCalender && (
                                        <>
                                           {/* Background Overlay */}
                                           <div
                                             className="fixed inset-0   z-40"
                                             onClick={() => setOpentotalPenaltyCalender(false)}
                                           ></div>
                                       
                                           {/* Calendar Dropdown */}
                                           <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                           <C
                                       mode="range"
                                       selected={{ from: totalPenaltyDate.start, to: totalPenaltyDate.end }}
                                       onSelect={(range:any) => {
                                         setSearchDate({startDate: '', endDate: ''});
                                          setTotalPenaltyDate({start: formatDate(range.from), end: formatDate(range.to)});
                                         setCardView('lastcards')
                                          setLastUpdatedField('totalPenalty');
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
                src={`/images/overdue.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{ showTotalPenalty ? formatCurrency(totalPenalty || 0) : "*****"}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowTotalPenalty(prev => !prev)}/>
                </div>
            </div>

            {/* Card 2 */}
           <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#F7F0F0] relative rounded-[12px] shadow-custom3 border border-[#C73802]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total Penalty Due</p>
                    <Image
                                         src='/images/calendar.png'
                                         width={20}
                                         height={20}
                                         alt=''
                                         className='z-10 cursor-pointer '
                                         onClick={() => setOpenPenaltyDueCalender(true)}
                                       />
                                     
                                     {openPenaltyDueCalender && (
                                        <>
                                           {/* Background Overlay */}
                                           <div
                                             className="fixed inset-0   z-40"
                                             onClick={() => setOpenPenaltyDueCalender(false)}
                                           ></div>
                                       
                                           {/* Calendar Dropdown */}
                                           <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                           <C
                                       mode="range"
                                       selected={{ from: penaltyDueDate.start, to: penaltyDueDate.end }}
                                       onSelect={(range:any) => {
                                         setSearchDate({startDate: '', endDate: ''});
                                          setPenaltyDueDate({start: formatDate(range.from), end: formatDate(range.to)});
                                         setCardView('lastcards')
                                          setLastUpdatedField('penaltyDue');
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
                src={`/images/overdue.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{ showPenaltyDue ? formatCurrency(penaltyDue || 0) : "*****"}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowPenaltyDue(prev => !prev)}/>
                </div>
            </div>
            

  {/* Card 3 */}
  <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#C5F1D8] relative rounded-[12px] shadow-custom3 border border-[#054F31]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total Penalty Collected</p>
                     <Image
                                          src='/images/calendar.png'
                                          width={20}
                                          height={20}
                                          alt=''
                                          className='z-10 cursor-pointer '
                                          onClick={() => setOpenPenaltyCollectedCalender(true)}
                                        />
                                      
                                      {openPenaltyCollectedCalender && (
                                         <>
                                            {/* Background Overlay */}
                                            <div
                                              className="fixed inset-0   z-40"
                                              onClick={() => setOpenPenaltyCollectedCalender(false)}
                                            ></div>
                                        
                                            {/* Calendar Dropdown */}
                                            <div className="absolute top-10 right-1    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                            <C
                                        mode="range"
                                        selected={{ from: penaltyCollectedDate.start, to: penaltyCollectedDate.end }}
                                        onSelect={(range:any) => {
                                          setSearchDate({startDate: '', endDate: ''});
                                            setPenaltyCollectedDate({start: formatDate(range.from), end: formatDate(range.to)});
                                          setCardView('lastcards')
                                            setLastUpdatedField('penaltyCollected');
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
                src={`/images/overdue.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{ showPenaltyCollected ? formatCurrency(Math.abs(penaltyCollected) || 0) : "*****"}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowPenaltyCollected(prev => !prev)}/>
                </div>
            </div>

          
            {/* Card 4 */}
            <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#1FB2C2]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total Penalty(count)</p>
                    <Image
                                         src='/images/calendar.png'
                                         width={20}
                                         height={20}
                                         alt=''
                                         className='z-10 cursor-pointer '
                                         onClick={() => setOpenPenaltyCountCalender(true)}
                                       />
                                     
                                     {openPenaltyCountCalender && (
                                        <>
                                           {/* Background Overlay */}
                                           <div
                                             className="fixed inset-0   z-40"
                                             onClick={() => setOpenPenaltyCountCalender(false)}
                                           ></div>
                                       
                                           {/* Calendar Dropdown */}
                                           <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                           <C
                                       mode="range"
                                       selected={{ from: penaltyCountDate.start, to: penaltyCountDate.end }}
                                       onSelect={(range:any) => {
                                         setSearchDate({startDate: '', endDate: ''});
                                       setPenaltyCountDate({start: formatDate(range.from), end: formatDate(range.to)});
                                       setCardView('lastcards')  
                                       setLastUpdatedField('penaltyCount');
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
                src={`/images/disbursed2.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showPenaltyCount ? penaltyCount : '*****'}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' 
                    onClick={() => setShowPenaltyCount(prev => !prev)}
                    />
                </div>
            </div>
          {/* Card 5 */}
            <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#1FB2C2]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total Penalty Due  (count)</p>
                   <Image
                                        src='/images/calendar.png'
                                        width={20}
                                        height={20}
                                        alt=''
                                        className='z-10 cursor-pointer '
                                        onClick={() => setOpenPenaltyDueCountCalender(true)}
                                      />
                                    
                                    {openPenaltyDueCountCalender && (
                                       <>
                                          {/* Background Overlay */}
                                          <div
                                            className="fixed inset-0   z-40"
                                            onClick={() => setOpenPenaltyDueCountCalender(false)}
                                          ></div>
                                      
                                          {/* Calendar Dropdown */}
                                          <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                          <C
                                      mode="range"
                                      selected={{ from: penaltyDueCountDate.start, to: penaltyDueCountDate.end }}
                                      onSelect={(range:any) => {
                                        setSearchDate({startDate: '', endDate: ''});
                                       setPenaltyDueCountDate({start: formatDate(range.from), end: formatDate(range.to)});
                                       setCardView('lastcards') 
                                       setLastUpdatedField('penaltyDueCount');
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
                src={`/images/disbursed2.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{ showPenaltyDueCount ? penaltyDueCount : '*****'}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer'
                    onClick={() => setShowPenaltyDueCount(prev => !prev)}
                    />
                </div>
            </div>
                                    {/* Card 6 */}
            <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#0057FF21] relative rounded-[12px] shadow-custom3 border border-[#05134F]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total open loan- interest</p>
                     <Image
                        src='/images/calendar.png'
                        width={20}
                        height={20}
                        alt=''
                        className='z-10 cursor-pointer '
                        onClick={() => {
                         
                          setOpenTotalOpenLoanInterestCalender(!openTotalOpenLoanInterestCalender)}}
                      />
                                        {openTotalOpenLoanInterestCalender && (
                      <>
                      {/* Background Overlay */}
                      <div
                        className="fixed inset-0   z-40"
                        onClick={() => setOpenTotalOpenLoanInterestCalender(!openTotalOpenLoanInterestCalender)}
                      ></div>
                    
                      {/* Calendar Dropdown */}
                      <div className="absolute top-10 right-1    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                      <C
                    mode="range"
                    selected={{ from: totalOpenLoanInterestDate.start, to: totalOpenLoanInterestDate.end }}
                    onSelect={(range:any) => {
                    setSearchDate({startDate: '', endDate: ''});
                    setTotalOpenLoanInterestDate({start: formatDate(range.from), end: formatDate(range.to)});
                    setCardView('lastcards')  
                    setLastUpdatedField('totalOpenLoanInterest');
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
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{ showTotalOpenLoanInterest ? formatCurrency(totalOpenLoanInterest || 0) : "*****"}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowTotalOpenLoanInterest(prev => !prev)}/>
                </div>
            </div>
      </div>
    </div>
  );
};


export default LastCards;
