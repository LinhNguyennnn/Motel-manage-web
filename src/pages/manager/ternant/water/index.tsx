import React, {useEffect, useState} from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';

import {getDetailBillServiceByMonthYear} from 'src/pages/api/statistical';
import {useUserContext} from '@/context/UserContext';

const today = new Date();

const ListWater: React.FC = () => {
  const [monthCheck, setMonth] = useState(today.getMonth() + 1);
  const [yearCheck, setYear] = useState(today.getFullYear());
  const [listBillData, setListBillData] = useState<{
    outputValue: number;
    inputValue: number;
  }>({inputValue: 0, outputValue: 0});

  const {cookies, setLoading} = useUserContext();

  useEffect(() => {
    if (cookies?.code_room?._id) {
      (async () => {
        setLoading(true);
        const {data} = await getDetailBillServiceByMonthYear(
          cookies.code_room._id,
          'nuoc',
          monthCheck,
          yearCheck,
        );
        setListBillData(data.data);
        setLoading(false);
      })();
    }
  }, [cookies?.code_room?._id, monthCheck, yearCheck, setLoading]);

  return (
    <div className="h-screen">
      <header className="bg-white shadow">
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate uppercase">
                quản lý số nước hàng tháng
              </h2>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="block p-2">
          <h3>Chọn tháng năm</h3>
          <DatePicker
            style={{width: '200px'}}
            onChange={(_, dateString) => {
              setMonth(parseInt(dateString.slice(5, 7)));
              setYear(parseInt(dateString.slice(0, 4)));
            }}
            defaultValue={moment(`${yearCheck}-${monthCheck}`, 'YYYY-MM')}
            allowClear={false}
            picker="month"
          />
        </div>
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
                          Tháng
                        </th>
                        <th
                          scope="col"
                          className="px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số nước cũ
                        </th>

                        <th
                          scope="col"
                          className="px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số nước mới
                        </th>
                        <th
                          scope="col"
                          className="px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số nước tiêu thu (m3)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-9 py-4 whitespace text-sm text-gray-500">
                          <div className="text-center">{monthCheck}</div>
                        </td>
                        <td className="px-6 py-4 whitespace">
                          <div className="text-center">
                            {listBillData.inputValue}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace">
                          <div className="text-center">
                            {listBillData.outputValue}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace text-yellow-500 font-bold">
                          <div className="text-center">
                            {listBillData.outputValue - listBillData.inputValue}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListWater;
