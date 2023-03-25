import React, {useState} from 'react';
import {Modal} from 'antd';

import TabPanelComponent from '@/components/TabPanel';
import DetailDeposit from './DetailDeposit';
import DetailContact from './DetailContact';
import DetailMember from './DetailMember';
import BillLiqui from './BillLiqui';

type Props = {
  open: boolean;
  onCloseModal: () => void;
  detailBill: any;
};

const ModalDeatil: React.FC<Props> = ({open, onCloseModal, detailBill}) => {
  const [resetPage, setResetPage] = useState(0);

  const handleResetPage = () => {
    setResetPage(resetPage + 1);
  };

  const data = [
    {
      label: 'Hóa đơn',
      value: 0,
      children: <BillLiqui data={detailBill} />,
    },
    {
      label: 'Tiền cọc',
      value: 1,
      children: <DetailDeposit data={detailBill} />,
    },
    {
      label: 'Thành viên',
      value: 2,
      children: <DetailMember data={detailBill} />,
    },
    {
      label: 'Hợp đồng',
      value: 3,
      children: (
        <DetailContact
          data={detailBill}
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
      </div>
    </Modal>
  );
};

export default ModalDeatil;
