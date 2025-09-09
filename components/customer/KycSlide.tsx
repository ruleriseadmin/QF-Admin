import React, { useState ,useEffect} from 'react';
import Image from 'next/image';
import apiClient from '@/utils/apiClient';

type kycProps = {
  isOpen: boolean;
  togglekyc: () => void;
  id: string;
};

  
  //get onboarding process 
  

const Kyc: React.FC<kycProps> = ({ isOpen, togglekyc,id }) => {
  const [onboarding, setOnboarding] = useState<any>([]);

  useEffect(() => {
    const fetchBoardingProcess = async () => {
      try {
        const response = await apiClient.get(`/onboarding/${id}`);
        setOnboarding(response?.data?.data);
      
        
      } catch (error: any) {
        console.log('error',error);
       
      } 
    };
    fetchBoardingProcess();
    }, []);



  return (
    <div
    onClick={(e) => {
      e.stopPropagation();
      togglekyc();
    }}
    className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 font-montserrat z-50 flex justify-center items-center transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative bg-white rounded-[22px]  shadow-customshadow7 py-4 h-auto transition-transform duration-300 transform ${
        isOpen ? 'scale-100' : 'scale-75'
      } lg:w-[243px] md:w-[243px]   w-[243px]  min-h-[300px] h-auto `}
      
    >
      <div className='flex flex-col gap-4 mt-6' >
        <div className='flex justify-between items-center  mx-4 '>
        
          <p className='text-[14px] font-medium'>Personal Information</p>
          <Image src={onboarding?.profile_exists ? '/images/good2.png' : '/images/bad.png'} alt="kyc" width={17} height={17} />
        
        </div>
       
        <div className='flex justify-between items-center  mx-4 '>
          <p className='text-[14px] font-medium'>Bank Account Link</p>
          <Image src={onboarding?.bank_account_exists ? '/images/good2.png' : '/images/bad.png'} alt="kyc" width={17} height={17} />
        
        </div>
        <div className='flex justify-between items-center  mx-4 '>
          <p className='text-[14px] font-medium'>Card Tokenization</p>
          <Image src={onboarding?.card_tokenized ? '/images/good2.png' : '/images/bad.png'} alt="kyc" width={17} height={17} />
        </div>
        <div className='flex justify-between items-center  mx-4 '>
          <p className='text-[14px] font-medium'>BVN</p>
          <Image src={onboarding?.bvn_nin_exists ? '/images/good2.png' : '/images/bad.png'} alt="kyc" width={17} height={17} />
        </div>
         <div className='flex justify-between items-center  mx-4 '>
          <p className='text-[14px] font-medium'>BVN Verification</p>
          <Image src={onboarding?.bvn_nin_is_verified ? '/images/good2.png' : '/images/bad.png'} alt="kyc" width={17} height={17} />
        </div>
        <div className='flex justify-between items-center  mx-4 '>
          <p className='text-[14px] font-medium'>Credit Bureau</p>
          {onboarding?.credit_bureau === 'NO_DATA' ? 
          <p className='text-[13px] font-montserrat font-bold text-[#DA3737]'>No Data</p> 
          : onboarding?.credit_bureau === 'NO' 
          ?  <p className='text-[13px] font-montserrat font-bold text-[#DA3737]'>Failed</p> 
          : onboarding?.credit_bureau === 'YES' ? 
          <p className='text-[13px] font-montserrat font-bold text-lime-600'>Passed</p> 
         : <p className='text-[13px] font-montserrat font-bold text-[#DA3737]'>Not Done</p>
         }
        </div>
        <div className='flex justify-between items-center  mx-4 '>
          <p className='text-[14px] font-medium'>Liveness Check</p>
          <Image src={onboarding?.live_check === 'completed' ? '/images/good2.png' : '/images/bad.png'} alt="kyc" width={17} height={17} />
        </div>
        <div className='flex justify-between items-center mx-4 '>
          <p className='text-[14px] font-medium'>E-Mandate</p>
          <Image src={onboarding?.["e-mandate"] ? '/images/good2.png' : '/images/bad.png'} alt="kyc" width={17} height={17} />
        </div>
        

      </div>
    
        
       
        </div>
      </div>
    
  );
};

export default Kyc;
