import api from "./axios";

/**
 * Crear institución (con logo opcional)
 */
export const crearInstitucion = async (institucionDto, logoFile) => {
  try {
    const formData = new FormData();
    formData.append(
      "institucion",
      new Blob([JSON.stringify(institucionDto)], {
        type: "application/json",
      })
    );

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    const response = await api.post("/instituciones", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al crear institución:", error);
    throw error;
  }
};

/**
 * Obtener institución por ID
 */
export const getInstitucionById = async (id) => {
  try {
    const response = await api.get(`/instituciones/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener institución:", error);
    throw error;
  }
};

/**
 * Obtener todas las instituciones
 */
export const getAllInstituciones = async () => {
  try {
    const response = await api.get("/instituciones");
    return response.data;
  } catch (error) {
    console.error("Error al obtener instituciones:", error);
    throw error;
  }
};

/**
 * Actualizar institución (con logo opcional)
 */
export const updateInstitucion = async (id, institucionDto, logoFile) => {
  try {
    const formData = new FormData();
    formData.append(
      "institucion",
      new Blob([JSON.stringify(institucionDto)], {
        type: "application/json",
      })
    );

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    const response = await api.put(`/instituciones/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al actualizar institución:", error);
    throw error;
  }
};

/**
 * Eliminar institución
 */
export const deleteInstitucion = async (id) => {
  try {
    await api.delete(`/instituciones/${id}`);
  } catch (error) {
    console.error("Error al eliminar institución:", error);
    throw error;
  }
};

