import {useEffect} from 'react';
import {useRouter} from 'next/router';

import {useUserContext} from '@/context/UserContext';
import {readRoomData} from 'src/pages/api/room';
import {getInfoUser} from 'src/pages/api/auth';
import {Toast} from 'src/hooks/toast';

type PrivateRouterProps = {
  children: JSX.Element;
};

export const PrivateRouter: React.FC<PrivateRouterProps> = (
  props: PrivateRouterProps,
) => {
  const {cookies} = useUserContext();
  const router = useRouter();
  useEffect(() => {
    if (!cookies?.user) {
      router.push('/auth/signin');
    }
  }, [cookies?.user, router]);
  return props.children;
};

export const CheckUser: React.FC<PrivateRouterProps> = props => {
  const {cookies, logoutResetData} = useUserContext();
  const userData = cookies?.user;
  const router = useRouter();
  if (cookies?.user) {
    (async () => {
      await getInfoUser(userData?.user?._id, userData?.token)
        .then(() => {
          return props.children;
        })
        .catch(error => {
          Toast(
            'error',
            error?.response?.data?.message + 'và đăng xuất sau 2s',
          );
          setTimeout(() => {
            logoutResetData();
          }, 2000);
        });
    })();
  }
  if (cookies?.code_room) {
    (async () => {
      await readRoomData(cookies?.code_room?._id)
        .then(() => {
          router.push('/manager/ternant');
        })
        .catch(error => {
          Toast(
            'error',
            error?.response?.data?.message + 'và đăng xuất sau 2s',
          );
          setTimeout(() => {
            logoutResetData();
          }, 2000);
        });
    })();
  }
  return props.children;
};

export const CheckCodeRoom: React.FC<PrivateRouterProps> = (
  props: PrivateRouterProps,
) => {
  const {cookies} = useUserContext();
  const router = useRouter();
  useEffect(() => {
    if (!cookies?.code_room) {
      router.push('/');
    }
  }, [cookies?.code_room, router]);
  return props.children;
};

export default PrivateRouter;
