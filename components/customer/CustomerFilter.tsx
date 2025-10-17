import React, { useState } from 'react';
import { FaTimes } from "react-icons/fa";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type CustomerFilterProps = {
  isOpen: boolean;
  toggleCustomerFilter: () => void;
};

const CustomerFilter: React.FC<CustomerFilterProps> = ({ isOpen, toggleCustomerFilter }) => {
  const router = useRouter();
  const [loanStatus, setLoanStatus] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [regSource, setRegSource] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [loaned, setLoaned] = useState(false);
  const [noLoan, setNoLoan] = useState(false);
  const [blacklisted, setBlacklisted] = useState(false);
  const [defaulted, setDefaulted] = useState(false);
  const [neverDefaulted, setNeverDefaulted] = useState(false);
  const [fullyRegistered, setFullyRegistered] = useState(false);
  const [closedLoan,setClosedLoan] = useState(false);
  const [unDefined, setUnDefined] = useState(false);
  const [partiallyRegistered, setPartiallyRegistered] = useState(false);
  const [crc, setCrc] = useState('');
  const [ageRange, setAgeRange] = useState({
    from: '',
    to: ''
  })
  const [searchDueDate, setSearchDueDate] = useState({
      startDate: '',
      endDate: ''
    })
  
    const [searchCreatedDate, setSearchCreatedDate] = useState({
      startDate: '',
      endDate: ''
    })
  const [loanCount, setLoanCount] = useState({
    from: '',
    to: ''
  });

  const [searchCreatedTime, setSearchCreatedTime] = useState({
    startTime: '',
    endTime: ''
  });

  const [loanAmount, setLoanAmount] = useState({
      min: '',
      max: ''
    })

  const loanTypes = [
    { name: 'Loaned customers', value: 'loan' },
    { name: 'No loan customers', value: 'noloan' },
    { name: 'Blacklisted', value: 'blacklisted' },
    { name: 'Defaulted', value: 'defaulted' },
     {name: 'Closed loan customers',value:'closedLoan'},
    {name: 'Never Defaulted', value: 'neverDefaulted'},
    {name:'Fully registered', value: 'fullyRegistered'},
    {name:'Partially registered', value: 'partiallyRegistered'},
    {name:'Undefined',value: 'unDefined'}
    
  ];

  // Apply filter by updating query params
const applyFilter = () => {
  // ✅ Start with existing query params
  const params = new URLSearchParams(window.location.search);

  // ✅ Update or add new filters
  if (loanStatus) params.set('loanStatus', loanStatus);
  if (creditScore) params.set('creditScore', creditScore);
  if (regSource) params.set('source', regSource);
  if (employmentStatus) params.set('employmentStatus', employmentStatus);
  if (loaned) params.set('loaned', 'true');
  if (noLoan) params.set('noLoan', 'true');
  if (blacklisted) params.set('blacklisted', 'true');
  if (crc) params.set('crc', crc);
  if (defaulted) params.set('defaulted', 'true');
  if (neverDefaulted) params.set('neverDefaulted', 'true');
  if (fullyRegistered) params.set('fullyRegistered', 'true');
  if (partiallyRegistered) params.set('partiallyRegistered', 'true');
  if (unDefined) params.set('unDefined', 'true');
  if (closedLoan) params.set('closedLoansCustomers', 'true');

  if (ageRange.from && ageRange.to) {
    params.set('ageFrom', ageRange.from);
    params.set('ageTo', ageRange.to);
  }

  if (loanAmount.min) params.set('amountFrom', loanAmount.min);
  if (loanAmount.max) params.set('amountTo', loanAmount.max);

  if (searchDueDate.startDate && searchDueDate.endDate) {
    params.set('dueStart', searchDueDate.startDate);
    params.set('dueEnd', searchDueDate.endDate);
  }

  if (searchCreatedDate.startDate) params.set('start', searchCreatedDate.startDate);
  if (searchCreatedDate.endDate) params.set('end', searchCreatedDate.endDate);

  if (searchCreatedTime.startTime) {
    params.set('start', `${searchCreatedDate.startDate} ${searchCreatedTime.startTime}`);
  }
  if (searchCreatedTime.endTime) {
    params.set('end', `${searchCreatedDate.endDate} ${searchCreatedTime.endTime}`);
  }

  if (loanCount.from) params.set('loanCountFrom', loanCount.from);
  if (loanCount.to) params.set('loanCountTo', loanCount.to);

  // ✅ Push combined queries
  router.push(`${window.location.pathname}?${params.toString()}`);

  toggleCustomerFilter();
};


  // Reset filter by removing query params
  const handleResetFilter = () => {
    router.push(window.location.pathname);
    toggleCustomerFilter(); 
  };

  

  return (
    <div
    onClick={toggleCustomerFilter}
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
            onClick={toggleCustomerFilter}
            className="rounded-full w-[36px] h-[36px] bg-[#F6F6F6] flex justify-center items-center"
          >
            <FaTimes className="text-[#282828] text-xl" />
          </button>
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-12">
            <div className="lg:col-span-3 md:col-span-3  mt-3 bg-[#EBEBEB] rounded-[18px] shadow-customshadow4 lg:h-[532px] h-auto">
              <p className="text-[#5A5A5A] text-[14px] font-bold ml-4 mt-6">Quick sort</p>
              <div>
                {loanTypes?.map((loanType, index) => (
                  <div key={index} className="flex items-center ml-4 mt-4 mb-6 lg:mb-0 md:mb-0">
                    <input
                      type="checkbox"
                      checked={
                        (loanType.value === 'blacklisted' && blacklisted) ||
                        (loanType.value === 'defaulted' && defaulted) ||
                        (loanType.value === 'noloan' && noLoan) ||
                        (loanType.value === 'loan' && loaned) ||
                        (loanType.value === 'closedLoan' && closedLoan) ||
                        (loanType.value === 'neverDefaulted' && neverDefaulted) ||
                        (loanType.value === 'fullyRegistered' && fullyRegistered) ||
                        (loanType.value === 'partiallyRegistered' && partiallyRegistered) ||
                        (loanType.value === 'unDefined' && unDefined)
                      }

                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (loanType.value === 'blacklisted') setBlacklisted(isChecked);
                        if (loanType.value === 'defaulted') setDefaulted(isChecked);
                        if (loanType.value === 'noloan') setNoLoan(isChecked);
                        if (loanType.value === 'loan') setLoaned(isChecked);
                        if (loanType.value === 'closedLoan') setClosedLoan(isChecked)
                        if (loanType.value === 'neverDefaulted') setNeverDefaulted(isChecked);
                        if (loanType.value === 'fullyRegistered') setFullyRegistered(isChecked);
                        if (loanType.value === 'partiallyRegistered') setPartiallyRegistered(isChecked);
                        if (loanType.value === 'unDefined') setUnDefined(isChecked);
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
            <div className="grid lg:w-11/12 grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 pt-11 items-center">
              <div className="flex flex-col">
                <label className="text-[#282828] text-[16px] font-semibold mb-2">By loan status</label>
                <select
                value={loanStatus}
                onChange={(e) => setLoanStatus(e.target.value)}
                  className="cursor-pointer w-full h-[44px] bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2 focus:outline-none"
                >
                    <option value="" className="font-medium text-[15px]">Select</option>
                    <option value="open" className="font-medium text-[15px]">Open</option>
                    <option value="closed" className="font-medium text-[15px]">Closed</option>
                    <option value="overdue" className="font-medium text-[15px]">Overdue</option>
                </select>
                </div>


                <div className="flex flex-col  ">
                  <label className="text-[#282828] text-[16px] font-semibold mb-2">By credit score</label>
                  <input
                  type='number'
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  className=" w-full h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                  >
                   
                  </input>
                </div>

                <div className="flex flex-col ">
                  <label className="text-[#282828]  text-[16px] font-semibold mb-2">Registration source</label>
                  <select
                  value={regSource}
                  onChange={(e) => setRegSource(e.target.value)}
                    className=" w-full h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                  >
                    <option className='font-medium text-[15px]' value="">Select</option>
                    <option value="web" className='font-medium text-[15px]' >Web</option>
                    <option value="mobile" className='font-medium text-[15px]' >Mobile</option>
                    
                  </select>
                </div>

                <div className="flex flex-col ">
                  <label className="text-[#282828]  text-[16px] font-semibold mb-2">Employment status</label>
                  <select
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  className=" w-full h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                  >
                    <option className='font-medium text-[15px]' value="">Select</option>
                    <option value="employed" className='font-medium text-[15px]' >Employed</option>
                    <option value="self-employed" className='font-medium text-[15px]' >Self Employed</option>
                    <option value="student" className='font-medium text-[15px]' >Student</option>
                  </select>
                </div>
                </div>
                <div className="grid lg:w-full grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-8 pt-11 items-center">
                 <div className=" flex flex-col">
                  <label className="text-[#282828]  text-[16px] font-semibold mb-2">Credit status</label>
                  <select
                  value={crc}
                  onChange={(e) => setCrc(e.target.value)}
                  className=" lg:w-[168px] md:w-[128px]  w-[180px] h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                  >
                    <option className='font-medium text-[15px]' value="">Select</option>
                    <option value="NO" className='font-medium text-[15px]' >Failed</option>
                    <option value="YES" className='font-medium text-[15px]' >Passed</option>
                    <option value="NO_DATA" className='font-medium text-[15px]' >No Data</option>
                  </select>
                </div>
     
                   <div className='flex flex-col items-start '>
                    <p className='text-[#282828] text-[16px] mb-2 font-semibold'>Loan count</p>
                 <div className='flex items-center justify-between gap-2 lg:w-full md:w-full '>
                      <input 
                      type="number"
                      placeholder=' from'
                      value={loanCount.from}
                      required={loanCount.to ? true : false}
                      onChange={(e) => setLoanCount({...loanCount, from: e.target.value})}
                      className="lg:w-[128px] md:w-[128px]  w-[180px]  cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      />
                      <input 
                      type="number"
                      value={loanCount.to}
                      required={loanCount.from ? true : false}
                      onChange={(e) => setLoanCount({...loanCount, to: e.target.value})}
                      className="lg:w-[128px] md:w-[128px]  w-[180px]  h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      placeholder=' to'
                      />
                    </div>
              </div>
                <div className='flex flex-col items-start ml-16 '>
                    <p className='text-[#282828] text-[16px] text-nowrap mb-2 font-semibold w-full'>Loan amount</p>
                 <div className='flex items-center justify-between gap-2 lg:w-full md:w-full '>
                    <input 
                    type="number"
                    placeholder='₦ Amount from'
                    value={loanAmount.min}
                    required={loanAmount.max ? true : false}
                    onChange={(e) => setLoanAmount({...loanAmount, min: e.target.value})}
                    className="lg:w-[128px] md:w-[128px]  w-[180px] h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                    />
                    <input 
                    type="text"
                  value={loanAmount.max}
                  required={loanAmount.min ? true : false}
                  onChange={(e) => setLoanAmount({...loanAmount, max: e.target.value})}
                    className="lg:w-[128px] md:w-[128px]  w-[180px]  h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                    placeholder='₦ Amount to'
                    />

                  </div>
                </div>
              
              </div>
              <hr className='mt-8'/>
           

            {/**2nd */}
            <div className='grid lg:grid-cols-2 grid-cols-1 w-11/12 gap-8 mt-6 '>
             <div className='flex flex-col items-start'>
                    <p className='text-[#282828] text-[16px] mb-2 font-semibold'>Search by age range</p>
                    <div className='flex items-center justify-between gap-2 lg:w-full md:w-full'>
                      <input 
                      type="number"
                      placeholder=' from'
                      value={ageRange.from}
                      required={ageRange.to ? true : false}
                      onChange={(e) => setAgeRange({...ageRange, from: e.target.value})}
                      className="lg:w-[168px] md:w-[248px]  w-[180px]  cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      />
                      <input 
                      type="number"
                      value={ageRange.to}
                      required={ageRange.from ? true : false}
                      onChange={(e) => setAgeRange({...ageRange, to: e.target.value})}
                      className="lg:w-[168px] md:w-[248px]   w-[180px]  cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                      placeholder=' to'
                      />
                    </div>
              </div>
               
                <div className='flex flex-col items-start'>
                    <p className='text-[#282828] text-[16px] mb-2 font-semibold'>By registration date</p>
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

export default CustomerFilter;
