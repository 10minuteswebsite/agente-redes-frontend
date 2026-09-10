"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row">
      <div className="flex-1">
        <Link href="/cursos" className="text-sm text-neutral-500 hover:text-neutral-800">
          ← Biblioteca de cursos
        </Link>

        <h1 className="mt-2 text-xl font-semibold text-neutral-900">{curso.titulo}</h1>
        <h2 className="text-sm text-neutral-500">{leccion.titulo}</h2>

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
          <button
            onClick={() => alternar(leccion.slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              completada
                ? "bg-neutral-900 text-white"
                : "border border-neutral-300 text-neutral-700 hover:border-neutral-500"
            }`}
          >
            {completada ? "✓ Completado" : "Marcar como completado"}
          </button>

          <div className="flex gap-2">
            {anterior && (
              <Link
                href={`/cursos/${curso.slug}/${anterior.slug}`}
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-500"
              >
                ← Anterior
              </Link>
            )}
            {siguiente && (
              <Link
                href={`/cursos/${curso.slug}/${siguiente.slug}`}
                className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
              >
                Siguiente →
              </Link>
            )}
          </div>
        </div>
      </div>

      <aside className="w-full shrink-0 lg:w-72">
        <h3 className="text-sm font-medium text-neutral-500">Contenido del curso</h3>
        <ol className="mt-2 flex flex-col gap-1">
          {curso.lecciones.map((l, i) => {
            const activa = l.slug === leccion.slug;
            const hecha = completadas.includes(l.slug);
            return (
              <li key={l.slug}>
                <Link
                  href={`/cursos/${curso.slug}/${l.slug}`}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    activa
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                      activa
                        ? "bg-white/20"
                        : hecha
                        ? "bg-neutral-900 text-white"
                        : "border border-neutral-300"
                    }`}
                  >
                    {hecha ? "✓" : i + 1}
                  </span>
                  <span className="line-clamp-2">{l.titulo}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}
