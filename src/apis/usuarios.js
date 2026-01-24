//import axios from "axios";
import api from "./axios";

const API_URL = "http://localhost:8080/api/usuarios";

export const getUsuarios = async () => {
  const res = await api.get("/usuarios");
  return res.data;
};

export const getUsuarioById = async (idusuario) =>{
    const res = await api.get(`/usuarios/${idusuario}`)
    return res.data;
};
export const createUsuario = async(data) =>{
  const res = await api.post("/usuarios",data);
  return res.data;
};
export const updateUsuario = async(idUsuario,data) =>{
  const res = await api.put(`/usuarios/${idUsuario}`,data);
  return res.data;
};
export const updateUsuarioGen = async(idUsuario,data) =>{
  const res = await api.put(`/usuarios/general/${idUsuario}`,data);
  return res.data;
};

export const deleteUsuario = async (idusuario)=>{
  const res = await api.delete(`/usuarios/${idusuario}`);
  return res.data;
};