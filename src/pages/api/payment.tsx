import {AxiosResponse} from 'axios';
import instance from './instance';

export const createBillUpdateAccount = (
  infoPayment: any,
): Promise<AxiosResponse<any, any>> => {
  const url = '/user/update-account';
  return instance.post(url, infoPayment);
};
export const checkBillUpdateAccount = (
  infoOrder: any,
): Promise<AxiosResponse<any, any>> => {
  const url = '/user/payment-return';
  return instance.post(url, infoOrder);
};

export const createBillPayment = (
  infoPayment: any,
): Promise<AxiosResponse<any, any>> => {
  const url = '/payment/create-payment';
  return instance.post(url, infoPayment);
};

export const checkPaymentBill = (
  infoOrder: any,
): Promise<AxiosResponse<any, any>> => {
  const url = '/payment/payment-return';
  return instance.post(url, infoOrder);
};

export const createPaymentInTenant = (
  idHouse: any,
  data: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/payment/create-payment/${idHouse}`;
  return instance.post(url, data);
};

export const getPaymentMethod = (
  idHouse: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/payment/setting/${idHouse}`;
  return instance.get(url);
};

export const checkPaymentReturn = (
  idHouse: any,
  params: any,
): Promise<AxiosResponse<any, any>> => {
  const url = `/payment/payment-return/${idHouse}`;
  return instance.post(url, params);
};

export const getListBill = (idHouse: any): Promise<AxiosResponse<any, any>> => {
  const url = `/payment/list/${idHouse}`;
  return instance.get(url);
};
