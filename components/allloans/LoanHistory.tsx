'use client';
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import ReactDOM from 'react-dom';
import UserLoan from './UserLoan';
import {useRouter} from 'next/navigation';


type SideModalProps = {
  isOpen: boolean;
  toggleLoanHistory: () => void;
  loanHistory:any;
};

const LoanHistory: React.FC<SideModalProps> = ({
  isOpen,
  toggleLoanHistory,
    loanHistory
}) => {
    
 
  const [selectedRows, setSelectedRows] = useState('all');

  const router = useRouter();

  const dataToDisplay = loanHistory
  ?.sort((a: any, b: any) => b.id - a.id) // Sort by id in descending order
  ?.filter((data: any) => {
    if (selectedRows === 'all') return data;
    if (selectedRows === 'successful') return data.status === 'OPEN' || data.status === 'OVERDUE'|| data.status === 'CLOSED';
    if (selectedRows === 'failed') return data.status === 'FAILED';
    if (selectedRows === 'defaulted') return data.default;
  });



  const modalContent = (
    <div
    onClick={(e) => {
      e.stopPropagation();
      toggleLoanHistory();
    }}
    className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 font-montserrat z-50 flex justify-center items-center transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
  >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white md:left-2/4 lg:left-1/4 lg:ml-20  lg:w-[541px] md:w-9/12 w-full overflow-hidden min-h-screen h-auto ${
          isOpen ? 'scale-100' : 'scale-75'
        }`}
      >
        {/* Modal Content */}
        <div className={`w-full bg-[#FFFFFF] fixed z-0 h-auto`}>
        <div className="flex justify-end items-center mt-1 mr-2  ">
                    <button onClick={toggleLoanHistory} className="">
                      <IoClose className="text-navfont rounded-full bg-[#ECECEC] text-3xl mt-2 mr-2 p-1 font-bold" />
                    </button>
        </div>
            <>
            <div className='ml-4'>
            <p className='text-[18px] font-bold text-[#282828] my-2'>Loan History</p>
            <p className='text-[16px] font-medium text-[#282828] my-2'>{`${loanHistory[0]?.profile?.first_name} ${loanHistory[0]?.profile?.last_name}`}, {loanHistory[0]?.phone_number || loanHistory[0]?.profile?.phone_number}</p>
            
               <div className='flex justify-start gap-8 my-6 items-center '>
               <button
             onClick={() => setSelectedRows('all')}
             className={`${selectedRows === 'all' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
           >
             <span className="pb-6">All({loanHistory?.length})</span>
             {selectedRows === 'all' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
           </button>
           <button
             onClick={() => setSelectedRows('successful')}
             className={`${selectedRows === 'successful' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
           >
             <span className="pb-6">Successful({loanHistory?.filter((data:any) => data.status === 'OPEN' || data.status === 'OVERDUE' || data.status === 'CLOSED').length})</span>
             {selectedRows === 'successful' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
           </button>
           <button
             onClick={() => setSelectedRows('failed')}
             className={`${selectedRows === 'failed'? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
           >
               <span className="pb-6">Failed({loanHistory?.filter((data:any) => data.status === 'FAILED').length})</span>
               {selectedRows === 'failed' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
           </button>
           <button
               onClick={() => setSelectedRows('defaulted')}
               className={`${selectedRows === 'defaulted' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
               >
                   <span className="pb-6">Defaulted({loanHistory.filter((data:any) => data.default ).length})</span>
                   {selectedRows === 'defaulted' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
               </button>
   
               </div>
           
        </div>
       
        </>
    
       
        
    </div>
    {/* Scrollable Loan Cards Section */}
    <div className={`relative mt-[190px] overflow-y-auto pb-16 z-0 h-[calc(100vh-170px)]`}>
  
      {dataToDisplay?.map((loan: any, index: number) => (
        <UserLoan loanInfo={loan} loanHistory={true} key={index}/>
      ))}
</div>
        
      </div>
      
      
    </div>
  );

  // Render modal content into the root of the document
  return ReactDOM.createPortal(modalContent, document.body);
};

export default LoanHistory;
