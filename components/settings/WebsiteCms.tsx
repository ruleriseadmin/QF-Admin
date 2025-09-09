import {useState} from 'react'

const WebsiteCms = () => {
    const [selectedView, setSelectedView] = useState('landingPage')
  return (
    <div className=" my-10 mb-10 lg:ml-4 mx-4 h-auto md:ml-10 font-montserrat text-[#282828] ">
 <p className=' text-[24px] font-bold'>Website CMS</p>
 <div className="flex md:overflow-x-auto  overflow-x-auto lg:overflow-hidden md:overflow-hidden items-center gap-8 w-full h-auto mt-10  text-[#5A5A5A] text-[16px]">
        <button
          onClick={() => setSelectedView('landingPage')}
          className={`${selectedView === 'landingPage' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
        >
          <span className="pb-6">Landing Page</span>
          {selectedView === 'landingPage' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
        </button>
        <button
          onClick={() => setSelectedView('aboutUs')}
          className={`${selectedView === 'aboutUs' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
        >
          <span className="pb-6">About Us</span>
          {selectedView === 'aboutUs' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
        </button>
        <button
          onClick={() => setSelectedView('faq')}
          className={`${selectedView === 'faq' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
        >
          <span className="pb-6">FAQ</span>
          {selectedView === 'faq' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
        </button>
        <button
          onClick={() => setSelectedView('contact')}
          className={`${selectedView === 'contact' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
        >
          <span className="pb-6">Contact</span>
          {selectedView === 'contact' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
        </button>
        <button
          onClick={() => setSelectedView('jobs')}
          className={`${selectedView === 'jobs' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
        >
          <span className="pb-6">Jobs</span>
          {selectedView === 'jobs' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
        </button>
        <button
          onClick={() => setSelectedView('others')}
          className={`${selectedView === 'others' ? 'text-[#0D5860] font-semibold' : 'text-[#5A5A5A] font-medium'}`}
        >
          <span className="pb-6">Others</span>
          {selectedView === 'others' && <hr className="w-[35px] border-0 bg-[#0D5860] h-[6px] rounded-full " />}
        </button>
        </div>
    </div>
  )
}

export default WebsiteCms