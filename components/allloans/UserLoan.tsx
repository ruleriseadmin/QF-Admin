import React from 'react'
import { formatCurrency,formatDate,formatTime,calculateClosedDaysBetween } from '@/utils/loan'
import { IoTime } from "react-icons/io5";

type UserLoanProps = {
    loanInfo: any; 
    loanHistory?:boolean; 
}


const UserLoan: React.FC<UserLoanProps> = ({loanInfo,loanHistory=false}) => {

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
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Amount Disbursed</span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.amount)}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>{loanInfo?.status === 'OPEN' ? 'Amount Due' : 'Original Amount Due'}</span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.total_payable - loanInfo.penalty)}</span>
        </p>
        { loanInfo?.loan_schedules?.filter((loan: any) => loan?.status === "partially_paid" && loanInfo?.status !== "OVERDUE")
  .map((loan: any, index: number) => (
    <div key={index}>
      <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
        <span>Partial Payment</span>
        <span className="font-medium text-[15px]">
          {formatCurrency(loan?.payment_amount - loan?.remaining_balance)}
        </span>
      </p>
      <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
        <span>Balance to Pay</span>
        <span className="font-medium text-[15px]">
          {formatCurrency(loan?.remaining_balance)}
        </span>
      </p>
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
    {(window.location.pathname === '/customers' || window.location.pathname === '/kyc'|| loanHistory) && (
        
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
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
            <span className=' '>Amount Disbursed</span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.amount)}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px] '>
        <span className=' '>{loanInfo?.status === 'OPEN' ? 'Amount Due' : 'Original Amount Due'}</span>
            <span className='font-medium text-[15px]'>{formatCurrency(loanInfo?.total_payable - loanInfo.penalty)}</span>
        </p>
        
        { loanInfo?.loan_schedules?.filter((loan: any) => loan?.status === "partially_paid" && loanInfo?.status !== "OVERDUE")
  .map((loan: any, index: number) => (
    <div key={index}>
      <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
        <span>Partial Payment</span>
        <span className="font-medium text-[15px]">
          {formatCurrency(loan?.payment_amount - loan?.remaining_balance)}
        </span>
      </p>
      <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
        <span>Balance to Pay</span>
        <span className="font-medium text-[15px]">
          {formatCurrency(loan?.remaining_balance)}
        </span>
      </p>
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