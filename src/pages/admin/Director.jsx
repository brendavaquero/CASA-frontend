import React, { useEffect, useState } from "react";
import FormFirma from "@/componentes/FormFirma";
import { Button, TextField } from "@mui/material";
import { createDirector, updateDirector, getDirectores } from "@/apis/director";
import ModalMensaje from "@/componentes/ModalMensaje";

const API_URL = "http://localhost:8080";

const Director = () => {
  const [director, setDirector] = useState(null);
  const [nombre, setNombre] = useState("");
  const [firma, setFirma] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");

  // 🔥 CARGAR DIRECTOR AL INICIAR
  useEffect(() => {
    cargarDirector();
  }, []);

  const cargarDirector = async () => {
    const res = await getDirectores();
    if (res && res.length > 0) {
      setDirector(res[0]);
      setNombre(res[0].nombre);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);

    if (firma) {
      formData.append("firma", firma);
    }

    try {
      if (director?.id) {
        await updateDirector(director.id, formData);
        setModalMessage("Se actualizó correctamente");
      } else {
        await createDirector(formData);
        setModalMessage("Se creó correctamente");
      }

      setModalTitle("Éxito");
      setModalOpen(true);
      setFirma(null);
      cargarDirector(); // 🔄 refrescar vista
    } catch (error) {
      console.error(error);
      setModalTitle("Error");
      setModalMessage("Error guardando director");
      setModalOpen(true);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 space-y-4 max-w-lg"
      >
        <h2 className="text-lg font-semibold">Director</h2>

        <TextField
          label="Nombre del Director"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          required
        />
{/*
        {director?.firma && (
          <div className="flex justify-center">
            <img
              src={`${API_URL}${director.firma}`}
              alt="Firma del director"
              className="h-20 object-contain border rounded-md p-2"
            />
          </div>
        )}*/}

        <FormFirma
          firmaActual={director?.firma}
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
        autoCloseTime={8000}
      />
    </>
  );
};

export default Director;
