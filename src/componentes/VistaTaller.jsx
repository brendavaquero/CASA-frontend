import React, { useEffect, useState } from "react";
import FormElementFileUpload from "./FormElementFileUpload";
import { getAlumnosTaller } from "@/apis/tallerDiplomado_Service";
import { registrarAsistencia, getAprobadosPorTaller } from "@/apis/asistencia_Service";
import { getArchivosActividad,deleteArchivo } from "@/apis/archivo_Service";
import { generarConstancia } from "./GenerarConstancia";
import { getSesionesByTaller } from "@/apis/sesiones";
import {ChevronLeft} from "lucide-react";
import ModalMensaje from "./ModalMensaje";
import { Trash2,ClipboardList } from "lucide-react";
import { PostulacionesPendientesPage } from "@/pages";
import EditarTaller from "@/pages/admin/EditarTaller";
import { getUsuarioById } from "@/apis/usuarios";

const VistaTaller = ({ taller, onVolver, modo = " ",administrador  }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [docente, setDocente] = useState([]);
  const [fechaHoy, setFechaHoy] = useState("");
  const [asistencias, setAsistencias] = useState({});
  const [archivos, setArchivos] = useState([]);
  const [archivosAuxiliar, setArchivosAuxiliar] = useState([]);
  const [alumnosAprobados, setAlumnosAprobados] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");
  const [verPostulaciones, setVerPostulaciones] = useState(false);
  const [editarTaller, setEditar] = useState(false);
  const [archivoAEliminar, setArchivoAEliminar] = useState(null);
  const [modalType, setModalType] = useState("info");
  const esDocente = modo === "DOCENTE";
  const tallerPendiente = taller?.estado === "PENDIENTE";
  const soloLecturaDocente = esDocente && tallerPendiente;
  const esAdministrador = modo === "ADMINISTRADOR";
  const tallerFinalizado = taller?.estado === "FINALIZADA";
  const puedeGuardarAsistencia =  esDocente &&  sesiones.length > 0 &&  fechaHoy === sesiones[0].fechaInicio;
  const [asistenciaRegistrada, setAsistenciaRegistrada] = useState(false);


  useEffect(() => {
    if (modo === "ALUMNO") return;
    if (!taller?.idActividad) return;

    const fetchAlumnosTaller = async () => {
      try {
        const data = await getAlumnosTaller(taller.idActividad);
        setAlumnos(data);
      } catch (error) {
        console.error("Error al obtener alumnos:", error);
      }
    };
    fetchAlumnosTaller();
  }, [taller, modo]);

  useEffect(() => {
    const hoy = new Date();
    setFechaHoy(hoy.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (!taller?.idActividad) return;
    reloadArchivos();
  }, [taller]);
  
  useEffect(() => {
    const fetchDocenteTaller = async () => {
      try {
        const data = await getUsuarioById(taller.idDocente);
        setDocente(data);
      } catch (error) {
        console.error("Error al obtener docente:", error);
      }
    };
    fetchDocenteTaller();
  }, [taller, modo]);

  useEffect(() => {
  if (modo !== "ADMINISTRADOR") return;
  if (!taller?.idActividad) return;

  const fetchAprobados = async () => {
    try {
      const data = await getAprobadosPorTaller(taller.idActividad);
      setAlumnosAprobados(data);
    } catch (error) {
      console.error("Error al obtener aprobados:", error);
    }
  };

  fetchAprobados();
}, [taller, modo]);

console.log('taller',taller);

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

  const reloadArchivos = async () => {
   try {
      const res = await getArchivosActividad(taller.idActividad);

      // Filtrar recursos
      const recursos = res.filter(a => a.categoria === "RECURSO");

      // Filtrar evidencias
      const evidencias = res.filter(a => a.categoria === "EVIDENCIA");

      setArchivos(recursos);
      setArchivosAuxiliar(evidencias);  // o setArchivosEvidencias
    } catch (error) {
      console.error("Error al cargar archivos:", error);
    }
  };

  const handleGuardarAsistencia = async () => {
    try {
      for (const idAlumno in asistencias) {
        await registrarAsistencia({
          idAlumno,
          fecha: fechaHoy,
          presente: asistencias[idAlumno],
        });
      }
      setAsistencias({});
      setAsistenciaRegistrada(true);
      setModalTitle("Éxito");
      setModalMessage("Asistencia registrada correctamente");
      setModalOpen(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Asistencia  no registrada: ",error);
      setModalOpen(true);
    }
  };
  const fechaInicioTaller = sesiones.length > 0 ? sesiones[0].fechaInicio : taller.fechaInicio;
  const fechaCierreTaller = sesiones.length > 0 ? sesiones[sesiones.length - 1].fechaFin : taller.fechaCierre;

  const yaPuedeVerPostulaciones = (() => {
    if (!taller?.fechaCierre) return false;

    const hoy = new Date(fechaHoy);
    const cierre = new Date(taller.fechaCierre);

    cierre.setDate(cierre.getDate() + 1);

    return hoy >= cierre;
  })();

const solicitarEliminarArchivo = (archivo) => {
  setArchivoAEliminar(archivo);
  setModalType("confirm");
  setModalTitle("Confirmar eliminación");
  setModalMessage(`¿Deseas eliminar el archivo "${archivo.nombre}"?`);
  setModalOpen(true);
};

const confirmarEliminarArchivo = async () => {
  if (!archivoAEliminar) return;

  try {
    await deleteArchivo(archivoAEliminar.idArchivo);
    reloadArchivos();

    setModalType("info");
    setModalTitle("Archivo eliminado");
    setModalMessage("El archivo se eliminó correctamente");
    setModalOpen(true);
  } catch (error) {
    setModalType("info");
    setModalTitle("Error");
    setModalMessage("No se pudo eliminar el archivo");
    setModalOpen(true);
  } finally {
    setArchivoAEliminar(null);
  }
};
const editarBloqueado =  taller.estado === "EN_CURSO" ||  taller.estado === "FINALIZADA" || taller.estado === "CONVOCATORIA_ABIERTA" || taller.estado === "CONVOCATORIA_CERRADA";
  if (verPostulaciones) {
    return (
      <PostulacionesPendientesPage
        taller={taller}
        onVolver={() => setVerPostulaciones(false)}
      />
    );
  }
  if (editarTaller) {
    return (
      <EditarTaller
        taller={taller}
        onVolver={() => setEditar(false)}
      />
    );
  }

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
          {esDocente && !soloLecturaDocente && (
            <button
              onClick={() => setVerPostulaciones(true)}
              className={`px-4 py-2 rounded text-white 
                ${yaPuedeVerPostulaciones 
                  ? "bg-black hover:bg-gray-800" 
                  : "bg-gray-400 cursor-not-allowed"}
              `}
            >
              Ver postulaciones
            </button>
          )}
          {modo === "ADMINISTRADOR" && (
              <button
                onClick={() => !editarBloqueado && setEditar(true)}
                disabled={editarBloqueado}
                title={
                  editarBloqueado
                    ? "No se puede editar un taller en este estado"
                    : ""
                }
                className={`px-4 py-2 rounded text-white
                  ${editarBloqueado
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"}
                `}
              >
                Editar Taller
              </button>
            )}
          {!soloLecturaDocente && (modo === "DOCENTE" || modo === "ALUMNO" || modo === "ADMINISTRADOR") && (
            <div className="border p-5 rounded bg-white shadow-sm">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                📚 Recursos
              </h2>

              <ul className="space-y-2 text-sm text-gray-700">
                {archivos.length === 0 ? (
                  <p className="text-gray-500">No hay recursos aún.</p>
                ) : (
                  archivos.map((a) => (
                    <li
                      key={a.idArchivo}
                      className="border-b pb-1 flex items-center justify-between"
                    >
                      <a
                        href={`http://localhost:8080${a.ruta}`}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        {a.nombre}
                      </a>

                      {esDocente && !soloLecturaDocente && (
                        <button
                          onClick={() => solicitarEliminarArchivo(a)}
                          className="text-red-600 hover:text-red-800 ml-3"
                          title="Eliminar archivo"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {(modo === "auxiliar" || (esDocente && !soloLecturaDocente)) && (
            <FormElementFileUpload
              idActividad={taller.idActividad}
              onUploadSuccess={reloadArchivos}
              categoria={modo === "auxiliar" ? "EVIDENCIA" : "RECURSO"}
            />
          )}

          {/**ALUMNOS */}
          {!soloLecturaDocente && (modo === "DOCENTE" || modo === "ADMINISTRADOR") && (
            <div className="border p-5 rounded bg-white shadow-sm">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                {modo === "ADMINISTRADOR" ? "👥 Lista de alumnos" : `🗓️ Asistencias ${fechaHoy}`}
              </h2>

              {alumnos.length === 0 ? (
                <p className="text-gray-500">No hay alumnos registrados.</p>
              ) : (
                alumnos.map((alumno) => (
                  <div key={alumno.idAlumno} className="flex items-center gap-3">
                    {modo === "DOCENTE" && (
                      <input
                        type="checkbox"
                        disabled={asistenciaRegistrada}
                        checked={asistencias[alumno.idAlumno] || false}
                        onChange={(e) =>
                          setAsistencias({
                            ...asistencias,
                            [alumno.idAlumno]: e.target.checked,
                          })
                        }
                      />
                    )}

                    <span>{alumno.nombre} {alumno.apellidos}</span>
                  </div>
                ))
              )}
              {asistenciaRegistrada && (
                <p className="text-sm text-green-600 mt-2">
                  ✔️ La asistencia del día ya fue registrada
                </p>
              )}

              {puedeGuardarAsistencia && !asistenciaRegistrada && (
                <button
                  onClick={handleGuardarAsistencia}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
                >
                  Guardar Asistencia
                </button>
              )}
            </div>
          )}
          
          {esAdministrador && tallerFinalizado && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 w-full"
            onClick={() =>
              alumnosAprobados.forEach(al =>
                generarConstancia(
                  { 
                    ...taller,
                    fechaInicioTaller,
                    fechaCierreTaller
                  },
                  docente,
                  al,
                )
              )
            }
          >
            Generar constancias
          </button>
        )}

          {modo === "auxiliar" &&(
              <div className="border p-5 rounded bg-white shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Evidencias del taller:</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  {archivosAuxiliar.length === 0 ? (
                    <p className="text-gray-500">No hay evidencias aún.</p>
                  ) : (
                    archivosAuxiliar.map((a) => (
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
            )
          }
        </div>

        <div className="space-y-6">

          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              {taller?.titulo}
            </h1>

            <p className="text-gray-600 mb-4">{taller?.descripcion}</p>

            <div className="text-sm text-gray-500 space-y-1">
              {modo === "ALUMNO" && (
                <>
                  <p><strong>Material solicitado:</strong> {taller?.materialSol}</p>
                  <p><strong>Notas:</strong> {taller?.notas}</p>
                </>
              )}
              <p><strong>Número de sesiones:</strong> {taller?.numSesiones}</p>
              <p><strong>Objetivo general:</strong> {taller?.objetivoGeneral}</p>
              <p><strong>Objetivos específicos:</strong> {taller?.objetivosEspecificos}</p>
              <p><strong>Docente:</strong> {docente.nombre} {docente.apellidos}</p>
              {(modo === "DOCENTE" || modo === "ADMINISTRADOR" )&& (
                <>
                  <p><strong>Fecha de inicio inscripciones:</strong> {taller?.fechaInicio}</p>
                  <p><strong>Fecha de Cierre inscripciones:</strong> {taller?.fechaCierre}</p>
                  <p><strong>Cupo:</strong> {taller?.cupo}</p>
                  <p><strong>Estado:</strong> {taller?.estado}</p>
                </>
              )}
            </div>
          </div>

          {/*sesiones*/}
          {!soloLecturaDocente && (modo === "DOCENTE" || modo === "auxiliar" || modo === "ALUMNO" || modo === "ADMINISTRADOR") && (
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
        )}

        </div>
      </div>
      <ModalMensaje
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalType("info");
        }}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        autoClose={modalType === "info"}
        autoCloseTime={10000}
        onConfirm={confirmarEliminarArchivo}
        onCancel={() => {
          setArchivoAEliminar(null);
          setModalOpen(false);
        }}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

    </div>
  );
};
export default VistaTaller;