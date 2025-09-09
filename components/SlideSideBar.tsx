'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';
import SlideActivity from './activity/SlideActivity';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';

const SmallScreenSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [openActivity, setOpenActivity] = useState(false);
    const pathname = usePathname();
    const router = useRouter()
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
      const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
      const [displaySettings, setDisplaySettings] = useState('website-cms')


    const toggleSidebar = () => {
        if (isOpen) {
            setIsExiting(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsExiting(false);
            }, 300); // Match animation duration
        } else {
            setIsOpen(true);
        }
    };

    const toggleActivity = () => {
        if (openActivity) {
            setIsExiting(true);
            setTimeout(() => {
                setOpenActivity(false);
                setIsExiting(false);
            }, 300); // Match animation duration
        } else {
            setOpenActivity(true);
        }
    };

    const isActive = (path: any) =>
        pathname === path
            ? 'bg-[#46A4B5] font-bold border border-[#46A4B5] text-white w-11/12 mx-auto rounded-[8px]  h-[35px]'
            : 'text-[#FFFFFF]';

    return (
        <div
            className={`relative h-full overflow-y-auto overflow-x-hidden ${isOpen ? 'w-60' : 'w-12'} transition-all font-montserrat text-[#EEEEEE]  z-50 duration-300 bg-[#FFFFFF]`}
        >
            <div className='bg-[#155661] h-[181px] rounded-[12px] mx-1 mt-1'>
                <div className="flex items-center justify-between h-auto px-3 pt-4">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/images/shortlogo.png"
                            alt="Logo"
                            width={110}
                            height={46}
                        />
                        {isOpen && <p className="text-white font-bold"></p>}
                    </div>
                    <button
                        onClick={toggleSidebar}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-[#ECEAEA] mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h10" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 12h18" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18h13" />
                            </svg>
                            </button>
                </div>

                <div className="mt-4">
                    <div className="flex flex-col items-start">
                         {/* Activity Log Button */}
                         <button
                            onClick={toggleActivity}
                            className={`flex items-center gap-3 py-2 ${ isOpen ? 'px-4' : 'pl-1'} rounded-lg transition-all duration-300 hover:bg-[#46A4B5] cursor-pointer ${openActivity ? 'bg-[#46A4B5] font-bold' : ''}`}
                        >
                            <div className={`${
                                     openActivity ? 'bg-[#46A4B5]' : 'bg-[#25707D]'
                                } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}>
                                <Image
                                    src="/images/activity.png"
                                    alt="Activity Log"
                                    width={20}
                                    height={20}
                                />
                            </div>
                            {isOpen && <span className='text-[#EEEEEE]'>Activity Log</span>}
                        </button>
                        

                        <Link href="/user" className="w-full">
                            <div
                                className={`flex items-center gap-3 py-2  ${ pathname === '/user' ? 'px-2 text-[15px]' : isOpen ? 'px-4' : 'pl-1'} rounded-lg transition-all duration-300 hover:bg-[#46A4B5] cursor-pointer ${isActive(
                                    '/user'
                                )}`}
                            >
                                <div
                                    className={`${
                                        pathname === '/user' ? 'bg-[#46A4B5] ' : 'bg-[#25707D]'
                                    } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
                                    >
                                    <Image
                                        src="/images/user.png"
                                        alt="User Management"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                {isOpen && <span>User Management</span>}
                            </div>
                        </Link>
                    </div>
                </div>
                </div>
                
                        <div className={` rounded-t-[12px] pt-2   h-full my-1 ml-1 mr-3 bg-[#155661] ${isOpen ? 'w-[231px]' : 'w-[40px]'}`}>
                        <Link href="/dashboard" className="w-full">
                            <div
                                className={`flex items-center gap-3 py-2  ${ pathname === '/dashboard' ? 'px-2' : isOpen ? 'px-4' : 'pl-1'} rounded-lg transition-all duration-300 hover:bg-[#46A4B5] cursor-pointer ${isActive(
                                    '/dashboard'
                                )}`}
                            >
                                <div
                                className={`${
                                    pathname === '/dashboard' ? 'bg-[#46A4B5] ' : 'bg-[#25707D]'
                                } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
                                >
                                    <Image
                                        src="/images/dashboard.png"
                                        alt="Dashboard"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                {isOpen && <span>Dashboard</span>}
                            </div>
                        </Link>

                        <Link href="/loans" className="w-full">
                            <div
                                className={`flex items-center gap-3 py-2  ${ isOpen ? 'px-4' : 'pl-1'} rounded-lg transition-all duration-300 hover:bg-[#46A4B5] cursor-pointer ${isActive(
                                    '/loans'
                                )}`}
                            >
                                <div
                                className={`${
                                    pathname === '/loan' ? 'bg-[#46A4B5]' : 'bg-[#25707D]'
                                } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
                                >
                                    <Image
                                        src="/images/loan.png"
                                        alt="All Loans"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                {isOpen && <span>All Loans</span>}
                            </div>
                        </Link>

                        <Link href="/analytics" className="w-full">
                            <div
                                className={`flex items-center gap-3 py-2  ${ isOpen ? 'px-4' : 'pl-1'} rounded-lg transition-all duration-300 hover:bg-[#46A4B5] cursor-pointer ${isActive(
                                    '/analytics'
                                )}`}
                            >
                                <div
                                className={`${
                                    pathname === '/analytics' ? 'bg-[#46A4B5]' : 'bg-[#25707D]'
                                } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
                                >
                                    <Image
                                        src="/images/analytics.png"
                                        alt="Analytics"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                {isOpen && <span>Analytics</span>}
                            </div>
                        </Link>

                        <div
  className={`w-11/12 mx-auto rounded-[8px] ${
    showCustomerDropdown || pathname === '/customers' || pathname === '/kyc'
      ? 'bg-[#46A4B5] mt-2'
      : 'bg-inherit'
  }`}
>

  {/* Main Toggle Row */}
  <div
    className={`flex items-center gap-3 py-2 ${isOpen ? 'px-1' : 'pl-1'} rounded-lg transition-all duration-300 hover:bg-[#46A4B5] cursor-pointer 
    `}
    onClick={() => setShowCustomerDropdown((prev) => !prev)}
  >
    <div
      className={`${
        pathname === '/customers' || pathname === '/kyc' ? 'bg-[#46A4B5]' : 'bg-[#25707D]'
      } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
    >
      <Image
        src="/images/customer.png"
        alt="Customer Management"
        width={20}
        height={20}
      />
    </div>
    {isOpen && <span className="text-white text-[14px]">Customer Mgt.</span>}
    {isOpen && (
      showCustomerDropdown ? (
        <TiArrowSortedUp className="text-white text-[18px] ml-auto" />
      ) : (
        <TiArrowSortedDown className="text-white text-[18px] ml-auto" />
      )
    )}
  </div>

  {/* Dropdown Links */}
  {showCustomerDropdown && isOpen && (
    <div className="flex flex-col gap-1 pl-14 pb-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push('/customers');
          setShowCustomerDropdown(false);
        }}
        className={`text-[#EEEEEE] text-[13px] text-start hover:font-bold ${
          pathname === '/customers' ? 'font-bold' : ''
        }`}
      >
        All Customers
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push('/kyc');
          setShowCustomerDropdown(false);
        }}
        className={`text-[#EEEEEE] text-[13px] text-start hover:font-bold ${
          pathname === '/kyc' ? 'font-bold' : ''
        }`}
      >
        Manage KYC
      </button>
    </div>
  )}
