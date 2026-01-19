import { useNavigate } from "react-router-dom";

import {
  Card,
  Chip,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function PostulacionesJuradoTable({ postulaciones }) {
  const navigate = useNavigate();

  const obtenerNombreParticipante = (p) => {
    return p.infantil
      ? p.postulante
      : `${p.nombre} ${p.apellidos}`;
  };

  if (!postulaciones || postulaciones.length === 0) {
    return (
      <Card className="w-full">
        <CardBody>
          <Typography className="text-center text-gray-500">
            No hay postulaciones pendientes
          </Typography>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm">
      <CardBody className="max-h-[500px] overflow-y-auto overflow-x-auto px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 p-4">
                <Typography
                  variant="small"
                  className="font-semibold text-blue-gray-600"
                >
                  Participante
                </Typography>
              </th>

              <th className="border-b border-blue-gray-100 p-4">
                <Typography
                  variant="small"
                  className="font-semibold text-blue-gray-600"
                >
                  Obra
                </Typography>
              </th>

              <th className="border-b border-blue-gray-100 p-4 text-center">
                <Typography
                  variant="small"
                  className="font-semibold text-blue-gray-600"
                >
                  Tipo
                </Typography>
              </th>

              <th className="border-b border-blue-gray-100 p-4 text-center">
                <Typography
                  variant="small"
                  className="font-semibold text-blue-gray-600"
                >
                  Acción
                </Typography>
              </th>
            </tr>
          </thead>

          <tbody>
            {postulaciones.map((p, index) => {
              const isLast = index === postulaciones.length - 1;
              const rowClass = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr
                  key={p.idPostulacion}
                  className="hover:bg-blue-gray-50/50 transition-colors"
                >
                  <td className={rowClass}>
                    <Typography variant="small" className="font-normal">
                      {obtenerNombreParticipante(p)}
                    </Typography>
                  </td>

                  <td className={rowClass}>
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-700"
                    >
                      {p.nombreObra ?? "—"}
                    </Typography>
                  </td>

                  <td className={rowClass}>
                    <div className="flex justify-center">
                      <Chip
                        value={p.tipo ?? "—"}
                        color="blue"
                        size="sm"
                        variant="ghost"
                        className="capitalize w-fit"
                      />
                    </div>
                  </td>

                  <td className={`${rowClass} text-center`}>
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={() => navigate(`/evaluar/ronda1/${p.idPostulacion}`)}
                    >
                      Evaluar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
