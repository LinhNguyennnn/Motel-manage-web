import {AxiosResponse} from 'axios';

import instance from './instance';

export const listBill = (
  userData: any,
  idHouse: any,
  year: number,
  month: number,
): Promise<AxiosResponse<any, any>> => {
  const url = `/bill-all/list/${userData?.user?._id}/${idHouse}/${year}/${month}`;
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  });
};

export const readBill = (
  id: any,
  newData: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/bill/detail/${id}`;
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${newData?.token}`,
    },
  });
};

export const CreateBillHouseAll = (
  newData: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/bill-house-all/${newData?.idHouse}`;
  return instance.post(url, newData, {
    headers: {
      Authorization: `Bearer ${newData?.userData?.token}`,
    },
  });
};

export const CreateBillRooms = (
  newDataRooms: any,
): Promise<AxiosResponse<any, any>> => {
  const url = '/bill-room';
  return instance.post(url, newDataRooms, {
    headers: {
      Authorization: `Bearer ${newDataRooms?.userData?.token}`,
    },
  });
};

export const paymentStatus = (
  data: any,
  id: any,
  userData: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/bill-update/${id}`;
  return instance.put(url, data, {
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  });
};

export const getBillIdRoom = (
  idRoom: string,
  year: number,
  month: number,
): Promise<AxiosResponse<any, any>> => {
  const url = `/bill-room/${idRoom}/${year}/${month}`;
  return instance.get(url);
};

// hóa dơn thanh lý hợp đồng
export const getBillLiquidation = (
  idHouse: string,
): Promise<AxiosResponse<any, any>> => {
  const url = `/bill-liqui/${idHouse}`;
  return instance.get(url);
};

export const createBillLiquidation = (
  data: any,
): Promise<AxiosResponse<any, any>> => {
  const url = '/bill-liqui/create';
  return instance.post(url, data);
};
