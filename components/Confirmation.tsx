import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {useRouter,usePathname} from 'next/navigation'
import apiClient from '@/utils/apiClient';
import LoadingPage from '@/app/loading';
import Notification from '@/components/Notification';

type ConfirmationProps = {
  toggleConfirmation: () => void;
  isOpen: boolean;
 id: string | number;
 message: string;
 setRefresh?: (refresh: boolean) => void;
};


const Confirmation: React.FC<ConfirmationProps> = ({ toggleConfirmation, isOpen, id,message,setRefresh}) => {
  
  const router = useRouter()
  const [loading, setLoading] = useState(false)
   const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [successNotification, setSuccessNotification] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const pathName = usePathname();
    
  
     // Toggle notification
   const toggleNotification = () => {
    setNotificationOpen(!isNotificationOpen);
};

// Toggle success notification
const toggleSuccessNotification = () => {
  setSuccessNotification(!successNotification);
};


  const handleDelete = async () => {
    setLoading(true)
    try {
        if(!id) return;
      const url = pathName === ('/settings') ? `/ads/${id}` :`/auth/admin/${id}`;
    const response = await apiClient.delete(`${url}`);
    setSuccess( url.includes('users') ? 'User deleted successfully' : 'Ad deleted successfully');
    setSuccessNotification(true);
    if (setRefresh) {
      setRefresh(true);
      toggleConfirmation();
    }
  
      
    } catch (error:any) {
        console.error(error);
        if (error?.status === 401) {
            setError('Unauthorized access. You do not have permission to view this resource.');
            setNotificationOpen(true);
          }else {
          setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
          setNotificationOpen(true);
          }
        setLoading(false);
    } finally {
      setLoading(false);
    }
  };    

  const handleDeleteRole = async () => {
    setLoading(true)
    try {
        if(!id) return;
    const response = await apiClient.delete(`/roles/${id}`);
    setSuccess( 'Role deleted successfully');
    setSuccessNotification(true);
    if (setRefresh) {
      setRefresh(true);
      toggleConfirmation();
    }
      
    } catch (error:any) {
        console.error(error);
       if (error?.status === 401) {
            setError('Unauthorized access. You do not have permission to view this resource.');
            setNotificationOpen(true);
          }else {
          setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
          setNotificationOpen(true);
          }
    } finally {
      setLoading(false);
    }
  };    


  
  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 bg-black w-full h-full -translate-y-1/2 z-50 flex justify-center items-center  bg-opacity-80 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className={`notifybanner w-[431px] min-h-[260px] h-auto   mx-2 lg:mx-0 md:mx-0  font-outfit rounded-[22px] p-6 shadow-md  transition-transform duration-300 transform ${isOpen ? "scale-100" : "scale-75"}`}>
      <div className={` w-full mb-4  mt-3  rounded-[22px]`}>

            <Image
              src= '/images/failed.png' 
              alt="Confirmation Icon"
              width={60}
              height={60}
              className='ml-4'
            />
  
        </div>
        <div className='text-[20px] text-[#030602] '>
            <p className='text-center'>{message}</p>
        </div>
        {loading && <LoadingPage />}
        <div className=' flex justify-start items-center ml-4 mt-6'>
            <button
              type="button"
              onClick={ 
                pathName === '/settings' ? handleDelete :
                message === 'Are you sure you want to delete this user?' ? handleDelete : handleDeleteRole}
             className="bg-[#1C1C1E]  text-white disabled:opacity-50 disabled:cursor-not-allowed h-[47px] mb-4 w-[162px] rounded-[12px] px-4 py-2 mt-4 font-medium"
            >
              Yes, Continue
            </button>
            <button
               
                type="button"
                onClick={toggleConfirmation}
                className=" ml-4 bg-[#46A4B51F] text-[#F6011BCC] disabled:opacity-50 disabled:cursor-not-allowed h-[47px] mb-4 w-[162px] rounded-[12px] px-4 py-2 mt-4 font-medium"
              >
                Go Back
              </button>
          </div>
       
      </div>
       {/* Success Notification */}
       {successNotification && (
                <Notification
                    status="success"
                    title="Success!"
                    message={success}
                    toggleNotification={toggleSuccessNotification}
                    isOpen={successNotification}
                />
            )}

      {isNotificationOpen && (
                <Notification
                    status="error"
                    message={error}
                    toggleNotification={toggleNotification}
                    isOpen={isNotificationOpen}
                />
            )}

    </div>
  );
};

export default Confirmation;