import axios from "axios";

const API_URL = "http://localhost:8080/api/talleresydiplomados";
const API_URL_ALUMNOS = "http://localhost:8080/api/postulaciones";

export const getTalleres = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createTaller = async (tallerData) => {
  const res = await axios.post(API_URL, tallerData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

//Alumnos de un taller
export const getAlumnosTaller = async (idTaller) => {
  const res = await axios.get(`${API_URL_ALUMNOS}/alumnos/${idTaller}`);
  return res.data;
};

//Talleres por docente
export const getTalleresDocentes = async (idusuario) => {
  const res = await axios.get(`${API_URL}/docente/${idusuario}`);
  return res.data;
};

//Editar el taller desde auxiliar
export const updateTallerDiplo = async(idTallerDiplo, formData) => {
  const rest = await axios.put(`${API_URL}/${idTallerDiplo}`,formData);
  return rest.data;
}; 

//Aprobar una actividad
export const updateActividad = async(idActividad,estado) => {
  const res = await axios.put(
    `${API_URL}/estado/${idActividad}`,
    { estado: estado },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};


//Acompletar la actividad(fechas)
export const updatedActividad = async(idActividad,formData) => {
  const res = await axios.put(
    `${API_URL}/actividad/${idActividad}`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

//Subir imagen
export const uploadImagenActividad = async (formData) => {
  const response = await axios.post(`${API_URL}/uploadImagen`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data; // la URL
};