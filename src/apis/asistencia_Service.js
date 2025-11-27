import axios from "axios";
const API_URL = "http://localhost:8080/api/asistencias";

export const registrarAsistencia = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};