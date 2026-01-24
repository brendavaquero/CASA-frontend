//import axios from "axios";
import api from "./axios";
const API_URL = "http://localhost:8080/api/sesiones";

export const createSesiones = async (sesionData) => {
  const res = await api.post("/sesiones", sesionData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const getSesionesByTaller = async(idTaller) => {
  const res = await api.get(`/sesiones/tallerdiplomado/${idTaller}`);
  return res.data;
};

export const updateSesion = async(idSesion,data) => {
  const res = await api.put(`/sesiones/${idSesion}`,data);
  return res.data;
};

export const deleteSesion = async (idSesion)=>{
  const res = await api.delete(`/sesiones/${idSesion}`);
  return res.data;
};