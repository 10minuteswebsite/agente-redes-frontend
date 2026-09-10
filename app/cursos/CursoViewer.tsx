"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";
import type { Curso, Leccion } from "./data";

function claveProgreso(cursoSlug: string) {
  return `cursos:progreso:${cursoSlug}`;
}

function useProgreso(cursoSlug: string) {
  const [completadas, setCompletadas] = useState<string[]>([]);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(claveProgreso(cursoSlug));
      setCompletadas(guardado ? JSON.parse(guardado) : []);
    } catch {
      setCompletadas([]);
    }
  }, [cursoSlug]);

  function alternar(leccionSlug: string) {
    setCompletadas((prev) => {
      const next = prev.includes(leccionSlug)
        ? prev.filter((s) => s !== leccionSlug)
        : [...prev, leccionSlug];
      try {
        localStorage.setItem(claveProgreso(cursoSlug), JSON.stringify(next));
      } catch {
        // localStorage no disponible; el progreso simplemente no persiste
      }
      return next;
    });
  }

  return { completadas, alternar };
}

export default function CursoViewer({
  curso,
  leccion,
  anterior,
  siguiente,
}: {
  curso: Curso;
  leccion: Leccion;
  anterior?: Leccion;
  siguiente?: Leccion;
}) {
  const { completadas, alternar } = useProgreso(curso.slug);
  const completada = completadas.includes(leccion.slug);
  const total = curso.lecciones.length;
  const vistas = completadas.length;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
      <aside className="w-full shrink-0 border-b border-[var(--yr-border)] px-6 py-6 lg:w-80 lg:border-r lg:border-b-0">
        <Link href="/cursos">
          <BrandMark />
        </Link>

        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[var(--yr-olive)] uppercase">
          El curso en video
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--yr-brown)]">
          {curso.titulo}
        </h1>

        <p className="mt-4 text-xs text-[var(--yr-brown-soft)]">
          {vistas} / {total} {total === 1 ? "lección vista" : "lecciones vistas"}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--yr-border)]">
          <div
            className="h-full rounded-full bg-[var(--yr-olive)] transition-all"
            style={{ width: `${total ? (vistas / total) * 100 : 0}%` }}
          />
        </div>

        <ol className="mt-6 flex flex-col gap-1">
          {curso.lecciones.map((l) => {
            const activa = l.slug === leccion.slug;
            const hecha = completadas.includes(l.slug);
            return (
              <li key={l.slug}>
                <Link
                  href={`/cursos/${curso.slug}/${l.slug}`}
                  className={`flex items-start gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    activa
                      ? "bg-[var(--yr-cream-soft)] ring-1 ring-[var(--yr-border)]"
                      : "hover:bg-[var(--yr-cream-soft)]"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                      hecha
                        ? "border-[var(--yr-olive)] bg-[var(--yr-olive)] text-white"
                        : "border-[var(--yr-brown-soft)]"
                    }`}
                  >
                    {hecha ? "✓" : ""}
                  </span>
                  <span className="text-[var(--yr-brown)]">{l.titulo}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </aside>

      <div className="flex-1 px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--yr-brown)]">
            {leccion.titulo}
          </h2>
          <button
            onClick={() => alternar(leccion.slug)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              completada
                ? "bg-[var(--yr-olive)] text-white"
                : "bg-[var(--yr-purple)] text-white hover:bg-[var(--yr-purple-soft)]"
            }`}
          >
            {completada ? "✓ Vista" : "Marcar como vista"}
          </button>
        </div>

        <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-black">
          <iframe
            key={leccion.youtubeId}
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${leccion.youtubeId}`}
            title={leccion.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {anterior && (
              <Link
                href={`/cursos/${curso.slug}/${anterior.slug}`}
                className="rounded-full border border-[var(--yr-border)] px-4 py-2 text-sm text-[var(--yr-brown)] hover:border-[var(--yr-olive-soft)]"
              >
                ← Anterior
              </Link>
            )}
            {siguiente && (
              <Link
                href={`/cursos/${curso.slug}/${siguiente.slug}`}
                className="rounded-full bg-[var(--yr-brown)] px-4 py-2 text-sm text-white hover:bg-[var(--yr-brown-soft)]"
              >
                Siguiente →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
