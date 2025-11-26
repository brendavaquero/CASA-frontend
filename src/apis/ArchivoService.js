import axios from "axios";

const API_URL = "http://localhost:8080/api/archivos";

export const uploadArchivoPostulacion = async (formData) => {
  const res = await axios.post(
    "http://localhost:8080/api/archivos/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );

  return res.data;
};

export const getEvidenciasByActividad = async (idActividad) => {
  try {
    const response = await axios.get(
      `${API_URL}/${idActividad}/evidencias`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener evidencias:", error);
    throw error;
  }
};
