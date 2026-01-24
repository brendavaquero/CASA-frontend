import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Chip,
  Tooltip,
  Avatar,
} from "@material-tailwind/react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { getSesionesByTaller } from "../apis/sesion_Service"; 
import { getDocenteById } from "../apis/docente_Service";
import { existePostulacion } from "../apis/postulacion_Service";
import { useAuth } from "../context/AuthContext";

export default function TallerDetalle({ actividad, onPostular }) {

  const [sesiones, setSesiones] = useState([]);
  const [docente, setDocente] = useState(null);
  const [yaPostulado, setYaPostulado] = useState(false);

  const { user } = useAuth();

  const {
    titulo,
    descripcion,
    tipo,    
    fechaInicio,
    fechaCierre,
    fechaResultados,
    requisitos,
    estado,
    imagen,
    cupo,
    objetivoGeneral,
    objetivosEspecificos,
    temas,
    materialSol,
    criteriosSeleccion,
    notas,
    numSesiones
  } = actividad;

  const formatoFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatoHora = (hora) =>
    hora ? hora.substring(0, 5) : "";

  useEffect(() => {
  if (!actividad?.idActividad) return;
  if (actividad.infantil) return;
  if (!user?.idUsuario) return;

  console.log("🔍 Validando postulación:", {
    actividad: actividad.idActividad,
    usuario: user.idUsuario
  });

  console.log("USER DESDE CONTEXT:", user);


  existePostulacion(user.idUsuario, actividad.idActividad)
    .then((res) => {
      console.log("✅ Existe postulación:", res);
      setYaPostulado(res);
    })
    .catch((err) => {
      console.error("❌ Error validando postulación", err);
      setYaPostulado(false);
    });
}, [user, actividad]); // 👈 CLAVE



  /* DOCENTE */
  

  useEffect(() => {
    if (actividad && actividad.idDocente) {
      console.log("[TallerDetalle] idUsuario:", actividad.idDocente);

      // corregir
      getDocenteById(actividad.idDocente)
        .then((data) => {
          console.log("[TallerDetalle] docente:", data);
          //checar
          setDocente(data);
        })
        .catch((err) => console.error(err));
    }
  }, [actividad]);

  /* SESIONES */
  const [loadingSesiones, setLoadingSesiones] = useState(false);
  const [sesionesError, setSesionesError] = useState(null);
  useEffect(() => {
    if (!actividad?.idActividad) return;

    console.log("[TallerDetalle] Fetching sesiones para:", actividad.idActividad);

    getSesionesByTaller(actividad.idActividad)
      .then((data) => {
        console.log("[TallerDetalle] Respuesta backend:", data);
        setSesiones(data);
      })
      .catch((err) => console.error("[TallerDetalle] Error:", err));
  }, [actividad]);

  // debug
  console.log("[TallerDetalle] actividad:", actividad);
  console.log("[TallerDetalle] idActividad:", actividad.idActividad);
  console.log("[TallerDetalle] sesiones (state):", sesiones);


  return (
    <div className="flex flex-col min-h-screen relative bg-gray-50 pb-0">
      <div className="flex flex-col lg:flex-row gap-6 p-6 pb-32">

        {/* Imagen */}
        <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-md h-96">
          <img
            src={imagen ? `http://localhost:8080${imagen}` :
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"}
            alt={titulo}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Información */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <Typography variant="h3" className="font-bold text-gray-800">
            {titulo}
          </Typography>

          <Chip
              value={tipo}
              color="blue"
              size="sm"
              variant="ghost"
              className="capitalize w-fit"
          />
          {/* docente */}
          

          <div className="flex items-center space-x-3 pt-0">
            <Tooltip content={`${docente?.nombre} ${docente?.apellidos}`}>
              <Avatar
                size="sm"
                variant="circular"
                alt={`${docente?.nombre} ${docente?.apellidos}`}
                src={docente?.foto}
                className="border-2 border-none hover:z-10"
              />
            </Tooltip>

            <Typography variant="small" color="blue-gray" className="font-medium">
              por {docente?.nombre} {docente?.apellidos}
            </Typography>
          </div>      

          <Typography className="text-gray-600 leading-relaxed">
            {descripcion}

          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            

            <div className="p-4 bg-white shadow-sm rounded-xl">
              <Typography variant="small" className="text-gray-500">Fecha de inicio</Typography>
              <Typography className="font-medium">{formatoFecha(fechaInicio)}</Typography>
            </div>

            <div className="p-4 bg-white shadow-sm rounded-xl">
              <Typography variant="small" className="text-gray-500">Publicación de resultados</Typography>
              <Typography className="font-medium">{formatoFecha(fechaResultados)}</Typography>
            </div>
          </div>

          {/* Secciones de contenido */}
          <div className="flex flex-col gap-4 mt-4">
            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Objetivo general</Typography>
              <Typography className="text-gray-700 mt-1">{objetivoGeneral}</Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Objetivos específicos</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{objetivosEspecificos}</Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Temas</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{temas}</Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Requisitos</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{requisitos}</Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Material solicitado</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{materialSol}</Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Criterios de selección</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{criteriosSeleccion}</Typography>
            </section>

            {notas && (
              <section>
                <Typography variant="h6" className="font-semibold text-gray-800">Notas</Typography>
                <Typography className="text-gray-700 mt-1 whitespace-pre-line">{notas}</Typography>
              </section>
            )}
            
            {/* Sesiones */}
            <section>
              <Typography variant="h6" className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                
                Sesiones
              </Typography>

              {sesiones.length === 0 ? (
                <Typography className="text-gray-600 italic">
                  Este taller aún no tiene sesiones registradas.
                </Typography>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sesiones.map((s) => (
                    <div
                      key={s.idSesion}
                      className="p-4 bg-white shadow-sm rounded-xl border border-gray-100"
                    >
                      {/* <Typography variant="small" className="text-gray-500">
                        Sesión {s.num}
                      </Typography> */}

                      <Typography className="font-medium text-gray-800">
                        {formatoFecha(s.fechaInicio)}
                        {s.fechaFin && s.fechaFin !== s.fechaInicio
                          ? ` – ${formatoFecha(s.fechaFin)}`
                          : ""}
                      </Typography>

                      <Typography className="text-gray-700 mt-1">
                        De {formatoHora(s.horaInicio)} a {formatoHora(s.horaFin)} h
                      </Typography>

                      {s.aula && (
                        <Typography className="text-gray-600 mt-1">
                          Aula: {s.aula}
                        </Typography>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
            </section>


          </div>
        </div>
      </div>

      {/* Barra inferior fija */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-2xl border-t p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-700">
          <CalendarDaysIcon className="h-5 w-5" />
          <Typography variant="small">
            Postúlate antes del: <span className="font-semibold">{formatoFecha(fechaCierre)}</span>
          </Typography>
        </div>       

        {/* <Button
          type="button"
          variant="gradient"
          size="lg"
          onClick={onPostular}
        >
          Postular
        </Button> */}

        {!yaPostulado ? (
          <Button
            type="button"
            variant="gradient"
            size="lg"
            onClick={onPostular}
          >
            Postular
          </Button>
        ) : (
          <Typography color="0d47a1" className="font-semibold">
            Ya te has postulado a esta actividad
          </Typography>
        )}

      </div>
    </div>
  );
}