</div>

                        <Link href="/transactions" className="w-full">
                            <div
                                className={`flex items-center gap-3 py-2  ${ isOpen ? 'px-4' : 'pl-1'} rounded-lg transition-all duration-300 hover:bg-[#46A4B5] cursor-pointer ${isActive(
                                    '/transactions'
                                )}`}
                            >
                               <div
                                    className={`${
                                        pathname === '/wallet' ? 'bg-[#46A4B5]' : 'bg-[#25707D]'
                                    } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
                                    >
                                    <Image
                                        src="/images/wallet.png"
                                        alt="Transactions"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                {isOpen && <span>Transactions</span>}
                            </div>
                        </Link>

                        <Link href="/credit" className="w-full">
                            <div
                                className={`flex items-center gap-3 py-2  ${ isOpen ? 'px-4' : 'pl-1'} rounded-lg transition-all duration-300 hover:bg-[#46A4B5] cursor-pointer ${isActive(
                                    '/credit'
                                )}`}
                            >
                               <div
                                className={`${
                                    pathname === '/credit' ? 'bg-[#46A4B5]' : 'bg-[#25707D]'
                                } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
                                >
                                    <Image
                                        src="/images/credit.png"
                                        alt="Credit Bureau"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                {isOpen && <span>Credit Bureau</span>}
                            </div>
                        </Link>

                        {/* <Link href="/dispute" className="w-full">
                            <div
                                className={`flex items-center gap-3 py-2  ${ isOpen ? 'px-4' : 'pl-1'} rounded-lg transition-all duration-300 hover:bg-[#46A4B5] cursor-pointer ${isActive(
                                    '/dispute'
                                )}`}
                            >
                                <div
                            className={`${
                                pathname === '/dispute' ? 'bg-[#46A4B5]' : 'bg-[#25707D]'
                            } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
                            >
                                    <Image
                                        src="/images/settings.png"
                                        alt="Dispute Resolution"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                {isOpen && <span>Dispute resolution</span>}
                            </div>
                        </Link> */}

                      <div className="w-full">
  <div
    onClick={() => router.push('/settings')}
    className={`flex items-center gap-3 py-2 ${isOpen ? 'px-4' : 'pl-1'} rounded-lg transition-all duration-300 hover:bg-[#46A4B5] cursor-pointer ${isActive('/settings')}`}
  >
    <div
      className={`${
        pathname === '/settings' ? 'bg-[#46A4B5]' : 'bg-[#25707D]'
      } shadow-custom2 w-[30px] h-[30px] rounded-[8px] flex items-center justify-center`}
    >
      <Image
        src="/images/settings.png"
        alt="Settings"
        width={20}
        height={20}
      />
    </div>
    {isOpen && <span>Settings</span>}
    {isOpen && (
      <>
        {!showSettingsDropdown ? (
          <TiArrowSortedDown
            onClick={(e) => {
              e.stopPropagation();
              setShowSettingsDropdown(true);
            }}
            className="text-[#EEEEEE] text-[18px] ml-auto"
          />
        ) : (
          <TiArrowSortedUp
            onClick={(e) => {
              e.stopPropagation();
              setShowSettingsDropdown(false);
            }}
            className="text-[#EEEEEE] text-[18px] ml-auto"
          />
        )}
      </>
    )}
  </div>

  {isOpen && showSettingsDropdown && (
    <div className="flex flex-col gap-1 font-normal pb-5 pl-9">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setDisplaySettings('loan-offers');
          router.push(`/settings?set=${encodeURIComponent('loan-offers')}`);
        }}
        className={`text-[#EEEEEE] mb-2 text-[13px] text-start ${displaySettings === 'loan-offers' ? 'font-bold' : ''}`}
      >
        Loan offers
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setDisplaySettings('app-configuration');
          router.push(`/settings?set=${encodeURIComponent('app-configuration')}`);
        }}
        className={`text-[#EEEEEE] mb-2 text-[13px] text-start ${displaySettings === 'app-configuration' ? 'font-bold' : ''}`}
      >
        App configuration
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setDisplaySettings('website-cms');
          router.push(`/settings?set=${encodeURIComponent('website-cms')}`);
        }}
        className={`text-[#EEEEEE] mb-2 text-[13px] text-start ${displaySettings === 'website-cms' ? 'font-bold' : ''}`}
      >
        Website CMS
      </button>
    </div>
  )}
</div>

                    </div>
                
             {/* Show the Activity Log if open */}
             {openActivity && (
                <SlideActivity
                    isOpen={!isExiting}
                    toggleActivity={toggleActivity}
                    isExiting={isExiting}
                />
            )}
        </div>

    );
};

export default SmallScreenSidebar;
