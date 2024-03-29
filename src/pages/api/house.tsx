import {AxiosResponse} from 'axios';

import instance from './instance';

export const listHouse = (userData: any): Promise<AxiosResponse<any, any>> => {
  const url = `/house/${userData?.user?._id}`;
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  });
};

export const addHouse = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = `/house/${data?.userData?.user?._id}`;
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};

export const removeHouses = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = `/house/${data?._id}`;
  return instance.delete(url, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};
export const readHouse = (
  id_home: string,
  userData: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/house/detail/${id_home}`;
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  });
};
export const updateHouse = (house: any): Promise<AxiosResponse<any, any>> => {
  const url = `/house/${house?._id}`;
  return instance.put(url, house, {
    headers: {
      Authorization: `Bearer ${house?.userData?.token}`,
    },
  });
};

export const updateInfoPaymentForHouse = (
  idHouse: any,
  user: any,
  data: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/house/updatePayment/${idHouse}`;
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });
};
