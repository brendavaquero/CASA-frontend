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