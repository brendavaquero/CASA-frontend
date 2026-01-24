import React, { useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import ModalMensaje from "./ModalMensaje";

const FormFileUploadPostulacion = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");
  const ALLOWED_TYPES = [
    "application/pdf",
    "audio/mpeg", // mp3
    "audio/wav",
    "audio/x-wav",
  ];


  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setModalTitle("Archivo no permitido");
      setModalMessage("Solo se permiten archivos PDF,MP3 O WAV");
      setModalOpen(true);
      e.target.value = "";
      return;
    }

    setFile(selected);
    onFileSelect(selected);
  };


  const handleRemove = () => {
    setFile(null);
    onFileSelect(null);
  };

  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 w-full max-w-md bg-white shadow-sm">
      {!file ? (
        <label className="flex-1 text-gray-400 cursor-pointer text-sm">
          <input type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.mp3,.wav" />
          Seleccionar archivo...
        </label>
      ) : (
        <div className="flex justify-between items-center flex-1">
          <span className="text-gray-800 truncate">{file.name}</span>
          <button onClick={handleRemove} className="text-gray-400 hover:text-gray-600 ml-2">
            ✕
          </button>
        </div>
      )}
      <div className="bg-gray-800 text-white rounded-full p-2">
        <ArrowUpTrayIcon size={18} />
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

export default FormFileUploadPostulacion;
