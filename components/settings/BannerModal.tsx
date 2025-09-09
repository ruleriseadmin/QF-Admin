'use client';
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Notification from '@/components/Notification';
import LoadingPage from '@/app/loading';

type BannerModalProps = {
  isOpen: boolean;
  toggleBannerModal: () => void;
  toggleId: (id: string | number) => void;
  banners: any[];
  id?: string | number;
  createUpdateAd: (type: string, data: any) => Promise<void>;
  setRefresh: (refresh: boolean) => void;
  loading: boolean;

};

const BannerModal: React.FC<BannerModalProps> = ({
  isOpen,
  toggleBannerModal,
  toggleId,
  id,
  banners,
  createUpdateAd,
  loading
}) => {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [appLink, setAppLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [status, setStatus] = useState('active');
  const [imageToUpload, setImageToUpload] = useState<string | null>(null);

  // Load existing banner info if editing
  useEffect(() => {
    if (id) {
      const found = banners.find((ad: any) => ad.id === id);
      if (found) {
        setType(found.type || '');
        setAppLink(found.app_link || '');
        setBase64Image(found.signed_image_url || '');
        setTitle(found.title || '');
        setStatus(found.status || 'active');
      }
    } else {
      // Reset for creation mode
      setType('');
      setAppLink('');
      setImage(null);
      setBase64Image(null);
      setTitle('');
    }
  }, [id, banners]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageToUpload(result);
      const base64 = result.split(',')[1]; // Get only the base64 part
      setBase64Image(base64); // base64 string only (without the `data:image/png;base64,` prefix)
    };
    reader.readAsDataURL(file);
  }
};



 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !title || (!image && !base64Image)) {
      setError('Please fill all fields');
      setNotificationOpen(true);
      return;
    }

    const isBase64String = (str: string | null) => {
  return typeof str === 'string' && /^data:image\/[a-zA-Z]+;base64,/.test(str);
};
    const formData: any = {
      type,
      app_link: appLink,
      status: status,
      title,
      isBase64img: isBase64String(imageToUpload) ,
      
    };

    if (base64Image) {
      formData.image_url = base64Image;
    }

    try {
      await createUpdateAd(id ? 'update' : 'create', id ? { ...formData, id } : formData);
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
      setNotificationOpen(true);
    }
  };

  const toggleNotification = () => setNotificationOpen(!notificationOpen);

  return (
    <div
    onClick={toggleBannerModal}
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 bg-black w-full h-full -translate-y-1/2 z-50 flex justify-center items-center bg-opacity-80 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
      onClick={(e) => e.stopPropagation()}
        className={` lg:w-[420px] max-h-[90vh] w-11/12 md:w-7/12 bg-white mx-2 min-h-[520px] font-outfit rounded-[22px] overflow-y-auto p-4 shadow-md transition-transform duration-300 transform ${
          isOpen ? 'scale-100' : 'scale-75'
        }`}
      >
        <div className="mx-4">
          <div className="flex justify-end items-center max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                toggleId('');
                toggleBannerModal();
              }}
              className="rounded-full w-[36px] h-[36px] text-2xl bg-[#F6F6F6] font-bold flex items-center justify-center"
            >
              <FaTimes className="text-[#282828] text-xl" />
            </button>
          </div>

          <p className="text-[#282828] text-[15px] mb-4 font-medium font-montserrat">
            {id ? 'Update Banner' : 'Create Banner'}
          </p>

          <form onSubmit={handleSubmit} className="my-4 grid grid-cols-1 gap-4 font-poppins h-full">
            {/* Title and Category in one row */}
<div className="flex gap-4">
  {/* Title */}
  <div className="w-1/2">
    <label className="text-[14px] text-[#282828]">Title</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="mt-2 w-full h-[44px] border border-[#D0D5DD] rounded-[8px] px-4 py-2 text-[14px]"
      required
    />
  </div>

  {/* Category */}
  <div className="w-1/2">
    <label className="text-[14px] text-[#282828]">Category</label>
    <select
      value={type}
      onChange={(e) => setType(e.target.value)}
      className="mt-2 w-full h-[44px] border border-[#D0D5DD] rounded-[8px] px-4 py-2 text-[14px] z-50"
      required
    >
      <option value="" disabled>Select</option>
      <option value="pop_up">Pop-up Banner</option>
      <option value="carousel">Carousel Banner</option>
      <option value="emergency">Emergency Alert</option>
    </select>
  </div>
</div>

            <div>
              <label className="text-[14px] text-[#282828]">In-app link</label>
              <input
                type="text"
                value={appLink}
                onChange={(e) => setAppLink(e.target.value)}
                className="mt-2 w-full h-[44px] border border-[#D0D5DD] rounded-[8px] px-4 py-2 text-[14px]"
                
              />
            </div>

            <div>
              <label className="text-[14px] text-[#282828]">Upload Image</label>
              <label
                htmlFor="image-upload"
                className="mt-2 flex items-center justify-center min-h-[44px] border-2 border-dashed border-[#BEBEBE80] rounded-[8px] bg-[#F5F5F580] cursor-pointer"
              >
                <span className="text-[14px] text-[#828282]">+ Tap to upload image</span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {base64Image && (
              <div>
                <label className="text-[14px] text-[#282828]">Preview</label>
                <img src={imageToUpload || base64Image} alt="Preview" className="w-full h-[150px] object-contain rounded-[8px] mt-2" />
              </div>
            )}
               <div className="font-poppins text-[#282828] text-[14px] font-medium  my-6">
              <p>Image size rules</p>
              <p className="text-[#5A5A5A]">Pop-up Banner - </p>
              <p className="text-[#5A5A5A]">Carousel Banner - </p>
            </div>
            {loading && <LoadingPage/>}
            <button
              type="submit"
              disabled={!type  || !title || (!image && !base64Image)}
              className="disabled:opacity-50  disabled:cursor-not-allowed block font-montserrat mx-auto w-full font-medium bg-[#F6011BCC]  text-[#FFFFFF] rounded-full h-[54px] py-1 px-4 text-[15px]"
            >
              {id ? 'Update' : 'Create'} Banner
            </button>
          </form>
        </div>

        {notificationOpen && (
          <Notification
            status="error"
            message={error}
            isOpen={notificationOpen}
            toggleNotification={toggleNotification}
          />
        )}
      </div>
    </div>
  );
};

export default BannerModal;
