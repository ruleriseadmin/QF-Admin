import React,{useState,useEffect} from 'react'
import { formatCurrency,formatDate,formatTime,calculateClosedDaysBetween } from '@/utils/loan'
import { IoTime } from "react-icons/io5";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import Image from 'next/image';
import LoadingPage from '@/app/loading';
import apiClient from '@/utils/apiClient';

type UserLoanProps = {
    loanInfo: any; 
    loanHistory?:boolean; 
}


const UserLoan: React.FC<UserLoanProps> = ({loanInfo,loanHistory=false}) => {
  const [openProcessingModal, setOpenProcessingModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [confirmChangeStatus, setConfirmChangeStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  

  const toggleProcessingModal = () => {
    setOpenProcessingModal(!openProcessingModal);
  }

  const handleSubmit = async () => {
    // Handle the status change logic here
      try {
        setLoading(true);
        const response = await apiClient.post(`/loan/manual-verification`,
                        {
                            loan_id: loanInfo?.id,
                            status: selectedStatus
                        }
                    );
        setSuccess('Loan status updated successfully');

      } catch (error: any) {
        console.error('Error sending notification query:', error);
        setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
      } finally {
        setLoading(false);
      }
    };
  

  return (
    <>
    {(!loanHistory && (window.location.pathname === '/loans' || window.location.pathname === '/dashboard'))  && (
        <div>
        
    <div className=" bg-[#EBEBEB] lg:w-[487px] md:w-[487px] w-[410px] overflow-x-hidden rounded-[12px] min-h-[233px] h-auto mx-auto  mt-4 ">
        <div className='pb-4'>
        <p className={`flex justify-between items-center pt-6 mx-6 mb-4 font-semibold text-[16px] ${loanInfo?.status === 'OPEN' ? 'text-[#5E8D35]'
            : loanInfo?.status === 'CLOSED' ? 'text-[#2290DF]' : loanInfo?.status === 'FAILED' ? 'text-[#9D8814]' : loanInfo?.status === 'PROCESSING' ? 'text-[#9D8814]' : 'text-[#DA3737]'
        } `}>
            <span className=''>ID {loanInfo?.id}</span>
            <div className='flex justify-center items-center relative'>
              <span className=''>{loanInfo?.status}</span>
            {loanInfo?.status === 'PROCESSING' && (
               <IoIosArrowDropdownCircle 
               onClick={toggleProcessingModal}
               className='inline text-blue-700 text-lg cursor-pointer lg:text-xl md:text-2xl ml-1'/>
            )}
            </div>
           
        </p>
    {openProcessingModal && (
  <>
    {/* Background Overlay */}
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-30"
      onClick={() => {
        setError('');
        setSuccess('');
        setConfirmChangeStatus(false);
        setSelectedStatus('');
        toggleProcessingModal();
      }}
    ></div>

    {/* Dropdown Content */}
    <div
      className="absolute top-[67px] lg:left-[265px]  md:left-[232px] left-[191px] w-[229px] min-h-[138px] h-auto bg-white rounded-xl shadow-lg font-montserrat font-medium z-50"
    >
      {!confirmChangeStatus ? (
  // Step 1: status selection + proceed
  <>
    <p className='text-[16px] text-[#2290DF] mt-2 font-bold w-full text-center'>
      Change loan status
    </p>
    {['OPEN', 'CLOSED', 'FAILED'].map((select: any, index: number) => (
      <button
        key={index}
        onClick={() => {
          setSelectedStatus(select);
        }}
        className={`w-full font-montserrat text-start ml-4 font-medium text-[13px] text-[#282828] ${
          index === 0 ? 'mt-4' : 'mt-2'
        }`}
      >
        <div className="flex justify-start text-[#282828] items-center font-medium gap-6">
          <p>{select}</p>
          {select === selectedStatus && (
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

    {/* Continue / Proceed Button */}
    <div className="flex justify-end text-[13px] my-2 pr-4">
      <button
        onClick={() => {
          setConfirmChangeStatus(true);
        }}
        disabled={!selectedStatus} // prevent proceed without selection
        className={`px-4 py-2 rounded-md text-white ${
          selectedStatus
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Proceed
      </button>
    </div>
  </>
) : confirmChangeStatus && (!success && !error) ? (
  // Step 2: confirm action
  <div className="px-4 py-6">
    <p className="text-[#282828] text-[14px] text-center">
      Are you sure you want to change the loan status to{" "}
      <span className="font-bold text-[#DA3737]">{selectedStatus}</span>?
    </p>
    {loading && <LoadingPage />}
    <div className="flex justify-end mt-4">
      <button
        onClick={() => {
          handleSubmit();
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Confirm
      </button>
      <button
        onClick={() => {
          setConfirmChangeStatus(false);
        }}
        className="bg-gray-300 text-black px-4 py-2 rounded-md ml-2"
      >
        Cancel
      </button>
    </div>
  </div>
) : (!loading && (success || error)) ? (
  // Step 3: show result
  <div className="px-4 py-6 flex flex-col justify-center items-center">
  <p
    className={`text-[14px] font-medium ${
      error ? 'text-red-500' : success ? 'text-blue-500' : 'text-[#282828]'
    }`}
  >
    {success || error}
  </p>
</div>

) : null}

    </div>
  </>
)}


        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Loan Tenure</span>
            <span className='font-medium text-[15px]'>{loanInfo?.interest?.period}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Loan Source</span>
            <span className='font-medium text-[15px]'>{loanInfo?.source}</span>
        </p>
       {loanInfo?.has_upfront_interest ? (
            <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Loan Amount </span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.amount)}</span>
        </p>
            
          ) : null

        }
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Amount Disbursed</span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.disbursed_amount)}</span>
        </p>
         {loanInfo?.has_upfront_interest ? ( <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
        <span className=' '>{loanInfo?.status === 'OPEN' ? 'Amount Due' : 'Original Amount Due'}</span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.amount)}</span>
        </p>) : (
           <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
        <span className=' '>{loanInfo?.status === 'OPEN' ? 'Amount Due' : 'Original Amount Due'}</span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.total_payable - loanInfo.penalty)}</span>
        </p> 
         )}
        { loanInfo?.loan_schedules?.filter((loan: any) => loan?.status === "partially_paid" && loanInfo?.status !== "OVERDUE")
  .map((loan: any, index: number) => (
    <div key={index}>
      
{
  loanInfo?.has_upfront_interest ? (
    <>
      {/* Always show Upfront Payment */}
      <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
        <span>Upfront Payment</span>
        <span className="font-medium text-[15px]">
          {formatCurrency(loanInfo?.interest_amount)}
        </span>
      </p>

      {/* Show Partial Payment + Balance only if another payment (besides upfront) has been made */}
      {loanInfo?.amount_remaining < loanInfo?.amount && (
        <>
          <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
            <span>Partial Payment</span>
            <span className="font-medium text-[15px]">
              {formatCurrency(loanInfo?.amount + loanInfo?.interest_amount - loanInfo?.amount_remaining - loanInfo?.interest_amount)}
            </span>
          </p>

          <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
            <span>Balance to Pay</span>
            <span className="font-medium text-[15px]">
              {formatCurrency(loanInfo?.amount_remaining)}
            </span>
          </p>
        </>
      )}
    </>
  ) : (
    <>
      {/* No upfront interest — show normal partial + balance */}
      <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
        <span>Partial Payment</span>
        <span className="font-medium text-[15px]">
          {formatCurrency(loanInfo?.amount + loanInfo?.interest_amount - loanInfo?.amount_remaining)}
        </span>
      </p>

      <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
        <span>Balance to Pay</span>
        <span className="font-medium text-[15px]">
          {formatCurrency(loanInfo?.amount_remaining)}
        </span>
      </p>
    </>
  )
}

    </div>
  ))}

        
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Loan Date</span>
            <span className='font-medium text-[15px]'>{formatDate(loanInfo?.created_at?.split(' ')[0])} {formatTime(loanInfo?.created_at?.split(' ')[1])}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Due Date</span>
            <span className='font-medium text-[15px]'>{formatDate(loanInfo?.expiry_date)}</span>
        </p>
        {(loanInfo?.status === 'CLOSED' || loanInfo?.status === 'OVERDUE') && (
            <>
            <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
                <span className=' '>Last Payment</span>
                <span className='font-medium text-[15px] '>{formatDate(loanInfo?.updated_at?.split(' ')[0])} {formatTime(loanInfo?.updated_at?.split(' ')[1])}</span>
            </p>
            <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
                <span className=' '>DPD</span>
                <span className='font-medium text-[15px] '>{calculateClosedDaysBetween(loanInfo?.expiry_date,loanInfo?.updated_at?.split(' ')[0])}</span>
            </p>
            <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
                <span className=' '>Penalty Accrued</span>
                <span className='font-medium text-[15px] '>{formatCurrency(loanInfo?.penalty)}</span>
            </p>
             <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
                <span className=' '>Current Penalty</span>
                <span className='font-medium text-[15px] '>{formatCurrency(loanInfo?.penalty_remaining)}</span>
            </p>
            <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
                <span className=' '>{loanInfo.status === 'CLOSED' ? 'Total Amount Collected' : 'Amount Collected' }</span>
                <span className='font-medium text-[15px] '>{formatCurrency(loanInfo?.total_payable - loanInfo?.amount_remaining)}</span>
            </p>

            </>
        )}
        {
            loanInfo?.status === 'OVERDUE' && (
                <p className='text-[#C73802] flex justify-between items-center mx-6 mb-2 mt-5 font-semibold text-[16px] '>
                <span className=' '>Total Amount Outstanding</span>
                <span className='font-medium text-[15px] '>{formatCurrency(loanInfo?.amount_remaining)}</span>
            </p>
            )
        }
        

        </div>
        <p className='text-[#1922AB] text-[16px] font-bold font-montserrat ml-5 mt-6'>Loan Schedule </p>
{loanInfo?.loan_schedules?.map((loan:any, index:number) => (
<div key={index} className='grid lg:gap-3 mb-4 font-montserrat   lg:w-[487px] md:w-[487px] w-[410px] rounded-[12px] min-h-[50px] h-auto  mx-auto md:gap-2 p-4 text-[16px] grid-cols-2 align-middle '>
      <div className='w-full flex gap-3 font-semibold text-[16px]'>
        {/* Fixed-width container for Paid status or IoTime icon */}
      <div className="w-[60px] ">
              {loan?.status === 'completed' ? (
                <span className="px-3 py-1 text-white bg-[#1F96A9] rounded-full text-[13px] font-medium">Paid</span>
              )  : loanInfo?.status === 'OVERDUE' ? (
                <span className="px-2 pb-2 pt-1 text-white bg-[#ED3237] rounded-full text-[13px] font-light mr-1 ">Overdue</span>
              ) : loan?.status === 'partially_paid' ? (<span className="px-3  py-1 text-white bg-[#FFD166] rounded-full text-[13px] font-light">Part</span>) : (
                <IoTime className='text-blue-700 text-lg lg:text-xl md:text-2xl' />
              )}
            </div>

      {/* Payment title */}
      <p className={`${loan?.status === 'completed' ? 'text-[#5A5A5A]' : 'text-[#282828] '} lg:text-[16px] text-[13px] md:text-[16px]`}>
        Payment {index + 1}
      </p>
        
      </div>
      

      {/* Amount and Date section */}
      <div className={`${loan?.status === 'completed' ? 'text-[#5A5A5A]' : 'text-[#282828] '} font-medium text-[15px]  leading-7 flex  flex-col`}>
        <div className='flex flex-col justify-end items-end'>
        <span className='font-medium'>{loanInfo[0]?.status === 'OVERDUE' ? formatCurrency(loan?.remaining_balance + loanInfo[0]?.penalty_remaining) : formatCurrency(loan?.payment_amount)}</span>
        </div>
      </div>
    </div> ))}
        
    
</div>


    </div>



    )}
    {(window.location.pathname === '/customers' || window.location.pathname === '/kyc' || window.location.pathname === '/blacklisted'|| loanHistory) && (
        
        <div className=" bg-[#EBEBEB] lg:w-[487px] md:w-[487px] w-[410px] rounded-[12px] min-h-[233px] h-auto mx-auto  mt-4 ">
        <div className='pb-4'>
        <p className={`flex justify-between items-center pt-6 mx-6 mb-4 font-semibold text-[16px] ${loanInfo?.status === 'OPEN' ? 'text-[#5E8D35]'
            : loanInfo?.status === 'CLOSED' ? 'text-[#2290DF]' : loanInfo?.status === 'FAILED' ? 'text-[#9D8814]' : 'text-[#DA3737]'
        } `}>
            <span className=''>ID {loanInfo?.id}</span>
            <span className=''>{loanInfo?.status}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Loan Tenure</span>
            <span className='font-medium text-[15px]'>{loanInfo?.interest?.period}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Loan Source</span>
            <span className='font-medium text-[15px]'>{loanInfo?.source}</span>
        </p>
        {loanInfo?.has_upfront_interest ? (
            <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Loan Amount </span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.amount)}</span>
        </p>
            
          ) : null

        }
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Amount Disbursed</span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.disbursed_amount)}</span>
        </p>
         {loanInfo?.has_upfront_interest ? ( <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
        <span className=' '>{loanInfo?.status === 'OPEN' ? 'Amount Due' : 'Original Amount Due'}</span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.disbursed_amount)}</span>
        </p>) : (
           <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
        <span className=' '>{loanInfo?.status === 'OPEN' ? 'Amount Due' : 'Original Amount Due'}</span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.total_payable - loanInfo.penalty)}</span>
        </p> 
         )}
       
        
        { loanInfo?.loan_schedules?.filter((loan: any) => loan?.status === "partially_paid" && loanInfo?.status !== "OVERDUE")
  .map((loan: any, index: number) => (
    <div key={index}>
     {
  loanInfo?.has_upfront_interest ? (
    <>
      {/* Always show Upfront Payment */}
      <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
        <span>Upfront Payment</span>
        <span className="font-medium text-[15px]">
          {formatCurrency(loanInfo?.interest_amount)}
        </span>
      </p>

      {/* Show Partial Payment + Balance only if another payment (besides upfront) has been made */}
      {loanInfo?.amount_remaining < loanInfo?.amount && (
        <>
          <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
            <span>Partial Payment</span>
            <span className="font-medium text-[15px]">
              {formatCurrency(loanInfo?.amount + loanInfo?.interest_amount - loanInfo?.amount_remaining - loanInfo?.interest_amount)}
            </span>
          </p>

          <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
            <span>Balance to Pay</span>
            <span className="font-medium text-[15px]">
              {formatCurrency(loanInfo?.amount_remaining)}
            </span>
          </p>
        </>
      )}
    </>
  ) : (
    <>
      {/* No upfront interest — show normal partial + balance */}
      <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
        <span>Partial Payment</span>
        <span className="font-medium text-[15px]">
          {formatCurrency(loanInfo?.amount + loanInfo?.interest_amount - loanInfo?.amount_remaining)}
        </span>
      </p>

      <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
        <span>Balance to Pay</span>
        <span className="font-medium text-[15px]">
          {formatCurrency(loanInfo?.amount_remaining)}
        </span>
      </p>
    </>
  )
}

    </div>
  ))}
        
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Loan Date</span>
            <span className='font-medium text-[15px]'>{formatDate(loanInfo?.created_at?.split(' ')[0])} {formatTime(loanInfo?.created_at?.split(' ')[1])}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Due Date</span>
            <span className='font-medium text-[15px]'>{formatDate(loanInfo?.expiry_date)}</span>
        </p>
        {(loanInfo?.status === 'CLOSED' || loanInfo?.status === 'OVERDUE') && (
            <>
            <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
                <span className=' '>Last Payment</span>
                <span className='font-medium text-[15px] '>{formatDate(loanInfo?.updated_at?.split(' ')[0])} {formatTime(loanInfo?.updated_at?.split(' ')[1])}</span>
            </p>
            <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
                <span className=' '>DPD</span>
                <span className='font-medium text-[15px] '>{calculateClosedDaysBetween(loanInfo?.expiry_date,loanInfo?.updated_at?.split(' ')[0])}</span>
            </p>
            <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
                <span className=' '>Penalty Accrued</span>
                <span className='font-medium text-[15px] '>{formatCurrency(loanInfo?.penalty)}</span>
            </p>
             <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
                <span className=' '>Current Penalty</span>
                <span className='font-medium text-[15px] '>{formatCurrency(loanInfo?.penalty_remaining)}</span>
            </p>
            <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
                <span className=' '>{loanInfo.status === 'CLOSED' ? 'Total Amount Collected' : 'Amount Collected' }</span>
                <span className='font-medium text-[15px] '>{formatCurrency(loanInfo?.total_payable - loanInfo?.amount_remaining)}</span>
            </p>

            </>
        )}
         {
            loanInfo?.status === 'OVERDUE' && (
                <p className='text-[#C73802] flex justify-between items-center mx-6 mb-2 mt-5 font-semibold text-[16px] '>
                <span className=' '>Total Amount Outstanding</span>
                <span className='font-medium text-[15px] '>{formatCurrency(loanInfo?.amount_remaining)}</span>
            </p>
            )
        }
        </div>
</div>
    )}
</>
  )
}

export default UserLoan