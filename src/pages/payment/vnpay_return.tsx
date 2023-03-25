import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import {checkBillUpdateAccount} from '../api/payment';
import {useUserContext} from '@/context/UserContext';
import {getInfoUser} from '../api/auth';
import {Toast} from 'src/hooks/toast';

const VNpayReturn: React.FC = () => {
  const router = useRouter();
  const param = router.query;
  const {setLoading, cookies, setCookie} = useUserContext();
  const userData = cookies?.user;

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (param) {
      (async () => {
        setLoading(true);
        await checkBillUpdateAccount(param)
          .then(async result => {
            if (result.status == 200) {
              Toast(
                'success',
                'Sẽ chuyển bạn đến trang thông tin tài khoản sau 5s',
              );
              setTimeout(() => {
                router.push('/auth/information');
              }, 5000);
              setSuccess(true);
              await getInfoUser(userData?.user._id, userData?.token)
                .then(({data}) => {
                  const newData = {
                    token: userData?.token,
                    user: data.data,
                  };

                  setCookie('user', JSON.stringify(newData), {
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60,
                  });
                })
                .catch(() => {
                  Toast('error', 'Không lấy được dữ liệu mới của người dùng!');
                });
            } else {
              Toast('error', 'Xác thực chữ kí không thành công!');
            }
          })
          .finally(() => {
            setLoading(false);
          });
      })();
    }
  }, [param, router, setCookie, setLoading, userData]);

  return (
    <div className="min-h-80vh container mx-auto">
      {success && (
        <div className="py-auto text-2xl text-center mt-6">
          Nâng cấp tài khoản thành công ! <br />
          Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!
        </div>
      )}
    </div>
  );
};

export default VNpayReturn;
