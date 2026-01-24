import api from "./axios";

export const getParticipanteById = async (idusuario) =>{
    const res = await api.get(`/participantes/${idusuario}`)
    return res.data;
};

export const registrarParticipantePostal = async (data) => {
  try {
    const response = await api.post(
      `participantes/registro-postal`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error al registrar participante postal:", error);
    throw error;
  }
};

export const crearParticipante = async (participanteDto) => {
  try {
    const response = await api.post("/participantes", participanteDto);
    return response.data;
  } catch (error) {
    console.error("Error al crear participante:", error);
    throw error;
  }
};

export const crearParticipantePublico = async (participanteDto) => {
  try {
    const response = await api.post("/participantes/publico", participanteDto);
    return response.data;
  } catch (error) {
    console.error("Error al crear participante público:", error);
    throw error;
  }
};

export const validarCurp = async (curp) => {
  try {
    const response = await api.get(`/participantes/validar-curp`, {
      params: { curp } // envía el parámetro en query string
    });
    return response.data.existe; // true si ya existe
  } catch (error) {
    console.error("Error validando CURP", error);
    return false;
  }
};
export const updateParticipante = async (idusuario,data) =>{
    const res = await api.put(`/participantes/${idusuario}`,data)
    return res.data;
};
