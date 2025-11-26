import React, { useState } from "react";
import { Upload } from "lucide-react";
import { uploadImagenActividad } from "@/apis/tallerDiplomadoService";

const FormImageAct = ({idActividad,onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemove = () => {
    setFile(null);
  };

 const handleUpload = async () => {
  if (!file) {
    alert("Selecciona una imagen");
    return;
  }

  if (!idActividad) {
    alert("No se encontró idActividad");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("idActividad", idActividad);

    const urlImagen = await uploadImagenActividad(formData);

    alert(`Imagen subida correctamente 🎉`);

    if (onUploadSuccess) onUploadSuccess(urlImagen); // ENVÍA LA URL

    setFile(null);

  } catch (error) {
    console.error(error);
    alert("Error al subir la imagen");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 w-full max-w-md bg-white shadow-sm">
      {!file ? (
        <label className="flex-1 text-gray-500 cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          Seleccionar archivo...
        </label>
      ) : (
        <div className="flex justify-between items-center flex-1">
          <span className="text-gray-800 truncate">{file.name}</span>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <button
        disabled={loading}
        onClick={handleUpload}
        className="bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2 transition"
        title="Subir archivo"
      >
        <Upload size={18} />
      </button>
    </div>
  );
};

export default FormImageAct;
