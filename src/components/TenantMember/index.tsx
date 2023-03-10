import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { useForm } from 'react-hook-form';
import { useUserContext } from '@/context/UserContext';
import { useRouter } from 'next/router';
import { Toast } from 'src/hooks/toast';
import { IMember, IMember2 } from '@/components/ListMember';
import { addPeople } from 'src/pages/api/room';
import ModalChangeMember from '../ListMember/modal-change-member';


const ListMember = dynamic(() => import('@/components/ListMember'), { ssr: false });


type IProps = {
  data: IMember2;
  data1: any;
  handleResetPage: () => void
};

const TenantMember = ({ data, data1, handleResetPage }: IProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [modalChangeOneMember, setModalChangeOneMember] = useState<boolean>(false);
  const [check, setCheck] = useState<string>('');
  const router = useRouter();
  const param = router.query;
  const { cookies, setLoading } = useUserContext();
  const userData = cookies?.user;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const onHandleOpenModalChangeMember = () => {
    setModalChangeOneMember(true);
    setCheck('2');
  }
  const onSubmit = async (listMember: any) => {
    setLoading(true);
    const newData = { ...{ listMember }, userData: userData };
    await addPeople(param.id_room, newData).then((result) => {
      setLoading(false);
      setOpen(false);
      reset()
      Toast('success', result?.data?.message);
    }).catch((err) => {
      setLoading(false);
      Toast('error', err?.message);
    }).finally(() => {
      handleResetPage()
    });
  };

  return (
    <div>
      <div>
        {data?.status == true ? (
          <div>
            {data1?.length < data?.maxMember ? (
              <div className='flex'>
                <button
                  onClick={onOpenModal}
                  className="block mb-5 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Th??m th??nh vi??n
                </button>
                {data1?.length ? (
                  <button
                    onClick={() => onHandleOpenModalChangeMember()}
                    className="block mb-5 ml-5 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Chuy???n t???t c??? th??nh vi??n
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ) : (
              <div className='flex'>
                <button disabled className="block mb-5 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2">????? ng?????i</button>
                <button
                  onClick={() => onHandleOpenModalChangeMember()}
                  className="block mb-5 ml-5 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Chuy???n t???t c??? th??nh vi??n
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>Ph??ng ??ang s???a ch???a</div>
        )}

        <Modal open={open} onClose={onCloseModal} center>
          <div className="w-full pt-6">
            <div className="grid grid-flow-col px-4 py-2 text-white bg-cyan-500 mt-4 ">
              <div className="">
                <h2 className="pt-2 text-xl text-white">Th??m th??nh vi??n </h2>
              </div>
            </div>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  T??n th??nh vi??n <span className="text-[red]">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Xin m???i nh???p t??n th??nh vi??n"
                  {...register('memberName', { required: true, minLength: 6 })}
                />
                {errors.memberName?.type === 'required' && (
                  <span className="text-[red] mt-1 block">Vui l??ng nh???p t??n th??nh vi??n!</span>
                )}
                {errors.memberName?.type === 'minLength' && (
                  <span className="text-[red] mt-1 block">T??n th??nh vi??n t???i thi???u 6 k?? t???!</span>
                )}
              </div>

              <div className="col-span-6">
                <label className="block text-gray-700 text-sm font-bold" htmlFor="username">
                  Ch???c v??? <span className="text-[red]">*</span>
                </label>
                {data1?.length < 1 ? (
                  <select
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register('status', { required: true })}
                    id="status"
                  >
                    <option value="true">Ng?????i ?????i di???n</option>
                  </select>
                ) : (
                  <select
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register('status', { required: true })}
                    id="status"
                  >
                    <option value="false">Th??nh vi??n</option>
                  </select>
                )}
              </div>
              <div className="mb-4 mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  CMND/CCCD <span className="text-[red]">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="cardNumber"
                  type="text"
                  placeholder="Xin m???i nh???p  CMND/CCCD"
                  {...register('cardNumber', {
                    required: true,
                    minLength: 9,
                    maxLength: 12,
                    pattern: /^[0-9]+$/
                  })}
                />
                {errors.cardNumber?.type === 'required' && (
                  <span className="text-[red] mt-1 block">Vui l??ng nh???p s??? CMND/CCCD!</span>
                )}
                {errors.cardNumber?.type === 'minLength' && (
                  <span className="text-[red] mt-1 block">S??? CMND/CCCD kh??ng ????ng d???nh d???ng!</span>
                )}
                {errors.cardNumber?.type === 'maxLength' && (
                  <span className="text-[red] mt-1 block">S??? CMND/CCCD kh??ng ????ng d???nh d???ng!</span>
                )}
                {errors.cardNumber?.type === 'pattern' && (
                  <span className="text-[red] mt-1 block">S??? CMND/CCCD kh??ng ????ng d???nh d???ng!</span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  S??? ??i???n tho???i <span className="text-[red]">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="phoneNumber"
                  type="text"
                  placeholder="Xin m???i nh???p s??? ??i???n tho???i"
                  {...register('phoneNumber', {
                    required: true,
                    minLength: 10,
                    maxLength: 10,
                    pattern: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
                  })}
                />
                {errors.phoneNumber?.type === 'required' && (
                  <span className="text-[red] mt-1 block">Vui l??ng nh???p s??? ??i???n tho???i!</span>
                )}
                {errors.phoneNumber?.type === 'minLength' && (
                  <span className="text-[red] mt-1 block">S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng!</span>
                )}
                {errors.phoneNumber?.type === 'maxLength' && (
                  <span className="text-[red] mt-1 block">S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng!</span>
                )}
                {errors.phoneNumber?.type === 'pattern' && (
                  <span className="text-[red] mt-1 block">S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng!</span>
                )}
              </div>

              <div className="flex items-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Th??m th??nh vi??n
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
      {data?.status == true ? (
        <div className="flex flex-row flex-wrap w-full gap-4">
          {data1.length > 0 ? (
            data1?.map((item: IMember) => (
              <div key={item.memberName} className=" basis-full md:basis-[30%] ">
                <ListMember {...item} handleResetPage={() => handleResetPage()} />
              </div>
            ))
          ) : (
            <div>Ch??a c?? th??nh vi??n n??o</div>
          )}
        </div>
      ) : (
        <div></div>
      )}
      <ModalChangeMember openModal={modalChangeOneMember} setOpenModal={setModalChangeOneMember} data={data1} cardNumber='' idMember='' name='' phoneNumber='' check={check}></ModalChangeMember>
    </div>

  );
};

export default TenantMember;
