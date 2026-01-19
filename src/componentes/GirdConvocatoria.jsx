import React, { useEffect, useState } from "react";
const GirdConvocatoria = ({ onConvocatoriaClick ,convocatorias: convocatoriasProp }) => {
  const [convocatorias, setConvocatorias] = useState([]);

  useEffect(() => {
    if (convocatoriasProp) {
      setConvocatorias(convocatoriasProp);
      console.log('Convocatorias:',convocatoriasProp);
      return;
    }
  }, [convocatoriasProp]);

   return (
    <div className="p-6 w-full">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Convocatorias</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {convocatorias.length > 0 ? (
          convocatorias.map((convocatoria) => (
            <div
              key={convocatoria.id_actividad}
              className="border rounded-lg shadow-sm bg-white hover:bg-gray-200 shadow-md transition-shadow cursor-pointer"
              onClick={() => onConvocatoriaClick && onConvocatoriaClick(convocatoria)}
            >
              <div className="h-32 bg-gray-200 flex items-center justify-center mb-4 rounded">
                  {convocatoria.imagen ? (
                    <img
                      src={`http://localhost:8080${convocatoria.imagen}`}
                      alt={convocatoria.descripcion}
                      className="h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
                  )}
                </div>
              <div className="p-4">
                <p className="font-semibold text-sm text-gray-700 mb-2">
                  {convocatoria.titulo || "Sin categoría"}
                </p>
                <h2 className="text-sm text-gray-700 mb-3 text-justify">
                  {convocatoria.descripcion || "Sin descripción"}
                </h2>
                <div className="flex justify-between items-center text-gray-500 text-sm">
                  <div className="flex space-x-2">
                    <span>📅 {convocatoria.fechaInicio || "—"}</span>
                    <span>📅 {convocatoria.fechaCierre || "—"}</span>
                    <span>✏️ {convocatoria.estado || "—"}</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">⋯</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center">No hay convocatorias ni residencias registradas</p>
        )}
      </div>
    </div>
  );
};

export default GirdConvocatoria;
