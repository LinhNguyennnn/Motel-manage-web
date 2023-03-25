import React, {ReactNode} from 'react';
import {CircleSpinnerOverlay} from 'react-spinner-overlay';

import SideBarTenants from '@/components/SideBarTenants';
import {useUserContext} from '@/context/UserContext';
import Navbar from '@/components/AdminNavbar';

type Props = {
  children: ReactNode;
};

const LayoutTenants: React.FC<Props> = ({children}) => {
  const {loading} = useUserContext();

  return (
    <>
      <CircleSpinnerOverlay
        loading={loading}
        color="#2563eb"
        size={100}
        message="Loading"
        zIndex={9999}
      />
      <SideBarTenants />
      <Navbar isShowIcon={false} />
      <div className="relative md:ml-64 bg-blueGray-100">
        <div className=" mx-auto w-full h-full">
          <div className="bg-gray-100 p-4 min-h-screen sm:mt-[55px] s:mt-[55px] 2xs:mt-[55px] xs:mt-[55px] md:mt-0">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutTenants;
