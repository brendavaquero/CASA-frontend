import api from "./axios";

export const crearPostulacion = async (postulacionData) => {
  try {
    const response = await api.post(
      "/postulaciones/convocatoria",
      postulacionData
    );
    return response.data;
  } catch (error) {
    console.error("Error creando participación:", error);
    throw error;
  }
};

export const getPostulacionById = async (id) => {
  try {
    const response = await api.get(
      `/postulaciones/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo postulación:", error);
    throw error;
  }
};

export const updateEstadoPostulacion = async (idPostulacion, estado) => {
  try {
    const response = await api.put(
      `/postulaciones/convocatoria/estado/${idPostulacion}`,
      {
        estadoPos: estado,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando estado de postulación:", error);
    throw error;
  }
};

export const registrarPostulacionPostal = async (data) => {
  try {
    const response = await api.post(
      `/postulaciones/convocatoria/registro-postal`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error al registrar postulación postal:", error);
    throw error;
  }
};

export const existePostulacion = async (idUsuario, idActividad) => {
  try {
    const response = await api.get("/postulaciones/existe", {
      params: {        
        idUsuario,
        idActividad
      },
    });
    return response.data; // boolean
  } catch (error) {
    console.error("Error al verificar existencia de postulación:", error);
    throw error;
  }
};


