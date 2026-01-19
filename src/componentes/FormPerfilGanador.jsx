import { useState, useEffect } from "react";

const FormPerfilGanador = ({ ganador, onGuardar }) => {
  const [semblanza, setSemblanza] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");

  useEffect(() => {
    setSemblanza(ganador.semblanza || "");
    setFotoPerfil(ganador.fotoPerfil || "");
  }, [ganador]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...ganador,
      semblanza,
      fotoPerfil,
    };

    onGuardar(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Nombre */}
      <div>
        <label className="block font-semibold">Nombre</label>
        <p className="text-gray-700">{ganador.nombreGanador}</p>
      </div>

      {/* Foto */}
      <div>
        <label className="block font-semibold mb-1">Foto de perfil</label>

        {fotoPerfil ? (
          <img
            src={fotoPerfil}
            alt="Foto del ganador"
            className="w-40 h-40 object-cover rounded mb-2"
          />
        ) : (
          <p className="text-sm text-gray-500 mb-2">
            Aún no se ha asignado una foto
          </p>
        )}

        <input
          type="text"
          placeholder="URL de la foto"
          value={fotoPerfil}
          onChange={(e) => setFotoPerfil(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Semblanza */}
      <div>
        <label className="block font-semibold mb-1">Semblanza</label>
        <textarea
          value={semblanza}
          onChange={(e) => setSemblanza(e.target.value)}
          rows={5}
          className="w-full border rounded p-2"
          placeholder="Escribe la semblanza del ganador"
        />
      </div>

      {/* Archivo ganador */}
      <div>
        <label className="block font-semibold mb-1">
          Archivo ganador
        </label>
        <a
          href={ganador.archivoGanadorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Descargar archivo ganador
        </a>
      </div>

      {/* Guardar */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Guardar cambios
      </button>
    </form>
  );
};

export default FormPerfilGanador;
