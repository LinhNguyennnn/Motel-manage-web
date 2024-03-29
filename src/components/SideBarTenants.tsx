import React, {useState} from 'react';
import {faBars, faXmark, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {useUserContext} from '@/context/UserContext';

import {MENU_TENANTS} from 'src/util/MENUTENANT';

const SideBarTenants: React.FC = () => {
  const [collapseShow, setCollapseShow] = useState('hidden');
  const [actives, setActives] = useState<number>();

  const {logoutResetData} = useUserContext();

  const router = useRouter();

  return (
    <>
      <div
        className={
          collapseShow === 'hidden'
            ? 'overlay hidden'
            : 'fixed w-full h-full opacity-70 bg-black z-10'
        }
        onClick={() => setCollapseShow('hidden')}></div>
      <nav className="sm:fixed sm:w-full xs:fixed xs:w-full 2xs:fixed 2xs:w-full s:fixed s:w-full md:left-0 md:block  md:top-0 md:bottom-0  md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() =>
              setCollapseShow(
                'bg-white w-[50%] 2xs:w-[80%] xs:w-[60%] s:w-[40%] py-3 px-6 md:px-0 md:py-0 h-screen md:w-full',
              )
            }>
            <FontAwesomeIcon className="w-[16px] text-black" icon={faBars} />
          </button>
          {/* Brand */}
          <Link href="/">
            <a className="md:block text-left md:pb-2 text-black hover:text-black mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
              Quản Lý Phòng Trọ 24/7
            </a>
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              {/* <NotificationDropdown /> */}
            </li>
            <li className="inline-block relative">{/* <UserDropdown /> */}</li>
          </ul>
          {/* Collapse */}
          <div
            className={
              'md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-x-hidden items-center flex-1 rounded ' +
              collapseShow
            }>
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link href="/">
                    <a
                      href="#pablo"
                      className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold py-4 px-0">
                      QLPT 24/7
                    </a>
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="ml-4 cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow('hidden')}>
                    <FontAwesomeIcon
                      className="w-[16px] text-black"
                      icon={faXmark}
                    />
                  </button>
                </div>
              </div>
            </div>

            <ul className="md:flex-col md:min-w-full flex flex-col 2xs:h-screen md:h-screen sm:h-screen s:h-screen xs:h-screen list-none">
              {MENU_TENANTS.map((menu, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setActives(menu.checkMenu);
                    setCollapseShow('hidden');
                  }}
                  className={
                    'items-center rounded-lg mb-4 fw-500 cursor-pointer hover:bg-blue-500 round-md' +
                    ((menu.url &&
                      router.pathname.includes(menu.url) &&
                      !actives) ||
                    (actives && !menu.url)
                      ? 'hover:text-blueGray-500 bg-blue-500 rounded-lg text-white'
                      : 'bg-gray-300 text-lightBlue-500 hover:text-lightBlue-600')
                  }>
                  <Link href={`/manager/ternant/${menu.url}`}>
                    <a
                      className={
                        'h-[45px] text-xs font-bold flex items-center gap-4 text-black px-4 py-3 bg-gradient-to-tr from-light-blue-500 to-light-blue-700 rounded-lg focus:bg-blue-500 hover:text-white shadow-md'
                      }>
                      {menu.icon}
                      {menu.title}
                    </a>
                  </Link>
                </li>
              ))}
              <li
                onClick={logoutResetData}
                className={
                  'items-center rounded-lg mb-4 fw-500 cursor-pointer hover:bg-blue-500 round-mdbg-gray-300 text-lightBlue-500 hover:text-lightBlue-600'
                }>
                  <span className={
                      'h-[45px] text-xs font-bold flex items-center gap-4 text-black px-4 py-3 bg-gradient-to-tr from-light-blue-500 to-light-blue-700 rounded-lg focus:bg-blue-500 hover:text-white shadow-md'
                    }>
                    <FontAwesomeIcon className="w-[16px] text-black" icon={faRightFromBracket} />
                    Đăng xuất
                  </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideBarTenants;
