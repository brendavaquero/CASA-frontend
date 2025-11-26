import axios from "axios";

const API_URL = "http://localhost:8080/api/alumnos";

export const getAlumnoTalleres = async (idusuario) =>{
    const res = await axios.get(`${API_URL}/${idusuario}/talleres`)
    return res.data;
};