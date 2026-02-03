import React, { useEffect, useState } from "react";
import { Button, TextField, Checkbox, FormControlLabel } from "@mui/material";
import { Edit, X } from "lucide-react";
import FormFirma from "@/componentes/FormFirma";
import ModalMensaje from "@/componentes/ModalMensaje";
import {
  createDirector,
  updateDirector,
  getDirectores,
} from "@/apis/director";

const API_URL = "http://localhost:8080";

const Director = () => {
  const [directores, setDirectores] = useState([]);

  // ===== FORM =====
  const [nombre, setNombre] = useState("");
  const [firma, setFirma] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [activo, setActivo] = useState(false);

  // ===== EDICIÓN =====
  const [modoEdicion, setModoEdicion] = useState(false);
  const [directorEditando, setDirectorEditando] = useState(null);

  // ===== MODAL =====
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    cargarDirectores();
  }, []);

  const cargarDirectores = async () => {
    const res = await getDirectores();
    setDirectores(res || []);
  };

  // ================== CREAR ==================
  const crearDirector = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("fechaInicio", fechaInicio || "");
      formData.append("fechaFin", fechaFin || "");
      formData.append("activo", activo ? "true" : "false");

      if (firma) formData.append("firma", firma);

      await createDirector(formData);

      setModalTitle("Éxito");
      setModalMessage("Director creado correctamente");
      setModalOpen(true);

      limpiarFormulario();
      cargarDirectores();
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("No se pudo crear el director");
      setModalOpen(true);
    }
  };

  // ================== EDITAR ==================
  const iniciarEdicion = (director) => {
    setModoEdicion(true);
    setDirectorEditando(director);

    setNombre(director.nombre);
    setFechaInicio(director.fechaInicio || "");
    setFechaFin(director.fechaFin || "");
    setActivo(Boolean(director.activo));
    setFirma(null);
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("fechaInicio", fechaInicio || "");
      formData.append("fechaFin", fechaFin || "");
      formData.append("activo", activo ? "true" : "false");

      if (firma) formData.append("firma", firma);

      await updateDirector(directorEditando.id, formData);

      setModalTitle("Éxito");
      setModalMessage("Director actualizado correctamente");
      setModalOpen(true);

      cancelarEdicion();
      cargarDirectores();
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("No se pudo actualizar el director");
      setModalOpen(true);
    }
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setDirectorEditando(null);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre("");
    setFechaInicio("");
    setFechaFin("");
    setActivo(false);
    setFirma(null);
  };

  // ================== UI ==================
  return (
    <>
      {/* ================= FORM ================= */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {modoEdicion ? "Editar Director" : "Registrar Director"}
          </h2>

          {modoEdicion && (
            <button onClick={cancelarEdicion}>
              <X />
            </button>
          )}
        </div>

        <form onSubmit={modoEdicion ? guardarEdicion : crearDirector}>
          <TextField
            label="Nombre del Director"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="mb-4"
          />

          <FormFirma
            firmaActual={modoEdicion ? directorEditando?.firma : null}
            onFileSelected={setFirma}
          />

          {/* PERIODOS Y ACTIVO (CREAR + EDITAR) */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <TextField
              label="Fecha inicio"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />

            <TextField
              label="Fecha fin"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                />
              }
              label="Director activo"
              className="col-span-2"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            {modoEdicion && (
              <Button variant="outlined" onClick={cancelarEdicion}>
                Cancelar
              </Button>
            )}

            <Button type="submit" variant="contained" sx={{ bgcolor: "black" }}>
              {modoEdicion ? "Guardar cambios" : "Crear"}
            </Button>
          </div>
        </form>
      </div>

      {/* ================= LISTA ================= */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Directores registrados
        </h2>

        <div className="space-y-4">
          {directores.map((d) => (
            <div
              key={d.id}
              className="border rounded-lg p-4 flex justify-between items-center gap-4"
            >
              <div>
                <p className="font-semibold">{d.nombre}</p>
                <p className="text-sm text-gray-500">
                  Activo: {d.activo ? "Sí" : "No"}
                </p>
                <p className="text-sm">
                  Periodo: {d.fechaInicio || "—"} / {d.fechaFin || "—"}
                </p>
              </div>

              {d.firma && (
                <img
                  src={`${API_URL}${d.firma}`}
                  alt="Firma"
                  className="h-16 object-contain border rounded-md p-2"
                />
              )}

              <Button
                variant="outlined"
                startIcon={<Edit size={16} />}
                onClick={() => iniciarEdicion(d)}
              >
                Editar
              </Button>
            </div>
          ))}
        </div>
      </div>

      <ModalMensaje
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        autoClose
        autoCloseTime={4000}
      />
    </>
  );
};

export default Director;
