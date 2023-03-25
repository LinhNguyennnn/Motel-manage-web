import React, {useEffect, useState} from 'react';
import {faRightFromBracket, faBell} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useRouter} from 'next/router';

import {listReportStatus} from 'src/pages/api/notification';
import {useUserContext} from '@/context/UserContext';

type Props = {
  isShowIcon?: boolean;
};

const Navbar: React.FC<Props> = ({isShowIcon}) => {
  const [status, setStatus] = useState<any>({});

  const {logoutResetData, setActives} = useUserContext();

  const {
    query: {id},
    push,
  } = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (id) {
        (async () => {
          const {data} = await listReportStatus(id);
          setStatus(data);
        })();
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [id]);

  return (
    <>
      <nav className="left-0 w-full z-50 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="flex w-full mx-auto items-center justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          <div className="md:flex hidden flex-row items-center w-full justify-end mr-3">
            {isShowIcon ? (
              <div
                className="relative cursor-pointer"
                onClick={() => {
                  push(`/manager/landlord/${id}/report`);
                  setActives('report');
                }}>
                <div>
                  {status.count === 0 ? (
                    <div />
                  ) : (
                    <div className="absolute left-0 top-0  bg-red-500 rounded-full">
                      <span className="text-sm text-white p-2">
                        {status.count || 0}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <FontAwesomeIcon
                    className="w-[20px] text-black"
                    icon={faBell}
                  />
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <button
              className="cursor-pointer gap-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => logoutResetData()}>
              <FontAwesomeIcon
                className="w-[16px] text-white"
                icon={faRightFromBracket}
              />
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>
      {/* <Modal open={open1} onClose={closeModal1} center>
        <div className="w-full text-end">
          <div>
            <div className="">
              <div className="">
                <div className="flex items-center justify-between">
                  <p tabIndex={0} className="focus:outline-none text-2xl font-semibold leading-6 text-gray-800">
                    Thông báo
                  </p>
                </div>
                {status.count === 0 ? (
                  <div className="mt-5">
                    <p className="text-center text-lg text-black p-5">Không có thông báo</p>
                  </div>
                ) : (
                  <div className="mt-5">
                    {report?.map((item: any, index: number) => {
                      var timeAgo = moment(item.createdAt).format('DD/MM/YYYY');
                      return (
                        <>
                          {item.status == true ? (
                            <div></div>
                          ) : (
                            <>
                              <div className="text-left p-3 border border-blue-500 border-opacity-25">
                                <div className="font-bold mb-2 text-xl">{item.roomName}</div>
                                <div className="flex mb-2">
                                  <p className="w-full">
                                    <span className="text-indigo-700">{item.content}</span>
                                  </p>
                                  <p className="w-full text-right">{timeAgo}</p>
                                </div>
                                <Link href={`/manager/landlord/${id}/report`}>
                                  <a>
                                    <div
                                      className="text-sm text-cyan-700 hover:text-cyan-500"
                                      onClick={() => setOpen1(false)}
                                    >
                                      Xem thêm
                                    </div>
                                  </a>
                                </Link>
                              </div>
                            </>
                          )}
                        </>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal> */}
    </>
  );
};

export default Navbar;
