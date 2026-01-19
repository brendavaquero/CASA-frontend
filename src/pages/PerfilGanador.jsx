import React, { useEffect, useState } from "react";
import { getGanadorById, actualizarGanador } from "@/apis/ganador_Service";
import FormImageGanador from "../componentes/FormImageGanador";

const ID_GANADOR = "GAN2026-00008";

const PerfilGanador = () => {
  const [ganador, setGanador] = useState(null);
  const [semblanza, setSemblanza] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarGanador();
  }, []);

  const cargarGanador = async () => {
    try {
      const data = await getGanadorById(ID_GANADOR);
      setGanador(data);
      setSemblanza(data.semblanza || "");
    } catch (error) {
      console.error("Error al cargar ganador", error);
    }
  };

  const guardarCambios = async () => {
    try {
      setGuardando(true);

      const ganadorActualizado = {
        ...ganador,
        semblanza,
      };

      const actualizado = await actualizarGanador(
        ganador.idGanador,
        ganadorActualizado
      );

      setGanador(actualizado);
      alert("Perfil actualizado correctamente ✨");
    } catch (error) {
      console.error(error);
      alert("Error al guardar cambios");
    } finally {
      setGuardando(false);
    }
  };

  const onFotoActualizada = async (urlFoto) => {
    const actualizado = await actualizarGanador(ganador.idGanador, {
      ...ganador,
      fotoPerfil: urlFoto,
    });

    setGanador(actualizado);
  };

  if (!ganador) return <p>Cargando perfil...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
      
      {/* IZQUIERDA */}
      <div className="flex flex-col items-center gap-4">
        <img
          src={ganador.fotoPerfil || "/placeholder-user.png"}
          alt="Foto ganador"
          className="w-48 h-48 object-cover rounded-full border"
        />

        <FormImageGanador
          idGanador={ganador.idGanador}
          onUploadSuccess={onFotoActualizada}
        />
      </div>

      {/* DERECHA */}
      <div className="md:col-span-2 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">
          {ganador.resultadoRondaUno?.postulacion?.nombreAutor}
        </h1>

        <textarea
          className="w-full min-h-[150px] border rounded p-3"
          placeholder="Escribe la semblanza del ganador..."
          value={semblanza}
          onChange={(e) => setSemblanza(e.target.value)}
        />

        <button
          onClick={guardarCambios}
          disabled={guardando}
          className="self-start bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Guardar cambios
        </button>

        {ganador.resultadoRondaUno?.archivoParticipacion && (
          <a
            href={ganador.resultadoRondaUno.archivoParticipacion}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Descargar obra ganadora
          </a>
        )}
      </div>
    </div>
  );
};

export default PerfilGanador;
