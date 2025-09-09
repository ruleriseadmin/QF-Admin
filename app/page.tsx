'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Notification from "@/components/Notification";
import { ensureGuest } from "@/components/auth/EnsureGuest";
import ForgotPassword from "@/components/homepage/ForgotPassword";
import Login from "@/components/homepage/Login";
import ResetPassword from "@/components/homepage/ResetPassword";

const Homepage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const status = searchParams.get('status') || '';
  const title = searchParams.get('title') || '';
  const message = searchParams.get('message') || '';
  const subMessage = searchParams.get('subMessage') || '';
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const toggleForgotPassword = () => {
    setShowForgotPassword(true);
    setShowLogin(false);
    setShowResetPassword(false);
  };

  const toggleLogin = () => {
    setShowForgotPassword(false);
    setShowLogin(true);
    setShowResetPassword(false);
  };

  const toggleResetPassword = () => {
    setShowForgotPassword(false);
    setShowLogin(false);
    setShowResetPassword(true);
  };

  const toggleNotification = () => {
    setNotificationOpen(!isNotificationOpen);
  };

  const [notificationData, setNotificationData] = useState({
    status: '',
    title: '',
    message: '',
    subMessage: '',
  });

  useEffect(() => {
    if (message || subMessage) {
      setNotificationData({ status, title, message, subMessage });
      setNotificationOpen(true);
    }
  }, [status, title, message, subMessage, router]);

  useEffect(() => {
    if (status || title || message || subMessage) {
      router.replace(window.location.pathname);
    }
  }, [status, title, message]);

  return (
    <div className='w-full h-screen bg-[rgb(217,217,217)] font-outfit'>
      <div className='h-full grid grid-cols-12 gap-4'>

        {/* Scrollable Form Section */}
        <div className='lg:col-span-4 md:col-span-5 col-span-12 h-full overflow-y-auto ml-2 rounded-[12px] bg-[#FFFFFF]'>
          <div className="w-10/12 mx-auto my-10">
            <Image
              src='/images/icon.png'
              alt='Logo'
              width={130}
              height={61}
            />
            <div className="mt-10 w-full">
              <p className="text-[24px] font-semibold text-[#030602] tracking-wider">Welcome Admin</p>
              {showLogin && <Login toggleForgotPassword={toggleForgotPassword} />}
              {showForgotPassword && (
                <ForgotPassword
                  toggleResetPassword={toggleResetPassword}
                  toggleLogin={toggleLogin}
                />
              )}
              {showResetPassword && <ResetPassword toggleLogin={toggleLogin} />}
            </div>
          </div>
        </div>

        {/* Fixed Image Section */}
        <div className="hidden lg:block lg:col-span-8 md:col-span-7 h-full relative mr-2 rounded-[12px] overflow-hidden">
          <Image
            src='/images/loginimage.png'
            alt='Login Background'
            layout='fill'
            className="object-cover absolute w-full h-full rounded-[12px]"
          />
          <div className="absolute lg:w-[382px] md:w-[212px] lg:h-[129.5px] md:h-[90.5px] lg:top-48 lg:left-20 md:top-64 md:left-8">
            <Image
              src='/images/icon.png'
              alt='Quick Logo'
              layout="fill"
            />
          </div>
        </div>

      </div>

      {/* Notification Component */}
      {isNotificationOpen && (
        <Notification
          status={notificationData.status || 'error'}
          message={error || notificationData.message}
          subMessage={notificationData.subMessage}
          toggleNotification={toggleNotification}
          isOpen={isNotificationOpen}
        />
      )}
    </div>
  );
};

export default ensureGuest(Homepage);
