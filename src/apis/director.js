import api from "./axios";

export const createDirector = async (formData) => {
  const response = await api.post('/directores', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const getDirectores = async () => {
  const response = await api.get("/directores");
  return response.data;
};

export const updateDirector = async (id, formData) => {
  const response = await api.put(`/directores/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const deleteDirector = async (id) => {
  await api.delete(`/directores/${id}`);
};