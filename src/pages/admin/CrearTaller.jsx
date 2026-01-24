import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import FormImageAct from "@/componentes/FormImageAct";
import { createSesiones } from "@/apis/sesiones";
import { updatedActividad } from "@/apis/tallerDiplomado_Service";
import ModalMensaje from "@/componentes/ModalMensaje";
import { uploadImagenActividad } from "@/apis/tallerDiplomado_Service";
import { getProgramas } from "@/apis/programa_Service";


const CrearTaller = ({ taller, onVolver }) => {
  const navigate = useNavigate(); 
  const [errors, setErrors] = useState({});
  const [errorsSesiones, setErrorsSesiones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");
  const [imagenFile, setImagenFile] = useState(null);
  const [programas, setProgramas] = useState([]);

  const [form, setForm] = useState({
    sesiones: 0,
    inicio:"",
    cierre: "",
    publicacion: "",
    imagen: null,
    idPrograma: ""
  });

  const [sesionesData, setSesionesData] = useState([]);

  useEffect(() => {
  const cargarProgramas = async () => {
    try {
      const data = await getProgramas();
      setProgramas(data);
      console.log('programas',data);
    } catch (error) {
      console.error("Error cargando programas", error);
    }
  };

  cargarProgramas();
}, []);

  const horaAMinutos = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };


  const validarFormulario = () => {
    const nuevosErrores = {};
    const hoy = new Date().toISOString().split("T")[0];

    if (!form.inicio) {
      nuevosErrores.inicio = "La fecha de inicio es obligatoria";
    } else if (form.inicio < hoy) {
      nuevosErrores.inicio = "No puede ser anterior a hoy";
    }

    if (!form.cierre) {
      nuevosErrores.cierre = "La fecha de cierre es obligatoria";
    } else if (form.cierre < form.inicio) {
      nuevosErrores.cierre = "Debe ser mayor o igual a la fecha de inicio";
    }

    if (!form.publicacion) {
      nuevosErrores.publicacion = "La fecha de publicación es obligatoria";
    } else if (form.publicacion < form.cierre) {
      nuevosErrores.publicacion = "Debe ser mayor o igual a la fecha de cierre";
    }

    if (!form.sesiones || Number(form.sesiones) < 0) {
      nuevosErrores.sesiones = "Debe haber al menos una sesión";
    }

    if (!form.idPrograma) {
      nuevosErrores.idPrograma = "Debe seleccionar un programa";
    }
    setErrors(nuevosErrores);
    if(nuevosErrores.length>0){
      setModalTitle("Eror");
      setModalMessage("Revisa las fechas de nuevo por favor");
      setModalOpen(true);
    }

    
    return Object.keys(nuevosErrores).length === 0;
  };

  const validarSesiones = () => {
    const errores = [];

    const MIN_INICIO = 8 * 60;
    const MAX_FIN = 20 * 60;
    const DURACION_MIN = 60;

    sesionesData.forEach((sesion, index) => {
      const errorFila = {};

      // ───── FECHAS ─────
      if (!sesion.fechaInicio) {
        errorFila.fechaInicio = "Fecha obligatoria";
      } else if (sesion.fechaInicio < form.publicacion) {
        errorFila.fechaInicio = "Debe ser posterior a la publicación";
      }

      if (!sesion.fechaFin) {
        errorFila.fechaFin = "Fecha obligatoria";
      } else if (sesion.fechaFin < sesion.fechaInicio) {
        errorFila.fechaFin = "Debe ser mayor o igual a la fecha inicio";
      }

      // ───── HORA INICIO ─────
      if (!sesion.horaInicio) {
        errorFila.horaInicio = "Hora obligatoria";
      } else {
        const inicioMin = horaAMinutos(sesion.horaInicio);
        if (inicioMin < MIN_INICIO) {
          errorFila.horaInicio = "Debe iniciar después de las 08:00 am";
        }
      }

      // ───── HORA FIN ─────
      if (!sesion.horaFin) {
        errorFila.horaFin = "Hora obligatoria";
      } else if (sesion.horaInicio) {
        const inicioMin = horaAMinutos(sesion.horaInicio);
        const finMin = horaAMinutos(sesion.horaFin);

        if (finMin > MAX_FIN) {
          errorFila.horaFin = "Debe terminar antes de las 08:00 pm";
        } else if (finMin - inicioMin < DURACION_MIN) {
          errorFila.horaFin = "Debe durar al menos 1 hora";
        }
      }

      if (!sesion.aula) {
        errorFila.aula = "Aula obligatoria";
      }

      errores[index] = errorFila;
    });

    // ───── VALIDAR DUPLICADOS / TRASLAPES ─────
    for (let i = 0; i < sesionesData.length; i++) {
      for (let j = i + 1; j < sesionesData.length; j++) {
        const s1 = sesionesData[i];
        const s2 = sesionesData[j];

        if (
          s1.fechaInicio === s2.fechaInicio &&
          s1.fechaFin === s2.fechaFin &&
          s1.horaInicio &&
          s1.horaFin &&
          s2.horaInicio &&
          s2.horaFin
        ) {
          const s1Inicio = horaAMinutos(s1.horaInicio);
          const s1Fin = horaAMinutos(s1.horaFin);
          const s2Inicio = horaAMinutos(s2.horaInicio);
          const s2Fin = horaAMinutos(s2.horaFin);

          const traslape =
            s1Inicio < s2Fin && s2Inicio < s1Fin;

          if (traslape) {
            errores[i].general = "Ya existe 1 sesion igual";
            errores[j].general = "Se cruza con una sesion existente";
          }
        }
      }
    }
    if(errores.length>0){
      setErrorsSesiones(errores);
      setModalTitle("Error");
      setModalMessage("Revisa las fechas y horas de sesiones");
      setModalOpen(true);
    }

    

    return errores.every(e => Object.keys(e).length === 0);
  };




    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });

      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }

      

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
        setErrorsSesiones(Array(filas.length).fill({}));
      }
    };

  const handleTableChange = (index, field, value) => {
    const updated = [...sesionesData];
    updated[index][field] = value;
    setSesionesData(updated);
    if (errorsSesiones[index]?.[field]) {
      const updatedErrors = [...errorsSesiones];
      updatedErrors[index] = {
        ...updatedErrors[index],
        [field]: "",
      };
      setErrorsSesiones(updatedErrors);
    }
  };

  const handleSubmit = async () => {
    if (!taller?.idActividad) {
      setModalTitle("Exito");
      setModalMessage("La actividad aún no está lista");
      setModalOpen(true);
      return;
    }

    //VALIDACIONES
    const formValido = validarFormulario();
    const sesionesValidas = validarSesiones();

    if (!formValido || !sesionesValidas) {
      return;
    }

    try {
      await updatedActividad(taller.idActividad, {
        fechaInicio: form.inicio,
        fechaCierre: form.cierre,
        fechaResultados: form.publicacion,
        numSesiones: form.sesiones,
        idPrograma: form.idPrograma
      });

      // Crear sesiones
       await Promise.all(
        sesionesData.map((sesion) =>
          createSesiones({
            idTallerDiplomado: taller.idActividad,
            ...sesion
          })
        )
      );
        if (imagenFile) {
          const formDataImg = new FormData();
          formDataImg.append("file", imagenFile);
          formDataImg.append("idActividad", taller.idActividad);

          await uploadImagenActividad(formDataImg);
        }

      setModalTitle("Exito");
      setModalMessage("Taller registrado con éxito");
      setModalOpen(true);
      navigate("/homeAdministrador");
      onVolver();

    } catch (error) {
      console.error("Error al publicar", error);
      setModalTitle("Exito");
      setModalMessage("Ocurrió un error al publicar la actividad ",error);
      setModalOpen(true);
    }
  };

  const hoy = new Date().toISOString().split("T")[0];
  const minFechaCierre = form.fechaInicio || hoy;
  const minFechaResultados = form.fechaCierre || minFechaCierre; 

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

      <div className="flex flex-col mb-5">
        <label className="text-sm text-gray-700 mb-1">Programa</label>
        <select
          name="idPrograma"
          value={form.idPrograma}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        >
          <option value="">Seleccione un programa</option>
          {programas.map((programa) => (
            <option key={programa.idPrograma} value={programa.idPrograma}>
              {programa.nombre}
            </option>
          ))}
        </select>

        {errors.idPrograma && (
          <p className="text-red-500 text-xs mt-1">{errors.idPrograma}</p>
        )}
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

      {/* BOTÓN PUBLICAR */}
      <div className="flex justify-end mt-8">
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700"
        >
          Publicar
        </Button>
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

export default CrearTaller;
