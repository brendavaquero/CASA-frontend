import React, { useEffect, useState } from "react";
import FormUploadEvidencias from "@/componentes/FormUploadEvidencias";
import { getArchivosActividad, deleteArchivo } from "@/apis/archivo_Service";
import { ChevronLeft, Trash2 } from "lucide-react";
import ModalMensaje from "@/componentes/ModalMensaje";

const EvidenciasTaller = ({ taller, onVolver }) => {
  const [archivosAuxiliar, setArchivosAuxiliar] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Mensaje");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");

  const [archivoAEliminar, setArchivoAEliminar] = useState(null);

  // =========================
  // Cargar evidencias
  // =========================
  useEffect(() => {
    if (!taller?.idActividad) return;
    reloadArchivos();
  }, [taller]);

  const reloadArchivos = async () => {
    try {
      const res = await getArchivosActividad(taller.idActividad);
      const evidencias = res.filter(a => a.categoria === "EVIDENCIA");
      setArchivosAuxiliar(evidencias);
    } catch (error) {
      console.error("Error al cargar archivos:", error);
    }
  };

  // =========================
  // Eliminar archivo
  // =========================
  const solicitarEliminarArchivo = (archivo) => {
    setArchivoAEliminar(archivo);
    setModalType("confirm");
    setModalTitle("Confirmar eliminación");
    setModalMessage(`¿Deseas eliminar esta evidencia?`);
    setModalOpen(true);
  };

  const confirmarEliminarArchivo = async () => {
    if (!archivoAEliminar) return;

    try {
      await deleteArchivo(archivoAEliminar.idArchivo);
      await reloadArchivos();

      setModalType("info");
      setModalTitle("Archivo eliminado");
      setModalMessage("La evidencia se eliminó correctamente.");
      setModalOpen(true);
    } catch (error) {
      console.error(error);
      setModalType("info");
      setModalTitle("Error");
      setModalMessage("No se pudo eliminar la evidencia.");
      setModalOpen(true);
    } finally {
      setArchivoAEliminar(null);
    }
  };
  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <div className="rounded-lg overflow-hidden flex">
            {/*
            <img
              src={
                taller?.imagen
                  ? `http://localhost:8080${taller.imagen}`
                  : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              }
              alt={taller?.titulo || "Imagen del taller"}
              className="object-cover w-full h-72"
            />*/}
            <button onClick={onVolver} className="text-black px-2 py-1">
              <ChevronLeft size={30} />
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold">{taller.titulo}</h1>
                <p className="text-gray-800 text-justify mt-5">{taller.descripcion}</p>
              </div>
          </div>
          </div>

          <div className="border p-5 rounded bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Evidencias del taller
            </h2>

            {archivosAuxiliar.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No hay evidencias aún.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {archivosAuxiliar.map((archivo) => (
                  <div
                    key={archivo.idArchivo}
                    className="relative group border rounded overflow-hidden"
                  >
                    <img
                      src={`http://localhost:8080${archivo.ruta}`}
                      alt={archivo.nombre}
                      className="w-full h-60 object-cover"
                    />

                    <button
                      onClick={() => solicitarEliminarArchivo(archivo)}
                      className="
                        absolute top-2 right-2
                        bg-red-600 text-white
                        p-1 rounded-full
                        opacity-0 group-hover:opacity-100
                        transition
                      "
                      title="Eliminar evidencia"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <FormUploadEvidencias
            idActividad={taller.idActividad}
            categoria="EVIDENCIA"
            onUploadSuccess={reloadArchivos}
          />
        </div>
      </div>

      <ModalMensaje
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalType("info");
        }}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        autoClose={modalType === "info"}
        autoCloseTime={8000}
        onConfirm={confirmarEliminarArchivo}
        onCancel={() => {
          setArchivoAEliminar(null);
          setModalOpen(false);
        }}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default EvidenciasTaller;
