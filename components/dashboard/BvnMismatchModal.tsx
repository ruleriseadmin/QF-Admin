'use client';
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';
import LoadingPage from '@/app/loading';
import Notification from '../Notification';
import { formatDate } from '@/utils/loan';
import Paginate from './Paginate';
import apiClient from '@/utils/apiClient';
import LoanSlide from '../allloans/LoanSlide';
type BvnModalProps = {
  isOpen: boolean;
  toggleMismatch: () => void;
  isExiting: boolean;
  bvnArray?: any;
  lastPage?: number;
  page?: number;
  handlePageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
    loading?: boolean;
};

const BvnMismatchModal: React.FC<BvnModalProps> = ({
  isOpen,
  toggleMismatch,
  isExiting,
  bvnArray = [],
    lastPage = 0,
    page = 1,
    handlePageChange = () => {},
    itemsPerPage = 10,
    totalItems = 0,
    loading

}) => {
  const [openSelection, setOpenSelection] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [error, setError] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [openLoanSlide, setOpenLoanSlide] = useState(false)
const [customer, setCustomer] = useState<any[]>([]);
const [loanExiting, setLoanExiting] = useState(false)

 const toggleLoanSideSlide = () => {
    if (openLoanSlide) {
      setLoanExiting(true);
      setTimeout(() => {
        setOpenLoanSlide(false);
        setLoanExiting(false);
      }, 300); // Match animation duration
    } else {
      setOpenLoanSlide(true);
    }
  };

  const fetchCustomers = async (no: string) => {
  try {
    setSearchLoading(true);
    const response = await apiClient.get(`/customer?search=${no}`);
    setCustomer(response.data?.data?.customers[0] || []);
  } catch (error: any) {
    console.error('err from customer table', error);

    // Ignore cancelled requests properly
    if (error.message === 'canceled' || error.name === 'CanceledError') {
      return;
    }

    if (error?.status === 401) {
      setError('Unauthorized access. You do not have permission to view this resource.');
      setNotificationOpen(true);
    } else {
      setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
      setNotificationOpen(true);
    }
  }finally {
    setSearchLoading(false);
  }
};

  const selection = [
    { name: 'Overall', value: '' },
    { name: 'Last 7 days', value: 'last_7_days' },
    { name: 'Last 30 days', value: 'last_30_days' },
    { name: 'This quarter', value: 'this_quarter' },
    { name: 'Last quarter', value: 'last_quarter' },
    { name: 'This year', value: 'this_year' },
  ];

  const toggleSelection = () => setOpenSelection(!openSelection);
  const toggleNotification = () => setNotificationOpen(!notificationOpen);

  const tableColumns = ['Name', 'Reg Date', 'Phone Number', 'BVN', 'Action'];

  const modalContent = (
     <div
      onClick={toggleMismatch}
      className={`overlay fixed font-montserrat inset-0 z-50 ${
        isOpen ? 'opacity-100 bg-black' : 'opacity-0 pointer-events-none bg-transparent'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`sidebar-content fixed right-0 lg:ml-[233px] md:ml-[190px] lg:w-11/12 md:w-11/12 w-full overflow-y-auto ${
          isExiting ? 'sidebar-exit' : 'sidebar-enter'
        }`}
      >
        <div className="bg-white p-6">
          {/* Header */}
          <div className="flex justify-end">
            <button onClick={toggleMismatch}>
              <IoClose className="text-navfont bg-[#ECECEC] text-3xl p-1 rounded-full" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Image src="/images/matches.png" alt="Match" width={24} height={24} />
            <p className="font-bold text-[18px] text-[#323232]">Mismatch cases</p>
          </div>

          {/* Filter */}
          <div className="relative mb-6">
            <div
              onClick={toggleSelection}
              className="flex items-center bg-[#E1E3E4] rounded-full w-[260px] h-[48px] px-3 cursor-pointer"
            >
              <Image src="/images/calendar-2.png" alt="Calendar" width={18} height={18} />
              <p className="ml-2 text-[#282828]">
                {selection.find((s) => s.value === selectedFilter)?.name || 'Overall'}
              </p>
              <TiArrowSortedDown className="ml-auto text-[#828282]" />
            </div>

            {openSelection && (
              <div className="absolute bg-white shadow-lg rounded-xl z-50 mt-2 w-[250px]">
                {selection.map((item, index) => (
                  <button
                    key={index}
                    className="block text-left w-full px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedFilter(item.value);
                      toggleSelection();
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {loading && <LoadingPage />}
          {searchLoading && <LoadingPage />}

          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="">
                {tableColumns.map((col, i) => (
                  <th key={i} className="text-left py-3 px-4 text-[#282828] font-bold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bvnArray?.mismatches?.length > 0 ? (
                bvnArray?.mismatches?.map((item: any, index: number) => (
                  <tr key={index} className=" font-medium text-[15px]">
                    <td className="py-3 px-4">{item?.name || 'N/A'}</td>
                    <td className="py-3 px-4">{formatDate(item?.registration_date)}</td>
                    <td className="py-3 px-4">{item?.user_phone_number|| 'N/A'}</td>
                    <td className="py-3 px-4">{item?.bvn || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <Image
  onClick={async () => {
    if (searchLoading) return; // prevent double click
    await fetchCustomers(item?.user_phone_number);
    toggleLoanSideSlide();
  }}
  src="/images/blueuser.png"
  width={14}
  height={20}
  alt="Action"
  className={`cursor-pointer`}
/>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-4 text-center" colSpan={5}>
                    No mismatches found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {loading && <LoadingPage />}
        </div>

        {error && (
          <Notification
            message={error}
            toggleNotification={toggleNotification}
            isOpen={notificationOpen}
            status="error"
          />
        )}
         {lastPage > 1  && (
          <div className="lg:pl-14 md:pl-2 pl-4 pt-6 mb-8">
            <Paginate
              lastPage={lastPage}
              currentPage={page}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
                  />
                </div>
              )}

               {openLoanSlide && (
                      <LoanSlide
                      isOpen={!isExiting}
                      toggleLoanSlide={toggleLoanSideSlide}
                      isExiting={loanExiting}
                      toggleType={'user'}
                      user={customer}
                      bvnSlide={true}
              
              
                      />
                    )}
      </div>
     
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default BvnMismatchModal;
