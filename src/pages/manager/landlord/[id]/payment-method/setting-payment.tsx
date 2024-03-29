import React, {useEffect} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useRouter} from 'next/router';
import Link from 'next/link';

import {updateInfoPaymentForHouse} from 'src/pages/api/house';
import {getPaymentMethod} from 'src/pages/api/payment';
import {useUserContext} from '@/context/UserContext';
import {Toast} from 'src/hooks/toast';

type FormInputs = {
  TmnCode: string;
  HashSecret: string;
};

const SettingPayment: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<FormInputs>();
  const {cookies, setLoading} = useUserContext();
  const userData = cookies?.user;
  const router = useRouter();
  const {id: idHouse} = router.query;

  useEffect(() => {
    if (idHouse) {
      (async () => {
        setLoading(true);
        await getPaymentMethod(idHouse)
          .then(({data}) => {
            setValue('TmnCode', data?.data?.TmnCode);
            setValue('HashSecret', data?.data?.HashSecret);
          })
          .finally(() => {
            setLoading(false);
          });
      })();
    }
  }, [idHouse, setLoading, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    setLoading(true);
    await updateInfoPaymentForHouse(idHouse, userData, data)
      .then(result => {
        Toast('success', result.data.message);
      })
      .catch(err => {
        Toast('error', err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="mt-5 md:mt-0 md:col-span-3 border rounded-md">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="shadow rounded-md overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="col-span-6">
                  <label
                    className="block text-sm font-bold text-gray-700"
                    htmlFor="full_name">
                    TMN Code <span className="text-[red]">*</span>
                  </label>
                  <input
                    type="string"
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="TMN Code"
                    {...register('TmnCode', {required: true})}
                  />
                  {errors.TmnCode?.type === 'required' && (
                    <span className="text-[red] mt-1 block">
                      Vui lòng nhập mã TMN!
                    </span>
                  )}
                </div>
                <div className="col-span-6">
                  <label
                    className="block text-sm font-bold text-gray-700"
                    htmlFor="full_name">
                    Hash Secret <span className="text-[red]">*</span>
                  </label>
                  <input
                    type="string"
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Hash Secret"
                    {...register('HashSecret', {required: true})}
                  />
                  {errors.HashSecret?.type === 'required' && (
                    <span className="text-[red] mt-1 block">
                      Vui lòng nhập mã HashSecret!
                    </span>
                  )}
                </div>
                <div className="py-3 bg-gray-50">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      Đăng kí mã thanh toán
      <> </>
      <Link href="https://sandbox.vnpayment.vn/devreg/">tại đây!</Link>
    </div>
  );
};

export default SettingPayment;
