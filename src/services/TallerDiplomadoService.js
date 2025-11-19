import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/talleresydiplomados';
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

export async function getProgramaByTaller(id) {
  const resp = await fetch(`/api/talleresydiplomados/${id}/programa`);
  return resp.json();
}

export async function getDocenteByTaller(id) {
  const resp = await fetch(`/api/talleresydiplomados/${id}/docente`);
  return resp.json();
}

