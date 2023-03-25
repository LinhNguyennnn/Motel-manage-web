import React from 'react';
import {useForm} from 'react-hook-form';
import {useRouter} from 'next/router';

import {createBookingRoom} from 'src/pages/api/booking';
import {useUserContext} from '@/context/UserContext';
import {Toast} from 'src/hooks/toast';

type Props = {
  itemm1: any;
  itemm2: any;
};

const CardNumber: React.FC<Props> = props => {
  const {cookies} = useUserContext();

  const userData = cookies?.user;
  const router = useRouter();
  const param = router.query;
  const id = param.id;
  const {register, handleSubmit} = useForm<any>();

  const onCreateRoom = async (data: any) => {
    const newData = {...data, userData: userData};
    if (id) {
      await createBookingRoom(newData)
        .then((result: any) => {
          Toast('success', result?.data?.message);
          router.push(`/manager/landlord/${id}/list-room`);
        })
        .catch(error => {
          Toast('error', error?.response?.data?.message);
        });
    }
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit(onCreateRoom)}>
        <div className="hidden">
          <div>
            <input
              type="text"
              value={props.itemm1}
              {...register('idBooking', {required: true})}
            />
          </div>
          <div>
            <input
              type="text"
              value={props.itemm2}
              {...register('idRoom', {required: true})}
            />
          </div>
        </div>
        <div>
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-full-name"
            type="text"
            {...register('cardNumber', {required: true, minLength: 3})}
          />
        </div>
        <div>
          <button
            type="submit"
            className=" mt-5 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900">
            Nhận phòng
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardNumber;
