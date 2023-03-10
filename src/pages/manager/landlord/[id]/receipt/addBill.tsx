import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import 'react-responsive-modal/styles.css';
import 'antd/dist/antd.css';
import type { DatePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import moment from 'moment';
import { useUserContext } from '@/context/UserContext';
import { Toast } from 'src/hooks/toast';
import { CreateBillHouseAll, CreateBillRooms } from 'src/pages/api/bill';
import { listRoom } from 'src/pages/api/room';
import { useRouter } from 'next/router';
import { listHouse } from 'src/pages/api/house';
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

const AddBill = (props: Props) => {
  const today = new Date();
  const [rooms, setRooms] = useState([]);
  const [roomsBillId, setRoomsBillId] = useState(['']);
  const [rooms1, setRooms1] = useState();

  const { setLoading, cookies } = useUserContext();
  const userData = cookies?.user;
  const [monthCheck, setMonth] = useState(today.getMonth() + 1);
  const [yearCheck, setYear] = useState(today.getFullYear());
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const getRoom = async () => {
      try {
        const { data } = await listRoom(id, userData as any);

        if (data.data) {
          setRooms(data.data as any);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    getRoom();
  }, [userData, id]);

  const { register, handleSubmit, setValue, getValues, reset } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = async (data: any) => {

    if (monthCheck && yearCheck) {
      const newData = { ...data, month: monthCheck, year: yearCheck, userData: userData };
      const newDataRooms = { month: monthCheck, year: yearCheck, userData: userData, idRooms: roomsBillId };
      setLoading(true);
      if (rooms1 !== '2') {
        await CreateBillHouseAll(newData).then(() => {
          Toast('success', 'T???o h??a ????n th??nh c??ng');
          setLoading(false);
          props.onclose();
          props.data();
        }).finally(() => {
          props.data();
        })
          .catch((error: any) => {
            Toast('error', error?.response?.data?.message);
            props.onclose();
            setLoading(false);
          });
      } else {
        await CreateBillRooms(newDataRooms).then(() => {
          Toast('success', 'T???o h??a ????n th??nh c??ng');
          props.onclose();
          props.data();
        }).finally(() => {
          props.data();
        })
          .catch((error: any) => {
            setLoading(false);
          });
      }
    } else {
      Toast('error', 'Vui l??ng ch???n th??ng n??m!');
    }
  };
  const handleChange = (value: string[]) => {
    setRoomsBillId(value);
  };
  const datePickerShow = React.useMemo(() => {
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
      setMonth(parseInt(dateString.slice(5, 7)));
      setYear(parseInt(dateString.slice(0, 4)));
      reset();
    };
    return (
      <DatePicker
        style={{ width: '200px' }}
        onChange={onChange}
        defaultValue={moment(`${yearCheck}-${monthCheck}`, 'YYYY-MM')}
        picker="month"
      />
    );
  }, [monthCheck, reset, yearCheck]);
  const { Option } = Select;
  return (
    <div>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="luuy">
          <div className="font-bold">
            L??u ??:
          </div>
          <small>
            T???t c??? c??c h??a ????n ch??? ???????c t??nh theo khi ph??ng ???? c?? ng?????i (c?? ngh??a l?? khi ph??ng ???? ??ang trong tr???ng th??i ho???t ?????ng).
            <br />
            Khi t??nh l???i h??a ????n th?? t???t c??? c??c kho???n ti???n ???? tr??? s??? tr??? l???i l?? 0 ????? ?????m b???o t??nh to??n chu???n x??c v?? t??nh ti???n h??a ????n cho th??ng sau.
            <br />
            N???u ch??? mu???n t??nh l???i 1 ph??ng ho???c m???t v??i ph??ng, ch??ng ta c?? th??? ch???n T??nh ti???n v?? ch???n T??nh h??a ????n theo ph??ng.
            <br />
          </small>
          <div className="text-red-500">
            D??? li???u c?? kh??ng th??? ph???c h???i n??n b???n h??y c???n tr???ng tr?????c khi t??nh l???i h??a ????n
          </div>
        </div>
        <div className="mt-5">
          <label htmlFor="small" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
            Th??ng/N??m
          </label>
          <Space direction="vertical">{datePickerShow}</Space>
        </div>
        <div className="mt-5 mb-2">
          <label htmlFor="small" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
            T??nh H??a ????n theo
          </label>
          <select
            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('idHouse', { required: true })}
            onChange={(e: any) => setRooms1(e.target.value)}
          >
            <option value={id}>T??nh t???t c??? c??c ph??ng</option>
            <option value="2">T??nh theo ph??ng</option>
          </select>
        </div>

        {rooms1 == '2' && (
          <Select
            className="mt-4"
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Ch???n ph??ng"
            onChange={handleChange}
          >
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
            type="submit"
          >
            T??nh ti???n
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBill;
