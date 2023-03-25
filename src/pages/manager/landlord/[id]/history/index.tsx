import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';

import TabBillServiceHistory from '@/components/TabBillServiceHistory';
import TabServiceHistory from '@/components/TabServiceHistory';
import TabHistoryComponent from '@/components/TabHistory';
import TabBillHistory from '@/components/TabBillHistory';
import {useUserContext} from '@/context/UserContext';
import {historyDelete} from 'src/pages/api/history';
import TabPeople from '@/components/TabPeople';

const HistoryDelete: React.FC = () => {
  const {cookies, setLoading} = useUserContext();
  const userData = cookies?.user;
  const router = useRouter();
  const param = router.query;
  const id = param.id;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        const {data} = await historyDelete(id, userData);
        setHistory(data.data);
        setLoading(false);
      })();
    }
  }, [id, setLoading, userData]);

  const data = [
    {
      label: 'Thông tin phòng trọ',
      value: 0,
      children: <TabPeople data={[...history].reverse()} />,
    },
    {
      label: 'Điện nước',
      value: 1,
      children: <TabBillServiceHistory data={[...history].reverse()} />,
    },
    {
      label: 'Dịch vụ',
      value: 2,
      children: <TabServiceHistory data={[...history].reverse()} />,
    },
    {
      label: 'Hoá đơn',
      value: 3,
      children: <TabBillHistory data={[...history].reverse()} />,
    },
  ];
  return (
    <div className="w-full">
      <header className="bg-white shadow border rounded-md">
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate uppercase">
                quản lý lịch sử
              </h2>
            </div>
          </div>
        </div>
      </header>
      <div className="manage-room-container ">
        <TabHistoryComponent data={data} />
      </div>
    </div>
  );
};

export default HistoryDelete;
