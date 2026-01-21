import PostulacionesPendientesTable from "../componentes/PostulacionesPendientesTable";
import { ChevronLeft } from "lucide-react";

export function PostulacionesPendientesPage({taller,onVolver}) {
  return (
    <div className="p-6">
      <button
        onClick={onVolver}
        className="text-black px-4 py-2"
      >
        <ChevronLeft size={30} />
      </button>
      <h1 className="text-2xl font-semibold mb-6">
        Postulaciones pendientes
      </h1>

      <PostulacionesPendientesTable
       taller={taller}
       />
    </div>
  );
}

export default PostulacionesPendientesPage;