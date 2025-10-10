import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import apiClient from '@/utils/apiClient';
import LoadingPage from '@/app/loading';
import { useRouter } from 'next/navigation';
import Notification from '../Notification';
type PushNotificationProps = {
  isOpen: boolean;
  togglePushNotification: () => void;
  usersId:[];
};

const PushNotificationModal: React.FC<PushNotificationProps> = ({ isOpen, togglePushNotification,usersId }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openNotification, setOpenNotification] = useState(false);
  const router = useRouter();
  

  //toggle notification
  const toggleNotification = () => {
    setOpenNotification(!openNotification);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    // Start with existing query params
    const params = new URLSearchParams(window.location.search);

    //  Add or overwrite new values
    params.set('send_push_notification', 'true');
    if (status) params.set('pushStatus', status);
    if (title) params.set('pushTitle', title);
    if (body) params.set('pushBody', body);

    // Update URL without losing previous filters
    router.push(`${window.location.pathname}?${params.toString()}`);

    togglePushNotification();
  } catch (error: any) {
    console.error('Error sending notification query:', error);
  }
};


  return (
    <div
      onClick={togglePushNotification}
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 font-montserrat z-50 flex justify-center items-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white rounded-[22px] font-montserrat shadow-customshadow7 transition-transform duration-300 transform ${
          isOpen ? 'scale-100' : 'scale-75'
        } lg:w-[396px] w-11/12 md:w-7/12 bg-white lg:ml-32 md:ml-32 mx-2 min-h-[357px] h-auto`}
      >
        <div className="mx-4">
          <div className="max-h-[80vh] flex justify-end items-center">
            <button
              onClick={togglePushNotification}
              className="rounded-full w-[36px] h-[36px] text-2xl bg-[#F6F6F6] font-bold flex items-center justify-center mt-4"
            >
              <FaTimes className="text-[#282828] text-xl" />
            </button>
          </div>
          <p className="text-[#282828] text-[18px] mb-8 font-montserrat font-semibold">
            Create push notification
          </p>
          <form onSubmit={handleSubmit}>
            {/* Status Field */}
            <div className="mb-4">
              <label className="font-normal text-[#282828] text-[14px]">Status</label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-[#FFFFFF] mt-2 text-[14px] border border-solid border-[#D0D5DD] w-full h-[44px] rounded-[8px] focus:outline-none px-4 py-2"
              />
            </div>

            {/* Title Field */}
            <div className="mb-4">
              <label className="font-normal text-[#282828] text-[14px]">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#FFFFFF] mt-2 text-[14px] border border-solid border-[#D0D5DD] w-full h-[44px] rounded-[8px] focus:outline-none px-4 py-2"
              />
            </div>
            {/* Body Field */}
            <div className="mb-4">
              <label className="font-normal text-[#282828] text-[14px]">Body</label>
              <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="bg-[#FFFFFF] mt-2 text-[14px] border border-solid border-[#D0D5DD] w-full h-[44px] rounded-[8px] focus:outline-none px-4 py-2"
              />
            </div>
            {/* Submit Button */}
            {loading && <LoadingPage />}
            <button
              type="submit"
               className="disabled:opacity-50 my-6  disabled:cursor-not-allowed block font-montserrat mx-auto w-full font-medium bg-[#F6011BCC]  text-[#FFFFFF] rounded-full h-[54px] py-1 px-4 text-[15px]"
            >
              {loading? 'Sending...': 'Send'}
            </button>
          </form>
        </div>
      </div>
      {openNotification && error && (
        <Notification
          isOpen={openNotification}
          toggleNotification={toggleNotification}
          message={error}
          status='error'
        />
      )}
      {openNotification && success && (
        <Notification
          isOpen={openNotification}
          toggleNotification={toggleNotification}
          message={success}
          status='success'
          />
      )}
    </div>
  );
};

export default PushNotificationModal;
