import React, { useEffect, useState } from "react";
import FormElementFileUpload from "./FormElementFileUpload";
import { getAlumnosTaller } from "@/apis/tallerDiplomadoService";
import { registrarAsistencia } from "@/apis/asistenciaService";

const VistaTaller = ({ taller, onVolver }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [fechaHoy, setFechaHoy] = useState("");
  const [asistencias, setAsistencias] = useState({});
useEffect(() => {
  if (!taller?.idActividad) return;
    const fetchAlumnosTaller = async () => {
      try {
        const data = await getAlumnosTaller(taller.idActividad);
        console.log('alumnos:',data);
        setAlumnos(data);
      } catch (error) {
        console.error("Error al obtener el alumno:", error);
      }
    };

    fetchAlumnosTaller();
  }, [taller]);

  useEffect(() => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");

    setFechaHoy(`${year}-${month}-${day}`);
  }, []);

  const handleCheck = (idAlumno, checked) => {
    setAsistencias(prev => ({
      ...prev,
      [idAlumno]: checked
    }));
  };

  const handleGuardarAsistencia = async () => {
    try {
      for (const idAlumno in asistencias) {
        await registrarAsistencia({
          idAlumno,
          fecha: fechaHoy,
          presente: asistencias[idAlumno]
        });
      }
      alert("Asistencia registrada correctamente");
      setAsistencias({});
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      alert("Hubo un error al registrar la asistencia");
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={onVolver}
        className="bg-blue-400 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700"
      >
        ←
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-lg overflow-hidden shadow">
            <img
              src={
                taller?.imagen ||
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"
              }
              alt={taller?.descripcion || "Imagen del taller"}
              className="object-cover w-full h-72"
            />
          </div>

          <div className="border p-5 rounded bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">📚 Recursos</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="border-b pb-1">Documento PDF</li>
              <li className="border-b pb-1">Enlace a materiales</li>
              <li className="border-b pb-1">Guía del taller</li>
            </ul>
          </div>

          <FormElementFileUpload idActividad={taller.idActividad} />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              {taller?.titulo || "Título del taller"}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-4">
              {taller?.descripcion ||
                "Aquí iría la descripción detallada del taller, su propósito, objetivos y metodología."}
            </p>

            <div className="text-sm text-gray-500 space-y-1">
              <p><strong>Fecha de inicio:</strong> {taller?.fechaInicio || "—"}</p>
              <p><strong>Cupo:</strong> {taller?.cupo || "—"}</p>
              <p><strong>Estado:</strong> {taller?.estado || "—"}</p>
            </div>
          </div>

          <div className="border p-5 rounded bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              🗓️ Asistencias {fechaHoy}
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              {alumnos.length === 0 ? (
                <p className="text-gray-500">No hay alumnos registrados.</p>
              ) : (
                alumnos.map((alumno) => (
                  <div key={alumno.idAlumno} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={asistencias[alumno.idAlumno] || false}
                      onChange={(e) =>
                        handleCheck(alumno.idAlumno, e.target.checked)
                      }
                    />
                    <span>
                      {alumno.nombre} {alumno.apellidos}
                    </span>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={handleGuardarAsistencia}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Guardar Asistencia
            </button>
          </div>        
        </div>
      </div>
    </div>
  );
};

export default VistaTaller;
