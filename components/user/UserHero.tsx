import React from 'react'

type UserHeroProps = {
  users: any;
  roles: any;
}
const UserHero:React.FC<UserHeroProps> = ({users,roles}) => {
 
 

  return (
    <div className="lg:ml-8 ml-8 mr-2 md:ml-11 mt-12  h-auto font-montserrat ">
        <p className='font-bold text-[24px] font-[#282828] tracking-wide'>User Management</p>
        <div className='grid grid-cols-1 lg:gap-4 md:gap-2 gap-2 lg:grid-cols-4 md:grid-cols-2  lg:w-full h-auto mt-6'>
            <div className='min-h-[105px] flex flex-col gap-3 h-auto  bg-[#E6EAE8] shadow-customshadow5 rounded-[12px]'>
            <p className='text-[16px] text-[#5A5A5A] mx-4 font-medium mt-4'>Users</p>
            <p className='text-[22px] text-[#323232] mx-4 font-black'>{users.length}</p>
            </div>
            <div className='min-h-[105px] flex flex-col gap-3 h-auto  bg-[#FFFFFF] shadow-customshadow5 rounded-[12px]'>
            <p className='text-[16px] text-[#5A5A5A] mx-4 font-medium mt-4'>Roles</p>
            <p className='text-[22px] text-[#323232] mx-4 font-black'>{roles.length}</p>
            </div>

        </div>
    </div>
  )
}

export default UserHero