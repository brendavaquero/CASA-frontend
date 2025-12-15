import axios from "axios";
const API_URL = "http://localhost:8080/api/asistencias";

export const registrarAsistencia = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const getAprobadosPorTaller = async (idActividad) => {
  const res = await axios.get(`${API_URL}/actividad/${idActividad}/aprobados`);
  return res.data;
};