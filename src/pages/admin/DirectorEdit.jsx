import React, { useEffect, useState } from "react";
import FormFirma from "@/componentes/FormFirma";
import { Button, TextField } from "@mui/material";
import { getDirectores, updateDirector } from "@/apis/director";
import ModalMensaje from "@/componentes/ModalMensaje";

const DirectorEdit = ({ directorId }) => {
  const [director, setDirector] = useState(null);
  const [nombre, setNombre] = useState("");
  const [firma, setFirma] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");

  useEffect(() => {
    cargarDirector();
  }, [directorId]);

  const cargarDirector = async () => {
    const res = await getDirectores();
    const encontrado = res.find((d) => d.id === directorId);
    if (encontrado) {
      setDirector(encontrado);
      setNombre(encontrado.nombre);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("activo", director.activo);

    if (firma) {
      formData.append("firma", firma);
    }

    try {
      await updateDirector(directorId, formData);
      setModalTitle("Éxito");
      setModalMessage("Director actualizado correctamente");
      setModalOpen(true);
      cargarDirector();
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Error al actualizar director");
      setModalOpen(true);
    }
  };

  if (!director) return null;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 space-y-4 max-w-lg"
      >
        <h2 className="text-lg font-semibold">Editar Director</h2>

        <TextField
          label="Nombre del Director"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          required
        />

        <FormFirma
          firmaActual={director.firma}
          onFileSelected={setFirma}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="contained" sx={{ bgcolor: "black" }}>
            Guardar cambios
          </Button>
        </div>
      </form>

      <ModalMensaje
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        autoClose
        autoCloseTime={6000}
      />
    </>
  );
};

export default DirectorEdit;
