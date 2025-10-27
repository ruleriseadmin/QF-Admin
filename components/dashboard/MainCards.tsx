import React, {useRef,useState,useEffect} from 'react';
import Image from 'next/image';
import { FaEye } from "react-icons/fa6";
import { useRouter,usePathname } from 'next/navigation';
import { formatCurrency } from '@/utils/loan';
import { subDays } from 'date-fns';
import { DateRange } from "react-day-picker";
import {Calendar as C} from "@/components/dashboard/DashboardCalender"
import { Dispatch, SetStateAction } from 'react';
import LoadingPage from '@/app/loading';

type MainCardsProps = {
   stats: any;
   cardView:string;
   setCardView: Dispatch<SetStateAction<string>>;
   loading:boolean
};

const MainCards: React.FC<MainCardsProps> = ({ stats,cardView,setCardView,loading }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const [searchDate, setSearchDate] = useState({startDate: '', endDate: ''});
  
  const [loanDisburedPI, setLoanDisburedPI] = useState(0);
  const [lastUpdatedField, setLastUpdatedField] = useState<string | null>(null);
  const [loanDisburedDate, setLoanDisburedDate] = useState({
    start:'',
    end:''
  });
  const [showDisbursedPI, setShowDisbursedPI] = useState(true);
  const [fullyCollectedPI, setFullyCollectedPI] = useState(0);
  const [fullyCollectedDate, setFullyCollectedDate] = useState({
    start:'',
    end:''
  });
  const [showFullyCollectedPI, setShowFullyCollectedPI] = useState(true);
  const [totalLoanOverduePI, setTotalLoanOverduePI] = useState(0);
  const [totalLoanOverdueDate, setTotalLoanOverdueDate] = useState({
    start:'',
    end:''

  });
  const [showTotalLoanOverduePI, setShowTotalLoanOverduePI] = useState(true);
  const [totalLoanDisbursedPrincipal, setTotalLoanDisbursedPrincipal] = useState(0);
  const [totalLoanDisbursedPrincipalDate, setTotalLoanDisbursedPrincipalDate] = useState({
    start:'',
    end:''
  });
  const [showTotalLoanDisbursedPrincipal, setShowTotalLoanDisbursedPrincipal] = useState(true)
  const [totalLoanOverduePrincipal, setTotalLoanOverduePrincipal] = useState(0);
  const [totalLoanOverduePrincipalDate, setTotalLoanOverduePrincipalDate] = useState({
    start:'',
    end:''
  });
  const [showTotalLoanOverduePrincipal, setShowTotalLoanOverduePrincipal] = useState(true)
  const [totalInterestDisbursed, setTotalInterestDisbursed] = useState(0);
   const [totalInterestDisbursedDate, setTotalInterestDisbursedDate] = useState({
     start:'',
     end:''
   });
   const [showTotalInterestDisbursed, setShowTotalInterestDisbursed] = useState(true)
   const [openTotalInterestDisbursedCalender, setOpenTotalInterestDisbursedCalender] = useState(false);
  const [openCalenderDisbursed, setopenCalenderDisbursed] = useState(false);
  const [openCalenderCollected, setOpenCalenderCollected] = useState(false)
  const [openCalenderOverdue, setOpenCalenderOverdue] = useState(false)
  const [openCalenderDisbursedPrincipal, setOpenCalenderDisbursedPrincipal] = useState(false)
  const [openCalenderOverduePrincipal, setOpenCalenderOverduePrincipal] = useState(false)
  
  const [queryStart, setQueryStart] = useState('');
  const [queryEnd, setQueryEnd] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  })
  

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

  if (lastUpdatedField === 'loanDisburedDate' && cardView === 'maincards') {
    console.log('setting loan disbured');
    setLoanDisburedPI(stats.total_loan_disbursed);
  } else if (lastUpdatedField === 'fullyCollectedDate' && cardView === 'maincards') {
    console.log('fullycollected');
    setFullyCollectedPI(stats.fully_collected_loans);
  } else if (lastUpdatedField === 'totalLoanOverdueDate' && cardView === 'maincards') {
    setTotalLoanOverduePI(stats.total_loan_overdue);
  } else if (lastUpdatedField === 'totalLoanDisbursedPrincipalDate' && cardView === 'maincards') {
    setTotalLoanDisbursedPrincipal(stats.total_loan_disbursed_principal);
  } else if (lastUpdatedField === 'totalInterestDisbursed' && cardView === 'maincards') {
    setTotalInterestDisbursed(stats.total_interest_on_loan_disbursed);
  } else if (lastUpdatedField === 'totalLoanOverduePrincipalDate' && cardView === 'maincards') {
    setTotalLoanOverduePrincipal(stats.total_loan_overdue_principal);
  } else if (cardView === 'none') {
    setLoanDisburedPI(stats.total_loan_disbursed);
    setFullyCollectedPI(stats.fully_collected_loans);
    setTotalLoanOverduePI(stats.total_loan_overdue);
    setTotalLoanDisbursedPrincipal(stats.total_loan_disbursed_principal);
    setTotalInterestDisbursed(stats.total_interest_on_loan_disbursed);
    setTotalLoanOverduePrincipal(stats.total_loan_overdue_principal);
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
        
        
         
            {/* Card 1 */}
           <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#3E6151]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total loan disbursed (p + i)</p>
                    
  
  <Image
    src='/images/calendar.png'
    width={20}
    height={20}
    alt=''
    className='z-10 cursor-pointer '
    onClick={() => setopenCalenderDisbursed(!openCalenderDisbursed)}
  />

{openCalenderDisbursed && (
   <>
      {/* Background Overlay */}
      <div
        className="fixed inset-0   z-40"
        onClick={() => setopenCalenderDisbursed(!openCalenderDisbursed)}
      ></div>
  
      {/* Calendar Dropdown */}
      <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
      <C
  mode="range"
  selected={{ from: loanDisburedDate.start  , 
    to: loanDisburedDate.end  }}
  onSelect={(range:any) => {
    setSearchDate({startDate: '', endDate: ''});
    setLoanDisburedDate({
      start: formatDate(range.from) 
        ,
      end: formatDate(range.to)   
    });
    setCardView('maincards');
    setLastUpdatedField('loanDisburedDate');
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
                src={`/images/disbursed.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{ showDisbursedPI ? formatCurrency(loanDisburedPI || 0) : '*****'}</p>
                    <FaEye 
                     onClick={() => setShowDisbursedPI(prev => !prev)}
                    className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer'/>
                </div>
            </div>

            {/* Card 2 */}
           <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#EEF12B]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total Collected Loan (p+i)</p>
                    <Image
    src='/images/calendar.png'
    width={20}
    height={20}
    alt=''
    className='z-10 cursor-pointer '
    onClick={() => {
     
      setOpenCalenderCollected(!openCalenderCollected)}}
  />
                    {openCalenderCollected && (
  <>
  {/* Background Overlay */}
  <div
    className="fixed inset-0   z-40"
    onClick={() => setOpenCalenderCollected(!openCalenderCollected)}
  ></div>

  {/* Calendar Dropdown */}
  <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
  <C
mode="range"
selected={{ from: fullyCollectedDate.start  , 
to: fullyCollectedDate.end  }}
onSelect={(range:any) => {
setSearchDate({startDate: '', endDate: ''});
setFullyCollectedDate({
  start: formatDate(range.from) 
    ,
  end: formatDate(range.to) 
});
setCardView('maincards');
  setLastUpdatedField('fullyCollectedDate');
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
                src={`/images/disbursed3.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showFullyCollectedPI ? formatCurrency(fullyCollectedPI || 0) : '*****'}</p>
                    <FaEye
                    onClick={() => setShowFullyCollectedPI(prev => !prev)} 
                    className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer'/>
                </div>
            </div>
            {loading && (<LoadingPage/>)}

  {/* Card 3 */}
  <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#C73802]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total loan overdue (p + i + p)</p> 
 
  <Image
    src='/images/calendar.png'
    width={20}
    height={20}
    alt=''
    className=' z-10 cursor-pointer '
    onClick={() => {
      setOpenCalenderOverdue(!openCalenderOverdue)}}
  />
  {openCalenderOverdue && (
  <>
  {/* Background Overlay */}
  <div
    className="fixed inset-0   z-40"
    onClick={() =>setOpenCalenderOverdue(!openCalenderOverdue)}
  ></div>

  {/* Calendar Dropdown */}
  <div className="absolute top-12  right-1   bg-[#E0E0E0] shadow-md rounded-md  z-50">
  <C
mode="range"
selected={{ from: totalLoanOverdueDate.start  , 
to: totalLoanOverdueDate.end  }}
onSelect={(range:any) => {
setSearchDate({startDate: '', endDate: ''});
setTotalLoanOverdueDate({
  start: formatDate(range.from) 
    ,
  end: formatDate(range.to)
});
setCardView('maincards');
  setLastUpdatedField('totalLoanOverdueDate');
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
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showTotalLoanOverduePI ? formatCurrency(totalLoanOverduePI || 0) : '*****'}</p>
                    <FaEye 
                    onClick={() => setShowTotalLoanOverduePI(prev => !prev) }
                    className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer'/>
                </div>
            </div>
            {/* Card 4 */}
            <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#A6F4C58F] relative rounded-[12px] shadow-custom3 border border-[#3E6151]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total loan disbursed- Principal</p>
                   
  <Image
    src='/images/calendar.png'
    width={20}
    height={20}
    alt=''
    className='z-10  cursor-pointer '
    onClick={() => setOpenCalenderDisbursedPrincipal(!openCalenderDisbursedPrincipal)}
  />
  {openCalenderDisbursedPrincipal && (
     <>
     {/* Background Overlay */}
     <div
       className="fixed inset-0   z-40"
       onClick={() => setOpenCalenderDisbursedPrincipal(!openCalenderDisbursedPrincipal)}
     ></div>
   
     {/* Calendar Dropdown */}
     <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
     <C
   mode="range"
   selected={{ from: totalLoanDisbursedPrincipalDate.start  , 
   to: totalLoanDisbursedPrincipalDate.end  }}
   onSelect={(range:any) => {
   setSearchDate({startDate: '', endDate: ''});
    setTotalLoanDisbursedPrincipalDate({
      start: formatDate(range.from),
      end: formatDate(range.to)
    });
    setCardView('maincards');
     setLastUpdatedField('totalLoanDisbursedPrincipalDate');
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
                src={`/images/disbursed.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showTotalLoanDisbursedPrincipal ? formatCurrency(totalLoanDisbursedPrincipal || 0) : '*****'}</p>
                    <FaEye 
                    onClick={() => setShowTotalLoanDisbursedPrincipal(prev => !prev)}
                    className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer'/>
                </div>
            </div>
          {/* Card 5 */}
                  <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#3E6151]`}>
                      <img
                          src='/images/coin.png'
                          alt='Hero Image'
                          className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                          />
                          <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                              <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total Interest on loan disbursed </p>
                              <Image
                                  src='/images/calendar.png'
                                  width={20}
                                  height={20}
                                  alt=''
                                  className='z-10 cursor-pointer '
                                  onClick={() => setOpenTotalInterestDisbursedCalender(!openTotalInterestDisbursedCalender)}
                                />
                              
                              {openTotalInterestDisbursedCalender && (
                                 <>
                                    {/* Background Overlay */}
                                    <div
                                      className="fixed inset-0   z-40"
                                      onClick={() => setOpenTotalInterestDisbursedCalender(false)}
                                    ></div>
                                
                                    {/* Calendar Dropdown */}
                                    <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                    <C
                                mode="range"
                                selected={{ from: totalInterestDisbursedDate.start, to: totalInterestDisbursedDate.end }}
                                onSelect={(range:any) => {
                                  setSearchDate({startDate: '', endDate: ''});
                                  setTotalInterestDisbursedDate({start: formatDate(range.from), end: formatDate(range.to)});
                                  setCardView('maincards');
                                  setLastUpdatedField('totalInterestDisbursed');
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
                          src={`/images/disbursed.png`}
                          alt='Hero Image'
                          className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
          />
                              <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{ showTotalInterestDisbursed ? formatCurrency(totalInterestDisbursed || 0) : '*****'}</p>
                              <FaEye 
                              onClick={() => setShowTotalInterestDisbursed(prev => !prev)}
                              className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer'/>
                          </div>
                      </div>
          
            {/* Card 6 */}
            <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#632C2C29] relative rounded-[12px] shadow-custom3 border border-[#C73802]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total loan overdue -principal</p>
                   
  <Image
    src='/images/calendar.png'
    width={20}
    height={20}
    alt=''
    className='z-10  cursor-pointer '
    onClick={() => setOpenCalenderOverduePrincipal(!openCalenderOverduePrincipal)}
  />
  {openCalenderOverduePrincipal && (
     <>
     {/* Background Overlay */}
     <div
       className="fixed inset-0   z-40"
       onClick={() => setOpenCalenderOverduePrincipal(!openCalenderOverduePrincipal)}
     ></div>
   
     {/* Calendar Dropdown */}
     <div className="absolute top-12  right-1  bg-[#E0E0E0] shadow-md rounded-md  z-50">
     <C
   mode="range"
   selected={{ from: totalLoanOverduePrincipalDate.start  , 
   to: totalLoanOverduePrincipalDate.end  }}
   onSelect={(range:any) => {
   setSearchDate({startDate: '', endDate: ''});
    setTotalLoanOverduePrincipalDate({
      start: formatDate(range.from),
      end: formatDate(range.to)
    });
    setCardView('maincards');
     setLastUpdatedField('totalLoanOverduePrincipalDate');
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
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{ showTotalLoanOverduePrincipal ? formatCurrency(totalLoanOverduePrincipal | 0) : "*****"}</p>
                    <FaEye 
                    onClick={() => setShowTotalLoanOverduePrincipal(prev => !prev)}
                    className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer'/>
                </div>
            </div>
      </div>
    </div>
  );
};


export default MainCards;
