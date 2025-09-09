import React ,{useState,useEffect} from 'react';
import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';
import { formatCurrency } from '@/utils/loan';
import { useRouter,useSearchParams,usePathname } from 'next/navigation';
import LoadingPage from '@/app/loading';
import { FaEye } from 'react-icons/fa';
import { subDays } from 'date-fns';
import { DateRange } from "react-day-picker";
import { Dispatch, SetStateAction } from 'react';
import {Calendar as C} from "@/components/dashboard/DashboardCalender"


type BlackCardsProps = {
  stats: any;
   cardView:string;
   setCardView: Dispatch<SetStateAction<string>>;
   loading:boolean
};

const BlackCards: React.FC<BlackCardsProps> = ({ stats ,cardView,setCardView,loading}) => {
   const router = useRouter();
    const pathname = usePathname()
          const [queryStart, setQueryStart] = useState('');
          const [queryEnd, setQueryEnd] = useState('');
          const [dateRange, setDateRange] = useState<DateRange | undefined>({
                from: subDays(new Date(), 29),
                to: new Date(),
              })
        const [lastUpdatedField, setLastUpdatedField] = useState<string | null>(null);
    const [searchDate, setSearchDate] = useState({startDate: '', endDate: ''});
    
    const [dpdPI, setDpdPI] = useState(0);
    const [dpdPIDate, setDpdPIDate] = useState({
      start:'',
      end:''
    });
    const [openDpdPICalender, setOpenDpdPICalender] = useState(false);
    const [dpdPrincipal, setDpdPrincipal] = useState(0);
    const [dpdPrincipalDate, setDpdPrincipalDate] = useState({
      start:'',
      end:''
    });
    const [openDpdPrincipalCalender, setOpenDpdPrincipalCalender] = useState(false);
    const [dpdInterest, setDpdInterest] = useState(0);
    const [dpdInterestDate, setDpdInterestDate] = useState({
      start:'',
      end:''
    });
    const [openDpdInterestCalender, setOpenDpdInterestCalender] = useState(false);
    const [amountRecovered, setAmountRecovered] = useState(0);
    const [amountRecoveredDate, setAmountRecoveredDate] = useState({
      start:'',
      end:''
    });
    const [openAmountRecoveredCalender, setOpenAmountRecoveredCalender] = useState(false);
    const [amountCollected, setAmountCollected] = useState(0);
    const [amountCollectedDate, setAmountCollectedDate] = useState({
      start:'',
      end:''
    });
    const [openAmountCollectedCalender, setOpenAmountCollectedCalender] = useState(false);
    const [npl, setNpl] = useState(0);
    const [nplDate, setNplDate] = useState({
      start:'',
      end:''
    });
    const [openNplCalender, setOpenNplCalender] = useState(false);

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

  const data = stats;

  if (lastUpdatedField === 'dpdPI' && cardView === 'blackcards') {
    setDpdPI(data?.Dpd || 0);
  } else if (lastUpdatedField === 'dpdPrincipal' && cardView === 'blackcards') {
    setDpdPrincipal(data?.Dpd_principal || 0);
  } else if (lastUpdatedField === 'dpdInterest' && cardView === 'blackcards') {
    setDpdInterest(data?.dpd_interest || 0);
  } else if (lastUpdatedField === 'amountRecovered' && cardView === 'blackcards') {
    setAmountRecovered(data?.total_amount_recovered || 0);
  } else if (lastUpdatedField === 'amountCollected' && cardView === 'blackcards') {
    setAmountCollected(data?.total_interest_on_loans_collected || 0);
  } else if (lastUpdatedField === 'npl' && cardView === 'blackcards') {
    setNpl(data?.npl || 0);
  } else if (cardView === 'none') {
    setDpdPI(data?.Dpd || 0);
    setDpdPrincipal(data?.Dpd_principal || 0);
    setDpdInterest(data?.dpd_interest || 0);
    setAmountRecovered(data?.total_amount_recovered || 0);
    setAmountCollected(data?.total_interest_on_loans_collected || 0);
    setNpl(data?.npl || 0);
  }
}, [stats, lastUpdatedField, cardView]);


  useEffect(() => {
    if (queryStart && queryEnd) {
      router.replace(`${pathname}?start=${queryStart}&end=${queryEnd}`, { scroll: false });
    }
  }, [queryStart, queryEnd]);
  
  
  

  return (
    <div className=" my-4  h-auto font-montserrat ml-4 mr-2   md:ml-11 lg:ml-8">
      <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-3">

          <div>
            <div  className={`w-full lg:h-[142px] h-[142px] md:min-h-[142px] md:h-auto bg-[#252827] relative rounded-[12px] shadow-custom3  `}>
            <Image
                src='/images/coin.png'
                alt='Hero Image'
                width={136}
                height={136}
                className="object-cover absolute top-10 right-0 rounded-[12px]"
                />
                <p className='h-2'></p>
                <div className='flex w-11/12 mx-auto h-[48px] px-4 items-center justify-between border border-solid border-[#E1E3E4] bg-[#E1E3E4]  rounded-[12px]'>
                <p className="ml-2 text-[16px] lg:text-[16px] md:text-[10px] text-[#282828] font-medium"><span className='font-semibold'> {(dpdPIDate.start && dpdPIDate.end ) ?  `${dpdPIDate.start} - ${dpdPIDate.start}`  : 'dd-mm-yy - dd-mm-yy'}</span></p>
                    
                <TiArrowSortedDown 
                className="text-[#828282] text-[20px]  cursor-pointer "
                onClick={() => setOpenDpdPICalender(true)}
                />
                 {openDpdPICalender && (
                                                        <>
                                                           {/* Background Overlay */}
                                                           <div
                                                             className="fixed inset-0   z-40"
                                                             onClick={() => setOpenDpdPICalender(false)}
                                                           ></div>
                                                       
                                                           {/* Calendar Dropdown */}
                                                           <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                                           <C
                                                       mode="range"
                                                       selected={{ from: dpdPIDate.start, to: dpdPIDate.end }}
                                                       onSelect={(range:any) => {
                                                         setSearchDate({startDate: '', endDate: ''});
                                                          setDpdPIDate({start: formatDate(range.from), end: formatDate(range.to)});
                                                         setCardView('blackcards')
                                                          setLastUpdatedField('dpdPI');
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
                <div className='flex items-center lg:m-6 m-6 md:mx-2 md:my-6 lg:gap-3 gap-3 md:gap-2'>
               <p className='text-[#FFFFFF] font-medium md:text-[12px] lg:text-[20px] text-[20px]'>Dpd (p+i)</p>
                    <p className='text-[#FFFFFF] font-bold  md:text-[12px] lg:text-[20px] text-[20px]'>{formatCurrency(dpdPI || 0)}</p>
                    
                </div>
            </div>
            

    {loading && <LoadingPage />}
          </div>
          {/* Second Card */}
          <div>
            <div  className={`w-full lg:h-[142px] h-[142px] md:min-h-[142px] md:h-auto bg-[#252827] relative rounded-[12px] shadow-custom3  `}>
            <Image
                src='/images/coin.png'
                alt='Hero Image'
                width={136}
                height={136}
                className="object-cover absolute top-10 right-0 rounded-[12px]"
                />
                <p className='h-2'></p>
                <div className='flex w-11/12 mx-auto h-[48px] px-4 items-center justify-between border border-solid border-[#E1E3E4] bg-[#E1E3E4]  rounded-[12px]'>
                <p className="ml-2 text-[16px] lg:text-[16px] md:text-[10px] text-[#282828] font-medium"><span className='font-semibold'> {(dpdPrincipalDate.start && dpdPrincipalDate.end ) ?  `${dpdPrincipalDate.start} - ${dpdPrincipalDate.start}`  : 'dd-mm-yy - dd-mm-yy'}</span></p>
                    
                      
                <TiArrowSortedDown
                onClick={() => setOpenDpdPrincipalCalender(true)} 
                className="text-[#828282] text-[20px]  cursor-pointer " />
               {openDpdPrincipalCalender && (
                                                      <>
                                                         {/* Background Overlay */}
                                                         <div
                                                           className="fixed inset-0   z-40"
                                                           onClick={() => setOpenDpdPrincipalCalender(false)}
                                                         ></div>
                                                     
                                                         {/* Calendar Dropdown */}
                                                         <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                                         <C
                                                     mode="range"
                                                     selected={{ from: dpdPrincipalDate.start, to: dpdPrincipalDate.end }}
                                                     onSelect={(range:any) => {
                                                       setSearchDate({startDate: '', endDate: ''});
                                                        setDpdPrincipalDate({start: formatDate(range.from), end: formatDate(range.to)});
                                                        setCardView('blackcards')
                                                        setLastUpdatedField('dpdPrincipal');
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
                <div className='flex items-center lg:m-6 m-6 md:mx-2 md:my-6 lg:gap-3 gap-3 md:gap-2'>
               <p className='text-[#FFFFFF] font-medium md:text-[12px] lg:text-[20px] text-[20px]'>Dpd (p)</p>
                    <p className='text-[#FFFFFF] font-bold  md:text-[12px] lg:text-[20px] text-[20px]'>{formatCurrency(dpdPrincipal || 0)}</p>
                    
                </div>
            </div>
            

    
          </div>
          {/* Third Card */}
          <div>
            <div  className={`w-full lg:h-[142px] h-[142px] md:min-h-[142px] md:h-auto bg-[#252827] relative rounded-[12px] shadow-custom3  `}>
            <Image
                src='/images/coin.png'
                alt='Hero Image'
                width={136}
                height={136}
                className="object-cover absolute top-10 right-0 rounded-[12px]"
                />
                <p className='h-2'></p>
                <div className='flex w-11/12 mx-auto h-[48px] px-4 items-center justify-between border border-solid border-[#E1E3E4] bg-[#E1E3E4]  rounded-[12px]'>
                <p className="ml-2 text-[16px] lg:text-[16px] md:text-[10px] text-[#282828] font-medium"><span className='font-semibold'> {(dpdInterestDate.start && dpdInterestDate.end ) ?  `${dpdInterestDate.start} - ${dpdInterestDate.end}`  : 'dd-mm-yy - dd-mm-yy'}</span></p>
                    
              <TiArrowSortedDown 
              onClick={() => setOpenDpdInterestCalender(true)}
              className="text-[#828282] text-[20px]  cursor-pointer " />
                    
               {openDpdInterestCalender && (
                                                      <>
                                                         {/* Background Overlay */}
                                                         <div
                                                           className="fixed inset-0   z-40"
                                                           onClick={() => setOpenDpdInterestCalender(false)}
                                                         ></div>
                                                     
                                                         {/* Calendar Dropdown */}
                                                         <div className="absolute top-10 right-1    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                                         <C
                                                     mode="range"
                                                     selected={{ from: dpdInterestDate.start, to: dpdInterestDate.end }}
                                                     onSelect={(range:any) => {
                                                       setSearchDate({startDate: '', endDate: ''});
                                                        setDpdInterestDate({start: formatDate(range.from), end: formatDate(range.to)});
                                                        setCardView('blackcards')
                                                        setLastUpdatedField('dpdInterest');
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
                <div className='flex items-center lg:m-6 m-6 md:mx-2 md:my-6 lg:gap-3 gap-3 md:gap-2'>
               <p className='text-[#FFFFFF] font-medium md:text-[12px] lg:text-[20px] text-[20px]'>Dpd (i)</p>
                    <p className='text-[#FFFFFF] font-bold  md:text-[12px] lg:text-[20px] text-[20px]'>{formatCurrency(dpdInterest || 0)}</p>
                    
                </div>
            </div>
            

    
          </div>
          {/* Fourth Card */}
          <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#1FB2C2]`}>
                      <img
                          src='/images/coin.png'
                          alt='Hero Image'
                          className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                          />
                          <div className='flex lg:mx-6 md:mx-2 mx-6 mt-6 mb-4 justify-between items-center'>
                              <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total amount recovered
                              <br/>(principal, penalty. Interest)</p>
                              <Image
                                                                      src='/images/calendar.png'
                                                                      width={20}
                                                                      height={20}
                                                                      alt=''
                                                                      className='z-10 cursor-pointer '
                                                                      onClick={() => setOpenAmountRecoveredCalender(true)}
                                                                    />
                                                                  
                                                                  {openAmountRecoveredCalender && (
                                                                     <>
                                                                        {/* Background Overlay */}
                                                                        <div
                                                                          className="fixed inset-0   z-40"
                                                                          onClick={() => setOpenAmountRecoveredCalender(false)}
                                                                        ></div>
                                                                    
                                                                        {/* Calendar Dropdown */}
                                                                        <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                                                        <C
                                                                    mode="range"
                                                                    selected={{ from: amountRecoveredDate.start, to: amountRecoveredDate.end }}
                                                                    onSelect={(range:any) => {
                                                                      setSearchDate({startDate: '', endDate: ''});
                                                                      setAmountRecoveredDate({start: formatDate(range.from), end: formatDate(range.to)});
                                                                       setCardView('blackcards')
                                                                      setLastUpdatedField('amountRecovered');
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
                         
                          <div className='flex items-center m-6  lg:mt-0  lg:m-6 md:mx-2 gap-3 lg:gap-3 md:gap-2 md:my-5'>
                          <img
                          src={`/images/disbursed2.png`}
                          alt='Hero Image'
                          className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
          />
                              <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{formatCurrency(Math.abs(amountRecovered) || 0)}</p>
                              <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px]'/>
                          </div>
                      </div>
          {/* Fifth Card */}
          <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#1FB2C2]`}>
                      <img
                          src='/images/coin.png'
                          alt='Hero Image'
                          className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                          />
                          <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                              <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total interest on loan collected</p>
                               <Image
                                                                       src='/images/calendar.png'
                                                                       width={20}
                                                                       height={20}
                                                                       alt=''
                                                                       className='z-10 cursor-pointer '
                                                                       onClick={() => setOpenAmountCollectedCalender(true)}
                                                                     />
                                                                   
                                                                   {openAmountCollectedCalender && (
                                                                      <>
                                                                         {/* Background Overlay */}
                                                                         <div
                                                                           className="fixed inset-0   z-40"
                                                                           onClick={() => setOpenAmountCollectedCalender(false)}
                                                                         ></div>
                                                                     
                                                                         {/* Calendar Dropdown */}
                                                                         <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                                                         <C
                                                                     mode="range"
                                                                     selected={{ from: amountCollectedDate.start, to: amountCollectedDate.end }}
                                                                     onSelect={(range:any) => {
                                                                       setSearchDate({startDate: '', endDate: ''});
                                                                        setAmountCollectedDate({start: formatDate(range.from), end: formatDate(range.to)});
                                                                        setCardView('blackcards')
                                                                        setLastUpdatedField('amountCollected');
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
                              <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{formatCurrency(amountCollected || 0)}</p>
                              <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px]'/>
                          </div>
                      </div>
          
          {/* sixth Card */}
          <div>
            <div  className={`w-full lg:h-[142px] h-[142px] md:min-h-[142px] md:h-auto bg-[#252827] relative rounded-[12px] shadow-custom3  `}>
            <Image
                src='/images/coin.png'
                alt='Hero Image'
                width={136}
                height={136}
                className="object-cover absolute top-10 right-0 rounded-[12px]"
                />
                <p className='h-2'></p>
                <div className='flex w-11/12 mx-auto h-[48px] px-4 items-center justify-between border border-solid border-[#E1E3E4] bg-[#E1E3E4]  rounded-[12px]'>
                <p className="ml-2 text-[16px] lg:text-[16px] md:text-[10px] text-[#282828] font-medium"><span className='font-semibold'> {(nplDate.start && nplDate.end ) ?  `${nplDate.start} - ${nplDate.end}`  :  'dd-mm-yy - dd-mm-yy'}</span></p>
                    
                     
                        <TiArrowSortedDown 
                        onClick={() => setOpenNplCalender(true)}
                        className="text-[#828282] text-[20px]  cursor-pointer " />
                   {openNplCalender && (
                                                          <>
                                                             {/* Background Overlay */}
                                                             <div
                                                               className="fixed inset-0   z-40"
                                                               onClick={() => setOpenNplCalender(false)}
                                                             ></div>
                                                         
                                                             {/* Calendar Dropdown */}
                                                             <div className="absolute top-10 right-1    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                                             <C
                                                         mode="range"
                                                         selected={{ from: nplDate.start, to: nplDate.end }}
                                                         onSelect={(range:any) => {
                                                           setSearchDate({startDate: '', endDate: ''});
                                                            setNplDate({start: formatDate(range.from), end: formatDate(range.to)});
                                                            setCardView('blackcards')
                                                            setLastUpdatedField('npl');
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
                  <div className='flex items-center lg:m-6 m-6 md:mx-2 md:my-6 lg:gap-3 gap-3 md:gap-2'>
               <p className='text-[#FFFFFF] font-medium md:text-[12px] lg:text-[20px] text-[20px]'>Npl</p>
                    <p className='text-[#FFFFFF] font-bold  md:text-[12px] lg:text-[20px] text-[20px]'>{formatCurrency(Math.abs(npl))}</p>
                    
                </div>
   

                </div>
                
            </div>
            

    
          </div>
          
       
      </div>
    
  );
};

export default BlackCards;
