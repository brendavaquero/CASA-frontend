import api from "./axios";

export const enviarCorreo = async (data) => {
  return api.post("/email/enviar", data);
};