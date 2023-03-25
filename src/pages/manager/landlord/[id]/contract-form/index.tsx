import 'react-slideshow-image/dist/styles.css';
import 'react-quill/dist/quill.bubble.css';
import React, {useEffect, useState} from 'react';
import {Slide} from 'react-slideshow-image';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import {useUserContext} from '@/context/UserContext';
import {listContract} from 'src/pages/api/contract';

const ReactQuill = dynamic(import('react-quill'), {ssr: false});

const ContractForm: React.FC = () => {
  const [contract1, setContract] = useState([]);
  const {setLoading} = useUserContext();

  const router = useRouter();
  const param = router.query;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const {data} = await listContract();
      setContract(data.data);
      setLoading(false);
    })();
  }, [setLoading]);

  return (
    <>
      <p className=" mb-5 mt-5">
        <Link href={`/manager/landlord/${param.id}/contract-form/add`}>
          <a className="bg-cyan-400 text-white rounded-md px-5 py-3  mb-5 hover:bg-cyan-500">
            Thêm hợp đồng
          </a>
        </Link>
      </p>
      <Slide>
        {contract1?.map((item: any, index: number) => (
          <div key={index} className="m-5  ">
            <div className=" snap-start ">
              <h1 key={index} className="text-xl font-bold =">
                {item?.title}
              </h1>
              <ReactQuill
                value={item?.content}
                readOnly={true}
                theme={'bubble'}
                className="border mt-5"
              />
            </div>
          </div>
        ))}
      </Slide>
    </>
  );
};

export default ContractForm;
