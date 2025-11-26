import React, { useEffect, useState } from "react";
import { getTalleres } from "@/apis/tallerDiplomadoService";

const GirdTallerD = ({ onTallerClick,talleres: talleresProp }) => {
  const [talleres, setTalleres] = useState([]);

  useEffect(() => {
    if (talleresProp) {
      setTalleres(talleresProp);
      console.log('talleres:',talleres);
      return;
    }
  }, [talleresProp]);

   return (
    <div className="p-6 w-full">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Mis talleres</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {talleres.length > 0 ? (
          talleres.map((taller) => (
            <div
              key={taller.id_actividad}
              className="border rounded-lg shadow-sm bg-white hover:bg-gray-200 shadow-md transition-shadow cursor-pointer"
              onClick={() => onTallerClick && onTallerClick(taller)}
            >
              <div className="h-32 bg-gray-200 flex items-center justify-center mb-4 rounded">
                  {taller.imagen ? (
                    <img
                      src={`http://localhost:8080${taller.imagen}`}
                      alt={taller.descripcion}
                      className="h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
                  )}
                </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">
                  {taller.titulo || "Sin categoría"}
                </p>
                <h2 className="font-semibold text-gray-700 mb-3">
                  {taller.descripcion || "Sin descripción"}
                </h2>
                <div className="flex justify-between items-center text-gray-500 text-sm">
                  <div className="flex space-x-2">
                    <span>👥 {taller.cupo || "—"}</span>
                    <span>📅 {taller.fechaInicio || "—"}</span>
                    <span>✏️ {taller.estado || "—"}</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">⋯</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center">No hay talleres registrados</p>
        )}
      </div>
    </div>
  );
};

export default GirdTallerD;
