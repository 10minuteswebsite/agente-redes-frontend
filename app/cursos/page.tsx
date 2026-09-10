import Link from "next/link";
import BrandMark from "./BrandMark";
import { cursos } from "./data";

export const metadata = {
  title: "Biblioteca de cursos",
};

export default function BibliotecaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <BrandMark />

      <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[var(--yr-olive)] uppercase">
        Biblioteca de cursos
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--yr-brown)]">
        Tus cursos en video
      </h1>
      <p className="mt-1 text-sm text-[var(--yr-brown-soft)]">
        Elige un curso para empezar a verlo en orden.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cursos.map((curso) => (
          <Link
            key={curso.slug}
            href={`/cursos/${curso.slug}`}
            className="rounded-2xl border border-[var(--yr-border)] bg-[var(--yr-cream-soft)] p-5 transition hover:border-[var(--yr-olive-soft)] hover:shadow-sm"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--yr-brown)]">
              {curso.titulo}
            </h2>
            <p className="mt-1 text-sm text-[var(--yr-brown-soft)]">{curso.descripcion}</p>
            <p className="mt-3 text-xs tracking-wide text-[var(--yr-olive)]">
              {curso.lecciones.length}{" "}
              {curso.lecciones.length === 1 ? "capítulo" : "capítulos"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
