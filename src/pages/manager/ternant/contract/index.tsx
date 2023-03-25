import React, {useState, useEffect} from 'react';
import {Image} from 'antd';

import {useUserContext} from '@/context/UserContext';
import {readRoomData} from 'src/pages/api/room';

const ContractTernant: React.FC = () => {
  const [roomData, setRoomData] = useState<any>();

  const {cookies, setLoading} = useUserContext();

  useEffect(() => {
    if (cookies?.code_room?._id) {
      (async () => {
        setLoading(true);
        const {data} = await readRoomData(cookies.code_room._id);
        setRoomData(data.data);
        setLoading(false);
      })();
    }
  }, [cookies?.code_room?._id, setLoading]);

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate uppercase">
                Hình ảnh hợp đồng
              </h2>
            </div>
          </div>
        </div>
      </header>
      <main className="text-center mt-10">
        {roomData?.contract?.imageContract?.length ? (
          <div className="flex gap-4 flex-wrap justify-center">
            {roomData?.contract?.imageContract.map(
              (item: any, index: number) => (
                <Image key={index} style={{width: 400}} src={item} alt="" />
              ),
            )}
          </div>
        ) : (
          <div>
            <h2 className="uppercase text-2xl">Không có ảnh hợp đồng</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContractTernant;
