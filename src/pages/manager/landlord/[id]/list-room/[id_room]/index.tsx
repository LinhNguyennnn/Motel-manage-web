import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';

import TenantContract from '@/components/TenantContact';
import TabPanelComponent from '@/components/TabPanel';
import TenantMember from '@/components/TenantMember';
import {useUserContext} from '@/context/UserContext';
import TabService from '@/components/TabService';
import LoginCode from '@/components/LoginCode';
import {getInfoUser} from 'src/pages/api/auth';
import {readRoom} from 'src/pages/api/room';
import {Toast} from 'src/hooks/toast';

const TenantInformation = dynamic(() => import('@/components/TenantInfo'), {
  ssr: false,
});

const ManageRoom: React.FC = () => {
  const [roomData, setRoomData] = useState<any>({});
  const {cookies, setLoading} = useUserContext();
  const [infoLandlord, setInfoLandlord] = useState();
  const [resetPage, setResetPage] = useState(0);
  const userData = cookies?.user;
  const router = useRouter();
  const {id, id_room} = router.query;

  const handleResetPage = () => {
    setResetPage(resetPage + 1);
  };

  useEffect(() => {
    if (!userData) return;
    setLoading(true);
    getInfoUser(userData.user._id, userData.token)
      .then(result => {
        setInfoLandlord(result.data.data);
      })
      .catch(err => {
        Toast('error', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading, userData]);

  const getRoom = useCallback(async () => {
    if (id) {
      setLoading(true);
      try {
        const {data} = await readRoom(`${id_room}`, userData);
        if (data.data) {
          setRoomData(data.data);
        }
      } finally {
        setLoading(false);
      }
    }
  }, [id, id_room, setLoading, userData]);

  useEffect(() => {
    getRoom();
  }, [getRoom]);

  const data = [
    {
      label: 'Thông tin phòng trọ',
      value: 0,
      children: <TenantInformation data={roomData} resetDataLiquid={getRoom} />,
    },
    // LoginCode
    {
      label: 'Thành viên',
      value: 1,
      children: (
        <TenantMember
          data={roomData}
          data1={roomData.listMember}
          handleResetPage={() => handleResetPage()}
        />
      ),
    },
    {
      label: 'Hợp đồng',
      value: 2,
      children: (
        <TenantContract
          data={roomData}
          dataContract={roomData.contract}
          leadMember={
            roomData?.listMember?.length > 0
              ? roomData?.listMember.find(
                  (element: any) => element.status == true,
                )
              : null
          }
          roomArea={roomData.area}
          roomPrice={roomData.price}
          dataLandlord={infoLandlord}
        />
      ),
    },
    {
      label: 'Mã đăng nhập',
      value: 3,
      children: (
        <LoginCode data={roomData} handleResetPage={() => handleResetPage()} />
      ),
    },
    {
      label: 'Dịch vụ riêng',
      value: 4,
      children: (
        <TabService
          id={id}
          idRoom={id_room}
          userData={userData}
          dataRoom={roomData}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <header className="bg-white shadow border rounded-md">
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate uppercase">
                Quản lý phòng trọ
              </h2>
            </div>
          </div>
        </div>
      </header>
      <div className="manage-room-container ">
        <TabPanelComponent data={data} />
      </div>
    </div>
  );
};

export default ManageRoom;
