'use client'
import Image from "next/image";
import React,{ useState, useEffect } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { ThreeDots } from 'react-loader-spinner';
import axios from "axios";
import Notification from "@/components/Notification";
import {ensureGuest} from "@/components/auth/EnsureGuest";


type ResetPasswordProps = {
  toggleLogin: () => void;
}
const ResetPassword:React.FC<ResetPasswordProps> = ({toggleLogin}) => {
      const [otp, setOtp] = useState("");
      const [email, setEmail] = useState("");
      const [loading, setLoading] = useState(false);
      const router = useRouter();
      const [error, setError] = useState("");
      const [isNotificationOpen, setNotificationOpen] = useState(false);
       const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [password_confirmation, setPassword_confirmation] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
    const [showResend, setShowResend] = useState(false);
    const [success, setSuccess] = useState('');
    const [successNotification, setSuccessNotification] = useState(false);

     // Countdown effect for resend button
    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timerId); // Clear timer on unmount
        } else {
            setShowResend(true); // Show resend button when timer runs out
        }
    }, [timeLeft]);

    // Format time as mm:ss
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Resend OTP
    const resendOtp = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_LENDING_SERVICE_URL}/auth/admin/send-otp`, {
                email
            }, {
                headers: {
                    'x-api-key': `${process.env.NEXT_PUBLIC_LENDING_SERVICE_API_KEY}`
                }
            });
            
            setSuccess(res?.data?.message);
            setSuccessNotification(true);
            setTimeLeft(30); // Reset countdown timer
            setShowResend(false); // Hide resend button
            setLoading(false);
        } catch (error: any) {
            console.log(error?.response);
            setError(error?.response?.data?.message || 'An error occurred, please try again');
            setNotificationOpen(true);
            setLoading(false);
        }
    };
    
    
      //toggle notification
    const toggleNotification = () => {
        setNotificationOpen(!isNotificationOpen);
    }

    //toggle success notification
    const toggleSuccessNotification = () => {
        setSuccessNotification(!successNotification);
    }

    //fetch email from local storage
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    
     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
       
          setLoading(true);
          
          const res = await axios.post(`${process.env.NEXT_PUBLIC_LENDING_SERVICE_URL}/auth/admin/reset-password`, {
              email,
              password,
              password_confirmation,
              otp

          }, {
              headers: {
                  'x-api-key': `${process.env.NEXT_PUBLIC_LENDING_SERVICE_API_KEY}`
              }
          });
          
          setSuccess(res?.data?.message);
          setSuccessNotification(true);
          // Wait a moment to show the success notification before proceeding
        setTimeout(() => {
          toggleLogin()
      }, 3000); 
          setLoading(false);
      } catch (error: any) {
          console.log(error?.response);
          setError(error?.response?.data?.error?.password[0] || error?.response?.data?.message  || 'An error occurred, please try again');
          setNotificationOpen(true);
          setLoading(false);
      }
       
    };

  return (
    <div className="mt-10 w-full  h-full">
      
         <p className="mt-1 tracking-wider font-light text-[#282828] lg:text-[16px]">Enter your admin login details</p>
         
         <form className=" w-full h-auto mt-10 mb-4" onSubmit={handleSubmit}>
            {/* otp */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Enter your OTP"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full  pl-12 pr-12 py-2 border placeholder-[#5A5A5A] border-[#BEBEBE] h-[55px] bg-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#BEBEBE] focus:outline-none"
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Image
                  src="/images/lock-circle.png"
                  alt="Lock Icon"
                  width={16}
                  height={16}
                  className="text-gray-400"
                />
              </div>
            </div>
            {/* Password input with visibility toggle */}
                         <div className="relative mb-6">
                           <input
                             type={showPassword ? "text" : "password"} // Toggle between password and text
                             placeholder="Enter your password"
                             name="password"
                             onChange={(e) => setPassword(e.target.value)}
                             className="w-full  pl-12 pr-12 py-2 border placeholder-[#5A5A5A] border-[#BEBEBE] h-[55px] bg-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#BEBEBE] focus:outline-none"
                           />
                           <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                             <Image
                               src="/images/lock-circle.png"
                               alt="Lock Icon"
                               width={16}
                               height={16}
                               className="text-gray-400"
                             />
                           </div>
                           <button
                             type="button"
                             className="absolute inset-y-0  right-6 lg:right-8 flex items-center text-[#5A5A5A] text-[16px] font-bold"
                             onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                           >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                           </button>
                         </div>
                         <div className="w-6/12">
           
                         </div>
                            {/* Confirm Password input with visibility toggle */}
                            <div className="relative mb-6">
                            <input
                              type={showConfirmPassword ? "text" : "password"} // Toggle between password and text
                              placeholder="Confirm your password"
                              name="password_confirmation"
                              onChange={(e) => setPassword_confirmation(e.target.value)}
                              className="w-full  pl-12 pr-12 py-2 border placeholder-[#5A5A5A] border-[#BEBEBE] h-[55px] bg-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#BEBEBE] focus:outline-none"
                            />
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                              <Image
                                src="/images/lock-circle.png"
                                alt="Lock Icon"
                                width={16}
                                height={16}
                                className="text-gray-400"
                                />
                            </div>
                            <button
                                type="button"
                                className="absolute inset-y-0  right-6 lg:right-8 flex items-center text-[#5A5A5A] text-[16px] font-bold"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle password visibility
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            </div>

   
                
                
                 {/* Submit button */}
                 
                 <div className="relative">
                   {/* Loading spinner */}
     {loading && (
      <div className=" rounded-lg absolute inset-0  flex items-center justify-center">
   <ThreeDots 
     height="19"
     width="38"
     radius="8"
     color="#282828"
     ariaLabel="three-dots-loading"
     visible={true}
   />
 </div>
     )}
     {/* Submit button */}
     <button
       type="submit"
       className="disabled:opacity-50 disabled:cursor-not-allowed w-full bg-[#F24C5D] text-white font-outfit rounded-full h-[55px] py-1 px-4 text-[15px] mt-12"
       disabled={loading} // Disable the button while loading
     >
        Reset password
     </button>
   
     
   </div>
   
               </form>
                <div className="w-full text-center mt-4 ">
                    <p className="text-[#5A5A5A] px-4 w-full mx-auto text-[16px] leading-7">
                        A 6 digit code has been sent to your email. Check your email.
                    </p>
                </div>

                {/* Show countdown or resend button */}
                {showResend ? (
                    <button
                        onClick={resendOtp}
                        className="text-center w-full  mt-8 font-normal text-[#F24C5D] hover:cursor-pointer hover:text-red-900"
                    >
                        Resend code
                    </button>
                ) : (
                    <p className="text-center text-[15px] text-[#F24C5D] mt-4 ">
                        Resend in {formatTime(timeLeft)}
                    </p>
                )}

          {/* Success Notification */}
            {successNotification && (
                <Notification
                    status="success"
                    title="Success!"
                    message={success || "Password reset successfully."}
                    toggleNotification={toggleSuccessNotification}
                    isOpen={successNotification}
                />
            )}
            
   
       {/* Error notification */}
       {isNotificationOpen && (
               <Notification
                 status={'error'}
                 message={error}
                 toggleNotification={toggleNotification}
                 isOpen={isNotificationOpen}
               />
             )}
   
   </div>
   );
   };

export default ensureGuest(ResetPassword)
