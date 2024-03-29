import React, {useEffect, useState} from 'react';
import Modal from 'react-responsive-modal';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {NumericFormat} from 'react-number-format';
import {Controller, useForm} from 'react-hook-form';
import {useRouter} from 'next/router';
import moment from 'moment';

import {createBooking, deleteBooking, listBooking} from 'src/pages/api/booking';
import {useUserContext} from '@/context/UserContext';
import {listRoom} from 'src/pages/api/room';
import {Toast} from 'src/hooks/toast';
import AddBooking from './addBooking';

const today = new Date();

const Booking: React.FC = () => {
  const [open, setOpen] = useState(false);
  const onCloseModal = () => setOpen(false);
  const onOpenModal = () => setOpen(true);
  const {cookies, setLoading} = useUserContext();
  const userData = cookies?.user;
  const router = useRouter();
  const param = router.query;
  const id = param.id;
  const [listRooms, setListRooms] = useState<any>();

  const date = moment(today).format('YYYY-MM-DD');

  const [fillter, setfillter] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {errors},
  } = useForm<any>();

  const handleSearch = (event: any) => {
    const value = event.target.value;
    setfillter(value);
  };
  const [listBookings, setListBookings] = useState<any>({});

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        const results = await Promise.all([
          listBooking(userData, id),
          listRoom(id, userData),
        ]);
        if (results[0].data) {
          setListBookings(results[0].data.data);
        }
        if (results[1].data) {
          setListRooms(results[1].data.data);
        }
        setLoading(false);
      })();
    }
  }, [id, setLoading, userData]);

  const onHandleRemove = async (id: any) => {
    const confirm = window.confirm('Bạn có chắc chắn muốn xóa không?');
    if (confirm) {
      setLoading(true);
      await deleteBooking(id, userData)
        .then((result: any) => {
          setListBookings(
            listBookings.filter((item: {_id: any}) => item._id !== id),
          );
          Toast('success', result?.data?.message);
        })
        .catch(err => {
          Toast('error', err?.response?.data?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const onSubmit = async (data1: any) => {
    if (id) {
      const newData = {
        ...data1,
        bookMoney: Number(data1.bookMoney),
        userData: userData,
      };
      try {
        if (data1.expectTime < date) {
          Toast('error', 'Ngày tháng phải lớn hơn  thời gian hiện tại');
        } else {
          const {data} = await createBooking(newData);
          const daata = data.data;
          setListBookings([...listBookings, daata]);
          setOpen(false);
          reset();
          Toast('success', 'Đặt tiền cọc thành công');
        }
      } catch (error: any) {
        Toast('error', error?.response?.data?.message);
      }
    }
  };

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate uppercase">
                Đặt cọc
              </h2>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4 items-center">
              <div className="mr-[20px]">
                <form>
                  <input
                    type="text"
                    name="keyword"
                    className="text-black shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Tìm kiếm..."
                    onChange={handleSearch}
                    value={fillter}
                  />
                </form>
              </div>
              <button
                onClick={onOpenModal}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Đặt cọc
              </button>
            </div>
          </div>
        </div>
      </header>
      <div>
        <div className="flex flex-col border bg-white mt-3">
          <div className="overflow-x-auto ">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        STT
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        Họ và tên
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        Email
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        Số điện thoại
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        Tiền cọc
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        Ngày nhận phòng
                      </th>
                    </tr>
                  </thead>
                  <tbody className=" ">
                    {listBookings?.length > 0 ? (
                      listBookings
                        .filter((val: any) => {
                          if (fillter == '') {
                            return val;
                          } else if (
                            val.fullName
                              .toLocaleLowerCase()
                              .includes(fillter.toLowerCase())
                          ) {
                            return val;
                          }
                        })
                        .map((item: any, index: number) =>
                          item.expectTime == date ? (
                            <tr
                              key={index}
                              className=" border-yellow-500 border-2 ">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {index + 1}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.fullName}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.email}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.phoneNumber}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.bookMoney.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.expectTime}
                              </td>
                              <td className="flex pt-2">
                                <div>
                                  <AddBooking
                                    item1={item._id}
                                    item2={item.idRoom}
                                    deposit={item.bookMoney}></AddBooking>
                                </div>
                                <div>
                                  <button
                                    type="submit"
                                    className="flex focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    onClick={() => onHandleRemove(item._id)}>
                                    <span className="pr-2"> Xóa</span>
                                    <FontAwesomeIcon
                                      className="h-[15px] pt-1"
                                      icon={faTrash}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr key={index} className="border-b">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {index + 1}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.fullName}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.email}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.phoneNumber}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.bookMoney.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {item.expectTime}
                              </td>
                              <td className="flex pt-2">
                                <div>
                                  <AddBooking
                                    item1={item._id}
                                    item2={item.idRoom}
                                    deposit={item.bookMoney}></AddBooking>
                                </div>
                                <div>
                                  <button
                                    type="submit"
                                    className=" flex focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    onClick={() => onHandleRemove(item._id)}>
                                    <span className="pr-2"> Xóa</span>
                                    <FontAwesomeIcon
                                      className="h-[15px] pt-1"
                                      icon={faTrash}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ),
                        )
                    ) : (
                      <tr className="text-red-500 p-5">
                        <td className="p-5">Không có dữ liệu</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={onCloseModal} center>
        <div className="w-full">
          <div className="grid grid-flow-col px-4 py-2 text-white bg-cyan-500 mt-6">
            <div className="">
              <h2 className="pt-2 text-xl">Thông tin </h2>
            </div>
          </div>
          <div className="border mt-5 p-2">
            <form className="w-full " onSubmit={handleSubmit(onSubmit)}>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/5">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="inline-full-name">
                    Họ và tên
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="inline-full-name"
                    type="text"
                    placeholder="Xin mời nhập họ và tên"
                    {...register('fullName', {required: true, minLength: 3})}
                  />
                  {errors.fullName?.type === 'required' && (
                    <span className="text-[red] mt-1 block">
                      Vui lòng nhập họ và tên!
                    </span>
                  )}
                  {errors.fullName?.type === 'minLength' && (
                    <span className="text-[red] mt-1 block">
                      Họ và tên tối thiểu 3 ký tự!
                    </span>
                  )}
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/5">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="inline-full-name">
                    Phòng
                  </label>
                </div>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                    {...register('idRoom')}>
                    {listRooms?.map((item: any, index: number) => {
                      if (item?.status === true && !item?.listMember?.length) {
                        return (
                          <option key={index} value={item._id}>
                            {item.name}
                          </option>
                        );
                      }
                    })}
                    <option value={0}>Không còn phòng nào</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="md:flex md:items-center mb-6 ">
                <div className="hidden">
                  <div className="md:w-1/5">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      htmlFor="inline-password">
                      Nhà
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id="inline-password"
                      type="text"
                      value={id}
                      {...register('idHouse', {required: true})}
                    />
                  </div>
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/5">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="inline-password">
                    Email
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="inline-password"
                    type="email"
                    placeholder="Xin mời nhập email"
                    {...register('email', {
                      required: true,
                      pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    })}
                  />
                  {errors.email?.type === 'required' && (
                    <span className="text-[red] mt-1 block">
                      Vui lòng nhập địa chỉ email!
                    </span>
                  )}
                  {errors.email?.type === 'pattern' && (
                    <span className="text-[red] mt-1 block">
                      Địa chỉ email không đúng định dạng!
                    </span>
                  )}
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/5">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="inline-full-name">
                    Số điện thoại
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="inline-full-name"
                    type="text"
                    placeholder="Xin mời nhập số điện thoại"
                    {...register('phoneNumber', {
                      required: true,
                      minLength: 10,
                      maxLength: 10,
                      pattern: /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/,
                    })}
                  />
                  {errors.phoneNumber?.type === 'required' && (
                    <span className="text-[red] mt-1 block">
                      Vui lòng nhập số điện thoại!
                    </span>
                  )}
                  {errors.phoneNumber?.type === 'minLength' && (
                    <span className="text-[red] mt-1 block">
                      Số điện thoại không đúng định dạng!
                    </span>
                  )}
                  {errors.phoneNumber?.type === 'maxLength' && (
                    <span className="text-[red] mt-1 block">
                      Số điện thoại không đúng định dạng!
                    </span>
                  )}
                  {errors.phoneNumber?.type === 'pattern' && (
                    <span className="text-[red] mt-1 block">
                      Số điện thoại không đúng định dạng!
                    </span>
                  )}
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/5">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="inline-full-name">
                    CMND/CCCD
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="inline-full-name"
                    type="text"
                    placeholder="Xin mời nhập CCCD hoặc CMND"
                    {...register('cardNumber', {
                      minLength: 9,
                      maxLength: 12,
                      pattern: /^[0-9]+$/,
                    })}
                  />
                  {errors.cardNumber?.type === 'minLength' && (
                    <span className="text-[red] mt-1 block">
                      Số CCCD hoặc CMND không đúng dịnh dạng!
                    </span>
                  )}
                  {errors.cardNumber?.type === 'maxLength' && (
                    <span className="text-[red] mt-1 block">
                      Số CCCD hoặc CMND không đúng dịnh dạng!
                    </span>
                  )}
                  {errors.cardNumber?.type === 'pattern' && (
                    <span className="text-[red] mt-1 block">
                      Số CCCD hoặc CMND không đúng dịnh dạng!
                    </span>
                  )}
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/5">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="inline-full-name">
                    Tiền cọc
                  </label>
                </div>
                <div className="md:w-2/3">
                  <Controller
                    control={control}
                    name="bookMoney"
                    rules={{
                      required: true,
                      min: 0,
                    }}
                    render={({field: {onChange, name, value}}) => (
                      <NumericFormat
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        type="text"
                        placeholder="Xin mời nhập số tiền cọc"
                        name={name}
                        value={value}
                        thousandSeparator=","
                        onChange={e => {
                          onChange(Number(e.target.value.split(',').join('')));
                        }}
                      />
                    )}
                  />
                  {errors.bookMoney?.type === 'required' && (
                    <span className="text-[red] mt-1 block">
                      Vui lòng nhập tiền cọc!
                    </span>
                  )}
                  {errors.bookMoney?.type === 'min' && (
                    <span className="text-[red] mt-1 block">
                      Số tiền cọc không được nhỏ hơn 0!
                    </span>
                  )}
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/5">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="inline-full-name">
                    Thời gian
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="inline-full-name"
                    type="date"
                    {...register('expectTime', {required: true})}
                  />
                  {errors.expectTime?.type === 'required' && (
                    <span className="text-[red] mt-1 block">
                      Vui lòng chọn thời gian nhận phòngc!
                    </span>
                  )}
                </div>
              </div>
              <div className="text-center">
                <button
                  className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                  type="submit">
                  Đặt cọc
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Booking;
