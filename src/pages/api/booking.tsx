import {AxiosResponse} from 'axios';

import instance from './instance';

export const createBooking = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = '/booking/create';
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${data.userData?.token}`,
    },
  });
};
export const listBooking = (
  userData: any,
  id: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/booking/list/${id}`;
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  });
};

export const createBookingRoom = (
  data: any,
): Promise<AxiosResponse<any, any>> => {
  const url = '/booking/accept-take-room';
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};

export const deleteBooking = (
  id: any,
  userData: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/booking/remove-booking/${id}`;
  return instance.delete(url, {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  });
};
