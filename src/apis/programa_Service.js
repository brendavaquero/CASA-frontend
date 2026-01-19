//import axios from "axios";
import api from "./axios";

const API_URL = "http://localhost:8080/api/programas"; 

export const getProgramasByUsuario = async (usuarioId) => {
  const response = await api.get(`/programas/usuario/${usuarioId}`);
  return response.data;
};

export const getById = async (idPrograma) => {
  const response = await api.get(`/programas/${idPrograma}`);
  return response.data;
};

/* export const descargarZipEvidencias = async (idPrograma) => {
  const response = await axios.get(
    `${API_URL}/${idPrograma}/evidencias/zip`,
    { responseType: "blob" }
  );

  return response.data;
}; */

export const descargarZipEvidencias = async (idPrograma) => {
  try {
    const response = await api.get(
      `/programas/${idPrograma}/evidencias/zip`,
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `evidencias_programa_${idPrograma}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error descargando ZIP:", error);
  }
};
