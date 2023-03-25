import {AxiosResponse} from 'axios';

import instance from './instance';

export const listContract = (): Promise<AxiosResponse<any, any>> => {
  const url = 'contract';
  return instance.get(url);
};

export const addContract = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = 'contract';
  return instance.post(url, data);
};

export const readContract = (): Promise<AxiosResponse<any, any>> => {
  const a = JSON.parse(localStorage.getItem('user') as any);

  const url = 'contract';
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${a.token}`,
    },
  });
};
