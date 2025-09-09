'use client';
import { ThreeDots } from 'react-loader-spinner';

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 flex items-center  justify-center ">
      <div className="w-10 rounded-lg shadow-lg z-50">
        <ThreeDots 
          height="19"
          width="38"
          radius="8"
          color="#282828"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    </div>
  );
};

export default LoadingPage;
