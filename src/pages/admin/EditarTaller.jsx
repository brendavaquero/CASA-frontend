import React, { useEffect, useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import FormImageAct from "@/componentes/FormImageAct";
import {
  getSesionesByTaller,
  deleteSesion,
  updateSesion,
  createSesiones,
} from "@/apis/sesiones";
import { updatedActividad, uploadImagenActividad } from "@/apis/tallerDiplomado_Service";
import ModalMensaje from "@/componentes/ModalMensaje";
import { Trash2,ChevronLeft } from "lucide-react";

const EditarTaller = ({ taller, onVolver }) => {
  const [form, setForm] = useState({
    sesiones: 0,
    inicio: "",
    cierre: "",
    publicacion: "",
  });

  const [sesionesData, setSesionesData] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorsSesiones, setErrorsSesiones] = useState([]);
  const [imagenFile, setImagenFile] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Mensaje");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info"); // info | confirm
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  const [datosCargados, setDatosCargados] = useState(false);

  /* ─────────────────────────────────────── */
  /* CARGA INICIAL */
  /* ─────────────────────────────────────── */
  useEffect(() => {
    if (!taller || datosCargados) return;

    const cargarDatos = async () => {
      try {
        setForm({
          sesiones: taller.numSesiones || 0,
          inicio: taller.fechaInicio || "",
          cierre: taller.fechaCierre || "",
          publicacion: taller.fechaResultados || "",
        });

        const data = await getSesionesByTaller(taller.idActividad);

        setSesionesData(
          data.map((s) => ({
            idSesion: s.idSesion,
            fechaInicio: s.fechaInicio,
            fechaFin: s.fechaFin,
            horaInicio: s.horaInicio,
            horaFin: s.horaFin,
            aula: s.aula,
          }))
        );

        setErrorsSesiones(Array(data.length).fill({}));
        setDatosCargados(true);
      } catch (err) {
        console.error("Error al cargar datos del taller", err);
      }
    };

    cargarDatos();
  }, [taller, datosCargados]);

  const horaAMinutos = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };
  const obtenerRangoSesiones = () => {
    const sesionesExistentes = sesionesData.filter(s => s.idSesion);

    if (sesionesExistentes.length === 0) return null;

    const fechasInicio = sesionesExistentes.map(s => new Date(s.fechaInicio));
    const fechasFin = sesionesExistentes.map(s => new Date(s.fechaFin));

    return {
      primeraSesion: new Date(Math.min(...fechasInicio)),
      ultimaSesion: new Date(Math.max(...fechasFin))
    };
  };


  const validarFormulario = () => {
    const e = {};
    const hoy = new Date().toISOString().split("T")[0];

    if (!form.inicio) e.inicio = "Fecha obligatoria";
    else if (form.inicio < hoy) e.inicio = "No puede ser anterior a hoy";

    if (!form.cierre) e.cierre = "Fecha obligatoria";
    else if (form.cierre < form.inicio) e.cierre = "Debe ser posterior al inicio";

    if (!form.publicacion) e.publicacion = "Fecha obligatoria";
    else if (form.publicacion < form.cierre)
      e.publicacion = "Debe ser posterior al cierre";

    if (!form.sesiones || form.sesiones <= 0)
      e.sesiones = "Debe haber al menos una sesión";

    const rangoSesiones = obtenerRangoSesiones();
      if (rangoSesiones) {
        if (new Date(form.inicio) > rangoSesiones.primeraSesion) {
          e.inicio =
            "No puedes cambiar la fecha de inicio sin modificar las sesiones";
        }

        if (new Date(form.cierre) < rangoSesiones.ultimaSesion) {
          e.cierre =
            "No puedes cambiar la fecha de cierre sin modificar las sesiones";
        }
      }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validarSesiones = () => {
    let errores = [];
    let valido = true;

    const iniTaller = new Date(form.inicio);
    const finTaller = new Date(form.cierre);

    const fechasExistentes = sesionesData
        .filter((s) => s.idSesion)
        .map((s) => new Date(s.fechaInicio));

    const fechaMinExistente =
        fechasExistentes.length > 0
        ? new Date(Math.min(...fechasExistentes))
        : null;

    sesionesData.forEach((s, index) => {
        let err = {};

        const iniSesion = new Date(s.fechaInicio);
        const finSesion = new Date(s.fechaFin);

        if (iniSesion < iniTaller) {
        err.fechaInicio = "No puede iniciar antes del taller";
        valido = false;
        }

        if (finSesion > finTaller) {
        err.fechaFin = "No puede terminar después del taller";
        valido = false;
        }

        if (iniSesion > finSesion) {
        err.fechaInicio = "Inicio mayor que fin";
        valido = false;
        }

        if (!s.idSesion && fechaMinExistente && iniSesion < fechaMinExistente) {
        err.fechaInicio = "No puede iniciar antes de sesiones ya registradas";
        valido = false;
        }

        errores[index] = err;
    });

    setErrorsSesiones(errores);
      if (!valido) {
        setModalType("info");
        setModalTitle("Error en fechas");
        setModalMessage(
          "Las fechas del taller no coinciden con las sesiones. Si cambias las fechas del taller, también debes ajustar las fechas de las sesiones."
        );
        setModalOpen(true);
      }

    return valido;
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "sesiones") {
      const count = parseInt(value) || 0;
      setSesionesData((prev) =>
        count <= prev.length
          ? prev.slice(0, count)
          : [
              ...prev,
              ...Array.from({ length: count - prev.length }, () => ({
                fechaInicio: "",
                fechaFin: "",
                horaInicio: "",
                horaFin: "",
                aula: "",
              })),
            ]
      );
    }
  };

  const handleTableChange = (i, field, value) => {
    setSesionesData((prev) => {
      const copy = [...prev];
      copy[i][field] = value;
      return copy;
    });
  };


  const handleSubmit = async () => {
    if (!validarFormulario() || !validarSesiones()) return;

    try {
      await updatedActividad(taller.idActividad, {
        fechaInicio: form.inicio,
        fechaCierre: form.cierre,
        fechaResultados: form.publicacion,
        numSesiones: form.sesiones,
      });

      await Promise.all(
        sesionesData.map((s) =>
          s.idSesion
            ? updateSesion(s.idSesion, s)
            : createSesiones({
                idTallerDiplomado: taller.idActividad,
                ...s,
              })
        )
      );

      if (imagenFile) {
        const fd = new FormData();
        fd.append("file", imagenFile);
        fd.append("idActividad", taller.idActividad);
        await uploadImagenActividad(fd);
      }

      const actualizadas = await getSesionesByTaller(taller.idActividad);
      setSesionesData(actualizadas);
      setErrorsSesiones(Array(actualizadas.length).fill({}));

      setModalType("info");
      setModalTitle("Éxito");
      setModalMessage("Cambios guardados correctamente");
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setModalType("info");
      setModalTitle("Error");
      setModalMessage("Error al guardar cambios");
      setModalOpen(true);
    }
  };

  const hoy = new Date().toISOString().split("T")[0];
  const minFechaCierre = form.inicio || hoy;
  const minFechaResultados = form.cierre || minFechaCierre;
  return (
    <div className="p-8 bg-white min-h-screen">
      <button
              onClick={onVolver}
              className="text-black px-4 py-2"
            >
              <ChevronLeft size={30} />
            </button>
      <h1 className="text-2xl font-semibold mb-8">
        Editar taller – {taller?.titulo}
      </h1>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      
              {/* Numero de sesiones */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Número de sesiones</label>
                <Input
                  type="number"
                  name="sesiones"
                  placeholder="1"
                  value={form.sesiones}
                  onChange={handleChange}
                />
                {errors.sesiones && (
                  <p className="text-red-500 text-xs mt-1">{errors.sesiones}</p>
                )}
              </div>
      
              {/* Fecha de inicio */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Fecha de Inicio</label>
                <Input
                  type="date"
                  name="inicio"
                  placeholder="0"
                  value={form.inicio}
                  min={hoy}
                  onChange={handleChange}
                />
                {errors.inicio && (
                  <p className="text-red-500 text-xs mt-1">{errors.inicio}</p>
                )}
              </div>
      
              {/* Cierre de inscripciones */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Cierre de inscripciones</label>
                <Input
                  type="date"
                  name="cierre"
                  min={minFechaCierre}
                  value={form.cierre}
                  onChange={handleChange}
                />
                {errors.cierre && (
                  <p className="text-red-500 text-xs mt-1">{errors.cierre}</p>
                )}
              </div>
      
              {/* Publicación de resultados */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Publicación de resultados</label>
                <Input
                  type="date"
                  name="publicacion"
                  value={form.publicacion}
                  onChange={handleChange}
                  min={minFechaResultados}
                />
                {errors.publicacion && (
                  <p className="text-red-500 text-xs mt-1">{errors.publicacion}</p>
                )}
              </div>
      
              {/* Imagen */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Imagen</label>
                  <FormImageAct
                    onFileSelected={(file) => setImagenFile(file)}
                  />
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
                    <th className="px-4 py-3 text-center">Acciones</th>
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
                            min={form.publicacion || hoy}
                          />
                          {errorsSesiones[index]?.fechaInicio && (
                            <p className="text-red-500 text-xs mt-1">
                              {errorsSesiones[index].fechaInicio}
                            </p>
                          )}
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
                            min={row.fechaInicio || form.publicacion || hoy}
                          />
                            {errorsSesiones[index]?.fechaFin && (
                              <p className="text-red-500 text-xs mt-1">
                                {errorsSesiones[index].fechaFin}
                              </p>
                            )}
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
                          {errorsSesiones[index]?.horaInicio && (
                            <p className="text-red-500 text-xs mt-1">
                              {errorsSesiones[index].horaInicio}
                            </p>
                          )}
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
                          {errorsSesiones[index]?.horaFin && (
                            <p className="text-red-500 text-xs mt-1">
                              {errorsSesiones[index].horaFin}
                            </p>
                          )}
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
                        <td className="px-4 py-3 text-center">
                            {row.idSesion && (
                                <button
                                    onClick={() => {
                                        setModalType("confirm");
                                        setModalTitle("Eliminar sesión");
                                        setModalMessage(
                                        "¿Estás seguro de eliminar esta sesión? Esta acción no se puede deshacer."
                                        );
                                        setOnConfirmAction(() => async () => {
                                        try {
                                            await deleteSesion(row.idSesion);

                                            setSesionesData((prev) =>
                                            prev.filter((s) => s.idSesion !== row.idSesion)
                                            );

                                            setModalOpen(false);
                                        } catch (err) {
                                            console.error(err);
                                            setModalType("info");
                                            setModalTitle("Error");
                                            setModalMessage("No se pudo eliminar la sesión");
                                            setModalOpen(true);
                                        }
                                        });
                                        setModalOpen(true);
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                    >
                                    <Trash2 size={18} />
                                    </button>

                            )}
                            </td>
                            <td colSpan="6" className="px-4 pb-2">
                              {errorsSesiones[index]?.general && (
                                <p className="text-red-600 text-xs">
                                  {errorsSesiones[index].general}
                                </p>
                              )}
                            </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

      <div className="flex justify-end mt-8">
        <Button onClick={handleSubmit}>Guardar cambios</Button>
      </div>

      <ModalMensaje
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        type={modalType}                 
        autoClose={modalType === "info"}
        onClose={() => {
          setModalOpen(false);
          setOnConfirmAction(null);
        }}
        onConfirm={onConfirmAction}     
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default EditarTaller;
