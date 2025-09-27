import React from 'react';
import Image from 'next/image';
import { formatDate,formatValue } from '@/utils/loan';

type CustomToolTipProps = {
  active?: boolean;
  payload?: any;
  growth?: boolean;
  label?: string | undefined | any;
  toolPosition?: {
    x: number;
    y: number;
  };
};

const CustomToolTip: React.FC<CustomToolTipProps> = ({ active, payload, label, toolPosition,growth }) => {
  
  if (!active || !payload || !toolPosition) return null;
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '₦ 0';
    return '₦ ' + amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  

 
  return (
     <div
          style={{
            position: 'absolute',
            top: toolPosition.y - 200, 
            left: toolPosition.x - 131,
            zIndex: 9999,
            pointerEvents: 'none', // Avoid interfering with mouse
          }}
          className="h-[199px] w-[270px] font-montserrat z-50"
        >
          <Image
            src="/images/pick.png"
            fill
            alt="pick"
            className="object-fill"
          />

      
        <div className="absolute top-0 px-2 left-0 w-full h-full flex flex-col ml-6  text-[#282828] z-10">
        <span className="text-[12px] text-[#3C3C4399] text-start font-bold mb-2 mt-8">
  {growth ? label : formatDate(label)}
</span>
          {payload[0]?.payload?.registration_count && (
            <div className="flex items-center gap-1 font-semibold text-[16px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#2B6E53]"></span>
              <span>{formatValue(payload[0]?.payload?.registration_count)}</span>
            </div>
          )}
          {payload[0]?.payload?.card_count && (
            <div className="flex items-center gap-1 font-semibold text-[16px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#A9CFC0]"></span>
              <span>{formatValue(payload[0]?.payload?.card_count)}</span>
            </div>
          )}
           {payload[0]?.payload?.new_customer >= 0 && (
                      <div className='grid grid-cols-12 gap-4 '>
                      <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
                        <span className="w-[10px] h-[10px] rounded-full bg-[#30353E]"></span>
                        <span>{formatCurrency(payload[0]?.payload?.new_customer)}</span>
                      </div>
                       <div className="flex col-span-5 items-center mr-4 gap-1 font-semibold text-[16px]">
                          <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
                            <span className='text-[#828282]'>{formatValue(payload[0]?.payload?.new_customer_count)}</span>
                        </div>
                      </div>
          )}
          {payload[0]?.payload?.existing_customer >= 0 && (
                      <div className='grid grid-cols-12 gap-4 '>
                      <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
                        <span className="w-[10px] h-[10px] rounded-full bg-[#DE8832]"></span>
                        <span>{formatCurrency(payload[0]?.payload?.existing_customer)}</span>
                      </div>
                       <div className="flex col-span-5 items-center mr-4 gap-1 font-semibold text-[16px]">
                          <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
                            <span className='text-[#828282]'>{formatValue(payload[0]?.payload?.existing_customer_count)}</span>
                        </div>
            </div>
          )}
          {payload[0]?.payload?.returning_customers >= 0 && (
                      <div className='grid grid-cols-12 gap-4 '>
                      <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
                        <span className="w-[10px] h-[10px] rounded-full bg-[#3BA8BA]"></span>
                        <span>{formatCurrency(payload[0]?.payload?.returning_customers)}</span>
                      </div>
                       <div className="flex col-span-5 items-center mr-4 gap-1 font-semibold text-[16px]">
                          <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
                            <span className='text-[#828282]'>{formatValue(payload[0]?.payload?.returning_customer_count)}</span>
                        </div>
            </div>
          )}
          {payload[0]?.payload?.loan_disbursed >= 0 && (
                      <div className='grid grid-cols-12 gap-4 '>
                      <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
                        <span className="w-[10px] h-[10px] rounded-full bg-[#30353E]"></span>
                        <span>{formatCurrency(payload[0]?.payload?.loan_disbursed)}</span>
                      </div>
                       <div className="flex col-span-5 items-center mr-4 gap-1 font-semibold text-[16px]">
                          <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
                            <span className='text-[#828282]'>{formatValue(payload[0]?.payload?.loan_disbursed_users_count)}</span>
                        </div>
                      </div>
          )}
          {payload[0]?.payload?.loan_open >= 0 && (
                      <div className='grid grid-cols-12 gap-4 '>
                      <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
                        <span className="w-[10px] h-[10px] rounded-full bg-[#2B6E53]"></span>
                        <span>{formatCurrency(payload[0]?.payload?.loan_open)}</span>
                      </div>
                       <div className="flex col-span-5 items-center mr-4 gap-1 font-semibold text-[16px]">
                          <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
                            <span className='text-[#828282]'>{formatValue(payload[0]?.payload?.loan_open_users_count)}</span>
                        </div>
            </div>
          )}
          {payload[0]?.payload?.loan_overdue >= 0 && (
                      <div className='grid grid-cols-12 gap-4 '>
                      <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
                        <span className="w-[10px] h-[10px] rounded-full bg-[#DA3737]"></span>
                        <span>{formatCurrency(payload[0]?.payload?.loan_overdue)}</span>
                      </div>
                       <div className="flex col-span-5 items-center mr-4 gap-1 font-semibold text-[16px]">
                          <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
                            <span className='text-[#828282]'>{formatValue(payload[0]?.payload?.loan_overdue_users_count)}</span>
                        </div>
            </div>
          )}
          {growth && (
                      <div className='grid grid-cols-12 gap-4 '>
                      <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
                        <span className="w-[10px] h-[10px] rounded-full bg-[#F3D55B]"></span>
                        <span>{formatValue(payload[0]?.payload?.first_time_loans_count)}</span>
                      </div>
            </div>
          )}
          {growth  && (
                      <div className='grid grid-cols-12 gap-4 '>
                      <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
                        <span className="w-[10px] h-[10px] rounded-full bg-[#2AA81A]"></span>
                        <span>{formatValue(payload[0]?.payload?.growth_rate)}%</span>
                      </ div>
            </div>
          )}
          
        </div>
      

      <Image
        src="/images/tool2.png"
        width={28}
        height={50}
        alt="shape"
        className="absolute top-36 left-1/2 transform -translate-x-1/2"
      />
    </div>
  );
};

export default CustomToolTip;