import { useSearchParams } from 'next/navigation';
import WebsiteCms from '@/components/settings/WebsiteCms';
import AppConfig from '@/components/settings/AppConfig';
import LoanOffer from '@/components/settings/LoanOffer';

const DisplaySettings = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('set'); // Reactive query parameter

  
  return (
    <div className="mt-10 mb-10 lg:ml-4 mx-4 h-auto md:ml-10 font-montserrat">
    {(activeTab === 'website-cms' || activeTab === null) && <WebsiteCms />}
      {activeTab === 'app-configuration' && <AppConfig />}
      {activeTab === 'loan-offers' && <LoanOffer />}
    </div>
  );
};

export default DisplaySettings;
