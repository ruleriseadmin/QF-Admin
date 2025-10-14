import React ,{useState,useEffect} from 'react';
import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';
import { formatCurrency, formatValue } from '@/utils/loan';
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
    const [dpdPIDays, setDpdPIDays] = useState('30');
    const [openDpdPICalender, setOpenDpdPICalender] = useState(false);
    const [showDpdPI, setShowDpdPI] = useState(false);

    const [dpdPrincipal, setDpdPrincipal] = useState(0);
    const [dpdPrincipalDays, setDpdPrincipalDays] = useState('30');
    const [openDpdPrincipalCalender, setOpenDpdPrincipalCalender] = useState(false);
    const [showDpdPrincipal, setShowDpdPrincipal] = useState(false);

    const [dpdInterest, setDpdInterest] = useState(0);
    const [dpdInterestDays, setDpdInterestDays] = useState('30');
    const [openDpdInterestCalender, setOpenDpdInterestCalender] = useState(false);
    const [showDpdInterest, setShowDpdInterest] = useState(false);

    const [amountRecovered, setAmountRecovered] = useState(0);
    const [amountRecoveredDate, setAmountRecoveredDate] = useState({
      start:'',
      end:''
    });
    const [openAmountRecoveredCalender, setOpenAmountRecoveredCalender] = useState(false);
    const [showAmountRecovered, setShowAmountRecovered] = useState(false);

    const [amountCollected, setAmountCollected] = useState(0);
    const [amountCollectedDate, setAmountCollectedDate] = useState({
      start:'',
      end:''
    });
    const [openAmountCollectedCalender, setOpenAmountCollectedCalender] = useState(false);
    const [showAmountCollected, setShowAmountCollected] = useState(false);

    const [npl, setNpl] = useState(0);
    const [nplDays, setNplDays] = useState('30');
    const [openNplCalender, setOpenNplCalender] = useState(false);
    const [showNpl, setShowNpl] = useState(false);

   const formatDate = (dateString:string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      }
      
    const selection = [
      { name: '1 day', value: '1' },
      {name: '2 days', value: '3' },
      { name: '7 days', value: '7' },
      {name:'14 days', value: '14' },
      {name:'30 days', value: '30' },
      {name:'60 days', value:'60'},
      { name: '90 days', value: '90' },
    ];


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
    if(lastUpdatedField === 'dpdPI' && dpdPIDays ){
      router.replace(`${pathname}?days=${dpdPIDays}`, { scroll: false });
    }
    if(lastUpdatedField === 'dpdPrincipal' && dpdPrincipal ){
       router.replace(`${pathname}?days=${dpdPrincipalDays}`, { scroll: false });
    }
    if(lastUpdatedField === 'dpdInterest' && dpdInterest ){
       router.replace(`${pathname}?days=${dpdInterestDays}`, { scroll: false });
    }
    if(lastUpdatedField === 'npl' && npl ){
       router.replace(`${pathname}?days=${nplDays}`, { scroll: false });
    }
    if (queryStart && queryEnd) {
      router.replace(`${pathname}?start=${queryStart}&end=${queryEnd}`, { scroll: false });
    }
    
  }, [queryStart, queryEnd, dpdPIDays,dpdPrincipalDays,dpdInterestDays,nplDays]);
  
  
  

  return (
    <div className=" my-4  h-auto font-montserrat ml-4 mr-2   md:ml-11 lg:ml-8">
      <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-3">

<div>
  <div className="w-full lg:h-[142px] h-[142px] md:min-h-[142px] md:h-auto bg-[#252827] relative rounded-[12px] shadow-custom3">
    <Image
      src="/images/coin.png"
      alt="Hero Image"
      width={136}
      height={136}
      className="object-cover absolute top-10 right-0 rounded-[12px]"
    />

    <p className="h-2"></p>

    <div className="flex w-11/12 mx-auto h-[48px] px-4 items-center justify-between border border-solid border-[#E1E3E4] bg-[#E1E3E4] rounded-[12px]">
      <p className="ml-2 text-[16px] lg:text-[16px] md:text-[10px] text-[#282828] font-medium">
        <span className="font-semibold">
          {dpdPIDays || '30'} day(s)
        </span>
      </p>

      <TiArrowSortedDown
        className="text-[#828282] text-[20px] cursor-pointer"
        onClick={() => setOpenDpdPICalender(true)}
      />

      {openDpdPICalender && (
        <>
          {/* Background Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenDpdPICalender(false)}
          ></div>

          {/* Calendar Dropdown */}
          <div className="absolute top-16 w-11/12 left-4 bg-[#E0E0E0] shadow-md rounded-md z-50 p-3">
            {selection.map((select, index) => (
              <button
                key={index}
                onClick={() => {
                  setDpdPIDays(select.value);
                  setCardView('blackcards')
                  setLastUpdatedField('dpdPI')
                  setQueryStart('');
                  setQueryEnd('');
                  setSearchDate({ startDate: '', endDate: '' });
                  setOpenDpdPICalender(false);
                }}
                className={`w-full text-start ml-2 text-[16px] font-medium pb-2 text-[#464646] ${
                  index === 0 ? 'mt-2' : 'mt-1'
                }`}
              >
                <div className="flex justify-start items-center gap-4">
                  <p>{select.name}</p>
                  {select.value === dpdPIDays && (
                    <Image
                      src="/images/good.png"
                      alt="good"
                      height={17}
                      width={17}
                    />
                  )}
                </div>
              </button>
            ))}

            {/* Custom input for manual day entry */}
            <div className="flex w-full mt-3 h-[38px] px-2 items-center justify-between bg-white rounded-[12px]">
              <input
                type="number"
                value={dpdPIDays}
                onChange={(e) => {
                  setDpdPIDays(e.target.value)
                  setCardView('blackcards')
                  setLastUpdatedField('dpdPI')
                }}
                className="w-full border font-medium border-gray-300 rounded-[8px] px-2 py-1 text-[16px] text-[#282828]"
              />
            </div>
          </div>
        </>
      )}
    </div>
     <div className='flex items-center lg:m-6 m-6 md:mx-2 md:my-6 lg:gap-3 gap-3 md:gap-2'>
               <p className='text-[#FFFFFF] font-medium md:text-[12px] lg:text-[20px] text-[20px]'>Dpd (p+i)</p>
                    <p className='text-[#FFFFFF] font-bold  md:text-[12px] lg:text-[20px] text-[20px]'>{showDpdPI ? formatCurrency(dpdPI || 0) : "*****"}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowDpdPI(prev => !prev)}/>
                    
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
                <p className="ml-2 text-[16px] lg:text-[16px] md:text-[10px] text-[#282828] font-medium"><span className='font-semibold'> {dpdPrincipalDays || '30'} day(s)</span></p>
                    
                      
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
          <div className="absolute top-16 w-11/12 left-4 bg-[#E0E0E0] shadow-md rounded-md z-50 p-3">
            {selection.map((select, index) => (
              <button
                key={index}
                onClick={() => {
                  setDpdPrincipalDays(select.value);
                  setLastUpdatedField('dpdPrincipal')
                  setCardView('blackcards')
                  setQueryStart('');
                  setQueryEnd('');
                  setSearchDate({ startDate: '', endDate: '' });
                  setOpenDpdPrincipalCalender(false)
                }}
                className={`w-full text-start ml-2 text-[16px] font-medium pb-2 text-[#464646] ${
                  index === 0 ? 'mt-2' : 'mt-1'
                }`}
              >
                <div className="flex justify-start items-center gap-4">
                  <p>{select.name}</p>
                  {select.value === dpdPrincipalDays && (
                    <Image
                      src="/images/good.png"
                      alt="good"
                      height={17}
                      width={17}
                    />
                  )}
                </div>
              </button>
            ))}

            {/* Custom input for manual day entry */}
            <div className="flex w-full mt-3 h-[38px] px-2 items-center justify-between bg-white rounded-[12px]">
              <input
                type="number"
                value={dpdPrincipalDays}
                onChange={(e) => {
                  setDpdPrincipalDays(e.target.value)
                  setCardView('blackcards')
                  setLastUpdatedField('dpdPrincipal')
                }}
                className="w-full border font-medium border-gray-300 rounded-[8px] px-2 py-1 text-[16px] text-[#282828]"
              />
            </div>
          </div>
                                                     
                                                       </>
                                                   )}

                </div>
                <div className='flex items-center lg:m-6 m-6 md:mx-2 md:my-6 lg:gap-3 gap-3 md:gap-2'>
               <p className='text-[#FFFFFF] font-medium md:text-[12px] lg:text-[20px] text-[20px]'>Dpd (p)</p>
                    <p className='text-[#FFFFFF] font-bold  md:text-[12px] lg:text-[20px] text-[20px]'>{ showDpdPrincipal ? formatCurrency(dpdPrincipal || 0) : '*****'}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowDpdPrincipal(prev => !prev)}/>
                    
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
                <p className="ml-2 text-[16px] lg:text-[16px] md:text-[10px] text-[#282828] font-medium"><span className='font-semibold'> {dpdInterestDays || '30'} day(s)</span></p>
                    
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
          <div className="absolute top-16 w-11/12 left-4 bg-[#E0E0E0] shadow-md rounded-md z-50 p-3">
            {selection.map((select, index) => (
              <button
                key={index}
                onClick={() => {
                  setDpdInterestDays(select.value);
                  setLastUpdatedField('dpdInterest')
                  setCardView('blackcards')
                  setQueryStart('');
                  setQueryEnd('');
                  setSearchDate({ startDate: '', endDate: '' });
                  setOpenDpdInterestCalender(false)
                }}
                className={`w-full text-start ml-2 text-[16px] font-medium pb-2 text-[#464646] ${
                  index === 0 ? 'mt-2' : 'mt-1'
                }`}
              >
                <div className="flex justify-start items-center gap-4">
                  <p>{select.name}</p>
                  {select.value === dpdInterestDays && (
                    <Image
                      src="/images/good.png"
                      alt="good"
                      height={17}
                      width={17}
                    />
                  )}
                </div>
              </button>
            ))}

            {/* Custom input for manual day entry */}
            <div className="flex w-full mt-3 h-[38px] px-2 items-center justify-between bg-white rounded-[12px]">
              <input
                type="number"
                value={dpdInterestDays}
                onChange={(e) => {
                  setDpdInterestDays(e.target.value)
                  setCardView('blackcards')
                  setLastUpdatedField('dpdInterest')
                }}
                className="w-full border font-medium border-gray-300 rounded-[8px] px-2 py-1 text-[16px] text-[#282828]"
              />
            </div>
          </div>
                                                     
                                                       </>
                                                   )}
                </div>
                <div className='flex items-center lg:m-6 m-6 md:mx-2 md:my-6 lg:gap-3 gap-3 md:gap-2'>
               <p className='text-[#FFFFFF] font-medium md:text-[12px] lg:text-[20px] text-[20px]'>Dpd (i)</p>
                    <p className='text-[#FFFFFF] font-bold  md:text-[12px] lg:text-[20px] text-[20px]'>{ showDpdInterest ? formatCurrency(dpdInterest || 0) : '*****'}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowDpdInterest(prev => !prev)}/>
                    
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
                              <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showAmountRecovered ? formatCurrency(Math.abs(amountRecovered) || 0) : '*****'}</p>
                              <FaEye 
                              className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowAmountRecovered(prev => !prev)}/>
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
                              <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showAmountCollected ? formatCurrency(amountCollected || 0) : '*****'}</p>
                              <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' 
                              onClick={() => setShowAmountCollected(prev => !prev)}
                              />
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
                <p className="ml-2 text-[16px] lg:text-[16px] md:text-[10px] text-[#282828] font-medium"><span className='font-semibold'> {nplDays || '30'} day(s)</span></p>
                    
                     
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
          <div className="absolute top-16 w-11/12 left-4 bg-[#E0E0E0] shadow-md rounded-md z-50 p-3">
            {selection.map((select, index) => (
              <button
                key={index}
                onClick={() => {
                  setNplDays(select.value);
                  setLastUpdatedField('npl')
                  setCardView('blackcards')
                  setQueryStart('');
                  setQueryEnd('');
                  setSearchDate({ startDate: '', endDate: '' });
                  setOpenNplCalender(false)
                }}
                className={`w-full text-start ml-2 text-[16px] font-medium pb-2 text-[#464646] ${
                  index === 0 ? 'mt-2' : 'mt-1'
                }`}
              >
                <div className="flex justify-start items-center gap-4">
                  <p>{select.name}</p>
                  {select.value === nplDays && (
                    <Image
                      src="/images/good.png"
                      alt="good"
                      height={17}
                      width={17}
                    />
                  )}
                </div>
              </button>
            ))}

            {/* Custom input for manual day entry */}
            <div className="flex w-full mt-3 h-[38px] px-2 items-center justify-between bg-white rounded-[12px]">
              <input
                type="number"
                value={nplDays}
                onChange={(e) => {
                  setNplDays(e.target.value)
                  setCardView('blackcards')
                  setLastUpdatedField('npl')
                }}
                className="w-full border font-medium border-gray-300 rounded-[8px] px-2 py-1 text-[16px] text-[#282828]"
              />
            </div>
          </div>
                                                           </>
                                                       )}
                  </div>
                  <div className='flex items-center lg:m-6 m-6 md:mx-2 md:my-6 lg:gap-3 gap-3 md:gap-2'>
               <p className='text-[#FFFFFF] font-medium md:text-[12px] lg:text-[20px] text-[20px]'>Npl</p>
                    <p className='text-[#FFFFFF] font-bold  md:text-[12px] lg:text-[20px] text-[20px]'>{showNpl ? formatValue(Math.abs(npl)) : '*****'} %</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowNpl(prev => !prev)}/>
                    
                </div>
   

                </div>
                
            </div>
            

    
          </div>
          
       
        
      </div>
    
  );
};

export default BlackCards;
