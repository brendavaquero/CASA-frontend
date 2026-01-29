import { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Input,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { ChevronLeft, Search } from "lucide-react";
import DialogDefault from "@/componentes/DialogDefault.jsx";
import { entrarRondaFinal } from "@/apis/evaluacion_Service";
import { existeGanador } from "@/apis/ganador_Service";

const ListaEvaluaciones = ({
    evaluaciones = [],
    convocatoria,
    onNavigate,
    onVolver,
  }) => {
  const [search, setSearch] = useState("");

  const evaluacionesFiltradas = useMemo(() => {
    if (!search) return evaluaciones;

    return evaluaciones.filter((e) =>
      `${e.nombre} ${e.apellidos} ${e.nombreJ} ${e.apellidosJ} ${e.calificacion}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, evaluaciones]);

  const [yaExisteGanador, setYaExisteGanador] = useState(false);
const [verificandoGanador, setVerificandoGanador] = useState(true);

useEffect(() => {
  const verificarGanador = async () => {
    try {
      if (!convocatoria?.idActividad) return;

      const existe = await existeGanador(convocatoria.idActividad);
      setYaExisteGanador(existe);
    } catch (error) {
      console.error("Error al verificar ganador:", error);
    } finally {
      setVerificandoGanador(false);
    }
  };

  verificarGanador();
}, [convocatoria]);

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const confirmarSeleccionGanador = async () => {
  try {
    setLoading(true);
    console.log("Convocatoria completa:", convocatoria);
console.log("ID convocatoria:", convocatoria?.idActividad);
console.log("ID actividad:", convocatoria?.idActividad);


    // genetrar ronda
    await entrarRondaFinal(convocatoria.idActividad);

    // ir
    onNavigate("selectGanador");
  } catch (error) {
    console.error("Error al generar la ronda final", error);
  } finally {
    setLoading(false);
    setOpenDialog(false);
  }
};



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <IconButton variant="text" onClick={onVolver}>
            <ChevronLeft size={22} />
          </IconButton>

          <Typography variant="h5">
            Evaluaciones – {convocatoria?.titulo}
          </Typography>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <div className="w-full md:w-72">
    <Input
      label="Buscar evaluación"
      icon={<Search size={18} />}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="bg-white"
      containerProps={{ className: "bg-white" }}
    />
  </div>

  {!verificandoGanador && !yaExisteGanador && (
  <Button
    color="blue-gray"
    onClick={() => setOpenDialog(true)}
  >
    Seleccionar ganador
  </Button>
)}



</div>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-[420px] overflow-y-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                {[
                  "ID Evaluación",
                  "Participante",
                  "Jurado",
                  "Calificación",
                  "Justificación",
                ].map((head) => (
                  <th key={head} className="p-4 border-b">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-semibold"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {evaluacionesFiltradas.length > 0 ? (
                evaluacionesFiltradas.map((e, index) => (
                  <tr
                    key={index}
                    className="bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="p-4">{e.idEvaluacion}</td>
                    <td className="p-4">
                      {e.nombre} {e.apellidos}
                    </td>
                    <td className="p-4">
                      {e.nombreJ} {e.apellidosJ}
                    </td>
                    <td className="p-4 font-medium">
                      {e.calificacion}
                    </td>
                    <td className="p-4 max-w-xs truncate">
                      {e.justificacion}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    <Typography color="gray">
                      No hay evaluaciones registradas
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      <DialogDefault
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  title="Confirmar acción"
  message={
    loading
      ? "Generando ronda final, por favor espera..."
      : "Al continuar se generará la lista final de participantes. ¿Deseas continuar?"
  }
  onConfirm={confirmarSeleccionGanador}
/>

    </div>
  );
};

export default ListaEvaluaciones;
