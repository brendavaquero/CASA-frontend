import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";
import PasoParticipante from "../componentes/PasoParticipante";
import { crearParticipante } from "../apis/participante_Service";
import { ChevronLeft } from "lucide-react";
import ModalMensaje from "@/componentes/ModalMensaje";

//const { user } = useAuth();

const RegistroParticipante = ({ onVolver }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Mensaje");
  const [modalMessage, setModalMessage] = useState("");

  const handleParticipanteSubmit = async (data) => {
    if (loading) return;
    try {
      setLoading(true);

      const response = await crearParticipante(data);
      console.log("Participante registrado:", response);

      alert(
        "Registro realizado correctamente."
      );
      setModalTitle("Exito");
      setModalMessage("Registro realizado correctamente 2");
       setModalOpen(true);
    // Redirige a login
  navigate("/login");
    } catch (error) {
      console.error(error);
      //alert("Error al registrar participante");
      setModalTitle("Error");
      setModalMessage("Error al registrar");
       setModalOpen(true);

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {onVolver && (
        <button onClick={onVolver} className="text-black px-2 py-1">
          <ChevronLeft size={30} />
        </button>
      )}

      <div className="flex justify-center">
        <Card className="w-full max-w-3xl p-6">
          <Typography variant="h4" className="mb-2">
            Registro de participante
          </Typography>

          <Typography variant="small" className="mb-6 text-gray-600">
            Completa tus datos para crear tu cuenta
          </Typography>

          <PasoParticipante
            onSubmit={handleParticipanteSubmit}
            pedirContrasenia={true}
            loading={loading}
          />

          {loading && (
            <Typography variant="small" className="mt-4 text-gray-500">
              Registrando información…
            </Typography>
          )}
        </Card>
      </div>
      <ModalMensaje
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalTitle}
                message={modalMessage}
                autoClose
                autoCloseTime={10000}
            />
    </>
  );
};

export default RegistroParticipante;
