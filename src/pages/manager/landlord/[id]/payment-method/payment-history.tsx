import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Table} from 'antd';
import moment from 'moment';

import {useUserContext} from '@/context/UserContext';
import {listRoom} from 'src/pages/api/room';
import useSearch from 'src/hooks/useSearch';

type Props = {
  listData?: any;
};

const PaymentHistory: React.FC<Props> = ({listData}) => {
  const [listRooms, setListRooms] = useState<any[]>([]);
  const {cookies, setLoading} = useUserContext();
  const userData = cookies?.user;
  const router = useRouter();
  const param = router.query;
  const id = param.id;

  const {getColumnSearchProps} = useSearch();
  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        const {data} = await listRoom(id, userData);
        setListRooms(data.data);
        setLoading(false);
      })();
    }
  }, [id, userData, setLoading]);

  const data: any[] = listData?.map((item: any, index: any) => {
    const idRoom = item?.idRoom;
    const target = listRooms?.find((item: any) => item?._id == idRoom);
    const roomName = target?.name ?? '';
    return {
      index: index + 1,
      key: item._id,
      name: roomName,
      month: `${item?.month} / ${item?.year}`,
      date: moment(item.createdAt).format('DD/MM/YYYY'),
      value: Number(item.value).toLocaleString('it-IT', {
        style: 'currency',
        currency: 'VND',
      }),
    };
  });
  const columns: any[] = [
    {
      title: 'Phòng',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Hóa đơn tháng',
      dataIndex: 'month',
      key: 'month',
      width: '25%',
      ...getColumnSearchProps('month'),
    },
    {
      title: 'Ngày thanh toán hóa đơn',
      dataIndex: 'date',
      key: 'date',
      width: '25%',
      ...getColumnSearchProps('date'),
    },
    {
      title: 'Số tiền thanh toán',
      dataIndex: 'value',
      key: 'value',
      width: '25%',
      ...getColumnSearchProps('value'),
    },
  ];
  return (
    <div className="overflow-auto bg-white rounded">
      <Table dataSource={data} columns={columns} />
    </div>
  );
};

export default PaymentHistory;
