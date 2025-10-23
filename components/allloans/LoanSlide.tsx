'use client';
import React, { useState,useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import ReactDOM from 'react-dom';
import LoanHistory from './LoanHistory';
import UserInfo from './UserInfo';
import UserLoan from './UserLoan';
import apiClient from '@/utils/apiClient';
import {useRouter} from 'next/navigation';
import LoadingPage from '@/app/loading';
import Kyc from '../customer/KycSlide';
import Image from 'next/image';
import { FaCaretDown } from "react-icons/fa";

type SideModalProps = {
  isOpen: boolean;
  toggleLoanSlide: () => void;
  isExiting: boolean;
  toggleType:string;
  user:any;
  setRefetch?: React.Dispatch<React.SetStateAction<boolean>>;
  bvnSlide?:boolean;
};

const LoanSlide: React.FC<SideModalProps> = ({
  isOpen,
  toggleLoanSlide,
  isExiting,
    toggleType,
    user,
  setRefetch,
  bvnSlide = false
}) => {
  
    
  
const [openKyC, setOpenKyC] = useState(false);
  const [selectedRows, setSelectedRows] = useState('all');
  const [loading, setLoading] = useState(false);
  const [loanHistory, setLoanHistory] = useState<any[]>([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [type,setType] = useState<string>('temporary');
  const [reason,setReason] = useState<string>('');
  const [amount,setAmount] = useState<number>(0)
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);
  const router = useRouter();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
  
  
  const [openBankModal,setOpenBankModal] = useState(false);

  //toggle bank modal
  const toggleBankModal = () => {
    setOpenBankModal(!openBankModal);
  }

  const dataToDisplay = user?.loans
  ?.sort((a: any, b: any) => b.id - a.id) // Sort by id in descending order
  ?.filter((data: any) => {
    if (selectedRows === 'all') return data;
    if (selectedRows === 'successful') return data.status === 'OPEN' || data.status === 'OVERDUE'|| data.status === 'CLOSED';
    if (selectedRows === 'failed') return data.status === 'FAILED';
    if (selectedRows === 'defaulted') return data.default;
  });

  //toggle blacklist modal
  const toggleBlacklistModal = () => {
    setShowBlacklistModal(!showBlacklistModal);
  };

useEffect(() => {
  const fetchLoanHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/loan?search=${ user?.profile?.phone_number}&page=1&per_page=10000`);
     
      setLoanHistory(response?.data?.data?.loans);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  if(window.location.pathname !== '/customers' && user)
  fetchLoanHistory();
}
, [user]);


  
const blacklistUser = async () => {
  const idToBlacklist =
    window.location.pathname === '/customers' || window.location.pathname === '/kyc' || bvnSlide ? user?.id : user?.user_id;

  if (!idToBlacklist) {
    console.log('User ID is required');
    return;
  }

  setLoading(true);

  try {
    let payload: Record<string, any> = { user_id: idToBlacklist, reason: reason };

    if (user?.blacklisted) {
      payload.type = type;

      if (type === 'temporary') {
        payload.eligible_amount = amount;
      }
      
    }

    const response = await apiClient.post(`/customer/blacklist`, payload);
    setRefetch && setRefetch(true);
    const url = `${window.location.pathname}?status=${encodeURIComponent('success')}&title=${encodeURIComponent('success')}&subMessage=${encodeURIComponent(response?.data?.message || 'User has been blacklisted')}`;
    router.push(url);
    toggleLoanSlide();
  } catch (error: any) {
    console.error(error);
    if (error?.status === 401) {
            setError('Unauthorized access. You do not have permission to view this resource.');
          }else {
          setError(  error?.response?.data?.message || error?.response?.message || 'An error occurred, please try again');
          }
    const url = `${window.location.pathname}?status=${encodeURIComponent('error')}&message=${encodeURIComponent(error?.response?.data?.message || error?.response?.message || 'An error occurred, please try again')}`;
    router.push(url);
    toggleLoanSlide();
  } finally {
    setLoading(false);
  }
};



//toggle kyc
const toggleKyc = () => {
  setOpenKyC(!openKyC);
}


//toggle loan history
const toggleLoanHistory = () => {
  setOpenHistory(!openHistory);
}
 

  const modalContent = (
    <div
      onClick={toggleLoanSlide}
      className={`overlay fixed font-montserrat inset-0 z-50 ${
        isOpen ? 'opacity-100 bg-black' : 'opacity-0 pointer-events-none bg-transparent'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`loanSlide-content  md:left-2/4 lg:left-1/4 lg:ml-20 z-50  lg:w-[541px] md:w-9/12 w-full overflow-hidden min-h-screen h-auto ${
          isExiting ? 'loan-exit' : 'loan-enter'
        }`}
      >
        {/* Modal Content */}
        <div className={`w-full bg-[#FFFFFF] fixed  h-auto`}>
        <div className="flex justify-end items-center mt-1 mr-2  ">
                    <button onClick={toggleLoanSlide} className="">
                      <IoClose className="text-navfont rounded-full bg-[#ECECEC] text-3xl mt-2 mr-2 p-1 font-bold" />
                    </button>
        </div>
        {toggleType === 'loan' && (
            <>
            <div className='ml-4'>
            <p className='text-[18px] font-bold text-[#282828] my-2'>{window.location.pathname === '/customers' || bvnSlide || window.location.pathname === '/kyc' ? 'Loan History' : 'Loan Details'}</p>
            <p className='text-[16px] font-medium text-[#282828] my-2'>{`${user.profile?.first_name} ${user.profile?.last_name}`}, {user.phone_number || user.profile?.phone_number}</p>
            {window.location.pathname === '/customers' ? (
               <div className='flex justify-start gap-8 my-6 items-center '>
               <button
             onClick={() => setSelectedRows('all')}
             className={`${selectedRows === 'all' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
           >
             <span className="pb-6">All({user?.loans?.length})</span>
             {selectedRows === 'all' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
           </button>
           <button
             onClick={() => setSelectedRows('successful')}
             className={`${selectedRows === 'successful' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
           >
             <span className="pb-6">Successful({user?.loans?.filter((data:any) => data.status === 'OPEN' || data.status === 'OVERDUE' || data.status === 'CLOSED').length})</span>
             {selectedRows === 'successful' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
           </button>
           <button
             onClick={() => setSelectedRows('failed')}
             className={`${selectedRows === 'failed'? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
           >
               <span className="pb-6">Failed({user?.loans?.filter((data:any) => data.status === 'FAILED').length})</span>
               {selectedRows === 'failed' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
           </button>
           <button
               onClick={() => setSelectedRows('defaulted')}
               className={`${selectedRows === 'defaulted' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
               >
                   <span className="pb-6">Defaulted({user?.loans?.filter((data:any) => data.default ).length})</span>
                   {selectedRows === 'defaulted' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
               </button>
   
               </div>
            ) : (
              <div className='my-6'></div>
            )}
           
        </div>
       
        </>
        

        )}
        {toggleType === 'user' && (
            <div className='flex justify-start items-center gap-3 ml-4 pb-4 relative'>
                <button
                onClick={() => {
                toggleBlacklistModal()
                }}
                className='bg-[#DA3737] font-semibold text-[15px] px-4 py-2 w-[129px] h-[40px] text-[#FFFFFF] rounded-[22px]'
                >
                    {user?.blacklisted ? 'Unblacklist' : 'Blacklist'}
                </button>
                <button
                onClick={toggleKyc}
                className='bg-[#111111] font-semibold text-[15px] px-4 py-2 w-[129px] h-[40px] text-[#FFFFFF] rounded-[22px] '
                >
                    KYC
                </button>
                {(window.location.pathname === '/loans' || (window.location.pathname === '/dashboard' && !bvnSlide))&& (
                  <button
                  onClick={toggleLoanHistory}
                  className='bg-[#1922AB] font-semibold text-[15px] px-4 py-2 w-[129px] h-[40px] text-[#FFFFFF] rounded-[22px] '
                  >
                      Loan History
                  </button>

                )}
            <div className='flex justify-start items-center'>
 
{openBankModal && ReactDOM.createPortal(
  <>
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-[10000]"
      onClick={() => {
        setError('');
        setSuccess('');
        toggleBankModal();
      }}
    ></div>

    <div
      className="fixed top-[90px] left-[45%] 
                 min-w-[250px] bg-white rounded-xl shadow-lg 
                 font-montserrat font-medium z-[10001] p-4 "
    >
      <div className="flex flex-col gap-2">
        {user?.bank_accounts?.map((bank: any, index: number) => (
          <label
            key={index}
            className="flex items-center gap-3 text-[14px] text-[#282828] cursor-pointer"
          >
            <input
              type="radio"
              name="primaryBank"
              value={bank.id}
              className="cursor-pointer accent-[#2290DF] w-[20px] pb-2 h-[20px] text-[#C4C4C4]"
            />
            <span>{bank.bank_name} - {bank?.account_number?.slice(0, 4)}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end mt-3">
         <button
                  
                  className='bg-[#282828] font-semibold text-[15px] flex justify-center items-center min-w-[161px] w-auto h-[40px] px-4 text-[#FFFFFF] rounded-[22px] '
                  >
                      Make Default bank
                  </button>
      </div>
    </div>
  </>,
  document.body
)}

</div>

                
            {loading && <LoadingPage />}
            
            </div>
        )}

        
    </div>

    {/* Scrollable Loan Cards Section */}
    <div className={`relative ${toggleType === 'loan' && (window.location.pathname === '/customers' || window.location.pathname === '/kyc') ? 'mt-[170px] overflow-y-auto pb-10' : toggleType === 'loan' && window.location.pathname === '/loans' ? 'mt-[150px] overflow-y-auto pb-10' : 'mt-[120px] overflow-auto'} z-0 h-[calc(100vh-170px)]`}>
  {toggleType === 'loan' ? (
    window.location.pathname === '/customers' ||  window.location.pathname === '/kyc' ? (
      dataToDisplay?.map((loan: any, index: number) => (
        <UserLoan key={index} loanInfo={loan}  />
      ))
    ) : (
      <UserLoan loanInfo={user} />
    )
  ) : (
    <UserInfo info={user} setRefetch={setRefetch} bvnSlide={bvnSlide} />
  )}
</div>
        
      </div>
      {openKyC && (
        <Kyc isOpen={openKyC} togglekyc={toggleKyc}  
        id={window.location.pathname === '/customers' || window.location.pathname === '/kyc' || bvnSlide ? user?.id : user?.user_id}/>
      )}
      {openHistory && (
        <LoanHistory isOpen={openHistory} toggleLoanHistory={toggleLoanHistory}  loanHistory={loanHistory}/>
      )}
      {showBlacklistModal && (
  <>
    <div
      className="fixed inset-0 bg-black bg-opacity-20 z-40 w-full"
      onClick={(e) => {
        e.stopPropagation();
        toggleBlacklistModal();
      }}
    ></div>
    <div 
      onClick={(e) => e.stopPropagation()} 
      className="absolute top-[85px] p-6 left-[450px] font-poppins w-[337px] min-h-[287px] h-auto bg-white rounded-[8px] shadow-lg  font-medium z-50"
    >
      {/* radio + amount input */}
      {user?.blacklisted && (
      <div>
         <label htmlFor="permanent" className="ml-8 text-[#282828] mb-2 font-semibold">Permanent</label>
      <div className="flex items-center mb-4">
        <input
          type="radio"
          id="permanent"
          name="blacklistType"
          value="permanent"
          checked={type === 'permanent'}
          onChange={() => {
            setType('permanent')
          }}
          className="mr-2 accent-[#038FC1] w-[25px] h-[25px]"
        />
       
        <input
          type="number"
          placeholder="₦2500"
          disabled
          className="border disabled:placeholder:text-[#D0D5DD] font-normal border-[#D0D5DD] shadow-blacklist h-[40px] rounded-[8px] px-2 py-1 w-full"
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      {/* temporary */}
       <label htmlFor="temporary" className="ml-8 text-[#282828] mb-2 font-semibold">Temporary</label>
      <div className="flex items-center mb-6">
        <input
          type="radio"
          id="temporary"
          name="blacklistType"
          value="temporary"
          checked={type === 'temporary'}
          onChange={() => setType('temporary')}
         className="mr-2 accent-[#1F96A9] w-[25px] h-[25px]"
        />
       
        <input
          type="number"
           placeholder="₦0"

          required={type === 'temporary'}
          className="border disabled:placeholder:text-[#D0D5DD] font-normal border-[#D0D5DD] shadow-blacklist h-[40px] rounded-[8px] px-2 py-1 w-full"
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
        
      </div>

      )}
       

      {/* reason */}
       
     
      <div className="mb-6">
        <label htmlFor="reason" className="ml-1 text-[#282828] mb-2 font-semibold">Reason</label>
        <textarea
          id="reason"
          rows={2}
          placeholder="Enter reason"
          className="border border-[#D0D5DD] shadow-blacklist w-full h-[80px] rounded-[8px] px-2 py-1 resize-none"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>
      </div>
   

      <button
        onClick={blacklistUser}
        className="bg-[#111111]  disabled:opacity-45 w-[115px] h-[41px] items-center rounded-[22px] text-white font-semibold flex justify-center text-[15px] "
        disabled={(user?.blacklisted && type === 'temporary' && amount === 0) ||  reason === '' || loading}
      >
        {loading ? 'Updating...' : 'Update'}
      </button>
    </div>
  </>
)}

      
    </div>
  );

  // Render modal content into the root of the document
  return ReactDOM.createPortal(modalContent, document.body);
};

export default LoanSlide;
