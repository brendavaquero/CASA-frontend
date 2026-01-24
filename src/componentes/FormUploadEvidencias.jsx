import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { CloudUploadIcon } from "lucide-react";
import { X } from "lucide-react";
import { uploadArchivo } from "@/apis/archivo_Service";
import ModalMensaje from "./ModalMensaje";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FormUploadEvidencias = ({ idActividad, categoria, onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Mensaje");
  const [modalMessage, setModalMessage] = useState("");

  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
  ];

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const validFiles = [];
    let rejected = 0;

    for (const file of selectedFiles) {
      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        validFiles.push(file);
      } else {
        rejected++;
      }
    }

    if (rejected > 0) {
      setModalTitle("Archivos no permitidos");
      setModalMessage(
        "Solo se permiten imágenes JPG o PNG."
      );
      setModalOpen(true);
    }

    setFiles(prev => [...prev, ...validFiles]);
    event.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setModalTitle("Advertencia");
      setModalMessage("Selecciona al menos un archivo.");
      setModalOpen(true);
      return;
    }

    if (!idActividad) {
      setModalTitle("Error");
      setModalMessage("No se encontró la actividad.");
      setModalOpen(true);
      return;
    }

    try {
      setLoading(true);

      let ok = 0;
      let fail = 0;

      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("idActividad", idActividad);
          formData.append("categoria", categoria);

          await uploadArchivo(formData);
          ok++;
        } catch {
          fail++;
        }
      }

      setModalTitle("Resultado de carga");
      setModalMessage(
        `✔ Subidos correctamente: ${ok}\n❌ Con error: ${fail}`
      );
      setModalOpen(true);

      setFiles([]);
      onUploadSuccess?.();

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 max-w-md">

      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={loading}
        fullWidth
        sx={{bgcolor:"black"}}
      >
        Seleccionar archivos
        <VisuallyHiddenInput
          type="file"
          multiple
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
      </Button>

      {files.length > 0 && (
        <ul className="border rounded p-2 max-h-40 overflow-y-auto text-sm">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex justify-between items-center gap-2"
            >
              <span className="truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-600"
                title="Quitar archivo"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="outlined"
        onClick={handleUpload}
        disabled={loading}
        sx={{borderColor:"black", color:"black"}}
      >
        Subir archivos
      </Button>

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

export default FormUploadEvidencias;
