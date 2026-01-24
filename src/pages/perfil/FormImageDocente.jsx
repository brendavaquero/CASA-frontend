import React, { useState } from "react";
import { Upload, User } from "lucide-react";

const FormImageDocente = ({ onFileSelected }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    onFileSelected?.(selected);
  };

  const handleRemove = () => {
    setFile(null);
    onFileSelected?.(null);
  };

  return (
    <div className="flex items-center gap-3 border rounded-xl p-3 shadow-sm bg-white">
      <User className="text-gray-400" />

      {!file ? (
        <label className="flex-1 text-gray-500 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
          Subir foto de perfil
        </label>
      ) : (
        <div className="flex-1 flex justify-between items-center">
          <span className="truncate">{file.name}</span>
          <button onClick={handleRemove}>✕</button>
        </div>
      )}

      <Upload size={18} />
    </div>
  );
};

export default FormImageDocente;
