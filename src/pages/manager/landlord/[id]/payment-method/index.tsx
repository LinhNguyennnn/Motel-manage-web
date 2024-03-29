import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import TabPanelComponent from '@/components/TabPanel';
import {getListBill} from 'src/pages/api/payment';
import PaymentHistory from './payment-history';
import SettingPayment from './setting-payment';
import {useUserContext} from '@/context/UserContext';

const Payment: React.FC = () => {
  const router = useRouter();
  const {id} = router.query;
  const [listData, setListData] = useState([]);

  const {setLoading} = useUserContext();

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        const {data} = await getListBill(id);
        setListData(data?.data);
        setLoading(false);
      })();
    }
  }, [id, setLoading]);

  const data = [
    {
      label: 'Lịch sử thanh toán',
      value: 0,
      children: <PaymentHistory listData={listData} />,
    },

    {
      label: 'Cài đặt thanh toán',
      value: 1,
      children: <SettingPayment />,
    },
  ];
  return (
    <div className="w-full">
      <header className="bg-white shadow border rounded-md">
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate uppercase">
                quản lý thanh toán
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

export default Payment;
