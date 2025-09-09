'use client'
import {useState} from 'react'
import SideBar from '@/components/SideBar'
import Header from '@/components/dashboard/Header'
import SmallScreenSidebar from '@/components/SlideSideBar'
import CreditHero from '@/components/credit/CreditHero'
import CreditTable from '@/components/credit/CreditTable'
import { withAuth } from '@/components/auth/EnsureLogin'


const Page = () => {
 
  return (
    <div className={`grid grid-cols-12  w-full  min-h-screen h-auto overflow-x-hidden bg-[#F8F8F8]`}>
      {/* Sidebar - Hidden on small screens */}
      <div className="hidden lg:block md:block lg:col-span-2 md:col-span-3 lg:w-[238px] h-auto bg-white shadow-custom1">
        <SideBar />
      </div>
      <div className="block lg:hidden md:hidden col-span-1 h-full bg-white shadow-custom1">
        <SmallScreenSidebar />
      </div>
    {/* Main Content */}
    <div className="lg:col-span-10 md:col-span-9 col-span-11">
        <Header />
        <CreditHero />
        <CreditTable />
        
      </div>
    </div>
  )
}

export default withAuth(Page);