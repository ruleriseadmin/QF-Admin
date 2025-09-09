'use client';
import React, { useEffect, useState } from 'react';
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";

type PaginateProps = {
  lastPage: number; // The last page number from the API response
  currentPage: number; // Current page number
  onPageChange: (pageNumber: number) => void; // Function to handle page change
 
  totalItems: number; 
  itemsPerPage: number;
};

const Paginate: React.FC<PaginateProps> = ({ lastPage, itemsPerPage, currentPage, onPageChange,totalItems }) => {
  const handleNext = () => {
    if (currentPage < lastPage ) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      
    }
  };

  const [enteredPage,setEnteredPage]= useState<number | undefined>()

  useEffect(() => {
    setEnteredPage(currentPage)
  },
  [currentPage]
)

  const getVisiblePages = () => {
    const maxVisible = 5; // Number of visible page buttons
    const pages: (number | string)[] = [];

    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, '...', lastPage);
      } else if (currentPage > lastPage - 3) {
        pages.push(1, '...', lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center font-montserrat lg:gap-6 md:gap-3 mt-5 overflow-x-auto">
      <div className="text-[#282828]  text-[15px] font-semibold tracking-wide text-nowrap">
        Showing {startItem}-{endItem} of {totalItems}
        <input 
  type="number" 
  value={enteredPage || currentPage} 
  onChange={(e) => {
    const value = Number(e.target.value);
    
    setEnteredPage(value);
    if (value >= 1 && value <= lastPage) {
      onPageChange(value);
      
    }
  }}
  min={1}
  max={lastPage}
   className=" min-w-[40px] mx-2 w-auto p-2 h-[34px] cursor-pointer bg-[#F9F8F8] text-[#5A5A5A] font-montserrat font-medium text-[15px] border border-solid border-[#282828] rounded-[8px]   focus:outline-none"
/>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200'
          }`}
        >
          <BiSolidLeftArrow
            className={`${
              currentPage === 1 ? 'text-[#E0E0E0]' : 'text-[#2C2C2C]'
            } text-2xl`}
          />
        </button>

        {/* Page Numbers */}
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`px-3 py-1 border min-w-[37px] w-auto h-[34.29px] rounded-[8px] ${
              page === currentPage
                ? 'bg-[#282828] text-[#FFFFFF]'
                : typeof page === 'number'
                ? 'bg-[#AEAEAE] text-[#FFFFFF]'
                : 'bg-none border-none text-[#282828]'
            }`}
            disabled={typeof page !== 'number'}
          >
            {typeof page === 'number' ? (
              page
            ) : (
              <BsThreeDots className="cursor-default" />
            )}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === lastPage}
          className={`${
            currentPage === lastPage ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200'
          }`}
        >
          <BiSolidRightArrow
            className={`${
              currentPage === lastPage ? 'text-[#E0E0E0]' : 'text-[#2C2C2C]'
            } text-2xl`}
          />
        </button>
      </div>

    </div>
  );
};

export default Paginate;
