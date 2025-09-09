'use client'
import React from 'react'
import SideBar from '@/components/SideBar'
import Header from '@/components/dashboard/Header'
import SmallScreenSidebar from '@/components/SlideSideBar'
import AnalyticHero from '@/components/analytics/AnalyticHero'
import Chart1 from '@/components/analytics/Chart1'
import Chart2 from '@/components/analytics/Chart2'
import Chart3 from '@/components/analytics/Chart3'
import { withAuth } from '@/components/auth/EnsureLogin'
import Chart4 from '@/components/analytics/Chart4'
import CardChart from '@/components/analytics/CardChart'
import CustomerChart from '@/components/analytics/CustomersChart'
import UncollectedChart from '@/components/analytics/UncollectedChart'



const Page = () => {
  
  return (
    <div className="grid grid-cols-12 min-h-screen w-full h-auto overflow-x-hidden font-montserrat bg-[#F8F8F8]">
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
        <AnalyticHero />
        <Chart1 />
        <Chart2 />
        <CardChart />
        <CustomerChart />
        <UncollectedChart />
        <Chart3 />
       <Chart4 />
        
      </div>
    </div>
  )
}

export default withAuth(Page);