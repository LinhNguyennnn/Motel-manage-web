import {toast} from 'react-toastify';

export const Toast = (type: string, message: string): void => {
  switch (type) {
    case 'success':
      toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      break;

    case 'error':
      toast.error(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      break;

    case 'warn':
      toast.warn(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      break;

    case 'info':
      toast.info(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      break;

    default:
      toast(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      break;
  }
};
