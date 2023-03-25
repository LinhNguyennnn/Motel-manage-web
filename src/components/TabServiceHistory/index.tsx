import React from 'react';
import moment from 'moment';
import {Table} from 'antd';

const {Column} = Table;

type Props = {
  data: any;
};

const TabServiceHistory: React.FC<Props> = ({data}) => {
  return (
    <Table
      dataSource={data
        .filter((item: {model: string}) => item.model === 'Service')
        .map((item: any, index: number) => ({
          key: index,
          index: index + 1,
          content: item.content,
          model: item.model,
          title: item.title,
          date: moment(item.createdAt).format('DD/MM/YYYY'),
        }))}
      pagination={{pageSize: 6}}>
      <Column title="STT" dataIndex="index" key="index" />
      <Column title="Tiêu đề" dataIndex="title" key="title" />
      <Column
        title="Nội dung"
        dataIndex="content"
        key="contents"
        width={500}
        render={content => {
          return <div dangerouslySetInnerHTML={{__html: content}}></div>;
        }}
      />
      <Column title="Ngày " dataIndex="date" key="date" />
    </Table>
  );
};

export default TabServiceHistory;
