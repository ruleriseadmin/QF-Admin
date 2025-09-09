import React, { useState,useEffect } from 'react';
import { FaTimes } from "react-icons/fa";
import apiClient from '@/utils/apiClient';
import Notification from '@/components/Notification';
import LoadingPage from '@/app/loading';

type RoleModalProps = {
  isOpen: boolean;
  toggleRoleModal: () => void;
  toggleId: (id: string | number) => void;
  roles: any;
  id?: string | number;
};

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, toggleRoleModal, roles, id, toggleId }) => {
  const [roleName, setRoleName] = useState('');
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteRole, setDeleteRole] = useState(false);
  const [view, setView] = useState(false);
  const [exportRole, setExportRole] = useState(false);
  const [blacklist,setBlacklist] = useState(false)
  const [broadcast,setBroadcast] = useState(false)
  const [switchDisbursement,setSwitchdisbursement] = useState(false)
  const [adminRole, setAdminRole] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [successNotification, setSuccessNotification] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  
  useEffect(() => {
      if(id){
        setAdminRole(roles?.find((admin:any) => admin.id === id));
      }} , [id,roles]);

      useEffect(() => {
        if (adminRole) {
          setRoleName(adminRole.name || '');
          setCreate(adminRole.can_create ?? false);
          setEdit(adminRole.can_edit ?? false);
          setDeleteRole(adminRole.can_delete ?? false);
          setView(adminRole.can_view ?? false);
          setExportRole(adminRole.can_download?? false);
          setBlacklist(adminRole.can_blacklist?? false);
          setBroadcast(adminRole.can_broadcast?? false);
          setSwitchdisbursement(adminRole.can_switch_disbursement?? false)
        }
      }, [adminRole]);


    // Toggle notification
    const toggleNotification = () => {
      setNotificationOpen(!isNotificationOpen);
  };
  
  // Toggle success notification
  const toggleSuccessNotification = () => {
    setSuccessNotification(!successNotification);
  };
  
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        setLoading(true);
        const response = await apiClient.post('/roles', {
          name: roleName,
          can_edit: edit,
          can_delete: deleteRole,
          can_create: create,
          can_view: view,
          can_download: exportRole,
          can_blacklist: blacklist,
          can_broadcast: broadcast,
          can_switch_disbursement: switchDisbursement
        });
       
  
        setSuccess(id ? 'Role updated successfully' : 'Role created successfully');
          setSuccessNotification(true);
          setLoading(false);
          setRoleName('');
          setCreate(false);
          setEdit(false);
          setDeleteRole(false);
          setView(false);
          setExportRole(false);
          setBlacklist(false);
          setBroadcast(false);
          setSwitchdisbursement(false);
          
      } catch (error:any) {
        console.error(error);
        if (error?.status === 401) {
            setError('Unauthorized access. You do not have permission to view this resource.');
            setNotificationOpen(true);
          }else {
          setError(error?.response?.data?.message || error?.message || 'An error occurred, please try again');
          setNotificationOpen(true);
          }
        setLoading(false);
      }
    };
  
    
    

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 bg-black w-full h-full font-euclid -translate-y-1/2 z-50 flex justify-center items-center bg-opacity-80 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`lg:w-[543px] w-[11/12] md:w-7/12 bg-white lg:ml-32 md:ml-32 mx-2 min-h-[477px] h-auto font-euclid rounded-[22px] p-4 shadow-md max-h-[80vh] transition-transform duration-300 transform ${
          isOpen ? 'scale-100' : 'scale-75'
        }`}
      >
        <div className="mx-6">
          <div className="max-h-[80vh] flex justify-end items-center">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  toggleId('');
                  toggleRoleModal();
                }}
                className="rounded-full w-[36px] h-[36px] text-2xl bg-[#F6F6F6] font-bold flex items-center align-middle justify-center"
              >
                <FaTimes className="text-[#282828] text-xl" />
              </button>
            </div>
          </div>
          <p className="text-[#282828] text-[16px] font-semibold mb-8 font-euclid">
            Create a new role
          </p>
          <form className="my-4 grid grid-cols-2 gap-2 font-euclid" onSubmit={handleSubmit}>
            <div className="col-span-2 mb-4">
              <label htmlFor="roleName" className="font-normal text-[#282828] text-[14px]">
                Role Name
              </label>
              <input
                type="text"
                id="roleName"
                value={roleName}
                disabled={id ? true : false}
                onChange={(e) => setRoleName(e.target.value)}
                className="bg-[#FFFFFF] mt-2 disabled:bg-[#D0D5DD] text-[14px] border border-solid border-[#D0D5DD] w-full h-[44px] rounded-[8px] shadow-customshadow6 focus:outline-none px-4 py-2"
              />
            </div>
            <div className="col-span-2 mb-4">
              <p className="font-normal text-[#282828] text-[14px] mb-6 mt-4">Role Permissions</p>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'View', value: view, toggle: setView },
                  { label: 'Create', value: create, toggle: setCreate },
                  { label: 'Edit', value: edit, toggle: setEdit },
                  { label: 'Delete', value: deleteRole, toggle: setDeleteRole },
                  { label: 'Export', value: exportRole, toggle: setExportRole },
                  {label: 'Blacklist',value:blacklist,toggle:setBlacklist},
                  {label:'Broadcast',value:broadcast,toggle:setBroadcast},
                  {label:'Disbursement',value:switchDisbursement, toggle:setSwitchdisbursement}
                 
                ].map(({ label, value, toggle }) => (
                  <div key={label} className="flex flex-col  ">
                    <span className="text-[#5A5A5A] font-semibold  text-[16px]">{label}</span>
                    <div
                      className={`relative w-[44px] h-[24px] rounded-full cursor-pointer transition-colors ${
                        value ? 'bg-[#3173F3]' : 'bg-[#5A5A5A]'
                      }`}
                      onClick={() => toggle(!value)}
                    >
                      <div
                        className={`absolute top-1 left-1 h-[18px] w-[18px] bg-[#FFFFFF] rounded-full transition-transform ${
                          value ? 'translate-x-5' : ''
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {loading && <LoadingPage />}
            <button
              type="submit"
              className="disabled:opacity-50 col-span-2 disabled:cursor-not-allowed block font-montserrat mx-auto w-[335px] mt-6 font-medium bg-[#F6011BCC] text-[#FFFFFF] rounded-full h-[54px] py-1 px-4 text-[15px]"
            >
              {id ? 'Update Role' : 'Create Role'}
            </button>
          </form>
        </div>
      </div>
       {/* Success Notification */}
       {successNotification && (
                <Notification
                    status="success"
                    title="Success!"
                    message={success}
                    toggleNotification={toggleSuccessNotification}
                    isOpen={successNotification}
                />
            )}

      {isNotificationOpen && (
                <Notification
                    status="error"
                    
                    message={error}
                    toggleNotification={toggleNotification}
                    isOpen={isNotificationOpen}
                />
            )}
    </div>
  );
};

export default RoleModal;
