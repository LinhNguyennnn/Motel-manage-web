import React, {useEffect} from 'react';
import {useUserContext} from '@/context/UserContext';
import {useForm} from 'react-hook-form';
import {useRouter} from 'next/router';

import {readHouse, updateHouse} from 'src/pages/api/house';
import {Toast} from 'src/hooks/toast';
import Link from 'next/link';

const EditHouse: React.FC = () => {
  const router = useRouter();
  const {cookies, setLoading} = useUserContext();
  const userData = cookies?.user;

  const param = router.query;
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const {data} = await readHouse(`${param.id_home}`, userData);
      if (data) {
        reset(data);
      }
      setLoading(false);
    })();
  }, [param.id_home, reset, userData, setLoading]);

  const onSubmit = async (dataForm: any) => {
    setLoading(true);
    await updateHouse({...dataForm, userData: userData})
      .then(() => {
        Toast('success', 'Sửa nhà  thành công!');
        router.push('/manager/landlord/list-home');
      })
      .catch(error => {
        Toast('error', error?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full ">
      <div className="grid grid-flow-col px-4 py-2 text-white bg-cyan-500 mt-4 ">
        <div className="">
          <h2 className="pt-2 text-xl">Sửa nhà </h2>
        </div>
      </div>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username">
            Tên nhà <span className="text-[red]">*</span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Xin mời nhập tên nhà"
            {...register('name', {required: true, minLength: 3})}
          />
          {errors.name?.type === 'required' && (
            <span className="text-[red] mt-1 block">
              Vui lòng nhập tên nhà!
            </span>
          )}
          {errors.name?.type === 'minLength' && (
            <span className="text-[red] mt-1 block">
              Tên nhà tối thiểu 3 ký tự!
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username">
            Địa chỉ <span className="text-[red]">*</span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            placeholder="Xin mời nhập địa chỉ"
            {...register('address', {required: true, minLength: 6})}
          />
          {errors.address?.type === 'required' && (
            <span className="text-[red] mt-1 block">
              Vui lòng nhập địa chỉ nhà!
            </span>
          )}
          {errors.address?.type === 'minLength' && (
            <span className="text-[red] mt-1 block">
              Địa chỉ nhà tối thiểu 6 ký tự!
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href="/manager/landlord/list-home"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <a className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Huỷ
            </a>
          </Link>

          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 ${
              Object.keys(errors).length > 0
                ? 'opacity-50 cursor-not-allowed pointer-events-none'
                : 'hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}>
            Sửa nhà
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHouse;
