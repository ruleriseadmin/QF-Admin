'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TiArrowSortedDown } from 'react-icons/ti';
import { HiOutlineTrash } from 'react-icons/hi';
import { FiEdit2 } from 'react-icons/fi';
import Paginate from '../dashboard/Paginate';
import BannerModal from './BannerModal';
import Confirmation from '../Confirmation';
import { formatDate } from '@/utils/loan';
import apiClient from '@/utils/apiClient';
import Notification from '@/components/Notification';
import LoadingPage from '@/app/loading';

const AppConfig = () => {
  const [selectedView, setSelectedView] = useState('ad');
  const [selectedSelection, setSelectedSelection] = useState('all');
  const [openSelection, setOpenSelection] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [lastPage, setLastPage] = useState(2);
  const [totalPerPage, setTotalPerPage] = useState(6);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [id, setId] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState<any>([]);
  const [error, setError] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const toggleConfirmation = () => setOpenConfirmation(!openConfirmation);
  const toggleBannerModal = () => setShowBannerModal(!showBannerModal);
  const toggleSelection = () => setOpenSelection(!openSelection);
  const toggleNotification = () => setNotificationOpen(!notificationOpen);
  const toggleId = (id: string | number) => setId(id);
  
  

  
  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const createUpdateAd = async (type: string, data: any) => {
    setLoading(true);
    try {
      if (type === 'update') {
        await apiClient.patch(`/ads/${data.id}`, data);
      } else {
        await apiClient.post('/ads', data);
      }
      setNotificationOpen(true);
      setError('');
      setRefresh(true);
    } catch (error: any) {
      setError(error?.response?.data?.message || 'An error occurred, please try again');
      setNotificationOpen(true);
    } finally {
      setLoading(false);
      setShowBannerModal(false);
    }
  };

  const isBase64String = (str: string | null) => {
   return typeof str === 'string' && /^data:image\/[a-zA-Z]+;base64,/.test(str);
  }

  useEffect(() => {
    const controller = new AbortController();
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const queryObj: Record<string, string> = { 
          page: String(page), 
          per_page: String(itemsPerPage) 
        }
          if(selectedSelection !== 'all') {
            queryObj.type = selectedSelection
          } 
        const query = new URLSearchParams(queryObj).toString();
        const res = await apiClient.get(`/ads?${query}`, { signal: controller.signal });
        setBanners(res?.data?.data?.ads || []);
        setTotalPerPage(res?.data?.data?.total_items || 0);
        setLastPage(res?.data?.data?.last_page || 0);
        setRefresh(false);
        
        
      } catch (error: any) {
        if (error.message !== 'canceled' || error.name !== 'CanceledError') {
          setError(error?.response?.data?.message || 'An error occurred, please try again');
          setNotificationOpen(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [page, refresh,selectedSelection]);

 
  const columns = [
    { name: '#', selector: 'id' },
    { name: 'APP_LINK', selector: 'app_link' },
    { name: 'IMAGE', selector: 'image_url' },
    { name: 'TYPE', selector: 'type' },
    { name: 'CREATED AT', selector: 'created_at' },
    { name: 'ACTIONS', selector: 'actions' },
  ];

  const selection = [
    { name: 'All', value: 'all' },
    { name: 'Pop-up', value: 'pop_up' },
    { name: 'Carousel', value: 'carousel' },
    { name: 'Emergency Alert', value: 'emergency' },
  ];

  return (
    <div className="my-10 mb-10 lg:ml-4 mx-4 h-auto md:ml-10 font-montserrat text-[#282828]">
      <p className="text-[24px] font-bold">App Configuration</p>

      <div className="flex items-center gap-8 w-full h-auto mt-10 text-[#5A5A5A] text-[16px]">
        <button
          onClick={() => setSelectedView('ad')}
          className={`${selectedView === 'ad' ? 'text-[#F6011BCC] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
        >
          <span className="pb-6">Ad Banner</span>
          {selectedView === 'ad' && <hr className="w-[35px] border-0 bg-[#F6011BCC] h-[6px] rounded-full" />}
        </button>
      </div>

      <div className="w-full mt-16 mb-10 h-auto">
        <div className="flex flex-wrap items-center gap-4 mb-10 text-[#5A5A5A] text-[16px]">
          <div className="relative">
            <div onClick={toggleSelection} 
            className="flex items-center cursor-pointer bg-[#E1E3E4] rounded-full min-w-[249px] h-[48px] px-4">
              <Image src="/images/calendar-2.png" alt="Logo" width={18} height={18} />
               <p className="text-[15px] text-[#282828] font-medium ml-1 font-euclid">
                Sortby: {selection.find((select) => select.value === selectedSelection)?.name || 'All'}
                </p>
              <TiArrowSortedDown className="text-[#828282] text-[18px] ml-auto" />
            </div>
            {openSelection && (
              <>
                {/* Background Overlay */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setOpenSelection(false)}
                >
                  </div>
              <div className="absolute mt-2 z-50 bg-white rounded-xl shadow-lg w-[269px] p-4">
                {selection.map((select, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedSelection(select.value);
                      setOpenSelection(false);
                    }}
                    className="w-full text-left text-[#282828] font-medium text-[14px] py-2"
                  >
                    <div className="flex items-center gap-3">
                      <p>{select.name} banners</p>
                    </div>
                  </button>
                ))}
              </div>
               </>
            )}
          </div>

          <button onClick={() => { toggleId(''); toggleBannerModal(); }} 
           className="min-w-[145px]  max-w-full min-h-[48px] h-auto rounded-[32px] bg-[#282828] text-[#FFFFFF] px-4 py-2 text-[13px] truncate">
            + Add new banner
          </button>
        </div>

        <div className="rounded-[12px] bg-white border border-[#DCDCDC] shadow-customshadow4 overflow-x-auto">
          <table className="w-full min-w-[800px] text-center">
            <thead className="bg-[#282828] text-[#FFFFFF] h-[46px] font-bold text-[12px]">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-3 ${idx === 0 ? 'rounded-tl-[14px]' : ''} ${idx === columns.length - 1 ? 'rounded-tr-[14px]' : ''}`}
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {banners?.map((row: any, idx: number) => (
                <tr key={idx} className="text-[15px] font-medium border-b border-[#E5E7EB]">
                  <td className="px-6 py-4">{row?.id}</td>
                  <td className="px-6 py-4">  <a
            href={row.app_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F6011BCC] hover:underline"
          >
            {row.app_link?.slice(0, 20)}...
          </a></td>
                  <td className="px-6 py-4">
                     <div className="w-[40px] h-[40px] relative mx-auto">
            <img
              src={row.signed_image_url}
              alt="Banner"
              width={40}
              height={40}
              className="object-contain rounded"
            />
          </div>
                   
                  </td>
                  <td className="px-6 py-4 capitalize">{row.type}</td>
                  <td className="px-6 py-4">{formatDate(row.created_at)}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button onClick={() => { toggleId(row.id); toggleBannerModal(); }}  className="text-[#282828] text-[20px] cursor-pointer" >
                      <FiEdit2 />
                    </button>
                    <button onClick={() => {
                      toggleId(row.id);
                      toggleConfirmation();
                    }} className="text-[#F04438] text-xl">
                      <HiOutlineTrash />
                    </button>
                    <div
              className={`relative w-[44px] h-[24px] rounded-full cursor-pointer transition-colors ${
                row.status === 'active' ? 'bg-[#F6011BCC]' : 'bg-[#5A5A5A]'
              }`}
              onClick={() => {
                
                createUpdateAd('update', { id: row.id, 
                  status: row.status === 'active' ? 'inactive' : 'active',
                  type: row.type,
                  app_link: row.app_link,
                  title: row.title,
                  image_url:row.signed_image_url,
                  isBase64img:isBase64String(row.signed_image_url) ? true : false

                });
              }}
            >
              <div
                className={`absolute top-1 left-1 h-[18px] w-[18px] bg-white rounded-full transition-transform ${
                  row.status === 'active' ? 'translate-x-5' : ''
                }`}
              />
            </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

         {loading && <LoadingPage />}
        { !loading && lastPage > 1  && (
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

      {showBannerModal && (
        <BannerModal
          isOpen={showBannerModal}
          toggleBannerModal={toggleBannerModal}
          toggleId={toggleId}
          banners={banners}
          id={id}
          createUpdateAd={createUpdateAd}
          setRefresh={setRefresh}
          loading={loading}
        />
      )}

      {notificationOpen && (
        <Notification
          status={error ? 'error' : 'success'}
          message={error || 'Operation successful'}
          isOpen={notificationOpen}
          toggleNotification={toggleNotification}
        />
      )}
       {openConfirmation && 
            <Confirmation 
            toggleConfirmation={toggleConfirmation} 
            isOpen={openConfirmation} 
            id={id} 
             setRefresh={setRefresh}
            message={ 'Are you sure you want to delete this banner?' }
            />}

      {loading && <LoadingPage />}
    </div>
  );
};

export default AppConfig;
