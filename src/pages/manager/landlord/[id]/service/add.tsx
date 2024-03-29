import React from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {NumericFormat} from 'react-number-format';
import {useRouter} from 'next/router';
import Link from 'next/link';

import {useUserContext} from '@/context/UserContext';
import {addService} from 'src/pages/api/service';
import {Toast} from 'src/hooks/toast';

interface IFormInputs {
  label: string;
  price: number;
  unit: string;
  type: boolean;
  idHouse: string;
}

const AddServiceRoom: React.FC = () => {
  const {cookies, setLoading} = useUserContext();
  const router = useRouter();
  const {id} = router.query;
  const userData = cookies?.user;
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = async (data: any) => {
    const newData = {
      ...data,
      price: Number(data.price),
      idHouse: id,
      userData: userData,
    };
    setLoading(true);
    await addService(newData)
      .then(() => {
        Toast('success', 'Thêm dịch vụ thành công');
        router.push(`/manager/landlord/${id}/service`);
        setLoading(false);
      })
      .catch(error => {
        Toast('error', error?.response?.data?.message);
        setLoading(false);
      });
  };

  return (
    <div className="w-full ">
      <header className="bg-white shadow border rounded-md">
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate uppercase">
                Thêm dịch vụ
              </h2>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-full mx-auto py-6 ">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="mt-5 md:mt-0 md:col-span-3 border rounded-md">
              <form id="formAdd" onSubmit={handleSubmit(onSubmit)}>
                <div className="shadow rounded-md overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="col-span-6">
                      <label
                        className="block text-sm font-bold text-gray-700"
                        htmlFor="username">
                        Tên dịch vụ <span className="text-[red]">*</span>
                      </label>
                      <input
                        className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Nhập tên dịch vụ..."
                        {...register('label', {required: true})}
                      />
                      {errors.label?.type === 'required' && (
                        <span className="text-[red] mt-1 block">
                          Vui lòng nhập tên dịch vụ!
                        </span>
                      )}
                    </div>
                    <div className="col-span-6">
                      <label
                        className="block text-gray-700 text-sm font-bold"
                        htmlFor="username">
                        Giá dịch vụ <span className="text-[red]">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="price"
                        rules={{
                          required: true,
                          min: 1000,
                        }}
                        render={({field: {onChange, name, value}}) => (
                          <NumericFormat
                            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="Nhập giá dịch vụ..."
                            name={name}
                            value={value}
                            thousandSeparator=","
                            onChange={e => {
                              onChange(
                                Number(e.target.value.split(',').join('')),
                              );
                            }}
                          />
                        )}
                      />
                      {errors.price?.type === 'required' && (
                        <span className="text-[red] mt-1 block">
                          Vui lòng nhập giá dịch vụ!
                        </span>
                      )}
                      {errors.price?.type === 'min' && (
                        <span className="text-[red] mt-1 block">
                          Giá dịch vụ tối thiểu và không được nhỏ hơn 1,000 VND!
                        </span>
                      )}
                    </div>
                    <div className="col-span-6">
                      <label
                        className="block text-gray-700 text-sm font-bold"
                        htmlFor="username">
                        Đơn vị <span className="text-[red]">*</span>
                      </label>
                      <input
                        className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="unit"
                        type="text"
                        placeholder="Nhập đơn vị dịch vụ..."
                        {...register('unit', {required: true})}
                      />
                      {errors.unit?.type === 'required' && (
                        <span className="text-[red] mt-1 block">
                          Vui lòng nhập đơn vị dịch vụ!
                        </span>
                      )}
                    </div>
                    <div className="col-span-6">
                      <label
                        className="block text-gray-700 text-sm font-bold"
                        htmlFor="username">
                        Trạng thái thanh toán
                      </label>
                      <select
                        className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        {...register('type', {required: false})}
                        id="type">
                        <option value="true">Trả theo số lượng sử dụng</option>
                        <option value="false">Trả theo tháng</option>
                      </select>
                    </div>
                  </div>

                  <div className="px-4 py-3 flex gap-[20px] bg-gray-50 text-right sm:px-6 ">
                    <Link
                      href={`/manager/landlord/${id}/service`}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <a className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Quay lại
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
                      Lưu
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddServiceRoom;
