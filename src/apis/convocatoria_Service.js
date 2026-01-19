import axios from "axios";

const API_URL = "http://localhost:8080/api/convocatoriasyresidencias";

export const getConvocatorias = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getConvocatoriaById = (idActividad) =>
  axios.get(`${API_URL}/${idActividad}`);


//export const listTalleresDiplomados = () => axios.get(REST_API_BASE_URL);
export async function listConvocatorias() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    /*if (taller.getDocente() == null) {
        throw new IllegalStateException("El taller requiere un docente asignado");
    }*/

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener las actividades:", error);
    return [];
  }
}

