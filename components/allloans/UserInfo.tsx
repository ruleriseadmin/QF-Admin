import React, {useEffect,useState} from 'react'
import Image from 'next/image'
import apiClient from '@/utils/apiClient';
import { formatDate } from '@/utils/loan';
import {LuRefreshCw} from 'react-icons/lu';
import LoadingPage from '@/app/loading';
import Notification from '@/components/Notification';


type UserInfoProps = {
    info: any;
    setRefetch?: React.Dispatch<React.SetStateAction<boolean>>;
}
const UserInfo:React.FC<UserInfoProps> = ({info,setRefetch}) => {
    const [imageData, setImageData] = useState<any>([]);
    const bankToDisplay = info?.bank_accounts?.length ? info?.bank_accounts : [info?.destination_bank_account]
    const cards = info?.card_tokenization?.length ? info?.card_tokenization : []
    const [proceedToFetch, setProceedToFetch] = useState(false);
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const toggleNotification = () => setNotificationOpen(!notificationOpen);
    const [success,setSuccess] = useState('');
   


    // Function to fetch images
    const fetchImageData = async () => {
        try {
            const response = await apiClient.get(`/customer/verification_images/${window.location.pathname === '/customers' || window.location.pathname === '/kyc' ? info?.id : info?.user_id}`);
            const images = response?.data?.data || {};

            setImageData(images);

            // If images exist, ensure proceedToFetch remains true
            if (images?.bvn_url || images?.liveliness_url) {
                setProceedToFetch(true);
            }
        } catch (error: any) {
            console.log('Error fetching images:', error);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchImageData();
    }, [info?.id, info?.user_id]);

    // Check if images disappeared after existing before
    useEffect(() => {
        if (proceedToFetch && !imageData?.bvn_url && !imageData?.liveliness_url) {
            fetchImageData(); // Refetch only once when they disappear
        }
    }, [imageData, proceedToFetch]);

    //function to refetch bvn details
    const refetchBvnDetails = async (ignoreStored=false) => {
        try {
            const idToUse = window.location.pathname === '/customers' || window.location.pathname === '/kyc' ? info?.id : info?.user_id
            const bvn = info?.bvn_details?.bvn
            if(!bvn || !idToUse) return
            setLoading(true)
            const response = await apiClient.post(`/account/nin-bvn`,
                {
                    user_id: idToUse,
                    bvn: bvn,
                    ignore_stored:ignoreStored
                }
            );
            setRefetch && setRefetch(true);
            setSuccess(response?.data?.message || 'BVN details updated successfully');
            setNotificationOpen(true);

        } catch (error: any) {
            console.log('Error fetching BVN details:', error);
            setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
             setNotificationOpen(true);
        }finally{
            setLoading(false)
            
        }
    };

  return (
    <div className=' min-h-[200px]  h-auto ml-6 overflow-hidden '>
      <div className='flex justify-start gap-6 items-center my-4'>
        <div className='flex flex-col z-30'>
        <p className='text-[#1922AB] text-[16px] font-medium mb-4'>Bvn Image</p>
        <div className='w-[150px] h-[150px] rounded-[12px] relative'>
          <Image src={imageData?.bvn_url || "/images/default.jpg"} alt='bvn' fill className='rounded-[12px]' />
        </div>

        </div>
        <div className='flex flex-col '>
        <p className='text-[#1922AB] text-[16px] font-medium mb-4 '>Liveness Image</p>
        <div className='w-[150px] h-[150px] rounded-[12px] relative'>
          <Image src={imageData?.liveliness_url || "/images/default.jpg"} alt='bvn' fill className='rounded-[12px]' />
        </div>

        </div>
      </div>
      <p className='text-[#1922AB] text-[16px] font-medium'>Personal Information</p>
      <div className='mr-10 mt-5'>
      <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Full name</span>
            <span className='font-medium text-[15px]'>{`${info?.profile?.first_name} ${info?.profile?.last_name}`}</span>
        </p>
       
        
        <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Phone number</span>
            <span className='font-medium text-[15px]'>{info?.phone_number || info?.profile?.phone_number}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Date of birth</span>
            <span className='font-medium text-[15px]'>{formatDate(info?.profile?.dob)}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Email address</span>
            <span className='font-medium text-[15px]'>{info?.profile?.email}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Marital Status</span>
            <span className='font-medium text-[15px]'>{info?.profile?.personal_data?.marital_status}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Dependents</span>
            <span className='font-medium text-[15px]'>{info?.profile?.personal_data?.dependents}</span>
        </p>
        
        <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Educational Status</span>
            <span className='font-medium text-[15px]'>{info?.profile?.personal_data?.educational_level}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Employment Status</span>
            <span className='font-medium text-[15px]'>{info?.profile?.employment_status}</span>
        </p>
        {info?.profile?.employment_status === 'employed' && (
          <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Employer</span>
            <span className='font-medium text-[15px]'>{info?.profile?.personal_data?.employer}</span>
        </p>

        )}
         <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Income Level</span>
            <span className='font-medium text-[15px]'>{info?.profile?.personal_data?.income_level}</span>
        </p>
       
        <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Credit score</span>
            <span className='font-medium text-[15px]'>{info?.credit_score}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Referal</span>
            <span className='font-medium text-[15px]'>{info?.profile?.source}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Reg Source</span>
            <span className='font-medium text-[15px]'>{info?.source}</span>
        </p>
         <p className='text-[#282828] flex justify-between items-center  mb-4 font-semibold text-[16px] '>
            <span className=' '>Joined</span>
            <span className='font-medium text-[15px]'>{info?.created_at ? formatDate(info?.created_at?.split(' ')[0]) : ''}</span>
        </p>
       
        
        
        

      </div>
        {/* Next of Kin */}
        <p className='text-[#1922AB] text-[16px] font-semibold mt-8'>Next of Kin</p>
        <div className='mr-10 mt-5'>
        <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Full name</span>
              <span className='font-medium text-[15px]'>{info?.profile?.next_of_kin?.name}</span>
          </p>
          <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Phone number</span>
              <span className='font-medium text-[15px]'>{info?.profile?.next_of_kin?.phone_number}</span>
          </p>
          
        </div>
        {loading && <LoadingPage/>}
        {/* BVN Details */}
        <div className='flex justify-start items-center mt-8'>
            <p className='text-[#1922AB] text-[16px] font-semibold '>BVN Details</p>
            <LuRefreshCw 
                className='inline ml-2 text-[#DA3737] mt-1  cursor-pointer'
                onClick={() => {
                    
                    refetchBvnDetails(true)
                }}
                />
        </div>
        
        <div className='mr-10 mt-5'>
        <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Number</span>

              <span className='flex items-center'>
                <LuRefreshCw 
                className='inline mr-2 text-[#1922AB] cursor-pointer'
                onClick={() => refetchBvnDetails(false)}
                />
                
                <span className='font-medium text-[15px]'>{info?.bvn_details?.bvn}</span>
              </span>
          </p>
          <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Name</span>
              <span className='font-medium text-[15px]'>{info?.bvn_details?.name}</span>
          </p>
           <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Gender</span>
              <span className='font-medium text-[15px]'>{info?.bvn_details?.gender}</span>
          </p>
          <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Address</span>
              <span className='font-medium text-[15px]'>{info?.bvn_details?.address}</span>
          </p>
          <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Phone</span>
              <span className='font-medium text-[15px]'>{info?.bvn_details?.bvn_phone_number}</span>
          </p>
          <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Email</span>
              <span className='font-medium text-[15px]'>{info?.bvn_details?.bvn_email}</span>
          </p>
          
        </div>
        
      {/* Bank Details */}
      {bankToDisplay?.map((bank:any, index:number) => (
        <div className='mr-10 mt-8' key={index}>
        <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
            
                  <span className='text-[#1922AB] '>Bank Account Details ({index + 1})</span>
                  {bank?.default && 
                  <p className='text-[#FFFFFF] flex justify-center w-[79px] h-[28px] bg-[#28A537] rounded-[22px] text-[16px] '>
              <span className=' '>Default</span>
              
          </p>}
          </p>
           <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Bank name</span>
              <span className='font-medium text-[15px]'>{bank?.bank_name}</span>
          </p>
          <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Account number</span>
              <span className='font-medium text-[15px]'>{bank?.account_number}</span>
          </p>
          <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Account name</span>
              <span className='font-medium text-[15px]'>{bank?.account_name}</span>
          </p>
          <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>E Mandate</span>
              <span className='font-medium text-[15px]'>{bank?.authorization_code || '-'}</span>
          </p>
          
        </div>

      ))}
        {/* Card Details */}
        {cards?.map((card:any, index:number) => (
        <div className='mr-10 mt-8' key={index}>
        <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className='text-[#1922AB] '>Card Details ({index + 1})</span>
              <span className='font-medium text-[15px]'>{card?.brand}</span>
          </p>
          <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Card number</span>
              <span className='font-medium text-[15px]'>**** **** **** {card?.last4}</span>
          </p>
          <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
              <span className=' '>Expiry date</span>
              <span className='font-medium text-[15px]'>{card?.exp_month}/{card?.exp_year}</span>
          </p>
            <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
                <span className=' '>Mandate status</span>
                <span className='font-medium text-[15px]'>{card?.authorization || '-'}</span>
            </p>
        </div>
        ))}
      


      <div className='mr-10 mt-8'>
      <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
            <span className=' text-[#1922AB]'>Virtual Account</span>
            <span className='font-medium text-[15px]'> {info?.virtual_accounts?.length ? info?.virtual_accounts[0]?.bank_name : ''} </span>
        </p>
        <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
            <span className=' '>Account number</span>
            <span className='font-medium text-[15px]'>{info?.virtual_accounts?.length ? info?.virtual_accounts[0]?.account_number : ''}</span>
        </p>
        <p className='text-[#282828] flex justify-between items-center  mb-2 font-semibold text-[16px] '>
            <span className=' '>Account name</span>
            <span className='font-medium text-[15px]'>{info?.virtual_accounts?.length ? info?.virtual_accounts[0]?.account_name : ''}</span>
        </p>
      </div>
      
     {notificationOpen && (
            <Notification
              status="error"
              message={error}
              isOpen={notificationOpen}
              toggleNotification={toggleNotification}
            />
          )}
         {notificationOpen && success && (
                <Notification
                  isOpen={notificationOpen}
                  toggleNotification={toggleNotification}
                  message={success}
                  status='success'
                  />
              )}

    </div>
  )
}

export default UserInfo