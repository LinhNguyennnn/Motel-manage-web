import React, {useCallback, useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useRouter} from 'next/router';

import {useUserContext} from '@/context/UserContext';
import {updateRoom} from 'src/pages/api/room';
import {Toast} from 'src/hooks/toast';

type Props = {
  id: any;
  idRoom: any;
  userData: any;
  dataRoom: any;
};
type FormInputs = {
  service: {
    status: boolean;
    name: string;
    price: number;
  }[];
};

const TabService: React.FC<Props> = ({
  id,
  idRoom,
  userData,
  dataRoom,
}: Props) => {
  const {register, handleSubmit, reset} = useForm<FormInputs>();
  const {setLoading} = useUserContext();
  const [idHouse] = useState(id);
  const [idRooms] = useState(idRoom);
  const router = useRouter();

  const getDataRoom = useCallback(() => {
    if (dataRoom) {
      reset(dataRoom);
    }
  }, [reset, dataRoom]);

  useEffect(() => {
    getDataRoom();
  }, [getDataRoom]);

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    setLoading(true);
    try {
      const dataService = await updateRoom({
        ...dataRoom,
        service: data.service,
        idRoom: idRoom,
        token: userData?.token,
      });
      if (dataService) {
        Toast('success', 'Lưu dịch vụ thành công');
        getDataRoom();
        router.push(`/manager/landlord/${idHouse}/list-room/${idRooms}`);
      }
    } catch (error) {
      Toast('error', 'Lưu dịch vụ phòng thành công');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full ">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <form action="" onSubmit={handleSubmit(onSubmit)}>
                <table className="min-w-full divide-y divide-gray-200 2xs:snap-always">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-9  w-[10%] py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th
                        scope="col"
                        className="2xs:w-[70%] px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên
                      </th>

                      <th
                        scope="col"
                        className="2xs:hidden px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá
                      </th>
                      <th
                        scope="col"
                        className="2xs:hidden px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đơn vị
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* {data?.map((item: any, index: any) => {
                                                if (item?.name == "nuoc" || item?.name == "dien") {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="px-9 py-4 whitespace text-sm text-gray-500">
                                                                <div className="text-center">
                                                                    <input checked type="checkbox" {...register(`service.${index}.status`, { required: false })} />
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace">
                                                                <div className="text-center">{item?.label}
                                                                    <input type="text" value={item?.label} className='hidden' {...register(`service.${index}.name`, { required: true })} />
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace 2xs:hidden ">
                                                                <div className="text-center">{item?.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                                    <input type="text" value={item?.price} className='hidden' {...register(`service.${index}.price`, { required: true })} />
                                                                </div>
                                                            </td>
                                                            <td className="2xs:hidden px-6 py-4 whitespace">
                                                                <div className="text-center">{item?.unit}</div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="px-9 py-4 whitespace text-sm text-gray-500">
                                                                <div className="text-center">
                                                                    <input type="checkbox" {...register(`service.${index}.status`, { required: false })} />
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace">
                                                                <div className="text-center">{item?.label}
                                                                    <input type="text" value={item?.label} className='hidden' {...register(`service.${index}.name`, { required: true })} />
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace 2xs:hidden ">
                                                                <div className="text-center">{item?.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                                    <input type="text" value={item?.price} className='hidden' {...register(`service.${index}.price`, { required: true })} />
                                                                </div>
                                                            </td>
                                                            <td className="2xs:hidden px-6 py-4 whitespace">
                                                                <div className="text-center">{item?.unit}</div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })} */}
                    {dataRoom?.service?.map((service: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td className="px-9 py-4 whitespace text-sm text-gray-500">
                            <div className="text-center">
                              <input
                                type="checkbox"
                                {...register(`service.${index}.status`, {
                                  required: false,
                                })}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace">
                            <div className="text-center">
                              {service?.label}
                              <input
                                type="text"
                                value={service?.label}
                                className="hidden"
                                {...register(`service.${index}.name`, {
                                  required: true,
                                })}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace 2xs:hidden ">
                            <div className="text-center">
                              {service?.price?.toLocaleString('it-IT', {
                                style: 'currency',
                                currency: 'VND',
                              })}
                              <input
                                type="text"
                                value={service?.price}
                                className="hidden"
                                {...register(`service.${index}.price`, {
                                  required: true,
                                })}
                              />
                            </div>
                          </td>
                          <td className="2xs:hidden px-6 py-4 whitespace">
                            <div className="text-center">
                              {service?.type
                                ? 'Trả theo số lượng sử dụng.'
                                : 'Trả theo tháng'}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <button
                  type="submit"
                  className="ml-4 text-white bg-blue-400 from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-4 mt-4 float-right">
                  Lưu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabService;
