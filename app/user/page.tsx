'use client'
import React from 'react'
import SideBar from '@/components/SideBar'
import Header from '@/components/dashboard/Header'
import UserHero from '@/components/user/UserHero'
import UserTable from '@/components/user/UserTable'
import SmallScreenSidebar from '@/components/SlideSideBar'
import { withAuth } from '@/components/auth/EnsureLogin'
import apiClient from '@/utils/apiClient'
import { useState,useEffect } from 'react'
import {useRouter} from 'next/navigation';
import Notification from '@/components/Notification'
const Page = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [totalPerPage, setTotalPerPage] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState('');

  //toggle notification
  const toggleNotification = () => {
    setShowNotification(!showNotification);
  }

   // Fetch users
   useEffect(() => {
    const fetchUsers = async () => {
     try {
       const response = await apiClient.get('/auth/admin');
       setUsers(response.data?.data?.admins);
     } catch (error:any) {
       console.error(error);
        setError(error?.response?.data?.message || 'An error occurred, please try again');
        setShowNotification(true);
     }}
     fetchUsers();
   }, []);
 
   // Fetch roles
   useEffect(() => {
     const fetchRoles = async () => {
       try {
         const response = await apiClient.get('/roles');
         setRoles(response.data?.data?.roles);
       } catch (error:any) {
         console.error(error);
         setError(error?.response?.data?.message || 'An error occurred, please try again');
         setShowNotification(true);
       }}
     fetchRoles();
   }, []);

  return (
    <div className="grid grid-cols-12 min-h-screen w-full h-auto overflow-y-hidden">
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
        <UserHero users={users} roles={roles}/>
        <UserTable/>
       
      </div>
      {showNotification && 
      <Notification 
      message={error} 
      toggleNotification={toggleNotification} 
      isOpen={showNotification}
      status='error'

      />}
    </div>
  )
}

export default withAuth(Page);