import { useEffect, useState } from "react";
import { Image, Users, UserCheck, ClipboardCheck, Trophy,Download,ChevronLeft } from 'lucide-react';
import { Button} from "@material-tailwind/react";
import { getJuradosByConvocatoria } from '@/apis/jurado';
import { participantesByIdActivdad } from "@/apis/postulacion_Service";
import { getEvaluacionByConvocatoria } from "@/apis/evaluacion";
import { updateConvocatoriaRondas,getByIdConvocatoria } from "@/apis/convocatorias";
import { getGanadoresByConvocatoria } from "@/apis/ganador_Service";
import ModalMensaje from "./ModalMensaje";

const VistaConvocatoria = ({convocatoria,jurados = [], evaluaciones = [], participantes = [], ganadores = [], onVolver, onNavigate, setJurados,setEvaluaciones,setParticipantes, setGanadores, recargarConvocatoria}) => {
  const [form, setForm] = useState({
    fechaInicioR1: '',
    fechaLimiteR1: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");
  const toDate = (value) => new Date(value + "T00:00:00");
  useEffect(() => {
    if (!convocatoria?.idActividad) return;

    getJuradosByConvocatoria(convocatoria.idActividad)
      .then(setJurados)
      .catch(err =>
        console.error("Error al obtener jurados:", err)
      );
  }, [convocatoria, setJurados]);

   useEffect(() => {
    if (!convocatoria?.idActividad) return;

    getEvaluacionByConvocatoria(convocatoria.idActividad)
      .then(setEvaluaciones)
      .catch(err =>
        console.error("Error al obtener las evaluaciones:", err)
      );
    console.log('evaluaciones',evaluaciones);
    console.log('act',convocatoria.idActividad);

  }, [convocatoria, setEvaluaciones]);

  useEffect(() => {
    if (!convocatoria?.idActividad) return;

    recargarConvocatoria(convocatoria.idActividad);
  }, []);

  useEffect(() => {
    if (!convocatoria?.idActividad) return;

     participantesByIdActivdad(convocatoria.idActividad)
      .then(setParticipantes)
      .catch(err =>
        console.error("Error al obtener las participaciones:", err)
      );
    console.log('participantes',participantes);
    console.log('actP',convocatoria.idActividad);

  }, [convocatoria, setParticipantes]);

  useEffect(() => {
    if (!convocatoria?.idActividad) return;

     getGanadoresByConvocatoria(convocatoria.idActividad)
      .then(setGanadores)
      .catch(err =>
        console.error("Error al obtener los ganadores:", err)
      );
    console.log('ganador',ganadores);

  }, [convocatoria, setGanadores]);

  const cards = [
    {
      key: 'participantes',
      label: 'Participantes',
      value: participantes.length ?? '0',
      icon: Users,
    },
    {
      key: 'jurados',
      label: 'Jurados asignados',
      value: jurados.length ?? '0',
      icon: UserCheck,
    },
    {
      key: 'evaluaciones',
      label: 'Evaluaciones',
      value: evaluaciones.length ?? '0',
      icon: ClipboardCheck,
    },
    {
      key: 'ganadores',
      label: 'Ganador',
      value: ganadores.length ?? 'Sin asignar',
      icon: Trophy,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarFechasEvaluacion = () => {
    const { fechaInicioR1, fechaLimiteR1 } = form;

    if (!fechaInicioR1 || !fechaLimiteR1) {
      setModalTitle("Error");
      setModalMessage("Debes completar ambas fechas de evaluación");
      setModalOpen(true);
      return false;
    }

    const inicioEval = toDate(fechaInicioR1);
    const finEval = toDate(fechaLimiteR1);
    const cierre = toDate(convocatoria.fechaCierre);
    const resultados = toDate(convocatoria.fechaResultados);

    if (inicioEval < cierre) {
      setModalTitle("Error");
      setModalMessage(
        "La fecha de inicio de evaluación no puede ser anterior a la fecha de cierre de la convocatoria"
      );
      setModalOpen(true);
      return false;
    }

    if (finEval < inicioEval) {
      setModalTitle("Error");
      setModalMessage(
        "La fecha límite de evaluación no puede ser menor a la fecha de inicio"
      );
      setModalOpen(true);
      return false;
    }

    if (finEval > resultados) {
      setModalTitle("Error");
      setModalMessage(
        "La fecha límite de evaluación no puede ser posterior a la fecha de resultados"
      );
      setModalOpen(true);
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
    if (!validarFechasEvaluacion()) return;

    try {
      await updateConvocatoriaRondas(convocatoria.idActividad, form);
      await recargarConvocatoria(convocatoria.idActividad);
      /*
      const convocatoriaActualizada = await getByIdConvocatoria(
        convocatoria.idActividad
      );
      onConvocatoriaActualizada(convocatoriaActualizada);*/

      setModalTitle("Éxito");
      setModalMessage("Fechas guardadas correctamente");
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setModalTitle("Error");
      setModalMessage("Fechas no registradas");
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={onVolver}
        className="text-black px-4 py-2"
      >
        <ChevronLeft size={30} />
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center mt-10">
            {convocatoria.imagen ? (
              <img
                src={convocatoria?.imagen ? `http://localhost:8080${convocatoria.imagen}` : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"}
                alt={convocatoria?.titulo || "Imagen de la convocatoria"}
                className="object-cover w-full h-72 rounded-xl"
              />
            ) : (
              <Image className="w-16 h-16 text-gray-400" />
            )}
          </div>
          
        </div>

        <div className="col-span-2 space-y-3">
          <div className='flex justify-end'>
            <span className="px-3 py-1 text-sm rounded-md bg-black text-white">
              {convocatoria.estado}
            </span>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold">{convocatoria.titulo}</h1>
              <p className="text-gray-800 text-justify mt-5">{convocatoria.descripcion}</p>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <p className="text-gray-800 text-justify mt-5"><span className="font-bold">Premio:</span> {convocatoria.premio}</p>
          <p className="text-gray-800 text-justify mt-5"><span className="font-bold">Convocantes:</span> {convocatoria.convocantes}</p>
          <div className="flex items-center gap-3">
            <span className="text-sm">Descarga la convocatoria completa:</span>
            {convocatoria?.bases ? (
              <a
                href={`http://localhost:8080${convocatoria.bases}`}
                download
                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-500"
              >
                <Download className="w-4 h-4" />
                Descargar bases
              </a>
            ) : (
              <span className="text-sm text-gray-400">Sin bases</span>
            )}
          </div>
          <div className="flex flex-nowrap p-5">
            <div>Inicio: {convocatoria.fechaInicio}  /</div>
            <div>Cierre: {convocatoria.fechaCierre} /</div>
            <div> Resultados: {convocatoria.fechaResultados}</div>
          </div>
          
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <h2 className="font-medium">Evaluación:</h2>
            <div className="flex gap-4 items-center">
                <label className="ml-2">Fecha inicio:</label>
                {convocatoria.fechaInicioR1 ? (
                  <input
                  type="date"
                  name="fechaInicioR1"
                  value={convocatoria.fechaInicioR1}
                  disabled
                  className="border rounded-lg px-3 py-2"
                />
                ):(
                  <input
                    type="date"
                    name="fechaInicioR1"
                    value={form.fechaInicioR1}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2"
                    min={convocatoria.fechaCierre}
                    max={convocatoria.fechaResultados}
                  />
                )}

                <label className="ml-2">Fecha límite:</label>
                {convocatoria.fechaLimiteR1 ? (
                <input
                  type="date"
                  name="fechaLimiteR1"
                  value={convocatoria.fechaLimiteR1}
                  disabled
                  className="border rounded-lg px-3 py-2"
                />):(
                  <input
                  type="date"
                  name="fechaLimiteR1"
                  value={form.fechaLimiteR1}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  min={form.fechaInicioR1}
                  max={convocatoria.fechaResultados}
                />
                )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map(({ key, label, value, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className="border-2 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-lg transition"
          >
            <span className="text-lg font-semibold">{value}</span>
            <span className="text-sm text-gray-500 text-center">{label}</span>
            <Icon className="w-6 h-6 text-gray-600" />
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 border rounded-lg" onClick={() => onNavigate("editarConvocatoria")}>Editar</button>
        <Button className="px-4 py-2 hover:bg-gray-500 text-white rounded-lg" variant="gradient" onClick={handleGuardar}>Guardar Fechas</Button>
      </div>
      <ModalMensaje
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        autoClose
        autoCloseTime={10000}
      />
    </div>
  );
};
export default VistaConvocatoria;