import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ModalMensaje from "./ModalMensaje";

const FormImageConvocatoria = ({ file, setFile }) => {
  const [preview, setPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(selected.type)) {
      setModalTitle("Advertencia");
      setModalMessage("Solo se permiten imágenes JPG, JPEG o PNG");
      setModalOpen(true);
      return;
    }

    setFile(selected);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {preview ? (
        <div className="relative w-full max-w-sm">
          <img
            src={preview}
            alt="Previsualización"
            className="w-full h-auto rounded-md shadow-sm"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center border-2 border-gray-300 rounded-md p-4 cursor-pointer">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-gray-800">Seleccionar imagen...</span>
          <span className="text-gray-500">Menor a 10MB</span>
        </label>
      )}
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

export default FormImageConvocatoria;
