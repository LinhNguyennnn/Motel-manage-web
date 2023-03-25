import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import moment from 'moment';

import {useUserContext} from '@/context/UserContext';
import {getBillLiquidation} from 'src/pages/api/bill';
import {listRoom} from 'src/pages/api/room';
import ModalDeatil from './ModalDeatil';

const LiquidationBill: React.FC = () => {
  const router = useRouter();
  const param = router.query;
  const {cookies, setLoading} = useUserContext();
  const userData = cookies?.user;
  const [listBillLiqui, setListBillLiqui] = useState<any>([]);
  const [listRooms, setListRooms] = useState<any[]>([]);
  const [detailBill, setDetailBill] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    if (param?.id) {
      (async () => {
        setLoading(true);
        try {
          const results = await Promise.all([
            getBillLiquidation(param.id as string),
            listRoom(param.id, userData),
          ]);
          if (results[0].data) {
            setListBillLiqui(results[0].data.data);
          }
          if (results[1].data) {
            setListRooms(results[1].data.data);
          }
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [param, setLoading, userData]);

  const onSubmit = (_id: any) => {
    const target = listBillLiqui?.find((item: any) => item?._id == _id);
    setDetailBill(target);
    setOpen(true);
  };

  return (
    <div className="h-screen">
      <header className="bg-white shadow">
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate uppercase">
                Quản lý hóa đơn thanh lý hợp đồng
              </h2>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-full mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full ">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          STT
                        </th>
                        <th
                          scope="col"
                          className="px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên người đại diện
                        </th>
                        <th
                          scope="col"
                          className="px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phòng
                        </th>
                        <th
                          scope="col"
                          className="px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày thanh lý
                        </th>
                        <th
                          scope="col"
                          className="px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {listBillLiqui?.map((item: any, index: any) => {
                        const idRoom = item?.idRoom;
                        const target = listRooms?.find(
                          (item: any) => item?._id == idRoom,
                        );
                        const roomName = target?.name ?? '';
                        const timeAgo = moment(item?.createdAt).format(
                          'DD/MM/YYYY',
                        );
                        return (
                          <tr key={index}>
                            <td className="px-9 py-4 whitespace text-sm text-gray-500">
                              <div className="text-center">{index + 1}</div>
                            </td>
                            <td className="px-6 py-4 whitespace">
                              <div className="text-center">
                                {item?.detailRoom?.listMember?.map(
                                  (item: any, index2: any) => {
                                    return (
                                      <div key={index2}>
                                        {item.status === true ? (
                                          <p>{item?.memberName}</p>
                                        ) : (
                                          ''
                                        )}
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace">
                              <div className="text-center">{roomName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace">
                              <div className="text-center">{timeAgo}</div>
                            </td>
                            <td className="px-6 py-4 whitespace">
                              <div className="text-center">
                                <button
                                  className="flex py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  onClick={() => onSubmit(item?._id)}>
                                  Xem chi tiết
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ModalDeatil
        open={open}
        onCloseModal={onCloseModal}
        detailBill={detailBill}
      />
    </div>
  );
};

export default LiquidationBill;
