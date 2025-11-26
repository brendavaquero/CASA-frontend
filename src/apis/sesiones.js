import axios from "axios";

const API_URL = "http://localhost:8080/api/sesiones";

export const createSesiones = async (sesionData) => {
  const res = await axios.post(API_URL, sesionData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};