//import axios from "axios";
import api from "./axios";
const API_URL = "http://localhost:8080/api/docentes";

export const getDocenteById = async (idusuario) =>{
    const res = await api.get(`/docentes/${idusuario}`)
    return res.data;
};