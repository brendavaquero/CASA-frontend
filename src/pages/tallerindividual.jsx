import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TallerDetalle from "../componentes/taller-detalle";
import { useAuth } from "../context/AuthContext";
import { AuthRequiredModal } from "../componentes/AuthRequiredModal";
import { Button } from "@material-tailwind/react";

export function TallerIndividual() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actividad, setActividad] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const { isAuthenticated } = useAuth();

  const handlePostular = () => {
    if (!isAuthenticated) {
      setOpenAuthModal(true);
    } else {
      navigate(`/postular/${actividad.idActividad}`);
    }
  };


  useEffect(() => {
    const obtenerTaller = async () => {
      try {
        const respuesta = await fetch(
          `http://localhost:8080/api/talleresydiplomados/${id}`
        );

        if (!respuesta.ok) throw new Error("No se pudo cargar el taller");

        const data = await respuesta.json();
        setActividad(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerTaller();
  }, [id]);

  if (cargando) return <div className="pt-24 p-6">Cargando información…</div>;
  if (error) return <div className="pt-24 p-6 text-red-600">{error}</div>;
  if (!actividad) return <div className="pt-24 p-6">No encontrado</div>;
  console.log("isAuthenticated:", isAuthenticated);


  return (
  <div className="pt-24 w-full min-h-screen">
    <TallerDetalle
      actividad={actividad}
      onPostular={handlePostular}
    />

    <AuthRequiredModal
      open={openAuthModal}
      onClose={() => setOpenAuthModal(false)}
    />
  </div>
);
}

export default TallerIndividual;
