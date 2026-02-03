import { useEffect, useState } from "react";
import { getInstitucionesByActividad } from "@/apis/convocatorias";
import { ChevronLeft } from "lucide-react";


import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

const ListInstituciones = ({ convocatoria,onVolver }) => {
  const [instituciones, setInstituciones] = useState([]);

  const cargarInstituciones = async () => {
    if (!convocatoria.idActividad) return;
    const data = await getInstitucionesByActividad(convocatoria.idActividad);
    setInstituciones(data);
  };

  useEffect(() => {
    cargarInstituciones();
  }, [convocatoria.idActividad]);

  return (
    <div className="p-6">
        <button onClick={onVolver}>
            <ChevronLeft size={28} />
        </button>
      <Card className="shadow-md">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <Typography variant="h6" color="blue-gray">
            Instituciones asignadas
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {["Nombre", "Logo"].map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {instituciones.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center">
                    <Typography variant="small" color="blue-gray">
                      No hay instituciones asignadas
                    </Typography>
                  </td>
                </tr>
              )}

              {instituciones.map((inst, index) => {
                const isLast = index === instituciones.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={inst.id}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {inst.nombre}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <img
                        src={
                          inst.logoUrl
                            ? `http://localhost:8080${inst.logoUrl}`
                            : "/placeholder-user.png"
                        }
                        alt="Logo institución"
                        className="w-[50px] h-[50px] object-contain"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ListInstituciones;
