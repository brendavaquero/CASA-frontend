import axios from "axios";

const API_URL = "http://localhost:8080/api/archivos";

//Archivo de actividad
export const uploadArchivo = async (idActividad) =>{
    const res = await axios.post(`API_URL, formData`, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};