import axios from "axios";

const API_URL = "http://localhost:8080/api/usuarios";

export const getUsuarios = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getUsuarioById = async (idusuario) =>{
    const res = await axios.get(`${API_URL}/${idusuario}`)
    return res.data;
};