import React, {useEffect} from 'react';
import {useRouter} from 'next/router';

import {checkPaymentReturn} from 'src/pages/api/payment';
import {useUserContext} from '@/context/UserContext';
import {Toast} from 'src/hooks/toast';

const ReturnPayment: React.FC = () => {
  const router = useRouter();
  const param = router.query;
  const {setLoading, cookies} = useUserContext();

  useEffect(() => {
    if (param) {
      (async () => {
        setLoading(true);
        await checkPaymentReturn(cookies?.code_room?.idHouse, param)
          .then(result => {
            if (result.status == 200) {
              Toast('success', 'Sẽ chuyển bạn đến trang hóa đơn sau 2s');
              setTimeout(() => {
                router.push('/manager/ternant/receipt');
              }, 2000);
            } else {
              Toast('error', 'Xác thực chữ kí không thành công!');
            }
          })
          .finally(() => {
            setLoading(false);
          });
      })();
    }
  }, [cookies?.code_room?.idHouse, param, router, setLoading]);

  return <div>ReturnPayment</div>;
};

export default ReturnPayment;
