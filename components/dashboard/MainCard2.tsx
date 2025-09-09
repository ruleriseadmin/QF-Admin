import React, {useRef,useState,useEffect} from 'react';
import Image from 'next/image';
import { FaEye } from "react-icons/fa6";
import { useRouter,usePathname } from 'next/navigation';
import LoadingPage from '@/app/loading';
import { subDays } from 'date-fns';
import { DateRange } from "react-day-picker";
import { Dispatch, SetStateAction } from 'react';
import {Calendar as C} from "@/components/dashboard/DashboardCalender"
import { formatCurrency } from '@/utils/loan';

type MainCards2Props = {
  stats: any;
  cardView:string;
  setCardView: Dispatch<SetStateAction<string>>;
  loading:boolean
};
const MainCards2: React.FC<MainCards2Props> = ({ stats,cardView,setCardView ,loading}) => {
  const router = useRouter();
  const pathname = usePathname();
   const [queryStart, setQueryStart] = useState('');
    const [queryEnd, setQueryEnd] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: subDays(new Date(), 29),
      to: new Date(),
    })
  const [searchDate, setSearchDate] = useState({startDate: '', endDate: ''});
  const [lastUpdatedField, setLastUpdatedField] = useState<string | null>(null);
  const [totalInterestOverdue, setTotalInterestOverdue] = useState(0);
  const [totalInterestOverdueDate, setTotalInterestOverdueDate] = useState({
    start:'',
    end:''
  });
  const [openTotalInterestOverdueCalender, setOpenTotalInterestOverdueCalender] = useState(false);
  const [totalOpenLoanPI, setTotalOpenLoanPI] = useState(0);
  const [totalOpenLoanPIDate, setTotalOpenLoanPIDate] = useState({
    start:'',
    end:''
  });
  const [openTotalOpenLoanPIDateCalender, setOpenTotalOpenLoanPIDateCalender] = useState(false);
  const [totalOpenLoanPrincipal, setTotalOpenLoanPrincipal] = useState(0);
  const [totalOpenLoanPrincipalDate, setTotalOpenLoanPrincipalDate] = useState({
    start:'',
    end:''
  });
  const [openTotalOpenLoanPrincipalCalender, setOpenTotalOpenLoanPrincipalCalender] = useState(false);
  
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

  if (lastUpdatedField === 'totalInterestOverdue' && cardView === 'maincard2') {
    setTotalInterestOverdue(stats.total_interest_on_loan_overdue);
  } else if (lastUpdatedField === 'totalOpenLoanPI' && cardView === 'maincard2') {
    setTotalOpenLoanPI(stats.total_open_loan);
  } else if (lastUpdatedField === 'totalOpenLoanPrincipal' && cardView === 'maincard2') {
    setTotalOpenLoanPrincipal(stats.total_open_loan_principal);
  } else if (cardView === 'none') {
    setTotalInterestOverdue(stats.total_interest_on_loan_overdue);
    setTotalOpenLoanPI(stats.total_open_loan);
    setTotalOpenLoanPrincipal(stats.total_open_loan_principal);
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
        {loading && (<LoadingPage/>)}

  {/* Card 3 */}
  <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#C73802]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total  interest on loan overdue</p>
                     <Image
                        src='/images/calendar.png'
                        width={20}
                        height={20}
                        alt=''
                        className='z-10 cursor-pointer '
                        onClick={() => {
                         
                          setOpenTotalInterestOverdueCalender(!openTotalInterestOverdueCalender)}}
                      />
                      {openTotalInterestOverdueCalender && (
                      <>
                      {/* Background Overlay */}
                      <div
                        className="fixed inset-0   z-40"
                        onClick={() => setOpenTotalInterestOverdueCalender(!openTotalInterestOverdueCalender)}
                      ></div>
                    
                      {/* Calendar Dropdown */}
                      <div className="absolute top-10 right-1    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                      <C
                    mode="range"
                    selected={{ from: totalInterestOverdueDate.start, to: totalInterestOverdueDate.end }}
                    onSelect={(range:any) => {
                    setSearchDate({startDate: '', endDate: ''});
                    setTotalInterestOverdueDate({start: formatDate(range.from), end: formatDate(range.to)});
                    setCardView('maincard2');  
                    setLastUpdatedField('totalInterestOverdue');
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
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{formatCurrency(totalInterestOverdue || 0)}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px]'/>
                </div>
            </div>
            {loading && <LoadingPage />}
            {/* Card 4 */}
            <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#1C90774D] relative rounded-[12px] shadow-custom3 border border-[#1FB2C2]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total Open loan (p + i)</p>
                     <Image
                        src='/images/calendar.png'
                        width={20}
                        height={20}
                        alt=''
                        className='z-10 cursor-pointer '
                        onClick={() => {
                         
                          setOpenTotalOpenLoanPIDateCalender(!openTotalOpenLoanPIDateCalender)}}
                      />
                                        {openTotalOpenLoanPIDateCalender && (
                      <>
                      {/* Background Overlay */}
                      <div
                        className="fixed inset-0   z-40"
                        onClick={() => setOpenTotalOpenLoanPIDateCalender(!openTotalOpenLoanPIDateCalender)}
                      ></div>
                    
                      {/* Calendar Dropdown */}
                      <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                      <C
                    mode="range"
                   selected={{ from: totalOpenLoanPIDate.start, to: totalOpenLoanPIDate.end }}
                    onSelect={(range:any) => {
                    setSearchDate({startDate: '', endDate: ''});
                    setTotalOpenLoanPIDate({start: formatDate(range.from), end: formatDate(range.to)});
                    setCardView('maincard2'); 
                      setLastUpdatedField('totalOpenLoanPI');
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
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{formatCurrency(totalOpenLoanPI  || 0)}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px]'/>
                </div>
            </div>
          {/* Card 5 */}
            <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#3510762E] relative rounded-[12px] shadow-custom3 border border-[#2B1544]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total Open loan - principal</p>
                   <Image
                      src='/images/calendar.png'
                      width={20}
                      height={20}
                      alt=''
                      className='z-10 cursor-pointer '
                      onClick={() => {
                       
                        setOpenTotalOpenLoanPrincipalCalender(!openTotalOpenLoanPrincipalCalender)}}
                    />
                                      {openTotalOpenLoanPrincipalCalender && (
                    <>
                    {/* Background Overlay */}
                    <div
                      className="fixed inset-0   z-40"
                      onClick={() => setOpenTotalOpenLoanPrincipalCalender(!openTotalOpenLoanPrincipalCalender)}
                    ></div>
                  
                    {/* Calendar Dropdown */}
                    <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                    <C
                  mode="range"
                  selected={{ from: totalOpenLoanPrincipalDate.start, to: totalOpenLoanPrincipalDate.end }}
                  onSelect={(range:any) => {
                  setSearchDate({startDate: '', endDate: ''});
                  setTotalOpenLoanPrincipalDate({start: formatDate(range.from), end: formatDate(range.to)});
                  setCardView('maincard2'); 
                    setLastUpdatedField('totalOpenLoanPrincipal');
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
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{formatCurrency(totalOpenLoanPrincipal  || 0)}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px]'/>
                </div>
            </div>

            {/* Card 6 */}
          
      </div>
    </div>
  );
};


export default MainCards2;
