import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const ListaJurados = ({ jurados = [], convocatoria, onVolver }) => {
  const navigate = useNavigate();
  console.log(jurados);

  return (
    <div className="p-6 space-y-6">
      <button onClick={onVolver}>
        <ChevronLeft size={28} />
      </button>

      <h1 className="text-2xl font-semibold">
        Jurados asignados - {convocatoria?.titulo}
      </h1>

      <div className="overflow-x-auto">
        <div>
            <table className="w-full border rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">ID Jurado</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Apellidos</th>
                <th className="p-3 text-left">Correo</th>
              </tr>
            </thead>
            <tbody>
              {jurados.length > 0 ? (
                jurados.map((j, index) => (
                  <tr key={index} className="border-t bg-gray-50">
                    <td className="p-3">{j.idJurado}</td>
                    <td className="p-3">{j.nombre}</td>
                    <td className="p-3">{j.apellidos}</td>
                    <td className="p-3">{j.correo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No hay jurados asignados
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

export default ListaJurados;
