import React, {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/router';
import moment from 'moment';
import {Table} from 'antd';

import {listReports, updateReport} from 'src/pages/api/notification';
import UpdateReport from 'src/pages/manager/landlord/[id]/report/update';
import {useUserContext} from '@/context/UserContext';
import {Toast} from 'src/hooks/toast';

const {Column} = Table;

const Resport: React.FC = () => {
  const {cookies, setLoading} = useUserContext();
  const [report, setReport] = useState<any>([]);
  const userData = cookies?.user;
  const router = useRouter();
  const {id} = router.query;
  const {resetPage, setResetPage} = useUserContext();

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        const {data} = await listReports({id, userData});
        setReport(data.data);
        setLoading(false);
      })();
    }
  }, [id, resetPage, setLoading, userData]);

  const onHandleUpdate = async (report: any) => {
    setLoading(true);
    await updateReport(report)
      .then(() => {
        Toast('success', 'Update thành công');
      })
      .catch(err => {
        Toast('error', err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
        setResetPage(resetPage + 1);
      });
  };

  const [noProcess, processed] = useMemo(
    () =>
      (report ?? []).reduce(
        (prevState: any, nextState: any) => {
          if (nextState?.status) {
            prevState[0].push(nextState);
          } else {
            prevState[1].push(nextState);
          }
          return prevState;
        },
        [[], []],
      ),
    [report],
  );

  return (
    <div className="">
      <Table
        dataSource={processed?.reverse().map(
          (
            item: {
              _id: any;
              roomName: any;
              content: any;
              createdAt: moment.MomentInput;
              status: any;
            },
            index: number,
          ) => ({
            index: index + 1,
            key: item._id,
            name: item.roomName,
            content: item.content,
            date: moment(item.createdAt).format('DD/MM/YYYY'),
            status: item.status,
          }),
        )}
        pagination={{pageSize: 3}}>
        <Column title="STT" dataIndex="index" key="name" />
        <Column title="Phòng" dataIndex="name" key="name" />
        <Column
          title="Nội dung"
          dataIndex="content"
          key="content"
          width={500}
        />
        <Column title="Ngày thông báo" dataIndex="date" key="date" />
        <Column
          title="Trạng thái"
          dataIndex="status"
          key="date"
          render={status =>
            status == false ? (
              <div
                className="p-2 text-center text-sm text-red-700 bg-red-100 rounded-lg "
                role="alert">
                <div>
                  <span className="font-medium">Chưa xử lý</span>
                </div>
              </div>
            ) : (
              <div></div>
            )
          }
        />
        <Column
          title=""
          key="action"
          render={action => (
            <UpdateReport
              id={action.key}
              onUpdate={onHandleUpdate}></UpdateReport>
          )}
        />
      </Table>
      <Table
        dataSource={noProcess?.reverse().map(
          (
            item: {
              _id: any;
              roomName: any;
              content: any;
              createdAt: moment.MomentInput;
              status: any;
            },
            index: number,
          ) => ({
            index: index + 1,
            key: item._id,
            name: item.roomName,
            content: item.content,
            date: moment(item.createdAt).format('DD/MM/YYYY'),
            status: item.status,
          }),
        )}
        pagination={{pageSize: 3}}>
        <Column title="STT" dataIndex="index" key="name" />
        <Column title="Phòng" dataIndex="name" key="name" />
        <Column
          title="Nội dung"
          dataIndex="content"
          key="content"
          width={500}
        />
        <Column title="Ngày thông báo" dataIndex="date" key="date" />
        <Column
          title="Trạng thái"
          dataIndex="status"
          key="date"
          render={status =>
            status == true ? (
              <div
                className=" p-2 text-center text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
                role="alert">
                <div>
                  <span className="font-medium">Đã xử lý</span>
                </div>
              </div>
            ) : (
              <div></div>
            )
          }
        />
        <Column
          title=""
          key="action"
          render={action => (
            <UpdateReport
              id={action.key}
              onUpdate={onHandleUpdate}></UpdateReport>
          )}
        />
      </Table>
    </div>
  );
};

export default Resport;
