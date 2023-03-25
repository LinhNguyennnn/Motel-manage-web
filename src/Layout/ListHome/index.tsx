import React, {ReactNode} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {CircleSpinnerOverlay} from 'react-spinner-overlay';
import {faReply} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

import {useUserContext} from '@/context/UserContext';

type Props = {
  children: ReactNode;
};

const LayoutListHome: React.FC<Props> = ({children}) => {
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
      <div className=" mx-auto min-h-screen">
        <div className="w-full bg-gray-400">
          <Link href="/">
            <a className=" font-bold flex p-3">
              <span>
                {' '}
                <FontAwesomeIcon className="w-[20px] mr-3" icon={faReply} />
              </span>
              <span> Trở về</span>
            </a>
          </Link>
        </div>
        {children}
      </div>
    </>
  );
};

export default LayoutListHome;
