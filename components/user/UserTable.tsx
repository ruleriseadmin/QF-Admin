'use client';
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import { IoSearchSharp } from "react-icons/io5";
import LoadingPage from '@/app/loading';
import { FiEdit2 } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import Paginate from '../dashboard/Paginate';
import UserModal from './UserModal';
import RoleModal from './RoleModal';
import Confirmation from '../Confirmation';
import { formatDate } from '@/utils/loan';
import apiClient from '@/utils/apiClient';
import { useRouter,useSearchParams } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';
import { saveToExcel } from '@/utils/loan';
import Notification from '../Notification';



const UserTable = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Items per page
  const [usersData, setUsersData] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [selectedRows, setSelectedRows] = useState('users');
  const [selectedSort, setSelectedSort] = useState('new');
  const [searchWord, setSearchWord] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
    const start = searchParams.get('start') || '';
    const end = searchParams.get('end') || '';
  const reset = searchParams.get('reset') || '';
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [error, setError] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [totalPerPage, setTotalPerPage] = useState(0)
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | number>('');
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [downloadExcel, setDownloadExcel] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [success, setSuccess] = useState('');


  //toggle notification
  const toggleNotification = () => {
    setOpenNotification(!openNotification);
  }

  //toggle confirmation
  const toggleConfirmation = () => {
    setOpenConfirmation(!openConfirmation);
  };

  //toggle id
  const toggleId = (id: string | number) => {
    setId(id);
  };

  //toggle user modal
  const toggleUserModal = () => {
    setShowUserModal(!showUserModal);
  };

  //toggle role modal
  const toggleRoleModal = () => {
    setShowRoleModal(!showRoleModal)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };


  const [searchDate, setSearchDate] = useState({
      startDate: '',
      endDate: ''
    })
  
  
    
    
  
    
      // Update search date
      useEffect(() => {
        if(start)
        setSearchDate((prev) => ({...prev, startDate: start}));
        if(end)
          setSearchDate((prev) => ({...prev, endDate: end}));
        if(reset){
          setSearchDate({
            startDate: '',
            endDate: ''
          })
        }
        
      }, [start, end, reset]);
      
      //cleanup url
      useEffect(() => {
        if(start && end){
          router.replace(window.location.pathname)
        }
      },[start,end])
          

  useEffect(() => {
    const controller = new AbortController();
    const fetchCredit = async () => {
      try {
        setLoading(true);
        const queryObj: Record<string, string> = { 
          page: String(page), 
          per_page: String(itemsPerPage) 
        };
  
        if (triggerSearch && searchWord ) {
          queryObj.search = searchWord;
        }
        if(downloadExcel){
          queryObj.download_excel = 'true';
        }
        if (selectedSort === 'old') {
          queryObj.sort_direction = 'asc';
        }
        if (selectedSort === 'new') {
          queryObj.sort_direction = 'desc';
        }
        if (searchDate.startDate && searchDate.endDate) {
          queryObj.search_date_range = `${searchDate.startDate}${' - '}${searchDate.endDate}`;
        }
        const queryString = new URLSearchParams(queryObj).toString();
        
        const urlToVisit = selectedRows === 'users' ? '/auth/admin' : '/roles';
  
        const response = await apiClient.get(`${urlToVisit}?${queryString}`, {
          signal: controller.signal,
          responseType: 'json',
        }
      );
      if(downloadExcel){
               setSuccess(response?.data?.message || 'Report is being processed and will be emailed to you shortly.');
              setOpenNotification(true);
              setDownloadExcel(false);
              return;
      }
      
        selectedRows === 'users' ? setUsersData(response?.data?.data?.admins || []) : setRolesData(response?.data?.data?.roles || []);
        setTotalPerPage(response?.data?.data?.total_items || 0);

        setLastPage(response?.data?.data?.last_page || 0);
        setRefresh(false);
      } catch (error: any) {
        console.error(error.message);
        if (error.message !== 'canceled' || error.name !== 'CanceledError') {
          if (error?.status === 401) {
            setError('Unauthorized access. You do not have permission to view this resource.');
           setOpenNotification(true);
          }else {
          setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
         setOpenNotification(true);
          }
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchCredit();
  
    return () => controller.abort();
  }, [page, triggerSearch, refresh, itemsPerPage, selectedSort, selectedRows, downloadExcel, searchDate.startDate, searchDate.endDate]);
  


  const columns = [
    { name: '#', selector: 'id' },
    {
      name: 'FULL NAME',
      cell: (row:any) => `${row.first_name} ${row.last_name}`, 
    },
    { name: 'DATE CREATED', selector: 'created_at' },
    { name: 'EMAIL', selector: 'email' },
    { name: 'ROLE', selector: 'role' },
    { name: 'ACTIONS', selector: 'actions' },
  ];
  const columnsRole = [
    { name: '#', selector: 'id' },
    { name: 'DATE CREATED', selector: 'created_at' },
    { name: 'ROLE', selector: 'name' },
    { name: 'ACTIONS', selector: 'actions' },
  ];

  const dataToDisplay = selectedRows === 'users' ? usersData : rolesData;
  const columnsToDisplay = selectedRows === 'users' ? columns : columnsRole;


  const resetQuery = () => {
    setSearchWord('');
    setSearchDate({ startDate: '', endDate: '' });
    setSelectedSort('new');
    setTriggerSearch(false);
    setDownloadExcel(false);
    
    // Reset query parameters in the URL
    router.replace(window.location.pathname);
    
    // Trigger re-fetch of data
    setPage(1);
  };

  

  return (
    <div className=" mt-28 mb-10 lg:ml-4 mx-4 h-auto md:ml-10 font-montserrat ">
      <div className="flex md:overflow-x-auto  overflow-x-auto lg:overflow-hidden md:overflow-hidden items-center gap-8 w-full h-auto mb-10 ml-4 text-[#5A5A5A] text-[16px]">
        <button
          onClick={() => setSelectedRows('users')}
          className={`${selectedRows === 'users' ? 'text-[#F6011BCC] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
        >
          <span className="pb-6">Users</span>
          {selectedRows === 'users' && <hr className="w-[35px] border-0 bg-[#F6011BCC] h-[6px] rounded-full " />}
        </button>
        <button
          onClick={() => setSelectedRows('roles')}
          className={`${selectedRows === 'roles' ? 'text-[#F6011BCC] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
        >
          <span className="pb-6">Roles</span>
          {selectedRows === 'roles' && <hr className="w-[35px] border-0 bg-[#F6011BCC] h-[6px] rounded-full " />}
        </button>
        <button 
         onClick={() => {
          selectedRows === 'users' ? toggleUserModal() : toggleRoleModal()
         }}
        className="min-w-[145px]  max-w-full min-h-[48px] h-auto rounded-[32px] bg-[#282828] text-[#FFFFFF] px-4 py-2 text-[13px] truncate">
  {selectedRows === 'roles' ? '+ Create new role' : '+ Add new user'}
</button>

  <div className="relative font-euclid">
              <input
                type="text"
                placeholder="Search ID"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="w-[306px] placeholder:text-[#5A5A5A] placeholder:text-[15px] h-[48px] bg-[#FFFFFF] pl-6 pr-6 border border-solid border-[#E6E6E6] rounded-[32px] focus:outline-none shadow-customshadow5"
              />
             <FaTimes 
                onClick={() => {
                setSearchWord('')
                setTriggerSearch(false)
                                           
                  }}
              className={`${searchWord === '' ? 'hidden' : 'absolute'}  inset-y-4 hover:cursor-pointer right-14 text-[16px] font-thin`} />
                                         
              <button
                onClick={() =>
                  {
                    if(triggerSearch) setSearchWord('')
                    setTriggerSearch(!triggerSearch)
                 }}>
                                                       
                <IoSearchSharp className="absolute inset-y-4 right-6 text-[20px] font-bold" />
                                                      
                                                        
              </button>
            </div>
         <button
         className='block min-w-[40px] flex-shrink-0 z-30'
                 >
                  <Image 
                  onClick={() => setDownloadExcel(true)}
                  src="/images/download.png" alt="download" width={40} height={40} className='block'/>
                </button>
        <div className="flex md:min-w-[200px]  md:max-w-full   min-w-[200px] items-center justify-start gap-1">
        <p className="font-medium text-[15px] text-[#5A5A5A]  ">
            {selectedSort === 'new' ? 'Newest to Oldest' : 'Oldest to Newest'}
          </p>
          <div className="flex flex-col items-center leading-none">
            <button className="h-3" onClick={() => setSelectedSort('new')}>
              <TiArrowSortedUp className="text-[20px] text-[#5A5A5A]" />
            </button>
            <button onClick={() => setSelectedSort('old')}>
              <TiArrowSortedDown className="text-[20px] text-[#5A5A5A]" />
            </button>
          </div>
        </div>
        <button
                       onClick={resetQuery
                       }
                       >
                       <LuRefreshCw className="text-[#282828] text-[16px] lg:ml-6 md:ml-1" />
                       </button>
      </div>

      <div className=" md:ml-4 lg:min-w-[1088px]  md:mr-10 lg:w-auto   lg:ml-0 ml-4  mr-2  font-montserrat lg:mr-8  h-auto rounded-[12px] lg:overflow-hidden bg-[#FFFFFF] shadow-customshadow4 border border-solid border-[#DCDCDC]">
      <div className="lg:overflow-x-hidden md:overflow-x-auto  overflow-x-auto mb-12 ">
  <table className="w-full   mt-2 ml-1">
    <thead className="bg-[#282828] w-full text-[#FFFFFF] h-[46px] font-bold text-[12px] text-left">
              <tr>
                {columnsToDisplay?.map((col, index) => (
                  <th
                    key={index}
                    style={
                      col.name === 'EMAIL'
                        ? { width: '150px' }
                        : col.name === '#'
                        ? { width: '60px' }
                        : undefined
                    }
                    className={`text-start pl-6 py-2 ${
                      index === 0 ? 'rounded-tl-[14px] rounded-bl-[14px]' : ''
                    } ${index === columns.length - 1 ? 'rounded-tr-[14px] rounded-br-[14px]' : ''}`}
                  >
                    {selectedRows === 'roles' && col.name === 'FULL NAME'
                      ? ''
                      : selectedRows === 'roles' && col.name === 'EMAIL'
                      ? ''
                      : col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataToDisplay?.map((row:any) => (
                <tr key={row.id} className="text-[15px] font-medium">
                  {columnsToDisplay?.map((col, index) => (
                    <td key={index} className="text-start pl-6 pt-5 pb-4 border-b border-[#E6E6E6] overflow-hidden">
                      {col.name === 'ACTIONS' ? (
                        <div className="flex justify-start items-center w-full gap-5">
                          <HiOutlineTrash 
                          onClick={() => {
                            toggleId(row.id);
                            toggleConfirmation();
                          }}
                          className="text-[#E74747] text-[20px] hover:cursor-pointer" 
                          />
                          <FiEdit2 
                          className="text-[#282828] text-[20px] hover:cursor-pointer"
                          onClick={() => {
                            toggleId(row.id);
                            selectedRows === 'users' ? toggleUserModal() : toggleRoleModal()
                          }} 
                          />
                        </div>
                      ) :  col.name === 'DATE CREATED' ? (
                         formatDate(row.created_at)
                      ): col.name === 'FULL NAME' ? (
                        `${row.first_name} ${row.last_name}`
                      )  : (
                        row[col.selector as keyof typeof usersData[number]]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <LoadingPage />}
        {lastPage > 1  && (
    <div className="lg:pl-14 md:pl-2 pl-4 pt-6 mb-8">
      <Paginate
        lastPage={lastPage}
        currentPage={page}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalPerPage}
            />
          </div>
        )}
      </div>
      {showUserModal && <UserModal 
      toggleUserModal={toggleUserModal} 
      isOpen={showUserModal} 
      id={id}
      toggleId={toggleId}
      users={usersData} 
      />}
      {success &&
              <Notification
                message={success}
                toggleNotification={toggleNotification}
                isOpen={openNotification}
                status='success'
    />}

{error && 
            <Notification 
            message={error} 
            toggleNotification={toggleNotification} 
            isOpen={openNotification}
            status='error'
     
   />}

      {showRoleModal && 
      <RoleModal 
      toggleRoleModal={toggleRoleModal} 
      isOpen={showRoleModal}
      roles={rolesData}
      id={id}
      toggleId={toggleId} 
      />}
      {openConfirmation && 
      <Confirmation 
      toggleConfirmation={toggleConfirmation} 
      isOpen={openConfirmation} 
      id={id} 
      message={selectedRows === 'users' ? 'Are you sure you want to delete this user?' : 'Are you sure you want to delete this role?'}
      setRefresh={setRefresh}
      />}
    </div>
  );
};

export default UserTable;
