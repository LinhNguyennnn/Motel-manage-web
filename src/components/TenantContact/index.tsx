import { useUserContext } from '@/context/UserContext';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import { updateRoom } from 'src/pages/api/room';
import storage from '@/util/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Toast } from 'src/hooks/toast';
import { Image } from 'antd';
import 'antd/dist/antd.css';
import ImageUploading from 'react-images-uploading';
import { NumericFormat } from 'react-number-format';

export type IContractData = {
  addressCT: string;
  timeCT: string;
  startTime: string;
  endTime: string;
  additional: any;
  fine: number;
  infoTenant: Info;
  infoLandlord: Info;
  imageContract: any;
};

type Info = {
  name: String;
  cardNumber: String;
  dateRange: String;
  phoneNumber: String;
  issuedBy: String;
  deposit: number
};

type IForm = {
  name: string;
  price: number;
  status: boolean;
  maxMember: number;
  emailOfAuth: string;
  area: number
};

type Props = {
  data: IForm | any;
  dataContract: IContractData;
  leadMember: any;
  dataLandlord: any;
  roomArea: number;
  roomPrice: number;
  setSetFirstTab: (number: number) => void;
};

const TenantContract = ({ data, dataContract, leadMember, roomPrice, dataLandlord, roomArea, setSetFirstTab }: Props) => {
  const router = useRouter();
  const { setLoading, cookies } = useUserContext();
  const param = router.query;
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [contractData, setContractData] = useState<IContractData>();
  const [progress, setProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState<any[]>();
  const [images, setImages] = useState<any>(dataContract.imageContract);
  const maxNumber = 69;
  const onChange = (imageList: any, addUpdateIndex: any) => {
    setImages(imageList);
  };
  const userData = cookies?.user;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<any>();

  useEffect(() => {
    if (dataContract) {
      setContractData(dataContract);
    }
  }, [dataContract]);

  useEffect(() => {
    if (contractData) {
      const { infoTenant, infoLandlord } = contractData;

      setValue('addressCT', contractData.addressCT);
      setValue('timeCT', contractData.timeCT);
      setValue('startTime', contractData.startTime);
      setValue('endTime', contractData.endTime);
      setValue('additional', contractData.additional.join('\n'));
      setValue('fine', String(contractData.fine));

      //tenant
      setValue('TNname', infoTenant?.name ? infoTenant?.name : leadMember?.memberName);
      setValue('TNcardNumber', infoTenant?.cardNumber ? infoTenant?.cardNumber : leadMember?.cardNumber);
      setValue('TNphoneNumber', infoTenant?.phoneNumber ? infoTenant?.phoneNumber : leadMember?.phoneNumber);
      setValue('TNdateRange', infoTenant?.dateRange);
      setValue('TNIssuedBy', infoTenant?.issuedBy);
      setValue('TNDeposit', String(infoTenant?.deposit));
      console.log(String(infoTenant?.deposit));


      //lanlord
      setValue('LLname', infoLandlord?.name ? infoLandlord?.name : dataLandlord?.name);
      setValue('LLcardNumber', infoLandlord?.cardNumber ? infoLandlord?.cardNumber : dataLandlord?.cardNumber);
      setValue('LLphoneNumber', infoLandlord?.phoneNumber ? infoLandlord?.phoneNumber : dataLandlord?.phoneNumber);
      setValue('LLdateRange', infoLandlord?.dateRange ? infoLandlord?.dateRange : dataLandlord?.dateRange);
      setValue('LLIssuedBy', infoLandlord?.issuedBy ? infoLandlord?.issuedBy : dataLandlord?.issuedBy);
    }
  }, [contractData, dataLandlord?.cardNumber, dataLandlord?.dateRange, dataLandlord?.issuedBy, dataLandlord?.name, dataLandlord?.phoneNumber, leadMember, setValue]);

  const uploadTask = (image: any) => {
    if (image.data_url == null) {
      return image;
    } else {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `files/${image?.file?.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image.file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(prog);
          },
          (error) => console.log(error),
          async () => {
            await getDownloadURL(uploadTask.snapshot.ref).then((downloadURLs) => {
              resolve(downloadURLs);
            });
          },
        );
      });
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const newAdditional = data.additional.split('\n');
    Promise.all(images.map((image: any) => uploadTask(image)))
      .then(async (ListImgs) => {
        const newValue = {
          contract: {
            startTime: data.startTime,
            endTime: data.endTime,
            additional: newAdditional,
            fine: Number(data.fine),
            timeCT: data.timeCT,
            addressCT: data.addressCT,
            imageContract: ListImgs,
            infoTenant: {
              name: data.TNname,
              cardNumber: data.TNcardNumber,
              phoneNumber: data.TNphoneNumber,
              issuedBy: data.TNIssuedBy,
              dateRange: data.TNdateRange,
              deposit: Number(data.TNDeposit)
            },
            infoLandlord: {
              name: data.LLname,
              cardNumber: data.LLcardNumber,
              phoneNumber: data.LLphoneNumber,
              issuedBy: data.LLIssuedBy,
              dateRange: data.LLdateRange,
            },
          },
          idRoom: param?.id_room,
          token: userData?.token,
        };
        await updateRoom(newValue)
          .then((result) => {
            setLoading(false);
            Toast('success', 'Th??m h???p ?????ng th??nh c??ng');
          })
          .catch((err) => {
            setLoading(false);
          })
          .finally(() => {
            setSetFirstTab(3);
          });
      }).catch(async (err) => {
        Toast('error', 'Th??m ???nh th???t b???i!');
        const newValue = {
          contract: {
            startTime: data.startTime,
            endTime: data.endTime,
            additional: newAdditional,
            fine: Number(data.fine),
            timeCT: data.timeCT,
            addressCT: data.addressCT,
            imageContract: dataContract.imageContract,
            infoTenant: {
              name: data.TNname,
              cardNumber: data.TNcardNumber,
              phoneNumber: data.TNphoneNumber,
              issuedBy: data.TNIssuedBy,
              dateRange: data.TNdateRange,
              deposit: Number(data.TNDeposit)
            },
            infoLandlord: {
              name: data.LLname,
              cardNumber: data.LLcardNumber,
              phoneNumber: data.LLphoneNumber,
              issuedBy: data.LLIssuedBy,
              dateRange: data.LLdateRange,
            },
          },
          idRoom: param?.id_room,
          token: userData?.token,
        };
        await updateRoom(newValue)
          .then((result) => {
            setLoading(false);
            Toast('success', 'Th??m h???p ?????ng th??nh c??ng');
          })
          .catch((err) => {
            setLoading(false);
          })
          .finally(() => {
            setSetFirstTab(3);
          });
      })
      .then((err) => console.log(err));
  };

  return (
    <div className="max-w-full mx-auto ">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        {data?.listMember?.length == 0 ? (
          <div>
            Ph??ng ch??a c?? th??nh vi??n
          </div>
        ) : (
          <div className="px-4 py-5 bg-white space-y-6 sm:p-6 mt-5 md:mt-0 md:col-span-3 border rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-5">H??nh ???nh h???p ?????ng sau khi ???? k??</label>
              <div className="flex flex-col gap-2 md:flex-row md:gap-6">
                {contractData?.imageContract &&
                  contractData?.imageContract.map((item: any, index: number) => (
                    <Image key="img" style={{ width: '200px', height: '200px', objectFit: 'cover' }} src={item} alt="" />
                  ))}
              </div>
              <div className="mt-5 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-white">
                <div className="space-y-1 text-center">
                  <ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber} dataURLKey="data_url">
                    {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                    }) => {
                      return (
                        <div className="relative cursor-pointer  rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <button style={isDragging ? { color: 'red' } : undefined} onClick={onImageUpload} {...dragProps}>
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Click or Drop here
                          </button>
                          &nbsp;
                          {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          <div className="flex flex-col md:flex-row items-center gap-10">
                            {imageList.map((image: any, index) => {
                              const imageFormat = image?.data_url || image;
                              return (
                                <div key={index} className="image-item">
                                  <Image style={{ width: '100px', height: '100px' }} src={imageFormat} alt="" />
                                  <div className="image-item__btn-wrapper flex gap-3">
                                    <button onClick={() => onImageUpdate(index)}>Update</button>
                                    <button onClick={() => onImageRemove(index)}>Remove</button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }}
                  </ImageUploading>
                </div>
              </div>
            </div>
            <div className="border p-5">
              <p className="mb-5">C??c th??ng tin nh???p ??? ????y s??? ???????c s??? d???ng cho vi???c xu???t/ in h???p ?????ng thu?? ph??ng</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="md:grid grid-cols-2 md:gap-10 sm:gap-6 gap-4">
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      N??i k?? h???p ?????ng  <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="string"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('addressCT', { required: true })}
                    />
                    {errors.addressCT?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng nh???p ?????a ch??? k?? h???p ?????ng!</span>
                    )}
                  </div>
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      Th???i gian k?? H??  <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="date"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('timeCT', { required: true })}
                    />
                    {errors.timeCT?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng ch???n th???i gian k?? h???p ?????ng!</span>
                    )}
                  </div>
                </div>

                <div className="md:grid grid-cols-2 md:gap-10 sm:gap-6 gap-4 mb-6">
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      Ng??y b???t ?????u H?? <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="date"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('startTime', { required: true })}
                    />
                    {errors.startTime?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng ch???n th???i gian b???t ?????u h???p ?????ng!</span>
                    )}
                  </div>
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      Ng??y k???t th??c H?? <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="date"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('endTime', { required: true })}
                    />
                    {errors.endTime?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng ch???n th???i gian k???t th??c h???p ?????ng!</span>
                    )}
                  </div>
                </div>
                <div className="md:grid grid-cols-2 md:gap-10 sm:gap-6 gap-4 ">
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      H??? v?? t??n ch??? tr??? <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="string"
                      placeholder="Nguy???n V??n A"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('LLname', { required: true })}
                    />
                    {errors.LLname?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng nh???p h??? v?? t??n c???a ch??? tr???!</span>
                    )}
                  </div>
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      S??? CMND/CCCD <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="string"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('LLcardNumber', {
                        required: true, minLength: 9, maxLength: 12, pattern: /^[0-9]+$/
                      })}
                    />
                    {errors.LLcardNumber?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng nh???p s??? CMND/CCCD!</span>
                    )}
                    {errors.LLcardNumber?.type === 'minLength' && (
                      <span className="text-[red] mt-1 block">S??? CMND/CCCD kh??ng ????ng ?????nh d???ng!</span>
                    )}
                    {errors.LLcardNumber?.type === 'maxLength' && (
                      <span className="text-[red] mt-1 block">S??? CMND/CCCD kh??ng ????ng d???nh d???ng!</span>
                    )}
                    {errors.LLcardNumber?.type === 'pattern' && (
                      <span className="text-[red] mt-1 block">S??? CMND/CCCD kh??ng ????ng d???nh d???ng!</span>
                    )}
                  </div>
                </div>
                <div className="md:grid grid-cols-2 md:gap-10 sm:gap-6 gap-4">
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      Ng??y c???p  <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="date"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('LLdateRange', { required: true })}
                    />
                    {errors.LLdateRange?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng ch???n ng??y c???p CMND/CCCD!</span>
                    )}
                  </div>

                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      N??i c???p <span className="text-[red]">*</span>
                    </label>
                    <input
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('LLIssuedBy', { required: true })}
                    />
                    {errors.LLIssuedBy?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng nh???p n??i c???p CMND/CCCD!</span>
                    )}
                  </div>
                </div>
                <div className="md:grid grid-cols-2 md:gap-10 sm:gap-6 gap-4 md:pb-10 pb-8">
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      S??? ??i???n tho???i li??n l???c <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="string"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('LLphoneNumber', {
                        required: true,
                        minLength: 10,
                        maxLength: 10,
                        pattern: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
                      })}
                    />
                    {errors.LLphoneNumber?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng nh???p s??? ??i???n tho???i!</span>
                    )}
                    {errors.LLphoneNumber?.type === 'minLength' && (
                      <span className="text-[red] mt-1 block">S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng!</span>
                    )}
                    {errors.LLphoneNumber?.type === 'maxLength' && (
                      <span className="text-[red] mt-1 block">S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng!</span>
                    )}
                    {errors.LLphoneNumber?.type === 'pattern' && (
                      <span className="text-[red] mt-1 block">S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng!</span>
                    )}
                  </div>
                </div>
                <div className="md:grid grid-cols-2 md:gap-10 sm:gap-6 gap-4">
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      Ng?????i ?????i di???n <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="string"
                      placeholder="Nguy???n V??n A"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('TNname', { required: true })}
                    />
                    {errors.TNname?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng nh???p h??? v?? t??n c???a ng?????i ?????i di???n!</span>
                    )}
                  </div>
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      S??? CMND/CCCD <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="string"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('TNcardNumber', {
                        required: true, minLength: 9, maxLength: 12, pattern: /^[0-9]+$/
                      })}
                    />
                    {errors.TNcardNumber?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng nh???p s??? CMND/CCCD!</span>
                    )}
                    {errors.TNcardNumber?.type === 'minLength' && (
                      <span className="text-[red] mt-1 block">S??? CMND/CCCD kh??ng ????ng ?????nh d???ng!</span>
                    )}
                    {errors.TNcardNumber?.type === 'maxLength' && (
                      <span className="text-[red] mt-1 block">S??? CMND/CCCD kh??ng ????ng d???nh d???ng!</span>
                    )}
                    {errors.TNcardNumber?.type === 'pattern' && (
                      <span className="text-[red] mt-1 block">S??? CMND/CCCD kh??ng ????ng d???nh d???ng!</span>
                    )}
                  </div>
                </div>
                <div className="md:grid grid-cols-2 md:gap-10 sm:gap-6 gap-4">
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      Ng??y c???p <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="date"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('TNdateRange', { required: true })}
                    />
                    {errors.TNdateRange?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng ch???n ng??y c???p c???a CMND/CCCD!</span>
                    )}
                  </div>
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      N??i c???p <span className="text-[red]">*</span>
                    </label>
                    <input
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('TNIssuedBy', { required: true })}
                    />
                    {errors.TNIssuedBy?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng nh???p n??i c???p c???a CMND/CCCD!</span>
                    )}
                  </div>
                </div>
                <div className="md:grid grid-cols-2 md:gap-10 sm:gap-6 gap-4">
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      S??? ??i???n tho???i li??n l???c <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="string"
                      className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3"
                      {...register('TNphoneNumber', {
                        required: true,
                        minLength: 10,
                        maxLength: 10,
                        pattern: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
                      })}
                    />
                    {errors.TNphoneNumber?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Vui l??ng nh???p s??? ??i???n tho???i!</span>
                    )}
                    {errors.TNphoneNumber?.type === 'minLength' && (
                      <span className="text-[red] mt-1 block">S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng!</span>
                    )}
                    {errors.TNphoneNumber?.type === 'maxLength' && (
                      <span className="text-[red] mt-1 block">S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng!</span>
                    )}
                    {errors.TNphoneNumber?.type === 'pattern' && (
                      <span className="text-[red] mt-1 block">S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng!</span>
                    )}
                  </div>
                  <div className="md:grid grid-cols-1 mb-4">
                    <label className="block text-gray-700 text-sm font-bold">
                      Ti???n c???c ph??ng <span className="text-[red]">*</span>
                    </label>
                    <NumericFormat
                      value={String(contractData?.infoTenant?.deposit)}
                      thousandSeparator="," className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3" defaultValue="0" {...register('TNDeposit', {
                        required: false,
                        min: 0
                      })}
                      onChange={(e) => {
                        setValue('TNDeposit', Number(e.target.value.split(',').join('')))
                      }}
                    />
                    {errors.TNDeposit?.type === 'required' && (
                      <span className="text-[red] mt-1 block">Nh???p s??? ti???n ph???t!</span>
                    )}
                    {errors.TNDeposit?.type === 'min' && (
                      <span className="text-[red] mt-1 block">Ti???n c???c kh??ng ???????c nh??? h??n 0 VN??!</span>
                    )}
                  </div>
                </div>
                <div className="md:grid grid-cols-2 md:gap-10 sm:gap-6 gap-4">
                  <div className="mb-4">
                    <div className="md:grid grid-cols-1 mb-4">
                      <label className="block text-gray-700 text-sm font-bold">
                        Ti???n ph???t n???u vi ph???m <span className="text-[red]">*</span>
                      </label>
                      <NumericFormat
                        value={String(contractData?.fine)}
                        thousandSeparator="," className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-10 md:col-span-3" defaultValue="0" {...register('fine', {
                          required: false,
                          min: 1000
                        })}
                        onChange={(e) => {
                          setValue('fine', Number(e.target.value.split(',').join('')))
                        }}
                      />
                      {errors.fine?.type === 'required' && (
                        <span className="text-[red] mt-1 block">Nh???p s??? ti???n ph???t!</span>
                      )}
                      {errors.fine?.type === 'min' && (
                        <span className="text-[red] mt-1 block">Ti???n ph???t t???i thi???u v?? kh??ng ???????c nh??? h??n 1,000 VN??!</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:grid grid-cols-1 mb-4">
                  <label className="block text-gray-700 text-sm font-bold">
                    Quy ?????nh b??? sung <span className="text-[red]">*</span>
                  </label>
                  <textarea id="" className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:col-span-7" {...register('additional', { maxLength: 80 })} />
                </div>
                <button
                  type="submit"
                  className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-4"
                >
                  L??u
                </button>
              </form>
              <button
                onClick={handlePrint}
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-4"
              >
                In h???p ?????ng
              </button>
            </div>

            <div className="hidden">
              <div ref={componentRef} className="w-10/12 m-auto">
                <div className="text-center">
                  <h1 className="font-bold">C???NG H??A X?? H???I CH??? NGH??A VI???T NAM</h1>
                  <p className="font-bold">?????c L???p - T??? Do - H???nh Ph??c</p>
                  <p>- - - o0o - - -</p>
                  <h1 className="font-bold pt-5">
                    H???P ?????NG <br /> CHO THU?? PH??NG TR???
                  </h1>
                </div>
                <div className="text-xs italic leading-5">
                  <p>- C??n c??? B??? lu???t D??n s??? s??? 91/2015/QH13 ng??y 24/11/2015 v?? c??c v??n b???n h?????ng d???n thi h??nh;</p>
                  <p>- C??n c??? Lu???t Nh?? ???, Lu???t ?????t ??ai v?? c??c v??n b???n h?????ng d???n thi h??nh;</p>
                  <p>- C??n c??? nhu c???u thu?? ph??ng tr??? c???a ??ng (B??) abc abc;</p>
                  <p>- C??n c??? v??o n??ng l???c v?? nhu c???u c???a c??c b??n ch??? th??? giao k???t h???p ?????ng. </p>
                </div>
                <div>
                  <p className="text-xs  pt-5  leading-5">
                    H??m nay, ng??y {contractData?.timeCT ? contractData?.timeCT.slice(8, 10) : '??????'} th??ng{' '}
                    {contractData?.timeCT ? contractData?.timeCT.slice(5, 7) : '??????'} n??m{' '}
                    {contractData?.timeCT ? contractData?.timeCT.slice(0, 4) : '??????'}., t???i ?????a ch???:{' '}
                    {contractData?.addressCT
                      ? contractData?.addressCT
                      : '?????????????????????????????????...............................................'}
                    <br />
                    Ch??ng t??i g???m c??:
                  </p>
                </div>
                <div className="pt-5">
                  <h1 className="font-bold text-sm  leading-5">B??N CHO THU??: </h1>
                  <p className="text-xs  leading-5">
                    <strong>??ng/b??: {contractData?.infoLandlord?.name ? contractData?.infoLandlord?.name : '??????????????????'} </strong> N??m Sinh:
                  </p>
                  <p className="text-xs leading-5">
                    CMND s???: {contractData?.infoLandlord?.cardNumber ? contractData?.infoLandlord?.cardNumber : '??????????????????'} <span className='ml-5'>Ng??y c???p:{' '}
                      {contractData?.infoLandlord?.dateRange ? moment(`${contractData?.infoLandlord?.dateRange}`).format('DD/MM/YYYY') : '??????????????????'}</span> <span className='ml-5'>N??i c???p:{' '}
                      {contractData?.infoLandlord?.issuedBy ? contractData?.infoLandlord?.issuedBy : '??????????????????'}</span>
                  </p>
                  <p className="text-xs  leading-5">?????a ch???: </p>
                  <p className="text-xs  leading-5">
                    ??i???n tho???i: {contractData?.infoLandlord?.phoneNumber ? contractData?.infoLandlord?.phoneNumber : '??????????????????'}
                  </p>
                  <p className="text-xs italic  leading-5">(Sau ????y ???????c g???i t???t l?? B??n a)</p>
                </div>
                <div>
                  <h1 className="font-bold text-sm  leading-5">B??N THU??: </h1>
                  <p className="text-xs  leading-5">
                    <strong>??ng/b??: {contractData?.infoTenant?.name ? contractData?.infoTenant?.name : '??????????????????'}</strong> N??m Sinh:
                  </p>
                  <p className="text-xs  leading-5">
                    CMND s???: {contractData?.infoTenant?.cardNumber ? contractData?.infoTenant?.cardNumber : '??????????????????'}, <span className='ml-5'>Ng??y c???p:{' '}
                      {contractData?.infoTenant?.dateRange ? moment(`${contractData?.infoTenant?.dateRange}`).format('DD/MM/YYYY') : '??????????????????'}</span> <span className='ml-5'>N??i c???p:{' '}
                      {contractData?.infoTenant?.issuedBy ? contractData?.infoTenant?.issuedBy : '??????????????????'}</span>
                  </p>
                  <p className="text-xs  leading-5">?????a ch???: </p>
                  <p className="text-xs  leading-5">
                    ??i???n tho???i: {contractData?.infoTenant?.phoneNumber ? contractData?.infoTenant?.phoneNumber : '??????????????????'}
                  </p>
                  <p className="text-xs italic  leading-5">(Sau ????y ???????c g???i t???t l?? B??n B)</p>
                </div>
                <div className="text-xs  leading-5">
                  <strong className="italic  leading-5">
                    Sau khi c??ng b??n b???c v?? tho??? thu???n tr??n tinh th???n h???p t??c, thi???n ch?? v?? b??nh ?????ng, Hai B??n nh???t tr?? k?? k???t
                    H???p ?????ng cho thu?? ph??ng tr??? (g???i t???t l?? H???p ?????ng) v???i c??c ??i???u kho???n sau ????y:
                  </strong>
                  <p className="font-bold text-base  leading-5">??i???u I: ?????i t?????ng c???a H???p ?????ng</p>
                  <p>
                    H???p ?????ng n??y l?? s??? tho??? thu???n gi???a B??n A v?? B??n B, theo ???? B??n A cho B??n B thu?? ph??ng tr??? thu???c quy???n qu???n
                    l??, s??? d???ng h???p ph??p c???a m??nh, c??n B??n B tr??? ti???n thu?? cho B??n A theo gi?? tr???, ph????ng th???c th???a thu???n
                    trong h???p ?????ng. C??? th??? nh?? sau :
                  </p>
                </div>
                <div className="text-xs  leading-5">
                  <h2 className="font-bold text-sm  leading-5">1. Ph??ng tr??? cho thu??</h2>
                  <p>Ph??ng tr??? cho thu?? c?? c??c ?????c ??i???m nh?? sau:</p>
                  <p>Ph??ng s???: . T???ng di???n t??ch s??? d???ng: {roomArea} m2</p>
                  <p>?????a ch???: </p>
                  <p>
                    B??n A ?????m b???o r???ng ph??ng tr??? n??i tr??n thu???c quy???n qu???n l?? v?? s??? d???ng h???p ph??p c???a m??nh, to??n b??? ph??ng tr???
                    cho thu?? kh??ng c?? tranh ch???p, khi???u ki???n v??? quy???n s??? h???u v?? quy???n s??? d???ng; Kh??ng b??? r??ng bu???c d?????i b???t k???
                    h??nh th???c n??o b???i c??c vi???c: mua, b??n, trao ?????i, t???ng, cho, cho thu??, cho m?????n, b??? k?? bi??n b???i c?? quan c??
                    th???m quy???n.
                  </p>
                  <p className="font-bold text-sm  leading-5">2. M???c ????ch thu?? ph??ng tr???:</p>
                  <p>
                    B??n B thu??, ????a v??o s??? d???ng ph??ng tr??? t???i ?????a ch???: ????? ??? theo nhu c???u c???a B??n B v?? theo ????ng quy ?????nh c???a
                    ph??p lu???t.
                  </p>
                  <h1 className="font-bold text-base  leading-5">
                    ??i???u II: Th???i h???n cho thu??, gi?? cho thu?? v?? ??i???u ki???n thanh to??n
                  </h1>
                  <p className="font-bold text-sm  leading-5">1. Th???i h???n cho thu??:</p>
                  <p>
                    T??? ng??y {contractData?.startTime ? contractData?.startTime.slice(8, 10) : '??????'} th??ng{' '}
                    {contractData?.startTime ? contractData?.startTime.slice(5, 7) : '??????'} n??m{' '}
                    {contractData?.startTime ? contractData?.startTime.slice(0, 4) : '??????'} ?????n h???t ng??y{' '}
                    {contractData?.endTime ? contractData?.endTime.slice(8, 10) : '??????'} th??ng{' '}
                    {contractData?.endTime ? contractData?.endTime.slice(5, 7) : '??????'} n??m{' '}
                    {contractData?.endTime ? contractData?.endTime.slice(0, 4) : '??????'}
                  </p>
                  <p className="font-bold text-sm  leading-5">2. Gi?? cho thu??: ?????ng/01/th??ng.</p>
                  <p className="font-bold text-sm  leading-5">3. ??i???u ki???n thanh to??n:</p>
                  <p>- ?????ng ti???n thanh to??n: ti???n VN??</p>
                  <p>- Ph????ng th???c thanh to??n: chuy???n kho???n ho???c ti???n m???t.</p>
                  <p>
                    - K??? thanh to??n: tr??? 1 th??ng/l???n, l???n ?????u tr??? ngay sau khi k?? H???p ?????ng. N???p ti???n thanh to??n s??? d???ng ph??ng
                    c???a th??ng sau v??o th???i ??i???m kh??ng qu?? ng??y ???. c???a th??ng tr?????c li???n k???.
                  </p>
                  <h1 className="font-bold text-base  leading-5">??i???u III: Quy???n v?? ngh??a v??? c???a B??n A</h1>
                  <p>
                    <strong className="font-bold text-sm  leading-5">1. B??n A c?? c??c quy???n sau ????y:</strong>
                  </p>
                  <p>- Nh???n ti???n cho thu?? ph??ng tr??? theo ????ng k??? h???n ???? th???a thu???n v???i B??n B;</p>
                  <p>
                    - C??ng B??n B th???a thu???n s???a ?????i, b??? sung c??c ??i???u kho???n trong H???p ?????ng ho???c l???p Ph??? l???c H???p ?????ng cho ph??
                    h???p v???i ??i???u ki???n c???a th???c t??? v?? nhu c???u c???a C??c B??n. Vi???c th???a thu???n s???a ?????i, b??? sung c??c ??i???u kho???n
                    trong H???p ?????ng ho???c l???p Ph??? l???c H???p ?????ng ph???i ???????c l???p th??nh v??n b???n c?? ch??? k?? x??c nh???n h???p l??? c???a Hai B??n
                    m???i c?? gi?? tr??? th???c hi???n;
                  </p>
                  <p>- ???????c nh???n l???i ph??ng tr??? cho thu?? khi h???t h???n H???p ?????ng;</p>
                  <p>
                    - ????n ph????ng ch???m d???t H???p ?????ng v???i B??n B, di chuy???n t??i s???n c???a B??n B ra ngo??i v?? kh??a c???a ph??ng tr???,
                    kh??ng ho??n l???i ti???n cho thu?? ph??ng tr??? ???? nh???n, ph???t vi ph???m H???p ?????ng v?? y??u c???u b???i th?????ng thi???t h???i khi
                    B??n B c?? m???t trong c??c h??nh vi sau ????y:
                  </p>
                  <p className="italic">+ Kh??ng thanh to??n ????? ti???n thu?? ph??ng tr??? cho B??n A ????ng th???i h???n;</p>
                  <p className="italic">
                    + Kh??ng s???a ch???a ho???c thay th??? thi???t b??? c???a B??n A b??? h?? h???ng trong qu?? tr??nh s??? d???ng;
                  </p>
                  <p className="italic">+ S??? d???ng ph??ng tr??? kh??ng ????ng m???c ????ch ???? thu?? t???i ??i???u I c???a H???p ?????ng;</p>
                  <p className="italic">
                    + Vi ph???m ph??p lu???t, g??y m???t an ninh tr???t t??? c??ng c???ng, g??y ch??y, n???, l??m m???t v??? sinh m??i tr?????ng v?? ???nh
                    h?????ng nghi??m tr???ng ?????n ho???t ?????ng b??nh th?????ng c???a khu v???c xung quanh;
                  </p>
                  <p>
                    <strong className="font-bold text-sm">2. B??n A c?? c??c ngh??a v??? sau ????y:</strong>
                  </p>
                  <p>- B??n giao ph??ng tr??? cho B??n B ????ng th???i gian ???? tho??? thu???n;</p>
                  <p>- C???p ngu???n ??i???n, n?????c ri??ng c?? c??ng t?? ??o ?????m cho B??n B s??? d???ng;</p>
                  <p>
                    - T???o ??i???u ki???n ?????m b???o cho B??n B s??? d???ng ph??ng tr??? ???? thu?? ???n ?????nh, tr???n v???n, ?????c l???p trong th???i h???n B??n
                    B thu??;
                  </p>
                  <p className="font-bold text-base">??i???u IV: Quy???n v?? ngh??a v??? c???a B??n B</p>
                  <p>
                    <strong className="font-bold text-sm">1. B??n B c?? c??c quy???n sau ????y:</strong>
                  </p>
                  <p>- Nh???n b??n giao ph??ng tr??? thu?? theo ????ng th???a thu???n v???i B??n A;</p>
                  <p>
                    - ???????c b??? tr??, l???p ?????t th??m c??c trang, thi???t b??? ph?? h???p v???i nhu c???u s??? d???ng t???i ph??ng tr??? nh??ng kh??ng ???nh
                    h?????ng ?????n ????? an to??n c???a k???t c???u, ki???n tr??c, thi???t k??? chung c???a ph??ng. Chi ph?? mua s???m v?? l???p ?????t c??c
                    trang thi???t b??? tr??n B??n B t??? ?????u t?? v?? ph???i t??? th??o d??? tr??? l???i nguy??n tr???ng ph??ng ban ?????u cho B??n A khi
                    tr??? ph??ng.
                  </p>
                  <p>
                    - C??ng B??n B th???a thu???n s???a ?????i, b??? sung c??c ??i???u kho???n trong H???p ?????ng ho???c l???p Ph??? l???c H???p ?????ng cho ph??
                    h???p v???i ??i???u ki???n c???a th???c t??? v?? nhu c???u c???a C??c B??n. Vi???c th???a thu???n s???a ?????i, b??? sung c??c ??i???u kho???n
                    trong H???p ?????ng ho???c l???p Ph??? l???c H???p ?????ng ph???i ???????c l???p th??nh v??n b???n c?? ch??? k?? x??c nh???n h???p l??? c???a C??c B??n
                    m???i c?? gi?? tr??? th???c hi???n;
                  </p>
                  <p>
                    <strong className="font-bold text-sm">2. B??n B c?? c??c ngh??a v??? sau ????y:</strong>
                  </p>
                  <p>- S??? d???ng ph??ng tr??? theo ????ng m???c ????ch ????? ??? ???? th???a thu???n v???i B??n A t???i H???p ?????ng;</p>
                  <p>- Tr??? ????? v?? ????ng k??? h???n ti???n thu?? ph??ng tr??? nh?? ???? th???a thu???n v???i B??n A ;</p>
                  <p>
                    - Tr??? ti???n ??i???n, n?????c, v??? sinh v?? c??c chi ph?? ph??t sinh kh??c (n???u c??) trong th???i gian thu?? ph??ng c??n c???
                    theo ch??? s??? th???c t??? s??? d???ng;
                  </p>
                  <p>
                    - B???o qu???n v?? gi??? g??n cho B??n A c??c t??i s???n, trang thi???t b??? trong ph??ng tr??? B??n A ???? b??n giao, n???u h?? h???ng
                    B??n B ph???i s???a ch???a ho???c thay th??? (tr??? tr?????ng h???p h?? h???ng do hao m??n t??? nhi??n);
                  </p>
                  <p>
                    - Ch???p h??nh c??c quy ?????nh c???a Nh?? n?????c, ch??nh quy???n ?????a ph????ng v?? t??? ch???u tr??ch nhi???m v??? b???o v??? an ninh
                    tr???t t???, v??? sinh, an to??n v??? ng?????i v?? t??i s???n c???a m??nh, t??? khai b??o ????ng k?? t???m tr??, t???m v???ng theo quy
                    ?????nh c???a ph??p lu???t;
                  </p>
                  <p>- B???i th?????ng thi???t h???i cho B??n A n???u ????? x???y ra ch??y, n??? ho???c g??y h?? h???ng ?????i v???i t??i s???n c???a B??n A;</p>
                  <p>- B??n giao l???i ph??ng tr??? cho B??n A khi h???t h???n h???p ?????ng thu?? ph??ng tr???.</p>
                  <p>
                    - Khi B??n B ????n ph????ng ch???m d???t th???c hi???n H???p ?????ng kh??ng ????ng quy ?????nh c???a ph??p lu???t ho???c kh??ng ????ng th???a
                    thu???n trong H???p ?????ng n??y, B??n B ph???i c?? ngh??a v??? n???p ph???t vi ph???m cho B??n A s??? ti???n l??{' '}
                    {roomPrice ? roomPrice : '?????????????????????'} ?????ng ({roomPrice ? roomPrice : '?????????????????????'} ?????ng Vi???t Nam).
                  </p>
                  {contractData?.additional
                    ? `${contractData?.additional.join('\n')}`
                      .split('\n')
                      .map((item: any) => <p key={item}>{item}</p>)
                    : '?????????????????????'}
                  <p>
                    <strong className="font-bold text-base"> ??i???u V: ??i???u kho???n chung</strong>
                  </p>
                  <p>
                    1. Hai B??n cam k???t th???c hi???n ????ng v?? ?????y ????? c??c ??i???u kho???n ???? ghi trong b???n H???p ?????ng, n???u B??n n??o vi ph???m
                    ph???i ch???u ph???t vi ph???m v?? ph???i b???i th?????ng thi???t h???i cho B??n kia ho???c B??n th??? ba (n???u c??)t????ng ???ng v???i m???c
                    ????? l???i vi ph???m v?? thi???t h???i th???c t??? x???y ra.
                  </p>
                  <p>
                    2. Trong qu?? tr??nh th???c hi???n H???p ?????ng n???u ph??t sinh tranh ch???p, Hai B??n s??? c??ng nhau th????ng l?????ng v?? h??a
                    gi???i tr??n tinh th???n thi???n ch??, h???p t??c, t??n tr???ng l???n nhau. Trong tr?????ng h???p kh??ng th????ng l?????ng ???????c,
                    tranh ch???p s??? ???????c gi???i quy???t b???ng con ???????ng T??a ??n theo quy ?????nh c???a h??? th???ng ph??p lu???t Vi???t Nam.
                  </p>
                </div>
                <div className="text-xs mt-16 mb-[100px] font-bold ">
                  <p className="text-right pr-[100px]"> Ng??y.... Th??ng.... N??m </p>
                  <div className="grid grid-cols-2 text-center pt-5">
                    <div className="grid grid-cols-1">
                      <p> B??N A</p>
                      <p className="pt-14">{contractData?.infoLandlord?.name}</p>
                    </div>

                    <div>
                      <p className="">B??N B</p>
                      <p className="pt-14">{contractData?.infoTenant?.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantContract;