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
    slug: "constelaciones-familiares",
    titulo: "Constelaciones Familiares",
    descripcion: "Aprende paso a paso siguiendo el orden de los capítulos.",
    lecciones: [
      {
        slug: "01-seminario-sobre-el-padre",
        titulo: "Seminario sobre el padre - Constelaciones familiares",
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
