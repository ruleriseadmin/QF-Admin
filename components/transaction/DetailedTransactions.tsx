import React, { useState } from 'react';
import { FaTimes } from "react-icons/fa";


type DetailedTransactionProps = {
  isOpen: boolean;
  toggleDetailedTransaction: () => void;
  row: any;
};

const DetailedTransaction: React.FC<DetailedTransactionProps> = ({ isOpen, toggleDetailedTransaction,row }) => {
 
  return (
    <div
    onClick={toggleDetailedTransaction}
    className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 font-montserrat z-50 flex justify-center items-center transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative bg-white rounded-[22px]  shadow-customshadow7 h-auto transition-transform duration-300 transform ${
        isOpen ? 'scale-100' : 'scale-75'
      } lg:w-[579px] md:w-[599px]   w-[510px]  h-[415px] overflow-y-auto`}
      
    >
        <div className="flex justify-between items-center  w-full h-[54px] lg:px-6 md:px-6 px-3  bg-[#EBEBEB] rounded-t-[22px] ">
                    <p className="ml-2 text-[#000000] font-medium lg:text-[14px] md:text-[12px]">
                      Payment Details
                    </p>
                  
                  <button
                    onClick={toggleDetailedTransaction}
                    className=" w-[36px] h-[36px]  flex justify-center items-center"
                  >
                    <FaTimes className="text-[#000000] text-xl" />
                  </button>
                </div>
                <div className='grid grid-cols-3  lg:w-11/12 md:w-11/12  mx-auto  lg:gap-8 md:gap-10 gap-8  py-8 '>
                    <div className='flex flex-col lg:text-[14px] md:text-[14px] text-[12px] w-full ml-3 '>
                        <p className='font-semibold'>LOAN ID</p>
                        <p>{row?.ref_id}</p>
                    </div>
                    <div className='flex flex-col text-[14px] w-full '>
                        <p className='font-semibold'>CUSTOMER ID</p>
                        <p>{row?.loan?.user_id || row?.profile?.id}</p>
                    </div>
                    <div className='flex flex-col text-[14px] w-full'>
                        <p className='font-semibold'>AMOUNT</p>
                        <p>₦{row?.amount}</p>
                    </div>
                    <div className='flex flex-col text-[14px] ml-3'>
                        <p className='font-semibold'>PAYMENT TYPE</p>
                        <p>{row?.transaction_type === 'loan' ? 'Disbursement' 
                        : row?.transaction_type === 'payment' ?  'Collection' 
                      : row?.transaction_type === 'refund' ?  'Refund' 
                      : row?.transaction_type === 'card_tokenization' ?  'Card Tokenization'
                      : row?.transaction_type === 'unapplied_payment' ?  'Unapplied Payment'
                      : '-'
                    }</p>
                    </div>
                    <div className='flex flex-col text-[14px] '>
                        <p className='font-semibold'>DATE CREATED</p>
                        <p>{row?.transaction_date}</p>
                    </div>
                    <div className='flex flex-col text-[14px] '>
                        <p className='font-semibold'>CHANNEL</p>
                        <p>{row?.repayment_method}</p>
                    </div>
                    <div className='flex flex-col text-[14px] ml-3'>
                        <p className='font-semibold'>STATUS</p>
                        <p>{row?.status}</p>
                    </div>
                    <div className='flex flex-col text-[14px] '>
                        <p className='font-semibold'>TRANSACTION ID</p>
                        <p>{row?.id}</p>
                    </div>
                    <div className='flex flex-col text-[14px] '>
                        <p className='font-semibold'>REFERENCE</p>
                        <p>{row?.reference}</p>
                    </div>
                    <div className='flex flex-col text-[14px] ml-3'>
                        <p className='font-semibold'>LOAN STATUS</p>
                        <p>{row?.loan?.status}</p>
                    </div>
                    <div className='flex flex-col text-[14px] '>
                        <p className='font-semibold'>BALANCE TO PAY</p>
                        <p>₦{row?.loan?.amount_remaining || '-'}</p>
                    </div>
                     <div className='flex flex-col text-[14px] col-span-3'>
                        <p className='font-semibold'>TRANSACTION MESSAGE.</p>
                        <p>{row?.message || '-'}</p>
                    </div>
                    
                    


                </div>
      
        </div>
      </div>
    
  );
};

export default DetailedTransaction;
