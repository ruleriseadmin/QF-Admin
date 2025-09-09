import React from 'react';
import ReactDOM from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { formatCurrency, formatDate, formatTime } from '@/utils/loan';

type DisputeProps = {
  isOpen: boolean;
  toggleLoanSlide: () => void;
  isExiting: boolean;
  disputes?: any[];
};

const DisputeModal: React.FC<DisputeProps> = ({
  isOpen,
  toggleLoanSlide,
  isExiting,
  disputes = [],
}) => {
  const modalContent = (
    <div
      onClick={toggleLoanSlide}
      className={`overlay fixed font-montserrat inset-0 z-40 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 bg-black bg-opacity-50' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed left-[500px] transform -translate-x-1/2 lg:w-[541px] md:w-9/12 w-full min-h-screen h-auto transition-all duration-300 ${
          isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        <div className={`w-full bg-[#FFFFFF] fixed z-0 h-full`}>
          <div className="flex justify-between items-center pt-4 mx-4">
            <p className="text-[18px] font-bold text-[#282828] my-2">Dispute Management</p>
            <button onClick={toggleLoanSlide}>
              <IoClose className="text-navfont rounded-full bg-[#ECECEC] text-3xl mt-2 mr-2 p-1 font-bold" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className={`relative mt-[40px] overflow-y-auto pb-[100px] z-0 h-[calc(106vh-170px)]`}>
            {disputes.length === 0 ? (
              <div className="text-center mt-20 text-gray-500 font-medium text-[16px]">
                No disputes available.
              </div>
            ) : (
              disputes.map((data, index) => (
                <div
                  key={index}
                  className="bg-[#EBEBEB] lg:w-[487px] md:w-[487px] w-[410px] overflow-x-hidden rounded-[12px] min-h-[233px] h-auto mx-auto pt-6 mt-4"
                >
                  <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
                    <span className="text-[#D06F20]">{data?.name}</span>
                  </p>
                  <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
                    <span>Category</span>
                    <span className="font-medium text-[15px]">{data?.category}</span>
                  </p>
                  <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
                    <span>Amount</span>
                    <span className="font-medium text-[15px]">{formatCurrency(data?.amount)}</span>
                  </p>
                  <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
                    <span>Date Created</span>
                    <span className="font-medium text-[15px]">
                      {formatDate(data?.date_created?.split('T')[0])}{' '}
                      {formatTime(data?.date_created?.split('T')[1])}
                    </span>
                  </p>
                  <p className="text-[#282828] flex justify-between items-center mx-6 mb-2 font-semibold text-[16px]">
                    <span>Status</span>
                    <span className="font-medium text-[15px]">{data?.status}</span>
                  </p>
                  <p className="text-[#282828] flex justify-between items-center mx-6 mb-6 font-semibold text-[16px]">
                    <span>Due Date</span>
                    <span className="font-medium text-[15px]">
                       {formatDate(data?.due_date?.split('T')[0])}{' '}
                      {formatTime(data?.due_date?.split('T')[1])}
                    </span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default DisputeModal;
