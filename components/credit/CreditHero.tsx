import React, { useEffect, useState } from 'react';
import apiClient from '@/utils/apiClient';
import { formatValue } from '@/utils/loan';
import { usePathname } from 'next/navigation';

const CreditHero = () => {
  const [error, setError] = useState('');
  const [creditData, setCreditData] = useState<any>(null);
  const pathName = usePathname();

  useEffect(() => {
    const fetchCreditStat = async () => {
      try {
        const response = await apiClient.get('/credit_reports/stats');
        setCreditData(response?.data?.data || {});
      } catch (error: any) {
        setError(error?.response?.data?.message || 'An error occurred, please try again');
        console.error(error);
      }
    };

    fetchCreditStat();
  }, []);

  const colors = ['#E6EAE8', '#FFFFFF', '#EEDADA', '#F5EBDD'];
  const sources = ['CRC', 'First Central', 'Credit Registry', `Cached (${creditData?.report_limit || 90})`];

  let displayData: Array<{ key: string; value: number; color: string }> = [];

  if (creditData) {
    if (pathName === '/credit') {
      displayData = [
        { key: sources[0], value: creditData.crc || 0, color: colors[0] },
        { key: sources[1], value: creditData.first_central || 0, color: colors[1] },
        { key: sources[2], value: creditData.credit_registry || 0, color: colors[2] },
        { key: sources[3], value: creditData.cached || 0, color: colors[3] },
      ];
    } else if (pathName === '/history') {
      displayData = [
        { key: sources[0], value: creditData.crc || 0, color: colors[0] },
        { key: sources[1], value: creditData.first_central || 0, color: colors[1] },
      ];
    }
  }


  return (
    <div className=" lg:ml-8 ml-4 mr-2 md:ml-11 mt-12 h-auto font-montserrat ">
      <p className="font-bold text-[24px]  text-[#282828] tracking-wide ">Credit Bureau Check</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 w-full h-auto mt-6">
  {displayData.map((credit,index) => (
    <div
      key={index}
      className="min-h-[123px]  w-full flex flex-col gap-6 h-auto shadow-customshadow5 rounded-[12px] px-5 py-3"
      style={{ backgroundColor: credit.color }}
    >
        <div className='flex justify-between items-center'>
            <>
            <p className="text-[16px] text-[#5A5A5A] font-medium">{credit.key}</p>
        
            </>
       

        </div>
      
      <p className="text-[22px] text-[#323232] font-black">{formatValue(credit.value)}</p>
    </div>
  ))}
</div>

    </div>
  );
};

export default CreditHero;
