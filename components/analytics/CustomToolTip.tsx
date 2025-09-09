import React from 'react';
import Image from 'next/image';
import { formatDate,formatValue } from '@/utils/loan';

type CustomToolTipProps = {
  active?: boolean;
  payload?: any;
  label?: string | undefined | any;
  toolPosition?: {
    x: number;
    y: number;
  };
};

const CustomToolTip: React.FC<CustomToolTipProps> = ({ active, payload, label, toolPosition }) => {
  if (!active || !payload || !toolPosition) return null;

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '₦ 0';
    return '₦ ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const parts = label?.split(" ", 5) || [];
 

  return (
    <div
      style={{
        position: 'absolute',
        top: toolPosition.y - 200, 
        left: toolPosition.x - 123,
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
      
        <div className="absolute top-0 px-2 left-0 w-full z-50 h-full flex flex-col ml-6  text-[#282828] ">
        <span className="text-[12px] text-[#3C3C4399] text-start font-bold mb-2 mt-8">
  {label?.includes("Week") ? (parts.length >= 2 ? `${parts[0]} ${parts[1]}` : label) : formatDate(label)}
</span>
{label?.includes("Week") && (
<span className="text-[12px] text-[#3C3C4399] text-start font-bold mb-2 ">
  {`${formatDate(parts[2])} ${parts[3]} ${formatDate(parts[4])}`}
</span>)}


          {payload[0]?.payload?.loan_disbursed >= 0 && (
            <div className='grid grid-cols-12 gap-4 '>
            <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#5C59EA]"></span>
              <span>{formatCurrency(payload[0]?.payload?.loan_disbursed)}</span>
            </div>
             <div className="flex col-span-5 items-center mr-4 gap-1 font-semibold text-[16px]">
                <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
                  <span className='text-[#828282]'>{formatValue(payload[0]?.payload?.loan_disbursed_users_count)}</span>
              </div>
            </div>
          )}
          {payload[0]?.payload?.loan_collected >= 0 && (
             <div className='grid grid-cols-12 gap-4 '>
            <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#C4B8FF]"></span>
              <span>{formatCurrency(payload[0]?.payload?.loan_collected)}</span>
            </div>
             <div className="flex col-span-5 items-center mr-4 gap-1 font-semibold text-[16px]">
                <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
                  <span className='text-[#828282]'>{formatValue(payload[0]?.payload?.loan_collected_users_count)}</span>
              </div>
            </div>
          )}
          {payload[0]?.payload?.npl && (
            <div className="flex items-center gap-1 font-semibold text-[16px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#25707D]"></span>
              <span>{payload[0]?.payload?.npl}%</span>
            </div>
          )}
           {(payload[0]?.payload?.penalty_colected >= 0 ) && (
            <div className='grid grid-cols-12 gap-4 '>
            <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#CB704E]"></span>
              <span>{formatCurrency(payload[0]?.payload?.penalty_colected)}</span>
            </div>
             <div className="flex col-span-5 items-center mr-4 gap-1 font-semibold text-[16px]">
                <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
                  <span className='text-[#828282]'>{formatValue(payload[0]?.payload?.penalty_colected_users_count)}</span>
              </div>
            </div>
          )}
           {(payload[0]?.payload?.penalty_due >= 0 ) && (
            <div className='grid grid-cols-12 gap-4 '>
            <div className="flex col-span-7  items-center gap-1 font-semibold text-[16px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#DDA995]"></span>
              <span>{formatCurrency(payload[0]?.payload?.penalty_due)}</span>
            </div>
             <div className="flex col-span-5 items-center mr-4 gap-1 font-semibold text-[16px]">
                <Image src="/images/loanuser.png" width={20} height={20} alt="shape" />
                  <span className='text-[#828282]'>{formatValue(payload[0]?.payload?.penalty_due_users_count)}</span>
              </div>
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
