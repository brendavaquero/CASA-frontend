import axios from "axios";

const API_URL = "http://localhost:8080/api/archivos";

//Archivo de actividad
export const uploadArchivo = async (formData) =>{
    const res = await axios.post(`${API_URL}/upload`,formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};

export const getArchivosActividad = async(idActividad) =>{
    const res = await axios.get(`${API_URL}/actividad/${idActividad}`);
    return res.data;
};
