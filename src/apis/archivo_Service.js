import api from "./axios";

//Archivo de actividad
export const uploadArchivo = async (formData) =>{
    const res = await api.post(`/archivos/upload`,formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};

export const getArchivosActividad = async(idActividad) =>{
    const res = await api.get(`/archivos/actividad/${idActividad}`);
    return res.data;
};

export const uploadArchivoPostulacion = async (formData) => {
  const res = await api.post(
    "/archivos/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );

  return res.data;
};

export const getEvidenciasByActividad = async (idActividad) => {
  try {
    const response = await api.get(
      `/archivos/${idActividad}/evidencias`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener evidencias:", error);
    throw error;
  }
};

export const deleteArchivo = async (idArchivo) => {
  const res = await api.delete(`/archivos/archivo/${idArchivo}`);
  return res.data;
};

