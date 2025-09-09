'use client';
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import LoadingPage from '@/app/loading';
import { BsThreeDots } from "react-icons/bs";
import Paginate from './Paginate';
import apiClient from '@/utils/apiClient';
import { formatDate } from '@/utils/loan';
import LoanSlide from '@/components/allloans/LoanSlide'; 
import Notification from '@/components/Notification';

const LoanUsers: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const itemsPerPage = 10; // Items per page
  const [paginate,setPaginate] = useState(true)
  const [lastPage, setLastPage] = useState(0);
   const [refetch,setRefetch] = useState<boolean>(false)
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [isExiting, setIsExiting] = useState(false)
    const [openLoanSlide, setOpenLoanSlide] = useState(false)
  const [loans, setLoans] = useState<any[]>([]);
  const [totalPerPage, setTotalPerPage] = useState(0);
  const [toggleType, setToggleType] = useState('');
  const [user, setUser] = useState<any>(null);
  const due_today = true;


  //toggle pagination
const togglePaginate = () => {
  setPaginate(!paginate);
}


  
  const handleRowSelect = (row: any) => {
    setSelectedRows((prevSelected) =>
      prevSelected.some((selectedRow) => selectedRow.id === row.id)
        ? prevSelected.filter((selectedRow) => selectedRow.id !== row.id)
        : [...prevSelected, row]
    );
  };
  
 
  
  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === loans.length ? [] : loans
    );
  };

  const toggleLoanSideSlide = () => {
    if (openLoanSlide) {
      setIsExiting(true);
      setTimeout(() => {
        setOpenLoanSlide(false);
        setIsExiting(false);
      }, 300); // Match animation duration
    } else {
      setOpenLoanSlide(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return '₦ ' + amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  

  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };
  useEffect(() => {
    const controller = new AbortController();
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const queryObj: Record<string, string> = { 
          page: String(page), 
          per_page: String(itemsPerPage),
          due_today: String(due_today)
        };
        
  
  
        const queryString = new URLSearchParams(queryObj).toString();
        
  
        const response = await apiClient.get(`/loan?${queryString}`, {
          signal: controller.signal
        });
  
        setLoans(response?.data?.data?.loans || []);
        setTotalPerPage(response?.data?.data?.total_items || 0);
        setLastPage(response?.data?.data?.last_page || 0);
         setRefetch(false)
      } catch (error: any) {
        console.error(error);
        if (error.message !== 'canceled' || error.name !== 'CanceledError') {
          setError(error?.response?.data?.message || 'An error occurred, please try again');
          setNotificationOpen(true);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchLoans();
  
    return () => controller.abort();
  }, [page,paginate,refetch, itemsPerPage]);
  


 const columns = [
     {
       name: (
         <input
           type="checkbox"
           checked={selectedRows.length === loans.length}
           onChange={handleSelectAll}
           className="hover:cursor-pointer accent-[#2d9eb3]"
         />
       ),
       cell: (row: typeof loans[number]) => (
         <input
           type="checkbox"
           checked={selectedRows.some((selectedRow:any) => selectedRow.id === row.id)}
           onChange={() => handleRowSelect(row)}
           className="hover:cursor-pointer accent-[#2d9eb3]"
         />
       ),
       ignoreRowClick: true,
       allowOverflow: true,
       button: true,
       width: '50px',
     },
     { name: 'LOAN SOURCE', selector: 'source' },
     { name: 'STATUS', selector: (row: any) => row.status },
     { name: 'FULL NAME', cell: (row: any) => `${row?.profile?.first_name} ${row?.profile?.last_name}` },
     { name: 'PHONE NO', cell: (row: any) => row?.profile?.phone_number },
     { name: 'LOAN DATE', cell: (row: any) => `${formatDate(row.created_at.split(' ')[0])} ${row.created_at.split(' ')[1]}` },
     { name: 'DUE DATE', cell: (row: any) => formatDate(row.expiry_date) },
     { name: 'LOAN AMT.', cell: (row: any) => `${formatCurrency(row?.amount)}` },
     { name: 'DUE AMT.', cell: (row: any) => `${formatCurrency(row?.total_payable)}` },
     { name: 'DPD', selector: (row: any) => row.expiry_date },
     { name: 'ACTIONS', selector: (row: any) => row.actions },
   ];

  function calculateDaysBetween(dateString: string): number {
    // Parse the input date string into a Date object
    const inputDate = new Date(dateString);
    const today = new Date();
  
    // Calculate the difference in time (in milliseconds)
    const timeDifference = today.getTime() - inputDate.getTime();
  
    // Convert the time difference to days (1 day = 24 * 60 * 60 * 1000 ms)
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    return daysDifference < 0 ? 0 : daysDifference;
  }

//toggle loan slide
const toggleLoanSlide = () => {
  setOpenLoanSlide(!openLoanSlide);
}


  return (
    <div className="mt-28 md:mt-16 mb-10 ml-3 mr-1 z-auto h-auto font-montserrat">
      <div className="flex items-center justify-between lg:pl-4 md:pl-8 mb-10">
        <div className="flex items-center">
          <Image src="/images/loanuser.png" alt="Loan" width={24} height={24} />
          <h1 className="text-[#282828] text-[18px] font-bold">Loans Due Today</h1>
        </div>
        <Image src="/images/sms.png" alt="Filter" width={24} height={24} className="mr-4" />
      </div>
      <div className=" md:ml-4 lg:min-w-[1088px]  md:mr-10 lg:w-auto   lg:ml-0 ml-4  mr-2  font-montserrat lg:mr-8  h-auto rounded-[12px] lg:overflow-hidden bg-[#FFFFFF] shadow-customshadow4 border border-solid border-[#DCDCDC]">
      <div className="lg:overflow-x-hidden md:overflow-x-auto  overflow-x-auto mb-12 ">
  <table className="w-full   mt-2 ml-1">
    <thead className="bg-[#282828] w-full text-[#FFFFFF] h-[46px] font-bold text-[12px] text-left">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`px-3 py-2 ${
                      index === 0 ? 'rounded-tl-[18px] rounded-bl-[18px]' : ''
                    } ${index === columns.length - 1 ? 'rounded-tr-[18px] rounded-br-[18px]' : ''}`}
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loans?.map((row:any) => (
                <tr key={row.id} className="text-[15px] font-medium">
                  {columns.map((col, index) => (
                    <td key={index} className="px-3 pt-7  pb-4 border-b font-montserrat border-[#E6E6E6]">
                      {col.name === 'STATUS' && row.status === 'OPEN' ? (
                        <span className="bg-[#5E8D35] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                          {row.status}
                        </span>
                      ): col.name === 'STATUS' && row.status === 'FAILED' ? (
                        <span className="bg-[#9D8814] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                          {row.status}
                        </span>
                      ) :  col.name === 'STATUS' && row.status === 'CLOSED' ? (
                        <span className="bg-[#2290DF] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                          {row.status}
                        </span>
                      ) :  col.name === 'STATUS' && row.status === 'OVERDUE' ? (
                        <span className="bg-[#DA3737] rounded-full text-[#FFFFFF] px-3 py-1 inline-block">
                          {row.status}
                        </span>
                      ): col.name === 'DPD' ? (
                        <span className=" rounded-full  px-3 py-1 inline-block">
                          {calculateDaysBetween(row?.expiry_date)} 
                        </span>
                      ): col.name === 'ACTIONS' ? (
                        <div className="flex justify-between items-center w-full gap-1">
                          <button
                          onClick={() => {
                            setToggleType('loan');
                            setUser(row);
                            
                            toggleLoanSlide();
                          }}
                          >
                          <Image
                            src="/images/receipt-item.png"
                            width={24}
                            height={24}
                            alt="Hold"
                            className={` ${selectedRows.length ===loans.length ? 'opacity-50' : ''} cursor-pointer`}
                          />

                          </button>
                          <button
                          onClick={() => {
                            setToggleType('user');
                            setUser(row);
                            toggleLoanSlide();
                          }}
                          >
                          <Image
                            src="/images/blueuser.png"
                            width={14}
                            height={20}
                            alt="Hold"
                            className={` ${selectedRows.length ===loans.length ? 'opacity-50' : ''} cursor-pointer`}
                          />
                          </button>
                          
                          <BsThreeDots className={`text-[#282828] text-[24px]  ${selectedRows.length ===loans.length ? 'opacity-50' : ''}`} />
                        </div>
                      ) : col.cell ? (
                        col.cell(row)
                      ) : (
                        row[col.selector as keyof typeof row]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <LoadingPage />}
        {lastPage > 1  && (
    <div className="lg:pl-14 md:pl-2 pl-4 pt-6 mb-8">
      <Paginate
        lastPage={lastPage}
        currentPage={page}
        onPageChange={handlePageChange}
        
        itemsPerPage={itemsPerPage}
        totalItems={totalPerPage}
            />
          </div>
        )}
      </div>
      

      {openLoanSlide && (
        <LoanSlide
        isOpen={!isExiting}
        toggleLoanSlide={toggleLoanSideSlide}
        isExiting={isExiting}
        toggleType={toggleType}
        user={user}
        setRefetch={setRefetch}

        />
      )}

{error && 
            <Notification 
            message={error} 
            toggleNotification={toggleNotification} 
            isOpen={notificationOpen}
            status='error'
     
            />}
       
    </div>
  );
};

export default LoanUsers;
