import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '@/context/UserContext';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DatePicker, Space } from 'antd';
import type { DatePickerProps } from 'antd';
import 'antd/dist/antd.css';
import { createAllBillForHouse, getAllBillForHouse } from 'src/pages/api/billService';
import { listRoom } from 'src/pages/api/room';
import { Toast } from 'src/hooks/toast';
import moment from 'moment';
import { getInfoService } from 'src/pages/api/service';

type FormInputs = {
  name: string;
  idHouse: string;
  month: number;
  year: number;
  data: {
    idRoom: string;
    inputValue: number;
    outputValue: number;
  }[];
};

type ServiceI = {
  idHouse: string;
  label: string;
  name: string;
  price: number;
  type: boolean;
  unit: string;
  _id: string;
};

const LisElectric = () => {
  const today = new Date();
  const [listRoomData, setListRoomData] = useState<any>([]);
  const { cookies, setLoading } = useUserContext();
  const [listBillData, setListBillData] = useState<any>([]);

  const [monthCheck, setMonth] = useState(today.getMonth() + 1);
  const [yearCheck, setYear] = useState(today.getFullYear());
  const [serviceData, setServiceData] = useState<ServiceI>();

  const [inputVs, setInputVs] = useState(0);
  const [outputVs, setOutputVs] = useState(0);

  const userData = cookies?.user;
  const router = useRouter();
  const { id } = router.query;
  const NameBuild = 'dien';
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormInputs>();

  useEffect(() => {
    const getServiceData = async () => {
      setLoading(true);
      if (id) {
        await getInfoService(id, NameBuild)
          .then((result) => {
            setLoading(false);
            setServiceData(result.data.data);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    };
    getServiceData();
  }, [id, NameBuild]);

  useEffect(() => {
    const getListBillData = async () => {
      setLoading(true);
      if (id) {
        await getAllBillForHouse(NameBuild, monthCheck, yearCheck, id)
          .then((result) => {
            setListBillData(result.data.docs as any);
            setLoading(false);
            if (result.data.docs) {
            }
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    };
    getListBillData();
  }, [NameBuild, id, monthCheck, setLoading, yearCheck]);

  const useWater = outputVs - inputVs;

  useEffect(() => {
    const getListRoom = async () => {
      setLoading(true);
      if (id) {
        await listRoom(id, userData)
          .then((result) => {
            const newListRoomData = result?.data?.data.map((item: any) => {
              return {
                amount: 0,
                idHouse: item.idHouse,
                idRoom: item._id,
                month: monthCheck,
                year: yearCheck,
                name: NameBuild,
                price: serviceData?.price,
                unit: serviceData?.unit,
                inputValue: 0,
                outputValue: 0,
                nameRoom: item.name,
              };
            });
            setListRoomData(newListRoomData);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    };
    getListRoom();
  }, [id, monthCheck, serviceData?.price, serviceData?.unit, userData, yearCheck, NameBuild]);

  useEffect(() => {
    if (listBillData.length) {
      setValue('data', listBillData);
    } else {
      setValue('data', listRoomData);
    }
  }, [listBillData, listRoomData]);

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    if (monthCheck && yearCheck) {
      const confirm = window.confirm(
        'Vui l??ng ki???m tra l???i s??? ??i???n m???i c???a c??c ph??ng trong th??ng n??y ???? nh???p ????ng ch??a. N???u ch??a ????ng vui l??ng b???m v??o cancel v?? s???a l???i tr?????c khi l??u. N???u ????ng r???i m???i b???n b???m ok ????? l??u s??? ??i???n th??ng n??y.',
      );
      if (confirm) {
        const newData = { ...data, month: monthCheck, year: yearCheck, idHouse: id, name: NameBuild };
        setLoading(true);
        await createAllBillForHouse(newData)
          .then((data: any) => {
            setLoading(false);
            Toast('success', 'Th??m s??? ??i???n c??c ph??ng th??nh c??ng');
          })
          .catch((error) => {
            Toast('error', 'Th??m s??? ??i???n c??c ph??ng kh??ng th??nh c??ng');
            setLoading(false);
          });
      }
    } else {
      Toast('error', 'Vui l??ng ch???n th??ng n??m!');
    }
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

  return (
    <div className="h-screen">
      <header className="bg-white shadow">
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate uppercase">
                Ch??? s??? ??i???n
              </h2>
            </div>
          </div>
        </div>
        <div className="relative max-w-full">
          <div className="flex mt-3 flex-wrap">
            <div className="w-full md:w-3/12 px-4">
              <div className="relative w-full mb-3 flex flex-wrap items-center gap-3">
                <div className="w-[30%] block uppercase text-blueGray-600 text-sm font-bold">Th??ng/n??m</div>
                <div className="block">
                  <Space direction="vertical">{datePickerShow}</Space>
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-6 border-1 borderlueGray-300" />
          <nav className="my-4 mx-4 pb-4">
            <h2 className="text-center">S??? ??i???n th??ng: {monthCheck}</h2>
            <h3 className="text-xl">L??u ??:</h3>
            <span className="block">
              - B???n ph???i g??n d???ch v??? thu???c lo???i ??i???n cho kh??ch thu?? tr?????c th?? ph???n ch??? s??? n??y m???i ???????c t??nh cho ph??ng ????
              khi t??nh ti???n.
            </span>
            <span className="block">
              - ?????i v???i l???n ?????u ti??n s??? d???ng ph???n m???m b???n s??? ph???i nh???p ch??? s??? c?? v?? m???i cho th??ng s??? d???ng ?????u ti??n, c??c
              th??ng ti???p theo ph???n m???m s??? t??? ?????ng l???y ch??? s??? m???i th??ng tr?????c l??m ch??? s??? c?? th??ng sau.
            </span>
            <span className="block">- B???n ph???i nh???p ch??? s??? ??i???n m???i ph???i l???n h??n ch??? s??? ??i???n c??.</span>
          </nav>
        </div>
      </header>
      <main>
        <div className="max-w-full mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <form onSubmit={handleSubmit(onSubmit)} className="">
                    <div className="table min-w-full divide-y divide-gray-200">
                      <div className="bg-gray-50 table-header-group">
                        <div className="table-row divide-y divide-x">
                          <div className="table-cell px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ph??ng
                          </div>
                          <div className="table-cell px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            S??? ??i???n c??
                          </div>
                          <div className="table-cell px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            S??? ??i???n m???i
                          </div>
                          <div className="table-cell px-9 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            S??? ??i???n s??? d???ng
                          </div>
                        </div>
                      </div>
                      {listBillData?.length >= 1 && (
                        <div className="bg-white divide-y divide-gray-200 table-footer-group">
                          {listBillData &&
                            listBillData.map((item: any, index: any) => {
                              return (
                                <div className="table-row divide-y divide-x" key={listBillData._id}>
                                  <div className="table-cell border-t px-4 py-4 whitespace">
                                    <p className="text-center">{item.nameRoom}</p>
                                  </div>
                                  <div className="hidden ml-2 text-center w-[90%]">
                                    <input
                                      {...register(`data.${index}.idRoom`, {
                                        required: true,
                                      })}
                                      className="font-bold w-full flex border-0 px-2 py-2 placeholder-blueGray-300 text-red-900 bg-gray-200  rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                      type="text"
                                    />
                                  </div>
                                  <div className="table-cell px-4 py-4 whitespace">
                                    <input
                                      type="number"
                                      defaultValue={0}
                                      id="inputValue"
                                      className="font-bold w-full flex border-0 px-2 py-2 placeholder-blueGray-300 bg-gray-200  rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                      {...register(`data.${index}.inputValue`, {
                                        required: true,
                                        min: 0,
                                        valueAsNumber: true,
                                        minLength: 0,
                                        onChange(e) {
                                          setInputVs(parseInt(e.target.value));
                                        },
                                      })}
                                    />
                                    {getValues(`data.${index}.inputValue`) < 0 && (
                                      <div className="text-rose-600">
                                        <p role="alert">S??? ??i???n c?? ph???i l???n h??n 0!</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="table-cell px-4 py-4 whitespace">
                                    <input
                                      defaultValue={0}
                                      type="number"
                                      className="font-bold w-full flex border-0 px-2 py-2 placeholder-blueGray-300 bg-gray-200  rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                      {...register(`data.${index}.outputValue`, {
                                        required: true,
                                        min: getValues(`data.${index}.inputValue`),
                                        valueAsNumber: true,
                                        onChange(e) {
                                          setOutputVs(parseInt(e.target.value));
                                        },
                                      })}
                                    />
                                    {getValues(`data.${index}.outputValue`) < 0 && (
                                      <p className="text-rose-600" role="alert">
                                        S??? ??i???n m???i ph???i l???n h??n 0!
                                      </p>
                                    )}
                                    {getValues(`data.${index}.outputValue`) < getValues(`data.${index}.inputValue`) ? (
                                      <div className="text-rose-600">S??? ??i???n m???i ph???i l???n h??n ho???c b???ng s??? ??i???n c??!</div>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                  <div className="table-cell px-4 py-4 whitespace">
                                    <div className="text-center">
                                      {getValues(`data.${index}.outputValue`) - getValues(`data.${index}.inputValue`)}
                                      {' '}KWH
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}

                      {listBillData?.length == 0 && listRoomData && (
                        <div className="bg-white divide-y divide-gray-200 table-footer-group">
                          {listRoomData &&
                            listRoomData.map((item: any, index: any) => {
                              const getInputValue = getValues(`data.${index}.inputValue`);
                              const getOuputValue = getValues(`data.${index}.outputValue`);
                              return (
                                <div className="table-row divide-y divide-x" key={listBillData._id}>
                                  <div className="table-cell border-t px-4 py-4 whitespace">
                                    <p className="text-center">{item.nameRoom}</p>
                                  </div>
                                  <div className="hidden ml-2 text-center w-[90%]">
                                    <input
                                      {...register(`data.${index}.idRoom`, {
                                        required: true,
                                      })}
                                      className="font-bold w-full flex border-0 px-2 py-2 placeholder-blueGray-300 text-red-900 bg-gray-200  rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                      type="text"
                                    />
                                  </div>
                                  <div className="table-cell px-4 py-4 whitespace">
                                    <input
                                      type="number"
                                      defaultValue={0}
                                      id="inputValue"
                                      className="font-bold w-full flex border-0 px-2 py-2 placeholder-blueGray-300 bg-gray-200  rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                      {...register(`data.${index}.inputValue`, {
                                        required: true,
                                        min: 0,
                                        valueAsNumber: true,
                                        onChange(e) {
                                          setInputVs(parseInt(e.target.value));
                                        },
                                      })}
                                    />
                                    {getInputValue < 0 && (
                                      <p role="alert">S??? ??i???n c?? ph???i l???n h??n 0!</p>
                                    )}
                                  </div>
                                  <div className="table-cell px-4 py-4 whitespace">
                                    <input
                                      type="number"
                                      defaultValue={0}
                                      className="font-bold w-full flex border-0 px-2 py-2 placeholder-blueGray-300 bg-gray-200  rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                                      {...register(`data.${index}.outputValue`, {
                                        required: true,
                                        min: getInputValue,
                                        valueAsNumber: true,
                                        onChange(e) {
                                          setOutputVs(parseInt(e.target.value));
                                        },
                                      })}
                                    />
                                    {getOuputValue < 0 && <p role="alert">S??? ??i???n m???i ph???i l???n h??n 0</p>}
                                    {getOuputValue < getInputValue && <div className="text-rose-600">S??? ??i???n m???i ph???i l???n h??n ho???c b???ng s??? ??i???n c??!</div>}
                                  </div>
                                  <div className="table-cell px-4 py-4 whitespace">
                                    <div className="text-center">
                                      {getOuputValue - getInputValue < 0 ? 0 : getOuputValue - getInputValue}
                                      {' '} KWH
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                    <div className="w-full flex items-center min-h-[80px] justify-end bg-white border">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 mr-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        L??u
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LisElectric;
