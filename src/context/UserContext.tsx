import React, {useContext, createContext, useState} from 'react';
import useCookies from 'react-cookie/cjs/useCookies';
import {useRouter} from 'next/router';

import {Toast} from 'src/hooks/toast';

export interface UserState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  user: any;
  setUser: (loading: any) => void;
  dateOfBirth: number;
  setDateOfBirth: (loading: number) => void;
  resetPage: number;
  setResetPage: (loading: number) => void;
  phoneNumber: string;
  setPhoneNumber: (loading: string) => void;
  token: string;
  setToken: (loading: string) => void;
  logoutResetData: () => void;
  cookies: any;
  setCookie: any;
  actives: any;
  setActives: (loading: string) => void;
}

const UserContext = createContext<UserState | null>(null);

type Props = {
  children: React.ReactNode;
};

export const useUserContext = (): UserState =>
  useContext(UserContext) as UserState;

export const UserProvider: React.FC<Props> = ({children}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(0);
  const [resetPage, setResetPage] = useState(0);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [token, setToken] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['user', 'code_room']);
  const pathnameUrl = router.pathname.split('/');
  const [actives, setActives] = useState(pathnameUrl[4] || '');

  const logoutResetData = () => {
    setLoading(true);
    removeCookie('user', {path: '/', maxAge: 30 * 24 * 60 * 60});
    removeCookie('code_room', {path: '/', maxAge: 7 * 24 * 60 * 60});
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    router.push('/');
    Toast('success', 'Đăng xuất thành công!');
  };

  const value: UserState = {
    loading,
    setLoading,
    user,
    setUser,
    dateOfBirth,
    setDateOfBirth,
    resetPage,
    setResetPage,
    phoneNumber,
    setPhoneNumber,
    token,
    setToken,
    logoutResetData,
    cookies,
    setCookie,
    actives,
    setActives,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
