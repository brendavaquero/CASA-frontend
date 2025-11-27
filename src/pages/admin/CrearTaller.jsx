import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import FormImageAct from "@/componentes/FormImageAct";
import { createSesiones } from "@/apis/sesiones";
import { updatedActividad } from "@/apis/tallerDiplomado_Service";

const CrearTaller = ({ taller, onVolver }) => {
  const [form, setForm] = useState({
    sesiones: 0,
    inicio:"",
    cierre: "",
    publicacion: "",
    imagen: null,
  });

  const [sesionesData, setSesionesData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "sesiones") {
      const count = parseInt(value) || 0;

      // Generar las filas automáticamente
      const filas = Array.from({ length: count }, () => ({
        fechaInicio: "",
        fechaFin: "",
        horaInicio: "",
        horaFin: "",
        aula:"",
      }));

      setSesionesData(filas);
    }
  };

  const handleTableChange = (index, field, value) => {
    const updated = [...sesionesData];
    updated[index][field] = value;
    setSesionesData(updated);
  };

  const handleSubmit = async () => {
    if (!taller || !taller.idActividad) {
      console.error("ERROR: taller o idActividad no disponible:", taller);
      alert("La actividad aún no termina de cargarse. Intenta de nuevo.");
      return;
    }
    try {
        // 1️⃣ ACTUALIZAR ACTIVIDAD
        await updatedActividad(taller.idActividad, {
        fechaCierre: form.cierre,
        fechaResultados: form.publicacion,
        numSesiones: form.sesiones
        });

        for (const [i, sesion] of sesionesData.entries()) {
          if (!sesion.fechaInicio || !sesion.fechaFin || !sesion.horaInicio || !sesion.horaFin) {
            alert(`La sesión #${i + 1} está incompleta.`);
            return;
          }
        }

        // 2️⃣ CREAR SESIONES
        for (const sesion of sesionesData) {
          console.log('taller id',taller.idActividad);
          console.log("SESION A REGISTRAR:", {
            idTallerDiplomado: taller.idActividad,
            ...sesion
          });
        await createSesiones({
            idTallerDiplomado: taller.idActividad,
            ...sesion,
        });
        }

        alert("Actividad publicada 🚀");

    } catch (err) {
        console.error("Error al publicar", err);
        alert("Ocurrió un error, revisa la consola.");
    }
    };

    console.log("TALLER RECIBIDO EN CrearTaller:", taller);
  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Título */}
      <h1 className="text-2xl font-semibold mb-8">{taller?.titulo || "Actividad sin nombre"}</h1>

      {/* FILA DE INPUTS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        {/* Numero de sesiones */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Número de sesiones</label>
          <Input
            type="number"
            name="sesiones"
            placeholder="0"
            value={form.sesiones}
            onChange={handleChange}
          />
        </div>

        {/* Fecha de inicio */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Fecha de Inicio</label>
          <Input
            type="date"
            name="inicio"
            placeholder="0"
            value={form.inicio}
            onChange={handleChange}
          />
        </div>

        {/* Cierre de inscripciones */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Cierre de inscripciones</label>
          <Input
            type="date"
            name="cierre"
            value={form.cierre}
            onChange={handleChange}
          />
        </div>

        {/* Publicación de resultados */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Publicación de resultados</label>
          <Input
            type="date"
            name="publicacion"
            value={form.publicacion}
            onChange={handleChange}
          />
        </div>

        {/* Imagen */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Imagen</label>
            <FormImageAct 
            idActividad={taller.idActividad}
            onUploadSuccess={(url) => setForm({ ...form, imagen: url })} />
        </div>
      </div>

      {/* TABLA DINÁMICA */}
      <div className="border rounded-xl overflow-hidden shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Fecha inicio</th>
              <th className="px-4 py-3">Fecha fin</th>
              <th className="px-4 py-3">Hora inicio</th>
              <th className="px-4 py-3">Hora fin</th>
              <th className="px-4 py-3">Aula</th>
            </tr>
          </thead>
          <tbody>
            {sesionesData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Ingresa número de sesiones para generar la tabla.
                </td>
              </tr>
            ) : (
              sesionesData.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3 font-semibold">{index + 1}</td>

                  {/* Fecha inicio */}
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      className="border rounded px-2 py-1 w-full"
                      value={row.fechaInicio}
                      onChange={(e) =>
                        handleTableChange(index, "fechaInicio", e.target.value)
                      }
                    />
                  </td>

                  {/* Fecha fin */}
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      className="border rounded px-2 py-1 w-full"
                      value={row.fechaFin}
                      onChange={(e) =>
                        handleTableChange(index, "fechaFin", e.target.value)
                      }
                    />
                  </td>

                  {/* Hora inicio */}
                  <td className="px-4 py-3">
                    <input
                      type="time"
                      className="border rounded px-2 py-1 w-full"
                      value={row.horaInicio}
                      onChange={(e) =>
                        handleTableChange(index, "horaInicio", e.target.value)
                      }
                    />
                  </td>

                  {/* Hora fin */}
                  <td className="px-4 py-3">
                    <input
                      type="time"
                      className="border rounded px-2 py-1 w-full"
                      value={row.horaFin}
                      onChange={(e) =>
                        handleTableChange(index, "horaFin", e.target.value)
                      }
                    />
                  </td>
                  {/* Aula */}
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full"
                      value={row.aula}
                      onChange={(e) =>
                        handleTableChange(index, "aula", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* BOTÓN PUBLICAR */}
      <div className="flex justify-end mt-8">
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700"
        >
          Publicar
        </Button>
      </div>
    </div>
  );
};

export default CrearTaller;
