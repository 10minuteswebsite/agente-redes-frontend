import { notFound } from "next/navigation";
import { getLeccion } from "../../data";
import CursoViewer from "../../CursoViewer";

export default async function LeccionPage({
  params,
}: {
  params: Promise<{ curso: string; leccion: string }>;
}) {
  const { curso: cursoSlug, leccion: leccionSlug } = await params;
  const datos = getLeccion(cursoSlug, leccionSlug);

  if (!datos) {
    notFound();
  }

  return (
    <CursoViewer
      curso={datos.curso}
      leccion={datos.leccion}
      anterior={datos.anterior}
      siguiente={datos.siguiente}
    />
  );
}
