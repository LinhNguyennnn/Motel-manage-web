import React, { useEffect, useState } from 'react';
import { faEye, faEyeSlash, faPenToSquare, faTrashCan, faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useUserContext } from '@/context/UserContext';
import { Toast } from 'src/hooks/toast';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { useForm } from 'react-hook-form';
import { removePeople, updatePeople } from 'src/pages/api/room';
import ModalChangeMember from './modal-change-member';

export type IMember = {
  status: boolean;
  _id: string;
  id: string;
  memberName: string;
  cardNumber: string;
  phoneNumber: string;
  handleResetPage: () => void
};
export type IMember2 = {
  _id: string;
  id: string;
  name: string;
  status: boolean;
  maxMember: number;
  price: number;
  area: number;
  listMember: object;
};

const ListMember = (props: IMember) => {
  const { _id, memberName, phoneNumber, cardNumber, status } = props;
  const [hiddenPhone, setHiddenphone] = useState<boolean>(true);
  const [check, setCheck] = useState<string>('');
  const [hiddenCardNumber, setHiddenCardNumber] = useState<boolean>(true);
  const { cookies, setLoading, user } = useUserContext();
  const [modalChangeOneMember, setModalChangeOneMember] = useState<boolean>(false);
  const userData = cookies?.user;
  const router = useRouter();
  const param = router.query;
  const idRoom = (param.id_room);


  const [open, setOpen] = useState(false);
  const onCloseModal = () => setOpen(false);
  const onOpenModal = () => setOpen(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset(props)
  }, [])
  const onHandleOpenModalChangeMember = () => {
    setModalChangeOneMember(true);
    setCheck('1');

  }
  const onSubmit = async (listMember: any) => {

    const newData = {
      id: listMember._id,
      memberName: listMember.memberName,
      phoneNumber: listMember.phoneNumber,
      cardNumber: listMember.cardNumber,
      status: listMember.status
    }
    setLoading(true);
    await updatePeople(newData, idRoom).then((result) => {
      setLoading(false);
      setOpen(false);
      Toast('success', result.data.message);
    }).catch((err) => {

      setLoading(false);
      Toast('error', err?.response?.data?.message);
    }).finally(() => {
      props.handleResetPage()
    });
  };


  const removeRoom = async (props: IMember) => {
    const confirm = window.confirm('B???n c?? mu???n x??a kh??ng?');
    if (confirm) {
      setLoading(true);
      const newData = { ...props, userData: userData };
      await removePeople(param.id_room, newData).then((result) => {
        Toast('success', result.data.message);
        setLoading(false);

      }).catch((error) => {

        Toast('error', error.message);
        setLoading(false);
      }).finally(() => {
        props.handleResetPage()
      })

    } else {
      setLoading(false);
    }
  };

  const showData = (data: string, status: boolean) => {
    if (data) {
      return status ? data : '************';
    }
    return 'Kh??ng c??';
  };

  return (
    <div>
      <div className="card-member bg-white w-full border border-solid border-gray-600 p-4 flex flex-col rounded">
        <div className="name-member">
          <strong>H??? v?? t??n:</strong>
          {memberName}
        </div>
        <div className="flex flex-row justify-between">
          <div className="phone-number">
            <strong>S??T:</strong> {showData(phoneNumber, !hiddenPhone)}{' '}
          </div>
          <FontAwesomeIcon
            className="w-[20px] text-[10px] pt-[2px]"
            onClick={() => setHiddenphone(!hiddenPhone)}
            icon={hiddenPhone ? faEyeSlash : faEye}
            size={'lg'}
          />
        </div>
        <div className="flex flex-row justify-between">
          <div className="cart-number">
            <strong>CMND/CCCD:</strong> {showData(cardNumber, !hiddenCardNumber)}
          </div>
          <FontAwesomeIcon
            className="w-[20px] text-[10px] pt-[2px]"
            onClick={() => setHiddenCardNumber(!hiddenCardNumber)}
            icon={hiddenCardNumber ? faEyeSlash : faEye}
            size={'lg'}
          />
        </div>
        <div className="name-member">{status == true ? <div>Ch??? Ph??ng</div> : <div>Th??nh vi??n</div>}</div>

        <div className="control-member flex flex-row gap-2">
          <div
            onClick={onOpenModal}
            className="rounded edit-member flex flex-row gap-2 p-2 bg-blue-500 text-white border border-solid border-blue-500 base-1/2 cursor-pointer"
          >
            <FontAwesomeIcon className="w-[10px] text-[10px] pt-[2px]" icon={faPenToSquare} height={20} />
            <span>S???a</span>
          </div>
          <div className="rounded edit-member flex flex-row gap-2 p-2 bg-red-500 hover:bg-red-400 text-white border border-solid border-red-500 hover:border-red-400 base-1/2 cursor-pointer">
            <FontAwesomeIcon className="w-[10px] text-[10px] pt-[2px]" icon={faTrashCan} height={20} />
            <span
              onClick={() => {
                removeRoom(props);
              }}
            >
              X??a
            </span>
          </div>
          <div className="rounded edit-member flex flex-row gap-2 p-2 bg-blue-500 text-white border border-solid border-blue-500 base-1/2 cursor-pointer">
            <FontAwesomeIcon className="w-[10px] text-[10px] pt-[2px]" icon={faHandPointRight} height={20} />
            <span
              onClick={() => onHandleOpenModalChangeMember()}
            >
              Chuy???n ph??ng
            </span>
          </div>
        </div>
        <Modal open={open} onClose={onCloseModal} center>
          <div className="w-full">
            <div className="  ">
              <h2 className="pt-2 text-xl">C???p nh???t th??nh vi??n </h2>
            </div>{' '}
            <div className="border  p-2 ">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    T??n th??nh vi??n
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
                    <span className="text-[red] mt-1 block">T??n th??nh vi??n ph???i t???i thi???u 6 k?? t???!</span>
                  )}
                </div>

                <div className="col-span-6">
                  <label className="block text-gray-700 text-sm font-bold" htmlFor="username">
                    Ch???c v???
                  </label>

                  <select
                    className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...register('status')}
                    id="status"
                  >
                    <option value="true">Ng?????i ?????i di???n</option>
                    <option value="false">Th??nh vi??n</option>
                  </select>

                </div>
                <div className="mb-4 mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    CMND/CCCD
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
                    S??? ??i???n tho???i
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
                    C???p nh???t
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
        <ModalChangeMember openModal={modalChangeOneMember} setOpenModal={setModalChangeOneMember} name={memberName} phoneNumber={phoneNumber} cardNumber={cardNumber} idMember={_id} data='' check={check}></ModalChangeMember>
      </div>
    </div>
  );
};

export default ListMember;
