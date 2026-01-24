import React, { useState } from "react";
import { Upload } from "lucide-react";

const FormImageAct = ({ onFileSelected }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (onFileSelected) {
      onFileSelected(selected);
    }
  };

  const handleRemove = () => {
    setFile(null);
    if (onFileSelected) {
      onFileSelected(null);
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

      <Upload size={18} className="text-gray-500 mr-2" />
    </div>
  );
};

export default FormImageAct;

