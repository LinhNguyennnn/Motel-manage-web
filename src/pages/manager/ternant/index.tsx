import React, {useEffect, useState} from 'react';

import {getBillServiceByYear} from 'src/pages/api/statistical';
import {useUserContext} from '@/context/UserContext';
import BarDien from '@/components/chart/barDien';
import BarNuoc from '@/components/chart/barNuoc';

const Ternant: React.FC = () => {
  const [checkYear, setCheckYear] = useState(new Date().getFullYear());
  const [totalElictic, setTotalElictric] = useState([]);
  const [totalWater, setTotalWater] = useState([]);

  const {cookies, setLoading} = useUserContext();

  useEffect(() => {
    if (!checkYear || !cookies?.code_room?._id) return;
    (async () => {
      setLoading(true);
      const results = await Promise.all([
        getBillServiceByYear(cookies?.code_room._id, 'nuoc', checkYear),
        getBillServiceByYear(cookies?.code_room._id, 'dien', checkYear),
      ]);
      if (results[0].data.data) {
        setTotalWater(results[0].data.data);
      }
      if (results[1].data?.data) {
        setTotalElictric(results[1].data.data);
      }
      setLoading(false);
    })();
  }, [cookies?.code_room?._id, checkYear, setLoading]);

  return (
    <div className="w-full gap-4 flex flex-col ">
      <header className="bg-white shadow border rounded-md">
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate uppercase">
                Bảng thống kê
              </h2>
            </div>
          </div>
        </div>
      </header>
      <div>
        <label
          className="block text-gray-700 text-sm font-bold"
          htmlFor="username">
          Chọn năm thống kê
        </label>
        <select
          className="mt-2 shadow appearance-none border rounded w-[10%] 2xs:w-[20%] xs:w-[20%] s:w-[20%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="status"
          onChange={data => setCheckYear(parseInt(data.target.value))}>
          {Array.from(new Array(10), (_, index) => (
            <option key={index} value={new Date().getFullYear() - index}>
              {new Date().getFullYear() - index}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full flex gap-y-4 lg:flex-nowrap lg:gap-4 xl:flex-nowrap flex-wrap">
        <div className="w-[100%] lg:w-[50%] xl:w-[50%] bg-white shadow border rounded-md p-2">
          <BarDien data={totalElictic} />
        </div>
        <div className="w-[100%] lg:w-[50%] xl:w-[50%] bg-white shadow border rounded-md p-2">
          <BarNuoc dataNuoc={totalWater} />
        </div>
      </div>
    </div>
  );
};

export default Ternant;
