import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";

const BASE_URL = "http://localhost:8080";

const FormFirma = ({ firmaActual, onFileSelected }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (firmaActual) {
      setPreview(`${BASE_URL}${firmaActual}`);
    } else {
      setPreview(null);
    }
  }, [firmaActual]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setPreview(URL.createObjectURL(selected));
    onFileSelected?.(selected);
  };

  const handleRemove = () => {
    setPreview(null);
    onFileSelected?.(null);
  };

  return (
    <div className="w-full space-y-2">
      {preview && (
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Firma del director"
            className="max-h-24 object-contain border rounded-md p-2 bg-white"
          />
        </div>
      )}

      <div className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 bg-white shadow-sm">
        <label className="flex-1 text-gray-500 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview ? "Cambiar firma..." : "Seleccionar firma..."}
        </label>

        <Upload size={18} className="text-gray-500 mr-2" />
      </div>

      {preview && (
        <button
          type="button"
          onClick={handleRemove}
          className="text-sm text-red-500 hover:underline"
        >
          Quitar firma seleccionada
        </button>
      )}
    </div>
  );
};

export default FormFirma;
