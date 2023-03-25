import React, {ReactNode} from 'react';
import {CircleSpinnerOverlay} from 'react-spinner-overlay';

import {useUserContext} from '@/context/UserContext';
import FooterPreview from './Footer';
import HeaderPreview from './Header';

type Props = {
  children: ReactNode;
};

const LayoutIntro: React.FC<Props> = ({children}) => {
  const {loading} = useUserContext();

  return (
    <div className="flex flex-col m-auto bg-white w-full min-h-screen justify-between">
      <CircleSpinnerOverlay
        loading={loading}
        color="#2563eb"
        size={100}
        message="Loading"
        zIndex={9999}
      />
      <HeaderPreview />
      {children}
      <FooterPreview />
    </div>
  );
};

export default LayoutIntro;
