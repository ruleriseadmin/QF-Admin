import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaEye } from 'react-icons/fa6';
import { useRouter, usePathname } from 'next/navigation';
import LoadingPage from '@/app/loading';
import { subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar as C } from '@/components/dashboard/DashboardCalender';
import { Dispatch, SetStateAction } from 'react';
import { formatCurrency } from '@/utils/loan';

type MainCards3Props = {
  stats: any;
  cardView:string;
  setCardView: Dispatch<SetStateAction<string>>;
  loading:boolean
};

const MainCards3: React.FC<MainCards3Props> = ({ stats, cardView, setCardView,loading }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [queryStart, setQueryStart] = useState('');
  const [queryEnd, setQueryEnd] = useState('');
  const [dateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [searchDate, setSearchDate] = useState({ startDate: '', endDate: '' });
  const [lastUpdatedField, setLastUpdatedField] = useState<string | null>(null);

  const [loanDueToday, setLoanDueToday] = useState(0);
  const [loanDueTodayPrincipal, setLoanDueTodayPrincipal] = useState(0);
  const [loanDueTodayInterest, setLoanDueTodayInterest] = useState(0);
  const [loanDisbursedCount, setLoanDisbursedCount] = useState(0);
  const [loanOpenCount, setLoanOpenCount] = useState(0);
  const [loanClosedCount, setLoanClosedCount] = useState(0);

  const [showLoanDueToday, setShowLoanDueToday] = useState(true)
  const [showLoanDueTodayPrincipal, setShowLoanDueTodayPrincipal] = useState(true)
  const [showLoanDueTodayInterest, setShowLoanDueTodayInterest] = useState(true)
  const [showLoanDisbursedCount, setShowLoanDisbursedCount] = useState(true)
  const [showLoanOpenCount, setShowLoanOpenCount] = useState(true)
  const [showLoanClosedCount, setShowLoanClosedCount] = useState(true)

  const [loanDueTodayDate, setLoanDueTodayDate] = useState({ start: '', end: '' });
  const [loanDueTodayPrincipalDate, setLoanDueTodayPrincipalDate] = useState({ start: '', end: '' });
  const [loanDueTodayInterestDate, setLoanDueTodayInterestDate] = useState({ start: '', end: '' });
  const [loanDisbursedCountDate, setLoanDisbursedCountDate] = useState({ start: '', end: '' });
  const [loanOpenCountDate, setLoanOpenCountDate] = useState({ start: '', end: '' });
  const [loanClosedCountDate, setLoanClosedCountDate] = useState({ start: '', end: '' });

  const [openLoanDueTodayCalender, setOpenLoanDueTodayCalender] = useState(false);
  const [openLoanDueTodayPrincipalCalender, setOpenLoanDueTodayPrincipalCalender] = useState(false);
  const [openLoanDueTodayInterestCalender, setOpenLoanDueTodayInterestCalender] = useState(false);
  const [openLoanDisbursedCountCalender, setOpenLoanDisbursedCountCalender] = useState(false);
  const [openLoanOpenCountCalender, setOpenLoanOpenCountCalender] = useState(false);
  const [openLoanClosedCountCalender, setOpenLoanClosedCountCalender] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
  };

  
useEffect(() => {
  if (!stats) return;

  if (lastUpdatedField === 'loanDueToday' && cardView === 'maincard3') {
    setLoanDueToday(stats.total_loans_due_today);
  } else if (lastUpdatedField === 'loanDueTodayPrincipal' && cardView === 'maincard3') {
    setLoanDueTodayPrincipal(stats.total_loans_due_today_principal);
  } else if (lastUpdatedField === 'loanDueTodayInterest' && cardView === 'maincard3') {
    setLoanDueTodayInterest(stats.total_loans_due_today_interest);
  } else if (lastUpdatedField === 'loanDisbursedCount' && cardView === 'maincard3') {
    setLoanDisbursedCount(stats.total_loans_disbursed_count);
  } else if (lastUpdatedField === 'loanOpenCount' && cardView === 'maincard3') {
    setLoanOpenCount(stats.total_open_loans_count);
  } else if (lastUpdatedField === 'loanClosedCount' && cardView === 'maincard3') {
    setLoanClosedCount(stats.total_closed_loans_count);
  } else if (cardView === 'none') {
    setLoanDueToday(stats.total_loans_due_today);
    setLoanDueTodayPrincipal(stats.total_loans_due_today_principal);
    setLoanDueTodayInterest(stats.total_loans_due_today_interest);
    setLoanDisbursedCount(stats.total_loans_disbursed_count);
    setLoanClosedCount(stats.total_closed_loans_count);
    setLoanOpenCount(stats.total_open_loans_count);
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
           <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#3E6151]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total loan due today - (p+i) </p>
                    <Image
                      src='/images/calendar.png'
                      width={20}
                      height={20}
                      alt=''
                      className='z-10 cursor-pointer '
                      onClick={() => setOpenLoanDueTodayCalender(true)}
                    />
                  
                  {openLoanDueTodayCalender && (
                     <>
                        {/* Background Overlay */}
                        <div
                          className="fixed inset-0   z-40"
                          onClick={() => setOpenLoanDueTodayCalender(false)}
                        ></div>
                    
                        {/* Calendar Dropdown */}
                        <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                        <C
                    mode="range"
                    selected={{ from: loanDueTodayDate.start, to: loanDueTodayDate.end }}
                    onSelect={(range:any) => {
                      setSearchDate({startDate: '', endDate: ''});
                      setLoanDueTodayDate({start: formatDate(range.from), end: formatDate(range.to)});
                      setCardView('maincard3');
                      setLastUpdatedField('loanDueToday');
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
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showLoanDueToday ? formatCurrency(loanDueToday  || 0) : "*****"}</p>
                    <FaEye 
                    onClick={() => setShowLoanDueToday(prev => !prev)}
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
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total loan due today- Principal</p>
                    <Image
                                            src='/images/calendar.png'
                                            width={20}
                                            height={20}
                                            alt=''
                                            className='z-10 cursor-pointer '
                                            onClick={() => setOpenLoanDueTodayPrincipalCalender(true)}
                                          />
                                        
                                        {openLoanDueTodayPrincipalCalender && (
                                           <>
                                              {/* Background Overlay */}
                                              <div
                                                className="fixed inset-0   z-40"
                                                onClick={() => setOpenLoanDueTodayPrincipalCalender(false)}
                                              ></div>
                                          
                                              {/* Calendar Dropdown */}
                                              <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                              <C
                                          mode="range"
                                          selected={{ from: loanDueTodayPrincipalDate.start, to: loanDueTodayPrincipalDate.end }}
                                          onSelect={(range:any) => {
                                            setSearchDate({startDate: '', endDate: ''});
                                           setLoanDueTodayPrincipalDate({start: formatDate(range.from), end: formatDate(range.to)});
                                           setCardView('maincard3'); 
                                           setLastUpdatedField('loanDueTodayPrincipal');
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
                src={`/images/disbursed3.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showLoanDueTodayPrincipal ? formatCurrency(loanDueTodayPrincipal || 0) : "*****"}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' 
                    onClick={() => setShowLoanDueTodayPrincipal(prev => !prev)}/>
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
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total loan due today - interest</p>
              <Image
                                      src='/images/calendar.png'
                                      width={20}
                                      height={20}
                                      alt=''
                                      className='z-10 cursor-pointer '
                                      onClick={() => setOpenLoanDueTodayInterestCalender(true)}
                                    />
                                  
                                  { openLoanDueTodayInterestCalender && (
                                     <>
                                        {/* Background Overlay */}
                                        <div
                                          className="fixed inset-0   z-40"
                                          onClick={() => setOpenLoanDueTodayInterestCalender(false)}
                                        ></div>
                                    
                                        {/* Calendar Dropdown */}
                                        <div className="absolute top-10 right-1    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                        <C
                                    mode="range"
                                    selected={{ from: loanDueTodayInterestDate.start, to: loanDueTodayInterestDate.end }}
                                    onSelect={(range:any) => {
                                      setSearchDate({startDate: '', endDate: ''});
                                      setLoanDueTodayInterestDate({start: formatDate(range.from), end: formatDate(range.to)});
                                      setCardView('maincard3');
                                      setLastUpdatedField('loanDueTodayInterest');
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
                src={`/images/overdue.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showLoanDueTodayInterest ? formatCurrency(loanDueTodayInterest || 0) : "*****"}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowLoanDueTodayInterest(prev => !prev)}/>
                </div>
            </div>
            {/* Card 4 */}
            <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#054F31]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total loan disbursed (count)</p>
                  <Image
                                          src='/images/calendar.png'
                                          width={20}
                                          height={20}
                                          alt=''
                                          className='z-10 cursor-pointer '
                                          onClick={() => setOpenLoanDisbursedCountCalender(true)}
                                        />
                                      
                                      {openLoanDisbursedCountCalender && (
                                         <>
                                            {/* Background Overlay */}
                                            <div
                                              className="fixed inset-0   z-40"
                                              onClick={() => setOpenLoanDisbursedCountCalender(false)}
                                            ></div>
                                        
                                            {/* Calendar Dropdown */}
                                            <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                            <C
                                        mode="range"
                                        selected={{ from: loanDisbursedCountDate.start, to: loanDisbursedCountDate.end }}
                                        onSelect={(range:any) => {
                                          setSearchDate({startDate: '', endDate: ''});
                                          setLoanDisbursedCountDate({start: formatDate(range.from), end: formatDate(range.to)});
                                          setCardView('maincard3');
                                          setLastUpdatedField('loanDisbursedCount');
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
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showLoanDisbursedCount ? loanDisbursedCount : "*****"}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowLoanDisbursedCount(prev => !prev)}/>
                </div>
            </div>
          {/* Card 5 */}
            <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#C73802]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total open loans (count)</p>
                   <Image
                                           src='/images/calendar.png'
                                           width={20}
                                           height={20}
                                           alt=''
                                           className='z-10 cursor-pointer '
                                           onClick={() => setOpenLoanOpenCountCalender(true)}
                                         />
                                       
                                       {openLoanOpenCountCalender && (
                                          <>
                                             {/* Background Overlay */}
                                             <div
                                               className="fixed inset-0   z-40"
                                               onClick={() => setOpenLoanOpenCountCalender(false)}
                                             ></div>
                                         
                                             {/* Calendar Dropdown */}
                                             <div className="absolute top-5    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                             <C
                                         mode="range"
                                         selected={{ from: loanOpenCountDate.start, to: loanOpenCountDate.end }}
                                         onSelect={(range:any) => {
                                           setSearchDate({startDate: '', endDate: ''});
                                           setLoanOpenCountDate({start: formatDate(range.from), end: formatDate(range.to)});
                                           setCardView('maincard3');
                                           setLastUpdatedField('loanOpenCount');
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
                src={`/images/overdue.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showLoanOpenCount ? loanOpenCount : "*****"}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer' onClick={() => setShowLoanOpenCount(prev => !prev)}/>
                </div>
            </div>

            {/* Card 6 */}
            <div  className={`w-full mb-4 h-[142px] lg:h-[142px] md:h-auto bg-[#FFFFFF] relative rounded-[12px] shadow-custom3 border border-[#C73802]`}>
            <img
                src='/images/coin.png'
                alt='Hero Image'
                className="object-contain lg:w-[136px] lg:h-[136px] w-[136px] h-[136px] md:h-[136px] md:w-[136px]  absolute top-6  right-0 lg:top-6  lg:right-0 md:right-0 rounded-[12px]"
                />
                <div className='flex lg:m-6 md:m-2 m-6 justify-between items-center'>
                    <p className='text-[#5A5A5A] md:text-[14px] text-[16px] lg:text-[16px] font-medium'>Total closed loans (count)</p>
                    <Image
                                            src='/images/calendar.png'
                                            width={20}
                                            height={20}
                                            alt=''
                                            className='z-10 cursor-pointer '
                                            onClick={() => setOpenLoanClosedCountCalender(true)}
                                          />
                                        
                                        {openLoanClosedCountCalender && (
                                           <>
                                              {/* Background Overlay */}
                                              <div
                                                className="fixed inset-0   z-40"
                                                onClick={() => setOpenLoanClosedCountCalender(false)}
                                              ></div>
                                          
                                              {/* Calendar Dropdown */}
                                              <div className="absolute top-10 right-1    bg-[#E0E0E0] shadow-md rounded-md  z-50">
                                              <C
                                          mode="range"
                                          selected={{ from: loanClosedCountDate.start, to: loanClosedCountDate.end }}
                                          onSelect={(range:any) => {
                                            setSearchDate({startDate: '', endDate: ''});
                                           setLoanClosedCountDate({start: formatDate(range.from), end: formatDate(range.to)});
                                           setCardView('maincard3'); 
                                           setLastUpdatedField('loanClosedCount');
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
                src={`/images/overdue.png`}
                alt='Hero Image'
                className="object-cover w-[46px] h-[46px] lg:w-[46px] lg:h-[46px] md:w-6 md:h-6"
/>
                    <p className='text-[#282828] font-bold text-[22px] lg:text-[22px] md:text-[13px]'>{showLoanClosedCount ? loanClosedCount : '*****'}</p>
                    <FaEye className='text-[#5A5A5A] text-[15px] lg:text-[15px] md:text-[13px] cursor-pointer'
                    onClick={() => setShowLoanClosedCount(prev => !prev)}
                    />
                </div>
            </div>
      </div>
    </div>
  );
};


export default MainCards3;
