import Link from "next/link";
import { cursos } from "./data";

export const metadata = {
  title: "Biblioteca de cursos",
};

export default function BibliotecaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Biblioteca de cursos</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Elige un curso para empezar a verlo en orden.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cursos.map((curso) => (
          <Link
            key={curso.slug}
            href={`/cursos/${curso.slug}`}
            className="rounded-2xl border border-neutral-200 p-5 transition hover:border-neutral-400 hover:shadow-sm"
          >
            <h2 className="text-lg font-medium text-neutral-900">{curso.titulo}</h2>
            <p className="mt-1 text-sm text-neutral-500">{curso.descripcion}</p>
            <p className="mt-3 text-xs text-neutral-400">
              {curso.lecciones.length}{" "}
              {curso.lecciones.length === 1 ? "capítulo" : "capítulos"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
