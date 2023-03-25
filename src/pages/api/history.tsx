import {AxiosResponse} from 'axios';

import instance from './instance';

export const historyDelete = (
  id: any,
  userData: {user: {id: any}; token: any},
): Promise<AxiosResponse<any, any>> => {
  const url = `/list-histories/${userData.user.id}/${id}`;
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  });
};
