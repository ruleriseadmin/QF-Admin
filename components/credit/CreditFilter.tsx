import React, { useState } from 'react';
import { FaTimes } from "react-icons/fa";
import Image from 'next/image';
import {useRouter} from 'next/navigation';

type CreditFilterProps = {
  isOpen: boolean;
  toggleCreditFilter: () => void;
};

const CreditFilter: React.FC<CreditFilterProps> = ({ isOpen, toggleCreditFilter }) => {
  const [selectedCreditType, setSelectedCreditType] = useState('All');
  const router = useRouter();
  const [searchCreatedDate, setSearchCreatedDate] = useState({
      startDate: '',
      endDate: ''
    })
  const [cachedExpiryDate, setCachedExpiryDate] = useState({
    startDate: '',
    endDate: ''
  });

const [deliquency,setDeliqueny] = useState<number | string>('');
const [creditStatus, setCreditStatus] = useState<string>('');

  // Apply filter by updating query params
  const applyFilter = () => {
    const queryParams: Record<string, string> = {};
    if(selectedCreditType) {
      queryParams.creditType = selectedCreditType;
    }
    if(searchCreatedDate.startDate) {
      queryParams.start = searchCreatedDate.startDate;
    }
    if(searchCreatedDate.endDate) {
      queryParams.end = searchCreatedDate.endDate;
    }
    if(cachedExpiryDate.startDate) {
      queryParams.expiry_start = cachedExpiryDate.startDate;
    }
    if(cachedExpiryDate.endDate) {
      queryParams.expiry_end = cachedExpiryDate.endDate;
    }
    if(deliquency){
      queryParams.deliquency = String(deliquency);
    }
    if(creditStatus){
      queryParams.creditStatus = creditStatus;
    }
    // Push query params to the URL
    router.push(`${window.location.pathname}?${new URLSearchParams(queryParams).toString()}`);
    toggleCreditFilter(); // Close modal after applying filter
  };

  // Reset filter by removing query params
  const handleResetFilter = () => {
    router.push(window.location.pathname);
    toggleCreditFilter(); // Close modal after resetting filter
  };

  const creditTypes = [
    {name: 'All'},
    { name: 'CRC'},
    { name: 'First Central' },
    { name: 'Credit Registry' },
  ];

  return (
    <div
    onClick={toggleCreditFilter}
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
            onClick={toggleCreditFilter}
            className="rounded-full w-[36px] h-[36px] bg-[#F6F6F6] flex justify-center items-center"
          >
            <FaTimes className="text-[#282828] text-xl" />
          </button>
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-12">
            <div className="lg:col-span-3 md:col-span-3  mt-3 bg-[#EBEBEB] rounded-[18px] shadow-customshadow4 lg:h-[532px] h-auto">
              <p className="text-[#5A5A5A] text-[14px] font-bold ml-4 mt-6">Quick sort</p>
              <div>
                {creditTypes.map((creditType, index) => (
                  <div key={index} className="flex items-center ml-4 mt-4 mb-6 lg:mb-0 md:mb-0">
                    <input
                      type="checkbox"
                      checked={creditType.name === selectedCreditType}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelectedCreditType(isChecked? creditType.name : 'All');
                      }}
                      className="hover:cursor-pointer accent-[#F6011BCC]"
                    />
                    <p className="text-[#282828] font-medium leading-none text-[14px] ml-2">
                      {creditType.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-9 md:col-span-9  lg:pl-6 md:pl-4">
            <div className="grid lg:w-11/12 grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 pt-11 items-center">
              <div className="flex flex-col">
                <label className="text-[#282828] text-[16px] font-semibold mb-2">By channel</label>
                <select
                value={selectedCreditType}
                onChange={(e) => setSelectedCreditType(e.target.value)}
                    className="cursor-pointer w-full h-[44px] bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2 focus:outline-none"
                >
                    <option value="" className="font-medium text-[15px]">Select</option>
                    <option value="CRC" className="font-medium text-[15px]">CRC</option>
                    <option value="First Central" className="font-medium text-[15px]">First Central</option>
                    <option value="Credit Registry" className="font-medium text-[15px]">Credit Registry</option>
                </select>
                </div>


                <div className="flex flex-col  ">
                  <label className="text-[#282828] text-[16px] font-semibold mb-2">By credit status</label>
                  <select
                  value={creditStatus}
                  onChange={(e) => setCreditStatus(e.target.value)}
                     className=" w-full h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                  >
                    <option value="" className='font-medium text-[15px]' >Select</option>
                    <option value="NO" className='font-medium text-[15px]' >Failed</option>
                    <option value="YES" className='font-medium text-[15px]' >Passed</option>
                    <option value="NO_DATA" className='font-medium text-[15px]' >No Data</option>
                  </select>
                </div>
                <div className="flex flex-col ">
                  <label className="text-[#282828]  text-[16px] font-semibold mb-2">Search by Deliquency</label>
                  <input
                  type='number'
                  placeholder='No of deliquencies'
                  value={deliquency}
                  onChange={(e) => setDeliqueny(e.target.value)}
                  className=" w-full h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                  >
                   
                  </input>
                </div>

                <div className="flex flex-col ">
                  <label className="text-[#282828]  text-[16px] font-semibold mb-2">By cached status</label>
                  <select
                    className=" w-full h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                  >
                    <option className='font-medium text-[15px]' value="">Select</option>
                    <option value="0" className='font-medium text-[15px]' >0 Days</option>
                    <option value="1-30" className='font-medium text-[15px]' >1-30 Days</option>
                    <option value="31-60" className='font-medium text-[15px]' >31-60 Days</option>
                  </select>
                </div>
              </div>
             

            {/**2nd */}
            <div className='grid lg:grid-cols-2 grid-cols-1 w-11/12 gap-8 mt-6 '>
                <div className='flex flex-col items-start'>
                <p className='text-[#282828] text-[16px] mb-2 font-semibold'>By created date</p>
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
                <div className='flex flex-col items-start'>
                    <p className='text-[#282828] text-[16px] mb-2 font-semibold'>By cached expiry date</p>
                    <div className='flex items-center justify-between lg:gap-2 md:gap-6 gap-2 w-full'>
                                     <div className='relative'>
                                          <input 
                                          type="date"
                                          placeholder='from'
                                          required={cachedExpiryDate.endDate ? true : false}
                                          value={cachedExpiryDate.startDate}
                                          onChange={(e) => setCachedExpiryDate({...cachedExpiryDate, startDate: e.target.value })}
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
                                          value={cachedExpiryDate.endDate}
                                          required={cachedExpiryDate.startDate ? true : false}
                                          onChange={(e) => setCachedExpiryDate({...cachedExpiryDate, endDate: e.target.value })}
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
            <div className='flex justify-end gap-4 items-end mt-48 md:mb-6 w-11/12'>
                <button
                type='submit'
                onClick={applyFilter} 
                className='w-[96px] h-[41px] bg-[#F6011BCC] text-[#FFFFFF] font-montserrat font-medium text-[15px] rounded-[22px] cursor-pointer hover:bg-[#333333]'>
                  Apply
                </button>
                <button
                onClick={handleResetFilter} 
                className='w-[135px] h-[44px] bg-inherit text-[#BF1515] font-montserrat font-medium text-[15px] border border-solid border-[#BF1515] rounded-[22px] cursor-pointer hover:bg-[#F2F2F2]'>
                  Reset filter
                </button>
              </div>
            
            </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default CreditFilter;
