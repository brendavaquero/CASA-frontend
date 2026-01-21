import api from "./axios";

export const enviarCorreoRecuperacion = async (correo) => {
  const response = await api.post("/authPs/forgot-password", {
    correo,
  });
  return response.data;
};

export const resetearContrasenia = async (token, nuevaContrasenia) => {
  const response = await api.post("/authPs/reset-password", {
    token,
    nuevaContrasenia,
  });
  return response.data;
};
