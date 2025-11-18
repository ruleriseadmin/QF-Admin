import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import apiClient from '@/utils/apiClient';
import { formatValue } from '@/utils/loan';

const MismatchHero = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [misMatchData, setMisMatchData] = useState<any>({});

  useEffect(() => {
    const fetchBvnMisMatch = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/customer/verification_mismatches`);
        setMisMatchData(response?.data?.data);
      } catch (error) {
        console.error('Error fetching bvn mismatch status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBvnMisMatch();
  }, []);

  const colors = ['#E6EAE8', '#FFDDCA', '#FFFFFF'];
  const cust = ['Total Mismatch', 'Unresolved', 'Passed'];

  const total = misMatchData?.total_items || 0;
  const unresolved = misMatchData?.unresolvedCount || 0;
  const passed = misMatchData?.passedCount || 0;

  const displayData = [
    { key: cust[0], value: total, color: colors[0] },
    { key: cust[1], value: unresolved, color: colors[1] },
    { key: cust[2], value: passed, color: colors[2] },
  ];

  return (
    <div className="lg:ml-8 ml-4 mr-2 md:ml-11 mt-12 h-auto font-montserrat">
      <p className="font-bold text-[24px] text-[#282828] tracking-wide">
        BVN Name Mis-match
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 w-full h-auto mt-6">
        {displayData.map((customer, index) => (
          <div
            key={index}
            className="min-h-[123px] w-full flex flex-col gap-6 shadow-customshadow5 rounded-[12px] px-5 py-3"
            style={{ backgroundColor: customer.color }}
          >
            <div className="flex justify-between items-center">
              <p className="text-[16px] text-[#5A5A5A] font-medium">
                {customer.key}
              </p>
              <Image src="/images/calendar.png" alt="Logo" width={18} height={18} />
            </div>
            <p className="text-[22px] text-[#323232] font-black">
              {formatValue(customer.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MismatchHero;
