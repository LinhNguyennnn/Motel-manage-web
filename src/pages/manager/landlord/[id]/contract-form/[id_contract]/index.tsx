import 'react-quill/dist/quill.snow.css';
import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';

import {useUserContext} from '@/context/UserContext';
import {Toast} from 'src/hooks/toast';

const ReactQuill = dynamic(import('react-quill'), {ssr: false});

const ContracEdit: React.FC = () => {
  const modules = {
    toolbar: [
      [{header: '1'}, {header: '2'}, {font: []}],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{list: 'ordered'}, {list: 'bullet'}, {indent: '-1'}, {indent: '+1'}],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };
  const router = useRouter();
  const param = router.query;
  const {setLoading} = useUserContext();

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
    watch,
  } = useForm();

  const onEditorStateChange = (editorState: any) => {
    setValue('contract', editorState);
  };
  useEffect(() => {
    register('contract', {required: true, minLength: 15});
  }, [register]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await axios.get(
          `https://6332ba04a54a0e83d2570a0f.mockapi.io/api/contract-form/${param.id_contract}`,
        );
        if (res.data) {
          reset(res.data);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [param, reset, setLoading]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await axios
        .put(
          `https://6332ba04a54a0e83d2570a0f.mockapi.io/api/contract-form/${param.id_contract}`,
          data,
        )
        .then(() => {
          router.push(`/manager/landlord/${param.id}/contract-form`);
          Toast('success', 'Cập nhật hợp đồng thành công');
        });
    } catch (error) {
      Toast('error', 'Cập nhật hợp đồng không thành công');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <button
        type="submit"
        className="bg-cyan-400 text-white rounded-md px-5 py-3  mb-5 hover:bg-cyan-500">
        Cập nhật
      </button>
      <ReactQuill
        theme="snow"
        modules={modules}
        value={watch('contract')}
        onChange={onEditorStateChange}
      />
      <h1 className="Error">{errors.contract && 'Bạn phải nhập trường này'}</h1>
    </form>
  );
};

export default ContracEdit;
