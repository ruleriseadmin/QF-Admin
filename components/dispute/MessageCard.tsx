import React from 'react'



type MessageCardProps = {
   data:{
    email: string;
    name?: string;
    message: string;
    status: string;
    created_at: string;
   }
    }
const MessageCard: React.FC<MessageCardProps> = ({data}) => {
  return (
    <div className='bg-[#DBE7F0] w-[276px] font-montserrat grid grid-cols-12 gap-4 mx-auto my-2 min-h-[79px] h-auto rounded-[8px]'>
        
        <div className='col-span-12 my-4 '>
            <div className='flex justify-between items-center mx-2'>
                <p className='font-semibold text-[13px]'>John Doe</p>
                <p className='font-semibold text-[10px]'>{data.created_at} </p>

            </div>
            <p className='text-[#5A5A5A] mx-2 text-[13px] overflow-hidden text-ellipsis whitespace-nowrap'>{data.message}</p>
        

        </div>
        
        
    </div>
  )
}

export default MessageCard