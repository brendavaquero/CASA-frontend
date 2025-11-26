import React, { useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const FormFileUploadPostulacion = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    onFileSelect(selected);  // <-- enviamos el archivo al formulario
  };

  const handleRemove = () => {
    setFile(null);
    onFileSelect(null);
  };

  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 w-full max-w-md bg-white shadow-sm">
      {!file ? (
        <label className="flex-1 text-gray-400 cursor-pointer text-sm">
          <input type="file" onChange={handleFileChange} className="hidden" />
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
    </div>
  );
};

export default FormFileUploadPostulacion;
