import React, { useState } from 'react';
import { FaTimes } from "react-icons/fa";
import Image from 'next/image';
import {useRouter} from 'next/navigation';

type AdvanceFilterProps = {
  isOpen: boolean;
  toggleAdvanceFilter: () => void;
};

const AdvanceFilter: React.FC<AdvanceFilterProps> = ({ isOpen, toggleAdvanceFilter }) => {
  const router = useRouter();

  // State for filters
  const [selectedLoanStatus, setSelectedLoanStatus] = useState<string[]>([]);
  const [dpd, setDpd] = useState<string | number>('');
  const [todayCreatedLoan, setTodayCreatedLoan] = useState<any>(false);
  const [todayDueLoan,setTodayDueLoan] = useState<any>(false);
  const [source, setSource] = useState('');
 
  const [searchDueDate, setSearchDueDate] = useState({
    startDate: '',
    endDate: ''
  })

  const [searchCreatedTime, setSearchCreatedTime] = useState({
    startTime: '',
    endTime: ''
  })

  const [searchCreatedDate, setSearchCreatedDate] = useState({
    startDate: '',
    endDate: ''
  })

  const [loanAmount, setLoanAmount] = useState({
    min: '',
    max: ''
  })
  const [loanCount, setLoanCount] = useState({
    from: '',
    to: ''
  });

  const handleLoanStatusChange = (loanType: string, isChecked: boolean) => {
    setSelectedLoanStatus((prev) => {
      if (isChecked) {
        return [...prev, loanType]; // Add to selected list
      } else {
        return prev.filter((status) => status !== loanType); // Remove from list
      }
    });
  };

  // Apply filter by updating query params
  const applyFilter = () => {
  //  Preserve existing query params in the URL
  const params = new URLSearchParams(window.location.search);

  // Loan Status (array)
  if (selectedLoanStatus.length > 0) {
    params.set('loanStatus', selectedLoanStatus.join(','));
  }

  //  Boolean filters
  if (todayCreatedLoan) params.set('createdToday', 'true');
  if (todayDueLoan) params.set('dueToday', 'true');
  if (dpd) params.set('dpd', String(dpd));

  //  Loan amount range
  if (loanAmount.min) params.set('amountFrom', String(loanAmount.min));
  if (loanAmount.max) params.set('amountTo', String(loanAmount.max));

  // Due Date Range
  if (searchDueDate.startDate) params.set('due_start', searchDueDate.startDate);
  if (searchDueDate.endDate) params.set('due_end', searchDueDate.endDate);

  //  Created Source
  if (source) params.set('source', source);

  // Created Date Range
  if (searchCreatedDate.startDate) params.set('start', searchCreatedDate.startDate);
  if (searchCreatedDate.endDate) params.set('end', searchCreatedDate.endDate);

  // Created Time Combined with Date
  if (searchCreatedTime.startTime) {
    params.set('start', `${searchCreatedDate.startDate} ${searchCreatedTime.startTime}`);
  }
  if (searchCreatedTime.endTime) {
    params.set('end', `${searchCreatedDate.endDate} ${searchCreatedTime.endTime}`);
  }

  //  Loan Count
  if (loanCount.from) params.set('loanCountFrom', String(loanCount.from));
  if (loanCount.to) params.set('loanCountTo', String(loanCount.to));

  //  Push final filter params to URL without page reload
  router.push(`${window.location.pathname}?${params.toString()}`);

  // Close filter modal after Apply
  toggleAdvanceFilter();
};

  // Reset filter by removing query params
  const handleResetFilter = () => {
    router.push(window.location.pathname);
    toggleAdvanceFilter(); // Close modal after resetting filter
  };

  const loanTypes = [
    { name: 'All loans', value: '' },
    { name: 'Open loans', value: 'open' },
    { name: 'Closed loans', value: 'closed' },
    {name:'Processing loans',value:'processing'},
    { name: 'Failed loans', value: 'failed' },
    {name:'Fully Paid', value:'fully_paid'},
    {name:'Partially Paid', value:'partially_paid'},
    { name: 'Overdue loans', value: 'overdue' },
    { name: 'Due Today', value: 'due_today' },
    { name: 'Applied Today', value: 'applied_today' },
  ];


  

  return (
    <div
    onClick={toggleAdvanceFilter}
    className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 font-montserrat z-50 flex justify-center items-center transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative bg-white rounded-[22px] p-4 shadow-customshadow7 h-auto transition-transform duration-300 transform ${
        isOpen ? 'scale-100' : 'scale-75'
      } lg:w-[1126px] md:w-[750px] w-full max-h-screen overflow-y-auto`}
      
    >
      <div className="lg:mx-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/images/filter.png" alt="Logo" width={15} height={15} />
            <p className="ml-2 text-[#282828] font-semibold lg:text-[14px] md:text-[12px]">
              Advance Filter
            </p>
          </div>
          <button
            onClick={toggleAdvanceFilter}
            className="rounded-full w-[36px] h-[36px] bg-[#F6F6F6] flex justify-center items-center"
          >
            <FaTimes className="text-[#282828] text-xl" />
          </button>
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-12">
            <div className="lg:col-span-3 md:col-span-3  mt-3 bg-[#EBEBEB] rounded-[18px] shadow-customshadow4 lg:h-[532px] h-auto">
              <p className="text-[#5A5A5A] text-[14px] font-bold ml-4 mt-6">Quick sort</p>
              <div>
                {loanTypes.map((loanType, index) => (
                  <div key={index} className="flex items-center ml-4 mt-4 mb-6 lg:mb-0 md:mb-0">
                   <input
  type="checkbox"
  checked={
    selectedLoanStatus.includes(loanType.value) ||
    (loanType.value === 'due_today' && todayDueLoan) ||
    (loanType.value === 'applied_today' && todayCreatedLoan)
  }
  onChange={(e) => {
    const isChecked = e.target.checked;

    if (loanType.value === 'due_today') {
      setTodayDueLoan(isChecked);
    } else if (loanType.value === 'applied_today') {
      setTodayCreatedLoan(isChecked);
    } else {
      handleLoanStatusChange(loanType.value, isChecked);
    }
  }}
  className="hover:cursor-pointer accent-[#F6011BCC]"
/>


                    <p className="text-[#282828] font-medium leading-none text-[14px] ml-2">
                      {loanType.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-9 md:col-span-9  lg:pl-6 md:pl-4">
            <form onSubmit={applyFilter}>
            <div className="grid lg:w-11/12 grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 pt-11 items-center">
             
              <div className="flex flex-col">
                <label className="text-[#282828] text-[16px] font-semibold mb-2">Loan Status</label>
                <select
  value={selectedLoanStatus.length > 0 ? selectedLoanStatus[0] : ''}
  onChange={(e) => setSelectedLoanStatus([e.target.value])}
  className="cursor-pointer w-full h-[44px] bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2 focus:outline-none"
>
  <option value="" className="font-medium text-[15px]">Select</option>
  <option value="" className="font-medium text-[15px]">All</option>
  <option value="open" className="font-medium text-[15px]">Open</option>
  <option value="overdue" className="font-medium text-[15px]">Overdue</option>
  <option value="processing" className="font-medium text-[15px]">Processing</option>
  <option value="failed" className="font-medium text-[15px]">Failed</option>
  <option value="closed" className="font-medium text-[15px]">Closed</option>
</select>
                </div>


                <div className="flex flex-col  ">
                  <label className="text-[#282828] text-[16px] font-semibold mb-2">Loan Source</label>
                  <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                     className=" w-full h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                  >
                    <option value="" className='font-medium text-[15px]' >Select</option>
                    <option value="web" className='font-medium text-[15px]' >Web</option>
                    <option value="mobile" className='font-medium text-[15px]' >Mobile</option>
                  </select>
                </div>

                <div className="flex flex-col ">
                  <label className="text-[#282828]  text-[16px] font-semibold mb-2">Search by DPD</label>
                  <select
                  value={dpd}
                  onChange={(e) => setDpd(e.target.value)}
                  className=" w-full h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                  >
                    <option value="" className='font-medium text-[15px]' >Select</option>
                    <option value="0 - 30" className='font-medium text-[15px]' >0-30</option>
                    <option value="31 - 60" className='font-medium text-[15px]' >31-60</option>
                    <option value="61 - 90" className='font-medium text-[15px]' >61-90</option>
                    <option value="91 - 10000" className='font-medium text-[15px]' >91+</option>
                  </select>
                </div>

              </div>
              <hr className='mt-8'/>
            <div className='grid lg:grid-cols-2 md:grid-cols-1 lg:w-11/12 gap-8 mt-5 '>
                <div className='flex flex-col items-start '>
                    <p className='text-[#282828] text-[16px] mb-2 font-semibold'>Loan amount range</p>
                 <div className='flex items-center justify-between gap-2 lg:w-full md:w-full '>
                    <input 
                    type="number"
                    placeholder='₦ Amount from'
                    value={loanAmount.min}
                    required={loanAmount.max ? true : false}
                    onChange={(e) => setLoanAmount({...loanAmount, min: e.target.value})}
                    className="lg:w-[168px] md:w-[248px] w-[180px] h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                    />
                    <input 
                    type="text"
                  value={loanAmount.max}
                  required={loanAmount.min ? true : false}
                  onChange={(e) => setLoanAmount({...loanAmount, max: e.target.value})}
                    className="lg:w-[168px] md:w-[248px] w-[180px]  h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                    placeholder='₦ Amount to'
                    />

                  </div>
                </div>
                <div className='flex flex-col items-start'>
                    <p className='text-[#282828] text-[16px] mb-2 font-semibold'>Search by default rate</p>
                    <div className='flex items-center justify-between gap-2 lg:w-full md:w-full'>
                      <input 
                      type="number"
                      disabled
                      placeholder='₦ Amount from'
                     
                      className="lg:w-[168px]  md:w-[248px]  w-[180px]  cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      />
                      <input 
                      type="text"
                      className="lg:w-[168px] md:w-[248px]  w-[180px]  cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      placeholder='₦ Amount to'
                      />
                    </div>
              </div>
            </div>

            {/**2nd */}
            <div className='grid lg:grid-cols-2 grid-cols-1 w-11/12 gap-8 mt-6 '>
                <div className='flex flex-col items-start'>
                    <p className='text-[#282828] text-[16px] mb-2 font-semibold'>By loan created date</p>
                
                 <div className='flex items-center justify-between lg:gap-2 md:gap-6 gap-2 w-full'>
                 <div className='relative'>
                      <input 
                      type="date"
                      placeholder='from'
                      required={searchCreatedDate.endDate ? true : false}
                      value={searchCreatedDate.startDate}
                      onChange={(e) => setSearchCreatedDate({...searchCreatedDate, startDate: e.target.value })}
                      className="lg:w-[168px] md:w-[248px]  w-[180px]  cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      
                      />
                      <Image
                      src='/images/calendar.png'
                      width={20}
                      height={20}
                      alt=''
                      className='absolute right-2 top-3  cursor-pointer pointer-events-none'
                       
                      />

                      </div>
                      <div className='relative'>
                      <input 
                      type="date"
                      placeholder='to'
                      value={searchCreatedDate.endDate}
                      required={searchCreatedDate.startDate ? true : false}
                      onChange={(e) => setSearchCreatedDate({...searchCreatedDate, endDate: e.target.value })}
                      className="lg:w-[168px] md:w-[248px]  w-[180px]  cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      />
                      <Image
                      src='/images/calendar.png'
                      width={20}
                      height={20}
                      alt=''
                      className='absolute right-2 top-3  cursor-pointer pointer-events-none'
                       
                      />

                      </div>

                  </div>
                </div>
                {/**3rd*/}
<div className='grid lg:grid-cols-2 grid-cols-1 w-11/12 gap-8  '>
  <div className='flex flex-col items-start'>
    <p className='text-[#282828] text-[16px] text-nowrap mb-2 font-semibold'>By loan created time</p>

    <div className='flex items-center justify-between lg:gap-2 md:gap-6 gap-2 w-full'>
      
      {/* From Time Input */}
      <div className='relative'>
        <input 
          type="time"
          placeholder='from'
          required={searchCreatedTime.endTime ? true : false}
          value={searchCreatedTime.startTime}
          onChange={(e) => setSearchCreatedTime({...searchCreatedTime, startTime: e.target.value })}
          className="lg:w-[168px] md:w-[248px] w-[180px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2 focus:outline-none"
        />
        <Image
          src='/images/calendar.png' // Update image to represent time if available
          width={20}
          height={20}
          alt=''
          className='absolute right-2 top-3 cursor-pointer pointer-events-none'
        />
      </div>

      {/* To Time Input */}
      <div className='relative'>
        <input 
          type="time"
          placeholder='to'
          required={searchCreatedTime.startTime ? true : false}
          value={searchCreatedTime.endTime}
          onChange={(e) => setSearchCreatedTime({...searchCreatedTime, endTime: e.target.value })}
          className="lg:w-[168px] md:w-[248px] w-[180px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2 focus:outline-none"
        />
        <Image
          src='/images/calendar.png' // Update image if needed
          width={20}
          height={20}
          alt=''
          className='absolute right-2 top-3 cursor-pointer pointer-events-none'
        />
      </div>

    </div>
  </div>
</div>
<div className='flex flex-col items-start'>
                    <p className='text-[#282828] text-[16px] mb-2 font-semibold'>By loan count</p>
                    <div className='flex items-center justify-center gap-2 lg:w-full md:w-full'>
                      <input 
                      type="number"
                      placeholder=' from'
                      value={loanCount.from}
                      required={loanCount.to ? true : false}
                      onChange={(e) => setLoanCount({...loanCount, from: e.target.value})}
                      className="lg:w-[168px] md:w-[128px]  w-[180px]  cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      />
                      <input 
                      type="number"
                      value={loanCount.to}
                      required={loanCount.from ? true : false}
                      onChange={(e) => setLoanCount({...loanCount, to: e.target.value})}
                      className="lg:w-[168px] md:w-[128px]   w-[180px]  cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      placeholder=' to'
                      />
                    </div>
              </div>

                <div className='flex flex-col items-start'>
                    <p className='text-[#282828] text-[16px] mb-2 font-semibold'>By loan due date</p>
                    <div className='flex items-center justify-between lg:gap-2 md:gap-6 gap-2 w-full'>
                      <div className='relative'>
                      <input 
                      type="date"
                      placeholder='from'
                      value={searchDueDate.startDate}
                      required={searchDueDate.endDate ? true : false}
                      onChange={(e) => setSearchDueDate({...searchDueDate, startDate: e.target.value })}
                      className="lg:w-[168px] md:w-[248px]  w-[180px]  cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      />
                      <Image
                      src='/images/calendar.png'
                      width={20}
                      height={20}
                      alt=''
                     className='absolute right-2 top-3  cursor-pointer pointer-events-none'
                       
                      />

                      </div>
                     
                      <div className='relative'>
                      <input 
                      type="date"
                      placeholder='to'
                      value={searchDueDate.endDate}
                      required={searchDueDate.startDate ? true : false}
                      onChange={(e) => setSearchDueDate({...searchDueDate, endDate: e.target.value })}
                      className="lg:w-[168px] md:w-[248px]  w-[180px]  cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      />
                      <Image
                      src='/images/calendar.png'
                      width={20}
                      height={20}
                      alt=''
                     className='absolute right-2 top-3  cursor-pointer pointer-events-none'
                       
                      />

                      </div>
                          
              </div>
                    </div>
                
              
              
            </div>
            <div className='flex justify-end gap-4 items-end mt-8 md:mb-6 w-11/12'>
                <button
                type='submit'
                 
                className='w-[96px] h-[41px] bg-[#F6011BCC] text-[#FFFFFF] font-montserrat font-medium text-[15px] rounded-[22px] cursor-pointer hover:bg-[#333333]'>
                  Apply
                </button>
                <button 
                type='button'
                onClick={handleResetFilter}
                className='w-[135px] h-[44px] bg-inherit text-[#BF1515] font-montserrat font-medium text-[15px] border border-solid border-[#BF1515] rounded-[22px] cursor-pointer hover:bg-[#F2F2F2]'>
                  Reset filter
                </button>
              </div>
              
              </form>
            </div>
            
            </div>
            
           
          </div>
          
        </div>
      </div>
    
  );
};

export default AdvanceFilter;
