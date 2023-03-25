import {AxiosResponse} from 'axios';

import instance from './instance';

export const SignIn = (data: {}): Promise<AxiosResponse<any, any>> => {
  const url = '/signin';
  return instance.post(url, data);
};

export const UserSignup = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = '/signup';
  return instance.post(url, data);
};

export const UserInfo = (userData: any): Promise<AxiosResponse<any, any>> => {
  const url = `/user/${userData.user._id}`;
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  });
};
export const UpdateUserInfo = (
  newData: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/user/${newData?.userData?.user?._id}`;
  return instance.put(url, newData, {
    headers: {
      Authorization: `Bearer ${newData?.userData?.token}`,
    },
  });
};
export const getInfoUser = (
  idUser: string,
  token: string,
): Promise<AxiosResponse<any, any>> => {
  const url = `/user/${idUser}`;
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const fogetPassword = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = '/forgot-password';
  return instance.post(url, data);
};
export const resetPassword = (
  newData: any,
): Promise<AxiosResponse<any, any>> => {
  const url = '/reset_password';
  return instance.post(url, newData);
};
export const comfimEmail = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = '/reset_password';
  return instance.post(url, data);
};
export const confirmation = (
  email: string | string[] | undefined,
  token: string | string[] | undefined,
): Promise<AxiosResponse<any, any>> => {
  const url = `/confirmation/${email}/${token}`;
  return instance.get(url);
};
export const changePassword = (
  newData: any,
): Promise<AxiosResponse<any, any>> => {
  const url = '/change-password';
  return instance.put(url, newData);
};
