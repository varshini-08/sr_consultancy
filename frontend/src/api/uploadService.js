import axios from './axios';

export const uploadImage = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const { data } = await axios.post('/upload', formData, config);
  return data;
};
