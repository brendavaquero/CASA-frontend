//import axios from "axios";
import api from "./axios";

export const getDocenteById = async (idusuario) =>{
    const res = await api.get(`/docentes/${idusuario}`)
    return res.data;
};
export const updateDocente = async(idUsuario,data) =>{
  const res = await api.put(`/docente/${idUsuario}`,data);
  return res.data;
};