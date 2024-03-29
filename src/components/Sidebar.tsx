import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Modal from 'react-responsive-modal';
import {useRouter} from 'next/router';
import Link from 'next/link';
import moment from 'moment';
import {
  faBars,
  faRightFromBracket,
  faXmark,
  faChevronLeft,
  faBell,
} from '@fortawesome/free-solid-svg-icons';

import {listReportStatus, listReports} from 'src/pages/api/notification';
import {useUserContext} from '@/context/UserContext';
import {MENU_LANDLORD} from 'src/util/MENU';

const SideBar: React.FC = () => {
  const [collapseShow, setCollapseShow] = useState('hidden');
  const router = useRouter();
  const {id} = router.query;
  const {cookies, setLoading, actives, setActives, logoutResetData, resetPage} =
    useUserContext();
  const [status, setStatus] = useState<any>({});
  const [open1, setOpen1] = useState(false);
  const [report, setReport] = useState<any>();
  const userData = cookies?.user;

  const closeModal1 = () => {
    setOpen1(false);
  };

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        const results = await Promise.all([
          listReportStatus(id),
          listReports({id, userData}),
        ]);
        if (results[0].data) {
          setStatus(results[0].data);
        }
        if (results[1].data) {
          setReport(results[1].data.data);
        }
        setLoading(false);
      })();
    }
  }, [id, resetPage, setLoading, userData]);

  return (
    <>
      <div
        className={
          collapseShow === 'hidden'
            ? 'overlay hidden'
            : 'fixed w-full h-full opacity-70 bg-black z-10'
        }
        onClick={() => setCollapseShow('hidden')}
      />
      <nav className="sm:fixed sm:w-full xs:fixed xs:w-full 2xs:fixed 2xs:w-full s:fixed s:w-full md:left-0 md:block  md:top-0 md:bottom-0  md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto flex-row-reverse">
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
          {/* ----------------------------------- */}
          <div
            className="relative cursor-pointer md:hidden"
            onClick={() => setOpen1(true)}>
            {status.count === 0 ? (
              <div></div>
            ) : (
              <div className="absolute left-0 top-0  bg-red-500 rounded-full">
                <span className="text-sm text-white p-2">{status.count}</span>
              </div>
            )}
            <div className="p-3">
              <FontAwesomeIcon className="w-[20px] text-black" icon={faBell} />
            </div>
            <Modal open={open1} onClose={closeModal1}>
              <div className="w-full text-end">
                <div>
                  <div className="">
                    <div className="">
                      <div className="flex items-center justify-between">
                        <p
                          tabIndex={0}
                          className="focus:outline-none text-2xl font-semibold leading-6 text-gray-800">
                          Thông báo
                        </p>
                      </div>
                      {status.count === 0 ? (
                        <div className="mt-5">
                          <p className="text-center text-lg text-black p-5">
                            Không có thông báo
                          </p>
                        </div>
                      ) : (
                        <div className="mt-5">
                          {report?.map((item: any, index: number) =>
                            item.status == true ? (
                              <div key={index} />
                            ) : (
                              <div
                                key={index}
                                className="text-left p-3 border border-blue-500 border-opacity-25">
                                <div className="font-bold mb-2 text-xl">
                                  {item.roomName}
                                </div>
                                <div className="flex mb-2">
                                  <p className="w-full">
                                    <span className="text-indigo-700">
                                      {item.content}
                                    </span>
                                  </p>
                                  <p className="w-full text-right">
                                    {moment(item.createdAt).format(
                                      'DD/MM/YYYY',
                                    )}
                                  </p>
                                </div>
                                <Link href={`/manager/landlord/${id}/report`}>
                                  <a>
                                    <div
                                      className="text-sm text-cyan-700 hover:text-cyan-500"
                                      onClick={() => setOpen1(false)}>
                                      Xem thêm
                                    </div>
                                  </a>
                                </Link>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
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
              'md:flex md:flex-col md:items-stretch md:opacity-100 ease-out duration-300  md:relative md:mt-4  md:shadow-none shadow absolute top-0 right-0 z-40 overflow-x-hidden items-center flex-1 rounded ' +
              collapseShow
            }>
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link href="/">
                    <a className="md:block text-left md:pb-2 text-black hover:text-black mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold py-4 px-0">
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
              <Link href={'/'}>
                <a className="h-[45px] text-xs font-bold flex items-center gap-4 text-black px-4 py-3 bg-gradient-to-tr from-light-blue-500 to-light-blue-700 hover:text-white shadow-md">
                  <FontAwesomeIcon
                    className="w-[16px] text-black"
                    icon={faChevronLeft}
                  />
                  <span className="font-bold text-black">
                    Trở lại trang chủ
                  </span>
                </a>
              </Link>

              <Link href="/manager/landlord/list-home">
                <a className="h-[45px] text-xs font-bold flex items-center gap-4 text-black px-4 py-3 bg-gradient-to-tr from-light-blue-500 to-light-blue-700 hover:text-white shadow-md mb-4">
                  <FontAwesomeIcon
                    className="w-[16px] text-black"
                    icon={faChevronLeft}
                  />

                  <span className="font-bold text-black">
                    Trở lại danh sách nhà
                  </span>
                </a>
              </Link>

              {MENU_LANDLORD.map((menu, index) => (
                <li
                  key={index}
                  onClick={() => setActives(menu.url)}
                  className={
                    'items-center rounded-lg mb-4 fw-500 cursor-pointer hover:bg-blue-500 round-md' +
                    ((menu.url && router.pathname.includes(menu.url)) ||
                    (router.pathname.includes(menu.url) &&
                      !menu.url &&
                      !actives)
                      ? ' text-blueGray-700 hover:text-blueGray-500 bg-blue-500 rounded-lg text-white'
                      : ' bg-gray-300 text-lightBlue-500 hover:text-lightBlue-600')
                  }>
                  <Link href={`/manager/landlord/${id}/${menu.url}`}>
                    <a
                      className={
                        'h-[45px] text-xs font-bold flex items-center gap-4 text-black px-4 py-3 bg-gradient-to-tr from-light-blue-500 to-light-blue-700 rounded-lg focus:bg-blue-500 hover:text-white shadow-md'
                      }
                      onClick={() => setCollapseShow('hidden')}>
                      {menu.icon}
                      {menu.title}
                    </a>
                  </Link>
                </li>
              ))}

              <div className="block md:hidden">
                <button
                  className="cursor-pointer gap-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => logoutResetData()}>
                  <FontAwesomeIcon
                    className="w-[16px] text-white"
                    icon={faRightFromBracket}
                  />{' '}
                  Đăng xuất
                </button>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default SideBar;
