'use client';
import React from 'react';
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";

type FrontPaginateProps = {
  totalItems: number; // Total number of items
  itemsPerPage: number; // Number of items per page
  currentPage: number; // Current page number
  onPageChange: (pageNumber: number) => void; // Function to handle page change
};

const FrontPaginate: React.FC<FrontPaginateProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const getVisiblePages = () => {
    const maxVisible = 5; // Number of visible page buttons
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage > totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center font-montserrat lg:gap-6 md:gap-3 mt-5 overflow-x-auto">
      {/* Show "1-10 of 20" */}
      <div className="text-[#282828]  text-[15px] font-semibold tracking-wide text-nowrap">
        Showing {startItem}-{endItem} of {totalItems}
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
            className={`px-3 py-1 border w-[37px] h-[34.29px] rounded-[8px] ${
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
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200'
          }`}
        >
          <BiSolidRightArrow
            className={`${
              currentPage === totalPages ? 'text-[#E0E0E0]' : 'text-[#2C2C2C]'
            } text-2xl`}
          />
        </button>
      </div>
    </div>
  );
};

export default FrontPaginate;