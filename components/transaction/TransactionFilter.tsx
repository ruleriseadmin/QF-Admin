import React, { useState } from 'react';
import { FaTimes } from "react-icons/fa";
import Image from 'next/image';
import {useRouter} from 'next/navigation';

type TransactionFilterProps = {
  isOpen: boolean;
  toggleTransactionFilter: () => void;
};

const TransactionFilter: React.FC<TransactionFilterProps> = ({ isOpen, toggleTransactionFilter }) => {
  const [selectedTransactionType, setSelectedTransactionType] = useState<string[]>([]);
  const router = useRouter();
  
    // State for filters
    const [selectedStatus, setSelectedStatus] = useState('')
   const [transactionID, setTransactionID] = useState<string | number>('');
  const [searchCreatedDate, setSearchCreatedDate] = useState({
      startDate: '',
      endDate: ''
    })
    const [Amount, setAmount] = useState({
      min: '',
      max: ''
    })



  const TransactionTypes = [
    { name: 'All', value: '' },
    { name: 'Disbursement', value: 'loan' },
    { name: 'Collection', value: 'payment' },
    { name: 'Penalty', value: 'penalty' },
    { name: 'Refund', value: 'refund' },
    { name: 'Card Tokenization', value: 'card_tokenization' },
    { name: 'Unapplied Payment', value: 'unapplied_payment' },
    { name: 'Unapplied Payment(Card)', value: 'unapplied_card_tokenization' },
   
  ];

  const handleTransactionType = (transactionType: string, isChecked:boolean) => {
    setSelectedTransactionType((prev:any) => {
      if(isChecked) {
        return [...prev, transactionType];
      }else {
        return prev.filter((t:any) => t !== transactionType);
      }
    });
    
  };

 // Apply filter by updating query params
const applyFilter = () => {
  //  Preserve existing query params in the URL
  const params = new URLSearchParams(window.location.search);

  // Update or add new filters
  if (selectedTransactionType?.length > 0) {
    params.set('type', selectedTransactionType.join(','));
  }

  if (selectedStatus) {
    params.set('status', selectedStatus);
  }

  if (transactionID) {
    params.set('id', String(transactionID));
  }

  if (Amount.min) {
    params.set('amountFrom', String(Amount.min));
  }

  if (Amount.max) {
    params.set('amountTo', String(Amount.max));
  }

  if (searchCreatedDate.startDate) {
    params.set('start', searchCreatedDate.startDate);
  }

  if (searchCreatedDate.endDate) {
    params.set('end', searchCreatedDate.endDate);
  }

  // Push updated query
  router.push(`${window.location.pathname}?${params.toString()}`);
  toggleTransactionFilter();
};


  // Reset filter by removing query params
  const handleResetFilter = () => {
    router.push(window.location.pathname);
    toggleTransactionFilter();
  };


  return (
    <div
    onClick={toggleTransactionFilter}
    className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 font-montserrat z-50 flex justify-center items-center transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative bg-white rounded-[22px] p-4 shadow-customshadow7 h-auto transition-transform duration-300 transform ${
        isOpen ? 'scale-100' : 'scale-75'
      } lg:w-[1126px] md:w-[750px] w-full max-h-screen lg:h-[613px] overflow-y-auto`}
      
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
            onClick={toggleTransactionFilter}
            className="rounded-full w-[36px] h-[36px] bg-[#F6F6F6] flex justify-center items-center"
          >
            <FaTimes className="text-[#282828] text-xl" />
          </button>
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-12">
            <div className="lg:col-span-3 md:col-span-3  mt-3 bg-[#EBEBEB] rounded-[18px] shadow-customshadow4 lg:h-[532px] h-auto">
              <p className="text-[#5A5A5A] text-[14px] font-bold ml-4 mt-6">Quick sort</p>
              <div>
                {TransactionTypes.map((tType, index) => (
                  <div key={index} className="flex items-center ml-4 mt-4 mb-6 lg:mb-0 md:mb-0">
                    <input
                      type="checkbox"
                      checked={selectedTransactionType.includes(tType.value)}
                      
                      onChange={(e) => handleTransactionType(tType.value, e.target.checked)}
                      className="hover:cursor-pointer accent-[#F6011BCC]"
                    />
                    <p className="text-[#282828] font-medium leading-none text-[14px] ml-2">
                      {tType.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-9 md:col-span-9  lg:pl-6 md:pl-4">
              <form onSubmit={applyFilter}>
            <div className="grid lg:w-11/12 grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 pt-11 items-center">
              <div className="flex flex-col">
                <label className="text-[#282828] text-[16px] font-semibold mb-2">By payment type</label>
                <select
                value={selectedTransactionType.length > 0 ? selectedTransactionType[0] : ''}
                onChange={(e) => setSelectedTransactionType([e.target.value])}
                    className="cursor-pointer w-full h-[44px] bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2 focus:outline-none"
                >
                    <option value="" className="font-medium text-[15px]">Select</option>
                    <option value="" className="font-medium text-[15px]">All</option>
                    <option value="loan" className="font-medium text-[15px]">disbursement</option>
                    <option value="payment" className="font-medium text-[15px]">collection</option>
                    <option value="penalty" className="font-medium text-[15px]">penalty</option>
                    <option value="refund" className="font-medium text-[15px]">refund</option>
                    <option value="card_tokenization" className="font-medium text-[15px]">Card Tokenization</option>
                    <option value="unapplied_payment" className="font-medium text-[15px]">Unapplied Payment</option>
                    <option value="unapplied_card_tokenization" className="font-medium text-[15px]">Unapplied Payment(Card)</option>
                </select>
                </div>


                <div className="flex flex-col  ">
                  <label className="text-[#282828] text-[16px] font-semibold mb-2">By payment status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)} 
                     className=" w-full h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                  >
                    <option value="" className='font-medium text-[15px]' >Select</option>
                    <option value="failed" className='font-medium text-[15px]' >Failed</option>
                    <option value="pending" className='font-medium text-[15px]' >Pending</option>
                    <option value="completed" className='font-medium text-[15px]' >Completed</option>
                  </select>
                </div>

                <div className="flex flex-col ">
                  <label className="text-[#282828]  text-[16px] font-semibold mb-2">By transaction ID</label>
                 <input
                  type='number'
                  value={transactionID}
                  onChange={(e) => setTransactionID(e.target.value)}
                    className=" w-full h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                  >
                  </input>
                </div>

              </div>
              <div className='grid lg:grid-cols-2 grid-cols-1 w-11/12 gap-8 mt-6 '>
                              <div className='flex flex-col items-start'>
                                  <p className='text-[#282828] text-[16px] mb-2 font-semibold'>By date created</p>
                               <div className='flex items-center justify-between lg:gap-2 md:gap-6 gap-2 w-full'>
                               <div className='relative'>
                                <input 
                                    type="date"
                                    placeholder='from'
                                value={searchCreatedDate.startDate}
                                required={searchCreatedDate.endDate ? true : false}
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
                                  <p className='text-[#282828] text-[16px] mb-2 font-semibold'>By amount range</p>
                                  <div className='flex items-center justify-between gap-2 lg:w-full md:w-full '>
                    <input 
                    type="number"
                    placeholder='₦ Amount from'
                    value={Amount.min}
                    required={Amount.max ? true : false}
                    onChange={(e) => setAmount({...Amount, min: e.target.value})}
                    className="lg:w-[168px] md:w-[248px] w-[180px] h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                    />
                    <input 
                    type="text"
                  value={Amount.max}
                  required={Amount.min ? true : false}
                  onChange={(e) => setAmount({...Amount, max: e.target.value})}
                    className="lg:w-[168px] md:w-[248px] w-[180px]  h-[44px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#E1E1E1] rounded-[8px] p-2  focus:outline-none"
                    placeholder='₦ Amount to'
                    />

                  </div>
                            </div>
                            
                          </div>
           

           
               
            <div className='flex justify-end gap-4 items-end lg:mt-64 md:mb-6 w-11/12'>
                <button
              type='submit'
                className='w-[96px] h-[41px] bg-[#F6011BCC] text-[#FFFFFF] font-montserrat font-medium text-[15px] rounded-[22px] cursor-pointer hover:bg-[#333333]'>
                  Apply
                </button>
                <button 
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

export default TransactionFilter;
