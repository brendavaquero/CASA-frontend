//http://localhost:8080/api/sesiones/tallerdiplomado/ACT2025-00021

/* import axios from "axios";

const API_URL = "http://localhost:8080/api/sesiones";

export const getSesionesByTaller = async (id) => {
  const response = await axios.get(`${API_URL}/tallerdiplomado/${id}`);
  return response.data;
}; */
import axios from "axios";

const API_URL = "http://localhost:8080/api/sesiones"; // verifica este valor

export const getSesionesByTaller = async (idActividad) => {
  const url = `${API_URL}/tallerdiplomado/${idActividad}`;
  console.log("[sesionService] GET ->", url);
  try {
    const response = await axios.get(url);
    console.log("[sesionService] response status:", response.status);
    console.log("[sesionService] response data:", response.data);
    return response.data;
  } catch (err) {
    console.error("[sesionService] error calling", url, err?.response ?? err);
    throw err;
  }
};
