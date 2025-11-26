import axios from "axios";

const API_URL = "http://localhost:8080/api/docentes";

/* export const getDocenteById = async (idUsuario) => {
  const response = await axios.get(`${API_URL}/${idUsuario}`);
  return response.data;
}; */

export const getDocenteById = async (idusuario) =>{
    const res = await axios.get(`${API_URL}/${idusuario}`)
    return res.data;
};
