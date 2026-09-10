export type Leccion = {
  slug: string;
  titulo: string;
  youtubeId: string;
};

export type Curso = {
  slug: string;
  titulo: string;
  descripcion: string;
  lecciones: Leccion[];
};

export const cursos: Curso[] = [
  {
    slug: "curso-1",
    titulo: "Curso 1",
    descripcion: "Aprende paso a paso siguiendo el orden de los capítulos.",
    lecciones: [
      {
        slug: "01-introduccion",
        titulo: "Capítulo 1: Introducción",
        youtubeId: "LVmkp9gfKK4",
      },
    ],
  },
];

export function getCurso(slug: string) {
  return cursos.find((c) => c.slug === slug);
}

export function getLeccion(cursoSlug: string, leccionSlug: string) {
  const curso = getCurso(cursoSlug);
  if (!curso) return undefined;
  const index = curso.lecciones.findIndex((l) => l.slug === leccionSlug);
  if (index === -1) return undefined;
  return {
    curso,
    leccion: curso.lecciones[index],
    anterior: curso.lecciones[index - 1],
    siguiente: curso.lecciones[index + 1],
  };
}
