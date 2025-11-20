import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/talleresydiplomados';

export const getTallerDiplomadoById = (idActividad) =>
  axios.get(`${REST_API_BASE_URL}/${idActividad}`);


//export const listTalleresDiplomados = () => axios.get(REST_API_BASE_URL);
export async function listTalleresDiplomados() {
  try {
    const response = await fetch(REST_API_BASE_URL, {
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
    console.error("Error al obtener los talleres:", error);
    return [];
  }
}

export async function getProgramaByTaller(idActividad) {
  const resp = await fetch(`/api/talleresydiplomados/${idActividad}/programa`);
  return resp.json();
}


export async function getDocenteByTaller(idActividad) {
  const url = `${REST_API_BASE_URL}/${idActividad}/docente`;

  try {
    const res = await fetch(url);

    if (res.status === 204) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return await res.json();
  } catch (err) {
    console.error("[DocenteService] Error al obtener docente:", err);
    return null;
  }
}


