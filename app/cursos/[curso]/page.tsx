import { notFound, redirect } from "next/navigation";
import { getCurso } from "../data";

export default async function CursoPage({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso: cursoSlug } = await params;
  const curso = getCurso(cursoSlug);
  if (!curso || curso.lecciones.length === 0) {
    notFound();
  }

  redirect(`/cursos/${curso.slug}/${curso.lecciones[0].slug}`);
}
