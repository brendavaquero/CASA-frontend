import TallerDetalle from "../componentes/taller-detalle";

export function PaginaPruebaTaller() {
  const actividadDemo = {
    titulo: "Narrativa Creativa en Lenguas Originarias",
    descripcion:
      "Un espacio formativo para desarrollar técnicas de escritura creativa con enfoque en lenguas originarias. Este taller busca fortalecer la expresión escrita a partir de ejercicios prácticos y análisis colectivo.",
    tipo: "TALLER",
    docente: "Laura Álvarez",
    docenteFoto: "https://randomuser.me/api/portraits/women/19.jpg",
    fechaInicio: "2025-03-15",
    fechaCierre: "2025-03-01",
    fechaResultados: "2025-03-10",
    requisitos: "Enviar carta de motivos y una muestra breve de escritura.",
    estado: "ABIERTA",
    imagen:
      "https://images.unsplash.com/photo-1529078155058-5d716f45d604?auto=format&fit=crop&w=800&q=80",
    cupo: 20,
    objetivoGeneral:
      "Fortalecer las habilidades narrativas de los participantes mediante dinámicas prácticas y análisis crítico.",
    objetivosEspecificos:
      "• Explorar diferentes estilos narrativos.\n• Desarrollar textos originales.\n• Fomentar el uso creativo de la lengua originaria.",
    temas:
      "• Técnicas narrativas.\n• Construcción de personajes.\n• Narrativa oral y escrita.\n• Proyectos individuales.",
    materialSol: "Cuaderno, dispositivo para escritura digital (opcional).",
    criteriosSeleccion:
      "Interés en el desarrollo narrativo, calidad de la muestra enviada y disponibilidad para asistir a todas las sesiones.",
    notas: "El taller incluye acompañamiento personalizado.",
    numSesiones: 8,
    idPrograma: "PR-001",
    idUsuario: "USR-001",
  };

  return (
    <div className="pt-24 w-full min-h-screen">
      <TallerDetalle actividad={actividadDemo} />
    </div>
  );
}

export default PaginaPruebaTaller;

/*import TallerDetalle from "./taller-detalle";

export default function PaginaPruebaTaller() {
  const actividadDemo = {
    titulo: "Taller de Narrativa Creativa en Lenguas Originarias",
    descripcion:
      "Un espacio formativo para desarrollar técnicas de escritura creativa con enfoque en lenguas originarias. Este taller busca fortalecer la expresión escrita a partir de ejercicios prácticos y análisis colectivo.",
    tipo: "TALLER",
    fechaInicio: "2025-03-15",
    fechaCierre: "2025-03-01",
    fechaResultados: "2025-03-10",
    requisitos: "Enviar carta de motivos y una muestra breve de escritura.",
    estado: "ABIERTA",
    imagen:
      "https://images.unsplash.com/photo-1529078155058-5d716f45d604?auto=format&fit=crop&w=800&q=80",
    cupo: 20,
    objetivoGeneral:
      "Fortalecer las habilidades narrativas de los participantes mediante dinámicas prácticas y análisis crítico.",
    objetivosEspecificos:
      "• Explorar diferentes estilos narrativos.\n• Desarrollar textos originales.\n• Fomentar el uso creativo de la lengua originaria.",
    temas:
      "• Técnicas narrativas.\n• Construcción de personajes.\n• Narrativa oral y escrita.\n• Proyectos individuales.",
    materialSol: "Cuaderno, dispositivo para escritura digital (opcional).",
    criteriosSeleccion:
      "Interés en el desarrollo narrativo, calidad de la muestra enviada y disponibilidad para asistir a todas las sesiones.",
    notas: "El taller incluye acompañamiento personalizado.",
    numSesiones: 8,
    idPrograma: "PR-001",
    idUsuario: "USR-001",
  };

  return (
    <div className="w-full min-h-screen">
      <TallerDetalle actividad={actividadDemo} />
    </div>
  );
}*/
