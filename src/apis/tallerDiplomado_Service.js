import api from "./axios";

/* ==============================
   TALLERES Y DIPLOMADOS
================================ */


export const getTalleres = async () => {
  const res = await api.get("/talleresydiplomados");
  return res.data;
};


export const getTallerDiplomadoById = async (idActividad) => {
  const res = await api.get(`/talleresydiplomados/${idActividad}`);
  return res.data;
};


export const createTaller = async (tallerData) => {
  const res = await api.post("/talleresydiplomados", tallerData);
  return res.data;
};


export const updateTallerDiplo = async (idTallerDiplo, formData) => {
  const res = await api.put(`/talleresydiplomados/${idTallerDiplo}`, formData);
  return res.data;
};


export const updateActividad = async (idActividad, estado) => {
  const res = await api.put(
    `/talleresydiplomados/estado/${idActividad}`,
    { estado }
  );
  return res.data;
};

//Acompletar la actividad(fechas)
/*export const updatedActividad = async(idActividad,formData) => {
  const res = await axios.put(
    `${API_URL}/actividad/${idActividad}`, )}*/

export const updatedActividad = async (idActividad, formData) => {
  const res = await api.put(
    `/talleresydiplomados/actividad/${idActividad}`,
    formData
  );
  return res.data;
};

/* ==============================
   IMÁGENES
================================ */


export const uploadImagenActividad = async (formData) => {
  const res = await api.post(
    "/talleresydiplomados/uploadImagen",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

/* ==============================
   DOCENTES
================================ */


export const getTalleresDocentes = async (idUsuario) => {
  const res = await api.get(`/talleresydiplomados/docente/${idUsuario}`);
  return res.data;
};


export const getDocenteByTaller = async (idActividad) => {
  const res = await api.get(`/talleresydiplomados/${idActividad}/docente`);
  return res.status === 204 ? null : res.data;
};

/* ==============================
   ALUMNOS / POSTULACIONES
================================ */



export const getAlumnosTaller = async (idTaller) => {
  const res = await api.get(`/postulaciones/alumnos/${idTaller}`);
  return res.data;
};


export const getProgramaByTaller = async (idActividad) => {
  const res = await api.get(`/talleresydiplomados/${idActividad}/programa`);
  return res.data;
};


//brenda:

/*export const getTallerDiplomadoById = (idActividad) =>
  axios.get(`${API_URL}/${idActividad}`); */

//export const listTalleresDiplomados = () => axios.get(REST_API_BASE_URL);
//export async function listTalleresDiplomados() {
export const listTalleresDiplomados = async () => {
  try {
    const res = await api.get("/talleresydiplomados");
    return res.data;
  } catch (error) {
    console.error("Error al obtener los talleres:", error);
    return [];
  }
};
export const getInstitucionesByActividadTaller = async (idTaller) => {
  try {
    const response = await api.get(`/talleresydiplomados/${idTaller}/instituciones`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener institución:", error);
    throw error;
  }
};
export const asignarInstitucionesTaller = async(idTaller, instituciones) => {
  const rest = await api.put(`/talleresydiplomados/${idTaller}/instituciones`,instituciones);
  return rest.data;
}; 

/*export async function getDocenteByTaller(idActividad) {
  const url = `${API_URL}/${idActividad}/docente`;

  try {
    const res = await fetch(url);

    if (res.status === 204) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return await res.json();
  } catch (err) {
    console.error("[DocenteService] Error al obtener docente:", err);
    return null;
  }
}*/
