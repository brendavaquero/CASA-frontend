import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConvocatoriaDetalle from "../componentes/convocatoria-detalle";
import { useAuth } from "../context/AuthContext";
import { AuthRequiredModal } from "../componentes/AuthRequiredModal";

export function ConvocatoriaIndividual() {
  const { id } = useParams(); // obtenemos el id desde la URL
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
      navigate(`/participar/${actividad.idActividad}`);
    }
  };

  useEffect(() => {
    const obtenerAct = async () => {
      try {
        const respuesta = await fetch(`http://localhost:8080/api/convocatoriasyresidencias/${id}`);


        if (!respuesta.ok) throw new Error("No se pudo cargar la actividad");

        const data = await respuesta.json();
        setActividad(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerAct();
  }, [id]);

  if (cargando)
    return (
      <div className="pt-24 p-6">
        <p>Cargando información...</p>
      </div>
    );

  if (error)
    return (
      <div className="pt-24 p-6 text-red-600">
        <p>Error: {error}</p>
      </div>
    );

  if (!actividad)
    return (
      <div className="pt-24 p-6">
        <p>No se encontró esta actividad.</p>
      </div>
    );
  console.log("isAuthenticated:", isAuthenticated);

  return (
    <div className="pt-24 w-full min-h-screen">
      <ConvocatoriaDetalle
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
 export default ConvocatoriaIndividual;