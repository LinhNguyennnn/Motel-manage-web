import axios, {AxiosResponse} from 'axios';
import instance from './instance';
import {IChangeAllMember, IChangeOneMember} from './type';

export const listRoom = (
  id: any,
  userData: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/list-room/${userData?.user?._id}/${id}`;
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  });
};

export const addRoom = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = '/room/add';
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};

export const removeRoom = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = `/room/remove/${data?._id}`;
  return instance.delete(url, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};

export const getRoomBySubName = (
  subName: string,
): Promise<AxiosResponse<any, any>> => {
  const url = `/room/get-data/${subName}`;
  return instance.get(url);
};

export const readRoom = (
  id_room: string,
  userData: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/room/${id_room}`;
  return instance.get(url, {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  });
};

export const readRoomData = (
  id_room: string,
): Promise<AxiosResponse<any, any>> => {
  const url = `/room/${id_room}`;
  return instance.get(url);
};
export const updateRoom = (newData: any): Promise<AxiosResponse<any, any>> => {
  const url = `/room/update/${newData?.idRoom}`;
  return instance.put(url, newData, {
    headers: {
      Authorization: `Bearer ${newData?.token}`,
    },
  });
};

export const liquidRoom = (
  data: any,
  token?: any,
): Promise<AxiosResponse<any, any>> => {
  const url = '/room/liquidation';
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const liquiBill = (
  data: any,
  token?: any,
): Promise<AxiosResponse<any, any>> => {
  const url = '/room/review';
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// update people
export const updatePeople = (
  listMember: any,
  idRoom: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/room/${idRoom}/updateInfoMember`;
  return instance.post(url, listMember);
};

//  api people

export const addPeople = (
  id: any,
  data: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/room/${id}/member/add`;
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};

export const removePeople = (
  _id: any,
  data: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/room/${_id}/member/remove`;
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};
// api ma dang nhap

export const loginCode = (data: any): Promise<AxiosResponse<any, any>> => {
  const url = '/room/edit-code-room';
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};

// hàm upload ảnh hợp đồng
export const upload = async (file: any): Promise<AxiosResponse<any, any>> => {
  const CLOUNDINARY_URL =
    'https://api.cloudinary.com/v1_1/dvj4wwihv/image/upload';
  const CLOUNDINARY_PRESET = 'js8yqruv';
  const formData = new FormData();
  formData.append('file', file.file.name);
  formData.append('upload_preset', CLOUNDINARY_PRESET);

  const {data} = await axios.post(CLOUNDINARY_URL, formData, {
    headers: {'Content-Type': 'application/form-data'},
  });

  return data.url;
};
// chuyển 1 người qua phòng khác

export const changeOneMemberApi = (
  data: IChangeOneMember,
): Promise<AxiosResponse<any, any>> => {
  const url = '/room/change-one-member';
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};

// chuyển tất cả qua phòng khác

export const changeAllMemberApi = (
  data: IChangeAllMember,
): Promise<AxiosResponse<any, any>> => {
  const url = '/room/change-all-member';
  return instance.post(url, data, {
    headers: {
      Authorization: `Bearer ${data?.userData?.token}`,
    },
  });
};
