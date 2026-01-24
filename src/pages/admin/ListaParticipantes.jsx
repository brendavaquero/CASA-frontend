import { ChevronLeft } from "lucide-react";
import { enviarCorreo } from "@/apis/emailService";
import ModalMensaje from "@/componentes/ModalMensaje";

const ListaParticipantes = ({participantes = [], convocatoria, onVolver }) => {
  console.log('partici',participantes);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");

  const handleEnviarCorreos = async () => {
    try {
      for (const p of participantes) {
        if (!p.participante?.correo) continue;

        const mensaje = `
Hola ${p.participante?.nombre},

Queremos agradecerte por haber participado en la convocatoria
"${convocatoria?.titulo}".

Tu interés y participación son muy valiosos para nosotros.
Te invitamos a mantenerte al tanto de nuestras próximas convocatorias
y actividades, las cuales podrás consultar en nuestro sitio oficial:

https://casa.oaxaca.gob.mx/

Esperamos contar nuevamente con tu participación.

Saludos cordiales,
Casa de la Cultura
        `;

        await enviarCorreo({
          correo: p.participante.correo,
          asunto: "Invitacion CaSa",
          mensaje
        });
      }
      setModalTitle("Éxito");
      setModalMessage("Se enviaron los correos exitosamente");
      setModalOpen(true);
    } catch (error) {
      console.error(error);
      setModalTitle("Error");
      setModalMessage("Ocurrió un error al enviar los correos,",error);
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <button onClick={onVolver}>
        <ChevronLeft size={28} />
      </button>

      <h1 className="text-2xl font-semibold">
        Participaciones de la convocatoria - {convocatoria?.titulo}
      </h1>

      <div className="overflow-x-auto">
        <div>
            <table className="w-full border rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">ID Postulacion</th>
                <th className="p-3 text-left">Nombre Postulante</th>
                <th className="p-3 text-left">Nombre Usuario</th>
                <th className="p-3 text-left">Correo</th>
                <th className="p-3 text-left">Número de Teléfono</th>
                <th className="p-3 text-left">Estado de la postulación</th>
              </tr>
            </thead>
            <tbody>
              {participantes.length > 0 ? (
                participantes.map((e, index) => (
                  <tr key={index} className="border-t bg-gray-50">
                    <td className="p-3">{e.idPostulacion}</td>
                    <td className="p-3">{e.postulante}</td>
                    <td className="p-3">{e.participante?.nombre} {e.participante?.apellidos}</td>
                    <td className="p-3">{e.participante?.correo}</td>
                    <td className="p-3">{e.participante?.numeroTelefono}</td>
                    <td className="p-3">{e.estadoPos}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No hay participantes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-3 mt-5">
            <button className="px-4 py-2 bg-black text-white rounded-lg" 
            onClick={handleEnviarCorreos}
            >
              Enviar correo
              </button>
        </div>
      </div>
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

export default ListaParticipantes;
