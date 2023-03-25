import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Modal} from 'antd';

import {createBillLiquidation} from 'src/pages/api/bill';
import {liquiBill, readRoom} from 'src/pages/api/room';
import TabPanelComponent from '@/components/TabPanel';
import {useUserContext} from '@/context/UserContext';
import LiquidationBill from './LiquidationBill';
import {Toast} from 'src/hooks/toast';
import Deposit from './Deposit';
import Contact from './Contact';
import Member from './Member';

type Props = {
  open: boolean;
  onCloseModal: () => void;
  setOpen: (data: boolean) => void;
  resetDataLiquid: () => void;
};

const ModailLiquidation: React.FC<Props> = ({
  open,
  onCloseModal,
  setOpen,
  resetDataLiquid,
}) => {
  const [roomData, setRoomData] = useState<any>({});
  const [liquidationBill, setLiquidationBill] = useState<any>({});
  const {cookies, setLoading} = useUserContext();
  const [resetPage, setResetPage] = useState(0);
  const userData = cookies?.user;
  const router = useRouter();
  const param = router.query;

  const handleResetPage = () => {
    setResetPage(resetPage + 1);
  };

  useEffect(() => {
    if (param.id) {
      (async () => {
        setLoading(true);
        try {
          const {data} = await readRoom(`${param.id_room}`, userData as any);
          if (data.data) {
            setRoomData(data.data);
          }
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [param, setLoading, userData, resetPage]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const {data} = await liquiBill(
        {idRoom: param?.id_room, idHouse: param?.id},
        userData?.token,
      );
      setLiquidationBill(data);
      setLoading(false);
    })();
  }, [param, setLoading, userData?.token]);

  const onSubmit = async () => {
    setLoading(true);
    await createBillLiquidation({
      idRoom: param?.id_room,
      idHouse: param?.id,
      invoiceService: liquidationBill,
      listMember: roomData?.listMember,
      contract: roomData?.contract?.imageContract,
      idAuth: userData?.user?._id,
      deposit: roomData?.contract?.infoTenant?.deposit,
    })
      .then(result => {
        Toast('success', result?.data?.message);
        setOpen(false);
        resetDataLiquid();
      })
      .catch(error => {
        Toast('error', error?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const data = [
    {
      label: 'Hóa đơn',
      value: 0,
      children: (
        <LiquidationBill
          data={liquidationBill}
          handleResetPage={() => handleResetPage()}
        />
      ),
    },
    {
      label: 'Tiền cọc',
      value: 1,
      children: (
        <Deposit
          dataContract={roomData.contract}
          handleResetPage={() => handleResetPage()}
        />
      ),
    },
    {
      label: 'Thành viên',
      value: 2,
      children: (
        <Member
          data={roomData.listMember}
          handleResetPage={() => handleResetPage()}
        />
      ),
    },
    {
      label: 'Hợp đồng',
      value: 3,
      children: (
        <Contact
          dataContract={roomData.contract}
          handleResetPage={() => handleResetPage()}
        />
      ),
    },
  ];
  return (
    <Modal
      open={open}
      onCancel={onCloseModal}
      okButtonProps={{hidden: true}}
      cancelButtonProps={{hidden: true}}>
      <div className="manage-room-container">
        <TabPanelComponent data={data} />
        <button
          onClick={() => onSubmit()}
          className="flex py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Thanh lý
        </button>
      </div>
    </Modal>
  );
};

export default ModailLiquidation;
