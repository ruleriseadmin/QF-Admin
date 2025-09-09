'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { ThreeDots } from 'react-loader-spinner';
import { encryptToken } from '@/utils/protect';
import axios from "axios";
import Notification from "@/components/Notification";
import {ensureGuest} from "@/components/auth/EnsureGuest";


type LoginProps = {
    toggleForgotPassword: () => void;
}
const Login:React.FC<LoginProps>  = ({toggleForgotPassword}) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [isNotificationOpen, setNotificationOpen] = useState(false);


  // Toggle notification
  const toggleNotification = () => {
    setNotificationOpen(!isNotificationOpen);
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_LENDING_SERVICE_URL}/auth/admin/login`,
        { email, password },
        {
          headers: {
            "x-api-key": `${process.env.NEXT_PUBLIC_LENDING_SERVICE_API_KEY}`,
          },
        }
      );

      const accessToken = res.data.data.access_token;
      const refreshToken = res.data.data.refresh_token
      localStorage.setItem('admin_refresh_token',refreshToken)
       await encryptToken(accessToken);
       localStorage.setItem('profile', JSON.stringify(res?.data?.data?.admin));

  
router.push('/dashboard');

    } catch (error: any) {
      console.error(error);
      setError(
        error?.response?.data?.error || error?.response?.data?.message || "An error occurred, please try again."
      );
      setNotificationOpen(true);
    } finally {
      setLoading(false);
    }
  };
return (

    <div className="mt-10 w-full  h-full">
   
      <p className="mt-1 tracking-wider font-light text-[#282828] lg:text-[16px]">Enter your admin login details</p>
      
      <form className=" w-full h-auto mt-10 mb-4" onSubmit={handleSubmit}>
              {/* Phone number input */}
              <div className="relative mb-6">
                <input
                  type="email"
                  placeholder="Enter email address"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full  pl-12 py-2 placeholder-[#5A5A5A]  border border-[#BEBEBE] h-[55px] bg-[#F5F5F5] rounded-lg focus:ring-1 focus:ring-[#BEBEBE] focus:outline-none"
                />
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Image
                    src="/images/email.png"
                    alt="email Icon"
                    width={20}
                    height={20}
                    className=""
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
    className="disabled:opacity-50 disabled:cursor-not-allowed w-full bg-[#F24C5D] text-white font-outfit rounded-full h-[55px] py-1 px-4 text-[15px] mt-20"
    disabled={loading} // Disable the button while loading
  >
    Login
  </button>

  
</div>

            </form>
            <div className="text-center mt-4">
              <button 
              type="button"
              onClick={toggleForgotPassword}
              className="text-[14px]  text-[#282828] font-medium hover:text-[#F24C5D] focus:outline-none">
                forgot password?{" "}
              </button>
              </div>

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

export default ensureGuest(Login);