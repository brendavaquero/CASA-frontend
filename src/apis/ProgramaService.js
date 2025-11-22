import axios from "axios";

const API_URL = "http://localhost:8080/api/programas"; 

export const getProgramasByUsuario = async (usuarioId) => {
  const response = await axios.get(`${API_URL}/usuario/${usuarioId}`);
  return response.data;
};

export const getById = async (idPrograma) => {
  const response = await axios.get(`${API_URL}/${idPrograma}`);
  return response.data;
};
