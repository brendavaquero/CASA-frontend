import { ChevronLeft } from "lucide-react";

const ListaEvaluaciones = ({evaluaciones = [], convocatoria, onVolver }) => {
  console.log(evaluaciones);

  return (
    <div className="p-6 space-y-6">
      <button onClick={onVolver}>
        <ChevronLeft size={28} />
      </button>

      <h1 className="text-2xl font-semibold">
        Evaluaciones - {convocatoria?.titulo}
      </h1>

      <div className="overflow-x-auto">
        <div>
            <table className="w-full border rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">ID Evaluacion</th>
                <th className="p-3 text-left">Nombre Participante</th>
                <th className="p-3 text-left">Nombre Jurado</th>
                <th className="p-3 text-left">Calificacion</th>
                <th className="p-3 text-left">Justificación</th>
              </tr>
            </thead>
            <tbody>
              {evaluaciones.length > 0 ? (
                evaluaciones.map((e, index) => (
                  <tr key={index} className="border-t bg-gray-50">
                    <td className="p-3">{e.idEvaluacion}</td>
                    <td className="p-3">{e.nombre} {e.apellidos}</td>
                    <td className="p-3">{e.nombreJ} {e.apellidosJ}</td>
                    <td className="p-3">{e.calificacion}</td>
                    <td className="p-3">{e.justificacion}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No hay evalauciones registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListaEvaluaciones;
