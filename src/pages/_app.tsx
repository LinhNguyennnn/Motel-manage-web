import '../assets/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';
import 'antd/dist/antd.css';
import React from 'react';
import {config} from '@fortawesome/fontawesome-svg-core';
import NextNProgress from 'nextjs-progressbar';
import {ToastContainer} from 'react-toastify';
import {CookiesProvider} from 'react-cookie';
import viVN from 'antd/lib/locale/vi_VN';
import type {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import {ConfigProvider} from 'antd';

import {CheckCodeRoom, CheckUser, PrivateRouter} from './PrivateRouter';
import LayoutLandlords from 'src/Layout/Manager/Landlords';
import LayoutTenants from 'src/Layout/Manager/Tenants';
import LayoutListHome from 'src/Layout/ListHome';
import UserProvider from '@/context/UserContext';
import LayoutIntro from 'src/Layout/Preview';

config.autoAddCss = false;

const MyApp: React.FC<AppProps> = ({Component, pageProps}) => {
  const router = useRouter();

  const switchLayout = () => {
    if (router.pathname.search('/manager/landlord/list-home') >= 0) {
      return (
        <PrivateRouter>
          <LayoutListHome>
            <Component {...pageProps} />
          </LayoutListHome>
        </PrivateRouter>
      );
    }

    if (router.pathname.search('/manager/landlord') >= 0) {
      return (
        <PrivateRouter>
          <LayoutLandlords>
            <Component {...pageProps} />
          </LayoutLandlords>
        </PrivateRouter>
      );
    }

    if (router.pathname.search('/manager/ternant') >= 0) {
      return (
        <CheckCodeRoom>
          <LayoutTenants>
            <Component {...pageProps} />
          </LayoutTenants>
        </CheckCodeRoom>
      );
    } else {
      return (
        <div className="bg-gray-200">
          <LayoutIntro>
            <CheckUser>
              <Component {...pageProps} />
            </CheckUser>
          </LayoutIntro>
        </div>
      );
    }
  };

  return (
    <>
      <NextNProgress />
      <CookiesProvider>
        <UserProvider>
          <ConfigProvider locale={viVN}>
            {switchLayout()}
            <ToastContainer />
          </ConfigProvider>
        </UserProvider>
      </CookiesProvider>
    </>
  );
};

export default MyApp;
