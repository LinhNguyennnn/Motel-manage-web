import React from 'react';
import moment from 'moment';
import {Table} from 'antd';

const {Column} = Table;

type Props = {
  data: any;
};

const TabPeople: React.FC<Props> = ({data}) => {
  return (
    <Table
      dataSource={data
        .filter((item: {model: string}) => item.model === 'Room')
        .map((item: any, index: number) => ({
          key: index,
          index: index + 1,
          content: item.content,
          title: item.title,
          date: moment(item.createdAt).format('DD/MM/YYYY'),
        }))}
      pagination={{pageSize: 6}}>
      <Column title="STT" dataIndex="index" key="index" />
      <Column title="Tiêu đề" dataIndex="title" key="title" />
      <Column
        title="Nội dung"
        dataIndex="content"
        key="content"
        width={500}
        render={content => {
          return <div dangerouslySetInnerHTML={{__html: content}}></div>;
        }}
      />
      <Column title="Ngày" dataIndex="date" key="date" />
    </Table>
  );
};

export default TabPeople;
