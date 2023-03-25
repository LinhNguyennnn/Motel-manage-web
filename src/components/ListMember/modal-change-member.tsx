import React, {useEffect, useState} from 'react';
import {Button, Form, Modal, Select, Typography} from 'antd';
import {useRouter} from 'next/router';

import {IListRoomType, ITypeChangeOneMember} from './type';
import {useUserContext} from '@/context/UserContext';
import {Toast} from 'src/hooks/toast';
import {
  changeAllMemberApi,
  changeOneMemberApi,
  listRoom,
} from 'src/pages/api/room';

type Props = {
  openModal: boolean;
  setOpenModal: (data: boolean) => void;
  name: string;
  phoneNumber: string;
  cardNumber: string;
  idMember: string;
  data: any;
  check: string;
};

const {Option} = Select;
const {Title} = Typography;

const ModalChangeMember: React.FC<Props> = props => {
  const [listRooms, setListRooms] = useState<[]>([]);
  const {cookies, setLoading} = useUserContext();
  const router = useRouter();
  const param = router.query;
  const id = param.id;
  const userData = cookies?.user;

  useEffect(() => {
    if (id && userData) {
      (async () => {
        setLoading(true);
        const {data} = await listRoom(id, userData);
        setListRooms(data.data);
        setLoading(false);
      })();
    }
  }, [id, userData, setLoading]);

  const [form] = Form.useForm();
  const onFinish = async (values: ITypeChangeOneMember) => {
    if (props.check == '1') {
      try {
        setLoading(true);
        const data = {
          idOldRoom: param.id_room,
          dataMember: {
            _id: props.idMember,
            cardNumber: props.cardNumber,
            memberName: props.name,
            phoneNumber: props.phoneNumber,
          },
          idNewRoom: values.idNewRoom,
        };
        await changeOneMemberApi(data);
        Toast('success', 'Chuyển sang phòng mới thành công!');
        props.setOpenModal(false);
        router.push(`/manager/landlord/${id}/list-room`);
      } catch (error: any) {
        Toast('error', error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const data = {
          idOldRoom: param.id_room,
          dataMember: props.data,
          idNewRoom: values.idNewRoom,
        };
        await changeAllMemberApi(data);
        Toast('success', 'Chuyển sang phòng mới thành công!');
        props.setOpenModal(false);
        router.push(`/manager/landlord/${id}/list-room`);
      } catch (error: any) {
        Toast('error', error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      centered
      open={props.openModal}
      onCancel={() => props.setOpenModal(false)}
      footer={[
        <Button key="cancel" onClick={() => props.setOpenModal(false)}>
          Quay lại
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form
              .validateFields()
              .then(values => {
                onFinish(values);
              })
              .catch(info => {
                console.log('Validate Failed:', info);
              });
          }}>
          Chuyển
        </Button>,
      ]}>
      <Form name="basic" form={form}>
        <Title level={5}>Chọn phòng muốn chuyển tới</Title>
        <Form.Item
          name="idNewRoom"
          rules={[{required: true, message: 'Vui lòng chọn phòng!'}]}>
          <Select
            style={{width: '100%'}}
            placeholder="Vui lòng chọn phòng muốn chuyển đến!">
            {listRooms?.map((room: IListRoomType) => {
              if (
                room?.status == true &&
                room?.listMember?.length < room.maxMember
              ) {
                return (
                  <Option value={room._id} label={room.name} key={room._id}>
                    {room.name}
                  </Option>
                );
              }
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalChangeMember;
