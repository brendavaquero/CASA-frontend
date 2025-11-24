import { useEffect, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import {
  getPostulacionesPendientesConParticipante,
  seleccionarPostulantes,
} from "../apis/PostulacionService";

import DialogDefault from "./DialogDefault";

const TABLE_HEAD = [
  "", // checkbox
  "Nombre",
  "Sexo",
  "Edad",
  "País",
  "Estado",
  "Municipio",
  "Lengua",
  "Postulante (niño)",
  "Motivo",
  "Estado",
];

export default function PostulacionesPendientesTable() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const idActividad = "ACT2025-00021"; // temporal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPostulacionesPendientesConParticipante(
          idActividad
        );
        setPostulaciones(data);
      } catch (error) {
        console.error("Error obteniendo postulaciones pendientes:", error);
      }
    };

    fetchData();
  }, []);

  // Toggle checkbox
  const toggleSeleccion = (idPostulacion) => {
    setSeleccionadas((prev) =>
      prev.includes(idPostulacion)
        ? prev.filter((id) => id !== idPostulacion)
        : [...prev, idPostulacion]
    );
  };

  // Ejecutar selección final
  const handleConfirmar = async () => {
    try {
      await seleccionarPostulantes(idActividad, seleccionadas);

      // Recargar tabla
      const data = await getPostulacionesPendientesConParticipante(
        idActividad
      );
      setPostulaciones(data);

      // Limpiar seleccionados
      setSeleccionadas([]);

      setOpenDialog(false);
    } catch (error) {
      console.error("Error al seleccionar postulantes:", error);
    }
  };

  return (
    <>
      {/* Botón de selección */}
      <div className="flex justify-end mb-4">
        <Button
          color="black"
          disabled={seleccionadas.length === 0}
          onClick={() => setOpenDialog(true)}
        >
          Confirmar selección ({seleccionadas.length})
        </Button>
      </div>

      {/* Tabla */}
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {postulaciones.map((post, index) => {
              const p = post.participante;
              const fullName = `${p.nombre} ${p.apellidos}`;
              const isSelected = seleccionadas.includes(post.idPostulacion);

              const isLast = index === postulaciones.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={post.idPostulacion}>
                  {/* Checkbox */}
                  <td className={classes}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSeleccion(post.idPostulacion)}
                      className="h-4 w-4 cursor-pointer"
                    />
                  </td>

                  {/* Nombre */}
                  <td className={classes}>
                    <Typography variant="small">{fullName}</Typography>
                  </td>

                  {/* Sexo */}
                  <td className={classes}>
                    <Typography variant="small">{p.sexo}</Typography>
                  </td>

                  {/* Edad */}
                  <td className={classes}>
                    <Typography variant="small">{post.edad}</Typography>
                  </td>

                  {/* Pais */}
                  <td className={classes}>
                    <Typography variant="small">
                      {p.pais?.nombre || "—"}
                    </Typography>
                  </td>

                  {/* Estado */}
                  <td className={classes}>
                    <Typography variant="small">
                      {p.estado?.nombre || "—"}
                    </Typography>
                  </td>

                  {/* Municipio */}
                  <td className={classes}>
                    <Typography variant="small">
                      {p.municipio?.nombre || "—"}
                    </Typography>
                  </td>

                  {/* Lengua indígena */}
                  <td className={classes}>
                    <Typography variant="small">
                      {p.lenguaIndigena?.nombre || "Ninguna"}
                    </Typography>
                  </td>

                  {/* Postulante niño */}
                  <td className={classes}>
                    <Typography variant="small">
                      {post.postulante || "—"}
                    </Typography>
                  </td>

                  {/* Motivo */}
                  <td className={classes}>
                    <Typography variant="small">{post.motivo}</Typography>
                  </td>

                  {/* Estado actual */}
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color={
                        post.estadoPos === "APROBADA"
                          ? "green"
                          : post.estadoPos === "RECHAZADA"
                          ? "red"
                          : "blue-gray"
                      }
                    >
                      {post.estadoPos.toLowerCase()}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Dialog de confirmación */}
      <DialogDefault
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Confirmar selección"
        message={`¿Confirmas aprobar ${seleccionadas.length} postulacion(es) y rechazar el resto automáticamente?`}
        onConfirm={handleConfirmar}
      />
    </>
  );
}
