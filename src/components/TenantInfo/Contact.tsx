import React from 'react';
import {Image} from 'antd';

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

export type IContractData = {
  addressCT: string;
  timeCT: string;
  startTime: string;
  endTime: string;
  additional: any;
  fine: number;
  imageContract: any;
};

type Props = {
  dataContract: IContractData;
  handleResetPage: () => void;
};

const Contact: React.FC<Props> = ({dataContract}) => {
  return dataContract?.imageContract?.length ? (
    <div className="flex gap-2 flex-wrap justify-around">
      {dataContract.imageContract.map((item: any, index: number) => (
        <div key={index} className="">
          <Image style={{width: '150px'}} src={item} alt="" />
        </div>
      ))}
    </div>
  ) : (
    <h2 className="uppercase text-2xl">Không có ảnh hợp đồng</h2>
  );
};

export default Contact;
