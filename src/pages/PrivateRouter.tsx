import { useUserContext } from '@/context/UserContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toast } from 'src/hooks/toast';
import { getInfoUser } from 'src/pages/api/auth';
import { readRoomData } from 'src/pages/api/room';

type PrivateRouterProps = {
  children: JSX.Element;
};

export const PrivateRouter = (props: PrivateRouterProps) => {
  const { cookies } = useUserContext();
  const router = useRouter();
  useEffect(() => {
    if (!cookies?.user) {
      router.push(`/auth/signin`);
    }
  }, [cookies?.user, router]);
  return props.children;
};

export const CheckUser = (props: PrivateRouterProps) => {
  const { cookies, logoutResetData } = useUserContext();
  const userData = cookies?.user;
  const router = useRouter();
  if (cookies?.user) {
    const getUsers = async () => {
      await getInfoUser(userData?.user?._id, userData?.token)
        .then(() => {
          return props.children;
        })
        .catch((error) => {
          Toast('error', error?.response?.data?.message + 'và đăng xuất sau 2s');
          setTimeout(() => {
            logoutResetData();
          }, 2000);
        });
    };
    getUsers();
  }
  if (cookies?.code_room) {
    const getDataRoom = async () => {
      await readRoomData(cookies?.code_room?._id)
        .then(() => {
          router.push('/manager/ternant');
        })
        .catch((error) => {
          Toast('error', error?.response?.data?.message + 'và đăng xuất sau 2s');
          setTimeout(() => {
            logoutResetData();
          }, 2000);
        });
    };
    getDataRoom();
  }
  return props.children;
};

export const CheckCodeRoom = (props: PrivateRouterProps) => {
  const { cookies, logoutResetData } = useUserContext();
  const router = useRouter();
  useEffect(() => {
    if (!cookies?.code_room) {
      router.push('/');
    }
  }, [cookies?.code_room, router]);
  return props.children;
}

export default PrivateRouter;
