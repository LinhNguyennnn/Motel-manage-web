import React, {useEffect, useState} from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';

import {createPaymentInTenant} from 'src/pages/api/payment';
import {useUserContext} from '@/context/UserContext';
import {getBillIdRoom} from 'src/pages/api/bill';

const InfoReceipt: React.FC = () => {
  const [bills, setBills] = useState<any>([]);
  const today = new Date();
  const [monthCheckk, setMonthh] = useState(today.getMonth() + 1);
  const [yearCheckk, setYearr] = useState(today.getFullYear());

  const {cookies, setLoading} = useUserContext();

  useEffect(() => {
    if (cookies?.code_room?._id) {
      (async () => {
        setLoading(true);
        const {data} = await getBillIdRoom(
          cookies.code_room._id,
          yearCheckk,
          monthCheckk,
        );
        setBills(data.data);
        setLoading(false);
      })();
    }
  }, [cookies?.code_room?._id, yearCheckk, monthCheckk, setLoading]);

  return (
    <div className="h-screen">
      <div className="h-screen">
        <header className="bg-white shadow">
          <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <DatePicker
                style={{width: '200px'}}
                onChange={(_, dateString) => {
                  setMonthh(parseInt(dateString.slice(5, 7)));
                  setYearr(parseInt(dateString.slice(0, 4)));
                }}
                defaultValue={moment(`${yearCheckk}-${monthCheckk}`, 'YYYY-MM')}
                allowClear={false}
                picker="month"
              />
            </div>
          </div>
        </header>
        {bills?.length ? (
          bills.map((bill: any, index: number) => {
            const totalPrice =
              bill.invoiceService.reduce(
                (previousValue: number, currentValue: any) =>
                  previousValue + currentValue.amount,
                0,
              ) + bill.debt;

            return (
              <main key={index}>
                <div className="w-full">
                  <div className="flex-[100%] bg-gray-100">
                    <div className="bg-white shadow-lg">
                      <div className="md:flex justify-between p-4 items-center">
                        <div>
                          <h1 className="text-3xl italic font-extrabold tracking-widest text-indigo-500">
                            Quản lý phòng trọ 24/7
                          </h1>
                          <p className="text-base">
                            Vui lòng thanh toán trong vòng 7 ngày tính từ thời
                            gian nhận được hóa đơn.
                          </p>
                          <p className="text-base">
                            Mọi thắc mắc xin gửi phản hồi về cho website để được
                            xử lý.
                          </p>
                        </div>
                        <div className="p-2">
                          <ul className="md:flex">
                            <li className="flex flex-col items-center p-2 border-l-2 border-indigo-200">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                />
                              </svg>
                              <span className="text-sm">
                                www.quanlyphongtro247.com
                              </span>
                            </li>
                            <li className="flex flex-col p-2 border-l-2 border-indigo-200 items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="text-sm">{bill?.address}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="w-full bg-indigo-500 h-6" />
                      <div className="flex justify-between p-4">
                        <div>
                          <h6 className="font-bold">
                            Ngày gửi hóa đơn:{' '}
                            <span className="text-sm font-medium">
                              {moment(bill.createdAt).format('DD/MM/YYYY')}
                            </span>
                          </h6>
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-bold">Thanh toán cho: </span>
                            {bill.memberName}
                          </p>
                        </div>
                        <div />
                      </div>
                      <div className="flex max-w-[100%] justify-center">
                        <div className="border-b border-gray-200 justify-between shadow w-full">
                          <table className="2xs:overflow-x-auto 2xs:overflow-y-auto w-full text-left">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-base text-gray-500 ">
                                  Loại hóa đơn
                                </th>
                                <th className="px-4 py-2 text-base text-gray-500 text-right">
                                  Thành tiền
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {bill.invoiceService?.map(
                                (totalBill: any, index1: number) => (
                                  <tr
                                    key={index1}
                                    className="whitespace-nowrap">
                                    <td className="px-6 py-4">
                                      <div className="text-sm text-gray-900">
                                        {totalBill?.serviceName}
                                      </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                      {totalBill?.amount.toLocaleString(
                                        'it-IT',
                                        {
                                          style: 'currency',
                                          currency: 'VND',
                                        },
                                      )}
                                    </td>
                                  </tr>
                                ),
                              )}
                              {bill?.debt !== 0 && (
                                <tr className="whitespace-nowrap">
                                  <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                      Tiền nợ tháng trước
                                    </div>
                                  </td>

                                  <td className="px-6 py-4 text-right">
                                    {bill?.debt?.toLocaleString('it-IT', {
                                      style: 'currency',
                                      currency: 'VND',
                                    })}
                                  </td>
                                </tr>
                              )}
                              <tr className="text-white bg-gray-800">
                                <td className="text-sm font-bold px-6 py-4">
                                  <b>Tổng tiền</b>
                                </td>
                                <td className="text-sm font-bold text-right px-6 py-4">
                                  <b>
                                    {totalPrice?.toLocaleString('it-IT', {
                                      style: 'currency',
                                      currency: 'VND',
                                    })}
                                  </b>
                                </td>
                              </tr>
                              <tr className="text-white bg-gray-800">
                                <td className="text-sm font-bold text-green-400 px-6 py-4">
                                  <b>Số tiền đã đóng</b>
                                </td>
                                <td className="text-sm font-bold  text-green-400 text-right px-6 py-4">
                                  <b>
                                    {bill?.paidAmount?.toLocaleString('it-IT', {
                                      style: 'currency',
                                      currency: 'VND',
                                    })}
                                  </b>
                                </td>
                              </tr>
                              <tr className="text-white bg-gray-800">
                                <td className="text-sm font-bold text-yellow-400 px-6 py-4">
                                  <b>Số tiền còn nợ</b>
                                </td>
                                <td className="text-sm font-bold text-yellow-400 text-right px-6 py-4">
                                  <b>
                                    {(
                                      totalPrice - bill.paidAmount
                                    )?.toLocaleString('it-IT', {
                                      style: 'currency',
                                      currency: 'VND',
                                    })}
                                  </b>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="px-4">
                        {totalPrice - bill.paidAmount == 0 && (
                          <div className="border border-transparent shadow-sm text-sm font-medium rounded-lg text-white text-center bg-green-400 hover:green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full px-6 py-4 my-4 ">
                            {' '}
                            Đã thanh toán{' '}
                          </div>
                        )}
                        {totalPrice - bill.paidAmount != 0 && (
                          <div
                            onClick={async () => {
                              const data = {
                                amount: totalPrice - bill.paidAmount,
                                orderDescription: `${monthCheckk},${yearCheckk},${
                                  totalPrice - bill.paidAmount
                                },${cookies?.code_room?._id},${
                                  cookies?.code_room?.idHouse
                                },${cookies?.code_room?.name},${bills[0]?._id}`,
                                orderType: 'billpayment',
                                language: 'vn',
                                bankCode: '',
                                month: monthCheckk,
                                year: yearCheckk,
                              };
                              await createPaymentInTenant(
                                cookies?.code_room?.idHouse,
                                data,
                              )
                                .then(result => {
                                  window.location.href = result.data.redirect;
                                })
                                .catch(err => {
                                  console.log('err', err);
                                });
                            }}
                            className="cursor-pointer w-full px-6 py-4 my-4 text-white bg-blue-600 rounded-lg hover:bg-blue-600 border border-transparent shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center">
                            Thanh toán hóa đơn
                          </div>
                        )}
                      </div>
                      <div className="w-full h-0.5 bg-indigo-500" />
                      <div className="p-4">
                        <div className="flex items-center justify-center font-extrabold text-indigo-500">
                          Cảm ơn bạn rất nhiều vì đã sử dụng dịch vụ của chúng
                          tôi.
                        </div>
                        <div className="flex items-end justify-end space-x-3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            );
          })
        ) : (
          <main className="bg-white relative overflow-hidden h-screen">
            <div className="container mx-auto px-6 md:px-12 relative z-10 flex items-center py-32">
              <div className="container mx-auto px-6 flex flex-col justify-between items-center relative">
                <div className="flex w-full items-center justify-center space-x-12 flex-col md:flex-row mb-16 md:mb-8">
                  <h1 className="font-thin text-center text-6xl text-gray-800">
                    Tháng này chưa có hóa đơn
                  </h1>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default InfoReceipt;
