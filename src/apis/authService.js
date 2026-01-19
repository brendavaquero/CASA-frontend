import axios from "axios";

const API_URL = "http://localhost:8080/auth";

export const loginService = async (correo, contrasenia) => {
  const response = await axios.post(`${API_URL}/login`, {
    correo,
    contrasenia,
  });

  return response.data;
};
