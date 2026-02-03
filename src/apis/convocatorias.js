//import axios from "axios";
import api from "./axios";
const API_URL = "http://localhost:8080/api/convocatoriasyresidencias";

export const getConvocatorias = async () => {
  const res = await api.get("/convocatoriasyresidencias");
  return res.data;
};

export const crearConvocatoria = async (formData) =>{
  const res = await api.post("/convocatoriasyresidencias", formData);
  return res.data;
};

export const getByIdConvocatoria = async (idConvocatoria) => {
  const res = await api.get(`/convocatoriasyresidencias/${idConvocatoria}`)
  return res.data;
};

export const updateConvocatoriaRondas = async(idConvocatoria, formData) => {
  const rest = await api.put(`/convocatoriasyresidencias/fechaRondas/${idConvocatoria}`,formData);
  return rest.data;
}; 

export const updateConvocatoria = async(idConvocatoria, formData) => {
  const rest = await api.put(`/convocatoriasyresidencias/updated/${idConvocatoria}`,formData);
  return rest.data;
}; 

export const obtenerActaPorConvocatoria = async (idConvocatoria) => {
  try {
    const response = await api.get(`/convocatoriasyresidencias/acta/${idConvocatoria}`);
    return response.data;
  } catch (error) {
    console.error("Error en obtenerActaPorConvocatoria:", error);
    throw error;
  }
};

export const getInstitucionesByActividad= async (idConvocatoria) => {
  try {
    const response = await api.get(`/convocatoriasyresidencias/${idConvocatoria}/instituciones`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener institución:", error);
    throw error;
  }
};
export const asignarInstitucionesConvocatorias = async(idConvocatoria, instituciones) => {
  const rest = await api.put(`/convocatoriasyresidencias/${idConvocatoria}/instituciones`,instituciones);
  return rest.data;
}; 