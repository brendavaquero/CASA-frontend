//import axios from "axios";
//const API_URL = "http://localhost:8080/api/asistencias";

import api from "./axios";

export const registrarAsistencia = async (data) => {
  const response = await api.post("/asistencias", data);
  return response.data;
};

export const getAprobadosPorTaller = async (idActividad) => {
  const res = await api.get(`/asistencias/actividad/${idActividad}/aprobados`);
  return res.data;
};
