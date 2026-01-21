//import axios from "axios";
import api from "./axios";
const API_URL = "http://localhost:8080/api/jurado";


//Obtener los jurados de cierta convocatoria
export const getJuradosByConvocatoria = async (idConvocatoria) => {
  const res = await api.get(`/jurado/convocatoriasyresi/${idConvocatoria}`);
  return res.data;
};

//Convocatorias de cierto Jurado
export const getConvocatoriasByJurado = async (idUsuario) => {
  const res = await api.get(`/jurado/usuarioJurado/convocatorias/${idUsuario}`);
  return res.data;
};

export const createJurado = async (data) => {
  const res = await api.post("/jurado",data);
  return res.data;
};