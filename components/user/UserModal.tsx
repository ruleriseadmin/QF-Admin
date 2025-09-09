import React, { useState,useEffect } from 'react';
import { FaTimes } from "react-icons/fa";
import apiClient from '@/utils/apiClient';
import Notification from '@/components/Notification';
import LoadingPage from '@/app/loading';
import { FaEyeSlash, FaEye } from "react-icons/fa6";

type UserModalProps = {
  isOpen: boolean;
  toggleUserModal: () => void;
  toggleId: (id: string | number) => void;
  users: any;
  id?: string | number;
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, toggleUserModal,toggleId,users,id }) => {
  const [roles, setRoles] = useState<any>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [successNotification, setSuccessNotification] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [adminData, setAdminData] = useState<any>([]);

  useEffect(() => {
    if(id){
      setAdminData(users?.find((admin:any) => admin.id === id));
    }} , [id,users]);


    // Fetch roles
   useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiClient.get('/roles');
        setRoles(response.data?.data?.roles);
      } catch (error:any) {
        console.error(error);
      }}
    fetchRoles();
  }, []);

  
    useEffect(() => {
      if (adminData) {
        setFirstName(adminData.first_name || '');
        setLastName(adminData.last_name || '');
        setEmail(adminData.email || '');
        setRole(roles.find((r: any) => r.name === adminData.role)?.id || '');
        setPassword(''); // Leave password empty for security reasons
      }
    }, [adminData, roles]);



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
      const response = await apiClient.post('/auth/admin/create', {
        first_name:firstName,
        last_name:lastName,
        role_id:role,
        email,
        password
      });

      setSuccess("Admin created successfully");
        setSuccessNotification(true);
        setLoading(false);
        setEmail("")
        setFirstName("")
        setLastName("")
        setPassword("")
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

  //update
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiClient.patch(`/auth/admin/update/${id}`, {
        first_name:firstName,
        last_name:lastName,
        role_id:role,
        email: email === adminData.email ? undefined : email,
        password
      });

      setSuccess("Admin updated successfully");
        setSuccessNotification(true);
        setLoading(false);
        setEmail("")
        setFirstName("")
        setLastName("")
        setPassword("")
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
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 bg-black w-full h-full -translate-y-1/2 z-50 flex justify-center items-center bg-opacity-80 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`lg:w-[396px] w-11/12 md:w-7/12 bg-white lg:ml-32 md:ml-32 mx-2 min-h-[557px] h-auto font-outfit rounded-[22px] p-4 shadow-md max-h-[80vh]  transition-transform duration-300 transform ${
          isOpen ? 'scale-100' : 'scale-75'
        }`}
      >
          <>
            <div className="mx-4">
              <div className=" max-h-[80vh] flex justify-end items-center">
                
              <div className='flex justify-end'>
            <button
                  onClick={() => {
                    toggleId('');
                    toggleUserModal();
                  }}
                  className="rounded-full w-[36px] h-[36px] text-2xl bg-[#F6F6F6] font-bold flex items-center align-middle justify-center"
                >
                  <FaTimes className="text-[#282828] text-xl" />
            </button>

            </div>
              </div>
              <p className="text-[#282828] text-[15px] mb-8 font-montserrat">Create a new user</p>
              
              <form 
              onSubmit={id ? handleUpdate : handleSubmit}
              className="my-4 grid grid-cols-2 gap-2 font-poppins">
                {/* First Name Field */}
                <div className="mb-2">
                    <label htmlFor="firstName" className='font-normal text-[#282828] text-[14px]'>
                        First Name
                    </label>
                  <input
                    type="text"
                    value={firstName }
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-[#FFFFFF] mt-2  text-[14px] border border-solid border-[#D0D5DD] w-full h-[44px] rounded-[8px]  focus:outline-none px-4 py-2"
                    required
                  />
                </div>

                {/* Last Name Field */}
                <div className=" ">
                <label htmlFor="firstName" className='font-normal text-[#282828] text-[14px] '>
                        Last Name
                    </label>
                  <input
                    type="text"
                    value={lastName }
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-[#FFFFFF] mt-2  text-[14px] border border-solid border-[#D0D5DD] w-full h-[44px] rounded-[8px]  focus:outline-none px-4 py-2"
                    
                    required
                  />
                 
                </div>

                {/* Email Field */}
                <div className=" col-span-2 mb-2">
                <label htmlFor="firstName" className='font-normal text-[#282828] text-[14px] '>
                        Email
                    </label>
                  <input
                    type="text"
                    value={email }
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#FFFFFF] mt-2  text-[14px] border border-solid border-[#D0D5DD] w-full h-[44px] rounded-[8px]  focus:outline-none px-4 py-2"
                  />
                  
                </div>

                {/* Role  input */}
                <div className="relative col-span-2 mb-2">
  <label htmlFor="role" className="font-normal text-[#282828] text-[14px]">
    Choose a role
  </label>
  <select
    value={role }
    onChange={(e) => setRole(e.target.value)}
    className="bg-[#FFFFFF] mt-2 text-[#282828] text-[14px] border border-solid border-[#D0D5DD] w-full h-[44px] rounded-[8px] focus:ring-1 focus:ring-[#BEBEBE] focus:outline-none px-4 py-2"
    required
  >
    <option value="" disabled>
      Select a role
    </option>
    {roles.map((role: any) => (
      <option key={role.id} value={role.id}>
        {role.name}
      </option>
    ))}
  </select>
</div>


                {/* Password Field */}
                <div className="col-span-2 mb-4 relative">
                <label htmlFor="firstName" className='font-normal text-[#282828] text-[14px]'>
                        Create a password
                    </label>
                  <input
                     type={showPassword ? "text" : "password"} // Toggle between password and text
                    value={password }
                    onChange={(e) => setPassword(e.target.value)}
                   className="bg-[#FFFFFF] mt-2 pl-6 placeholder:text-[#282828] text-[15px] border border-solid border-[#D0D5DD] w-full h-[44px] rounded-[8px] focus:ring-1 focus:ring-[#BEBEBE] focus:outline-none px-4 py-2"
                    required={!id && true}
                  />
                   <button
                  type="button"
                  className="absolute inset-y-14  right-2 flex items-center text-[#5A5A5A] text-[16px] font-bold"
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                >
                 {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                </div>
                {loading && <LoadingPage />}
            <button
              type='submit'
              className="disabled:opacity-50 col-span-2 disabled:cursor-not-allowed block font-montserrat mx-auto w-full font-medium bg-[#F6011BCC]  text-[#FFFFFF] rounded-full h-[54px] py-1 px-4 text-[15px]"
            >
              {id ? 'Update User' : 'Create User'}
            </button>
              </form>
            </div>
          </>
          
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

export default UserModal;