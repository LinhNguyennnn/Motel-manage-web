import React, {useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {DatePicker, Select} from 'antd';
import {useRouter} from 'next/router';
import moment from 'moment';

import {CreateBillHouseAll, CreateBillRooms} from 'src/pages/api/bill';
import {useUserContext} from '@/context/UserContext';
import {listRoom} from 'src/pages/api/room';
import {Toast} from 'src/hooks/toast';

type FormInputs = {
  idHouse: string;
  month: number;
  year: number;
  name: string;
};

type Props = {
  onclose: () => void;
  data: () => void;
};

const {Option} = Select;

const today = new Date();

const AddBill: React.FC<Props> = props => {
  const [rooms, setRooms] = useState([]);
  const [roomsBillId, setRoomsBillId] = useState(['']);
  const [rooms1, setRooms1] = useState();

  const {setLoading, cookies} = useUserContext();
  const userData = cookies?.user;
  const [monthCheck, setMonth] = useState(today.getMonth() + 1);
  const [yearCheck, setYear] = useState(today.getFullYear());
  const router = useRouter();
  const {id} = router.query;

  useEffect(() => {
    if (id && userData) {
      (async () => {
        setLoading(true);
        const {data} = await listRoom(id, userData);
        if (data.data) {
          setRooms(data.data);
        }
        setLoading(false);
      })();
    }
  }, [userData, id, setLoading]);

  const {register, handleSubmit, reset} = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = async (data: any) => {
    if (monthCheck && yearCheck) {
      setLoading(true);
      if (rooms1 !== '2') {
        await CreateBillHouseAll({
          ...data,
          month: monthCheck,
          year: yearCheck,
          userData: userData,
        })
          .then(() => {
            Toast('success', 'Tạo hóa đơn thành công');
            props.onclose();
            props.data();
          })
          .catch((error: any) => {
            Toast('error', error?.response?.data?.message);
            props.onclose();
          })
          .finally(() => {
            setLoading(false);
            props.data();
          });
      } else {
        await CreateBillRooms({
          month: monthCheck,
          year: yearCheck,
          userData: userData,
          idRooms: roomsBillId,
        })
          .then(() => {
            Toast('success', 'Tạo hóa đơn thành công');
            props.onclose();
            props.data();
          })
          .finally(() => {
            setLoading(false);
            props.data();
          });
      }
    } else {
      Toast('error', 'Vui lòng chọn tháng năm!');
    }
  };
  const handleChange = (value: string[]) => {
    setRoomsBillId(value);
  };

  return (
    <div>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="luuy">
          <div className="font-bold">Lưu ý:</div>
          <small>
            Tất cả các hóa đơn chỉ được tính theo khi phòng đó có người (có
            nghĩa là khi phòng đó đang trong trạng thái hoạt động).
            <br />
            Khi tính lại hóa đơn thì tất cả các khoản tiền đã trả sẽ trở lại là
            0 để đảm bảo tính toán chuẩn xác và tính tiền hóa đơn cho tháng sau.
            <br />
            Nếu chỉ muốn tính lại 1 phòng hoặc một vài phòng, chúng ta có thể
            chọn Tính tiền và chọn Tính hóa đơn theo phòng.
            <br />
          </small>
          <div className="text-red-500">
            Dữ liệu cũ không thể phục hồi nên bạn hãy cần trọng trước khi tính
            lại hóa đơn
          </div>
        </div>
        <div className="mt-5">
          <label
            htmlFor="small"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
            Tháng/Năm
          </label>
          <DatePicker
            style={{width: '200px'}}
            onChange={(_, dateString) => {
              setMonth(parseInt(dateString.slice(5, 7)));
              setYear(parseInt(dateString.slice(0, 4)));
              reset();
            }}
            defaultValue={moment(`${yearCheck}-${monthCheck}`, 'YYYY-MM')}
            picker="month"
            allowClear={false}
          />
        </div>
        <div className="mt-5 mb-2">
          <label
            htmlFor="small"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
            Tính Hóa đơn theo
          </label>
          <select
            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('idHouse', {required: true})}
            onChange={(e: any) => setRooms1(e.target.value)}>
            <option value={id}>Tính tất cả các phòng</option>
            <option value="2">Tính theo phòng</option>
          </select>
        </div>

        {rooms1 == '2' && (
          <Select
            className="mt-4"
            mode="multiple"
            allowClear
            style={{width: '100%'}}
            placeholder="Chọn phòng"
            onChange={handleChange}>
            {rooms &&
              rooms.map((item: any, index: number) => {
                if (item.status && item.listMember.length) {
                  return (
                    <Option key={index} value={item._id}>
                      {item.name}
                    </Option>
                  );
                }
              })}
          </Select>
        )}
        <div className="flex items-center mt-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit">
            Tính tiền
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBill;
