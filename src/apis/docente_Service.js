//import axios from "axios";
import api from "./axios";

export const getDocenteById = async (idusuario) =>{
    const res = await api.get(`/docentes/${idusuario}`)
    return res.data;
};