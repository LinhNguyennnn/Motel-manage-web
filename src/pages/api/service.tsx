import {AxiosResponse} from 'axios';

import instance from './instance';

export const ListService = (id: string): Promise<AxiosResponse<any, any>> => {
  const url = `/service-house/${id}`;
  return instance.get(url);
};

export const getInfoService = (
  idHouse: any,
  name: string,
): Promise<AxiosResponse<any, any>> => {
  const url = `/service/get-service/${idHouse}/${name}`;
  return instance.get(url);
};

export const removeService = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = `/service/remove/${data?.idHouse}/${data?.idService}`;
  return instance.delete(url, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};
export const addService = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = '/service/create';
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};
export const readService = (
  idService: any,
  userData: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/service/${idService}`;
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  });
};
export const updateService = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = `/service/update/${data?._id}`;
  return instance.patch(url, data, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};
