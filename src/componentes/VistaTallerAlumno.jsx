import React, { useEffect, useState } from "react";
import { getArchivosActividad } from "@/apis/archivo_Service";
import { getSesionesByTaller } from "@/apis/sesiones";
import {ChevronLeft} from "lucide-react";


const VistaTallerAlumno = ({ taller, onVolver}) => {
  const [archivos, setArchivos] = useState([]);
  const [sesiones, setSesiones] = useState([]);

    const reloadArchivos = async () => {
       try {
          const res = await getArchivosActividad(taller.idActividad);
    
          // Filtrar recursos
          const recursos = res.filter(a => a.categoria === "RECURSO");
    
          // Filtrar evidencias
          const evidencias = res.filter(a => a.categoria === "EVIDENCIA");
    
          setArchivos(recursos);
        } catch (error) {
          console.error("Error al cargar archivos:", error);
        }
      };
  useEffect(() => {
    const hoy = new Date();
    setFechaHoy(hoy.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (!taller?.idActividad) return;
    reloadArchivos();
  }, [taller]);


useEffect(() => {
  if (!taller?.idActividad) return;

  const fetchSesiones = async () => {
    try {
      const data = await getSesionesByTaller(taller.idActividad);
      const ordenadas = data.sort(
        (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
      );

      setSesiones(ordenadas);
    } catch (error) {
      console.error("Error al obtener sesiones:", error);
    }
  };

  fetchSesiones();
}, [taller]);

  const fechaInicioTaller = sesiones.length > 0 ? sesiones[0].fechaInicio : taller.fechaInicio;
  const fechaCierreTaller = sesiones.length > 0 ? sesiones[sesiones.length - 1].fechaFin : taller.fechaCierre;

  return (
    <div className="p-4">

      <button
        onClick={onVolver}
        className="text-black px-4 py-2"
      >
        <ChevronLeft size={30} />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="space-y-6">


          <div className="rounded-lg overflow-hidden shadow">
            <img
              src={taller?.imagen ? `http://localhost:8080${taller.imagen}` : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"}
              alt={taller?.titulo || "Imagen del taller"}
              className="object-cover w-full h-72"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              {taller?.titulo}
            </h1>

            <p className="text-gray-600 mb-4 text-sm text-justify">{taller?.descripcion}</p>

            <div className="text-sm text-gray-500 space-y-1 text-justify">
                <>
                  <p><strong>Material solicitado:</strong> {taller?.materialSol}</p>
                  <p><strong>Notas:</strong> {taller?.notas}</p>
                </>
              <p><strong>Número de sesiones:</strong> {taller?.numSesiones}</p>
              <p><strong>Objetivo general:</strong> {taller?.objetivoGeneral}</p>
              <p><strong>Objetivos específicos:</strong> {taller?.objetivosEspecificos}</p>
            </div>
          </div>

          
        </div>

        <div className="space-y-6">
              <div className="border p-5 rounded bg-white shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">📚 Recursos</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  {archivos.length === 0 ? (
                    <p className="text-gray-500">No hay recursos aún.</p>
                  ) : (
                    archivos.map((a) => (
                      <li key={a.idArchivo} className="border-b pb-1">
                        <a
                          href={`http://localhost:8080${a.ruta}`}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          {a.nombre}
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              </div>

          {/*sesiones*/}
          
          <div className="border p-5 rounded bg-white shadow-sm mt-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">🗓️ Sesiones del taller</h2>

            {sesiones.length === 0 ? (
              <p className="text-gray-500">No hay sesiones registradas aún.</p>
            ) : (
              <ul className="space-y-2 text-sm text-gray-700">
                {sesiones.map((s, index) => {
                  // Si fechaInicio y fechaFin son iguales, mostramos solo una fecha
                  const mismaFecha = s.fechaInicio && s.fechaFin && s.fechaInicio === s.fechaFin;
                  const fechaTexto = mismaFecha
                    ? s.fechaInicio
                    : `${s.fechaInicio} - ${s.fechaFin}`;

                  const horaInicio = s.horaInicio ? s.horaInicio.substring(0, 5) : "";
                  const horaFin = s.horaFin ? s.horaFin.substring(0, 5) : "";

                  return (
                    <li key={s.idSesion} className="border-b pb-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <strong>Sesión {index + 1}:</strong>{" "}
                          {fechaTexto} — {horaInicio} a {horaFin}
                        </div>
                        <div className="text-xs text-gray-500">Aula {s.aula}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default VistaTallerAlumno;