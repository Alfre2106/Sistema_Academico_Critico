export interface Microcurriculo {
  id: number;
  codigo: string;
  nombre: string;
  docente: string;
  descripcion: string;
  objetivoGeneral: string;
  metodologia: string;
  competencias: string[];
  evaluacion: { componente: string; porcentaje: string }[];
}

export const microcurriculos: Microcurriculo[] = [
  {
    id: 1,
    codigo: 'SIS-301',
    nombre: 'Base de Datos',
    docente: 'Dr. Carlos Méndez',
    descripcion: 'Introducción a los conceptos fundamentales de bases de datos relacionales, incluyendo diseño, implementación y administración de sistemas de gestión de bases de datos.',
    objetivoGeneral: 'Capacitar al estudiante en el diseño, implementación y gestión de bases de datos relacionales utilizando SQL y buenas prácticas de modelado.',
    metodologia: 'Clases teórico-prácticas, proyectos en equipo, laboratorios semanales con casos reales.',
    competencias: [
      'Diseño de modelos entidad-relación',
      'Normalización de bases de datos',
      'Consultas SQL avanzadas',
      'Optimización de consultas',
      'Administración de bases de datos'
    ],
    evaluacion: [
      { componente: 'Parciales', porcentaje: '40%' },
      { componente: 'Proyecto Final', porcentaje: '30%' },
      { componente: 'Talleres y Laboratorios', porcentaje: '20%' },
      { componente: 'Participación', porcentaje: '10%' }
    ]
  },
  {
    id: 2,
    codigo: 'SIS-302',
    nombre: 'Programación Avanzada',
    docente: 'Ing. Pedro Rojas',
    descripcion: 'Curso avanzado de programación que cubre patrones de diseño, estructuras de datos complejas, algoritmos avanzados y mejores prácticas de desarrollo de software.',
    objetivoGeneral: 'Desarrollar habilidades avanzadas en programación orientada a objetos, aplicando patrones de diseño y principios SOLID.',
    metodologia: 'Desarrollo de proyectos prácticos, code reviews, pair programming, y sesiones de refactorización.',
    competencias: [
      'Patrones de diseño de software',
      'Programación orientada a objetos avanzada',
      'Estructuras de datos complejas',
      'Algoritmos de ordenamiento y búsqueda',
      'Clean Code y buenas prácticas'
    ],
    evaluacion: [
      { componente: 'Proyectos Prácticos', porcentaje: '50%' },
      { componente: 'Exámenes Teóricos', porcentaje: '25%' },
      { componente: 'Code Reviews', porcentaje: '15%' },
      { componente: 'Participación', porcentaje: '10%' }
    ]
  },
  {
    id: 3,
    codigo: 'PSI-201',
    nombre: 'Psicología Social',
    docente: 'Dra. Ana García',
    descripcion: 'Estudio de cómo los individuos piensan, sienten y se comportan en contextos sociales. Análisis de la influencia social, relaciones interpersonales y dinámica de grupos.',
    objetivoGeneral: 'Comprender los procesos psicológicos que subyacen a la interacción social y su impacto en el comportamiento individual y grupal.',
    metodologia: 'Análisis de casos, discusiones grupales, trabajos de investigación y presentaciones.',
    competencias: [
      'Análisis de comportamiento social',
      'Comprensión de dinámicas grupales',
      'Investigación en psicología social',
      'Aplicación de teorías sociales',
      'Evaluación de fenómenos sociales'
    ],
    evaluacion: [
      { componente: 'Trabajo de Investigación', porcentaje: '35%' },
      { componente: 'Exámenes', porcentaje: '30%' },
      { componente: 'Presentaciones', porcentaje: '20%' },
      { componente: 'Participación', porcentaje: '15%' }
    ]
  },
  {
    id: 4,
    codigo: 'MED-401',
    nombre: 'Anatomía II',
    docente: 'Dra. Laura Sánchez',
    descripcion: 'Estudio detallado de la anatomía humana con enfoque en sistemas cardiovascular, respiratorio y digestivo. Incluye prácticas en laboratorio de anatomía.',
    objetivoGeneral: 'Desarrollar conocimiento profundo de la anatomía humana aplicada a la práctica clínica.',
    metodologia: 'Clases magistrales, prácticas de laboratorio con modelos anatómicos, análisis de casos clínicos.',
    competencias: [
      'Identificación de estructuras anatómicas',
      'Comprensión de relaciones anatómicas',
      'Aplicación clínica del conocimiento anatómico',
      'Interpretación de imágenes médicas',
      'Disección y análisis anatómico'
    ],
    evaluacion: [
      { componente: 'Exámenes Prácticos', porcentaje: '40%' },
      { componente: 'Exámenes Teóricos', porcentaje: '30%' },
      { componente: 'Laboratorios', porcentaje: '20%' },
      { componente: 'Casos Clínicos', porcentaje: '10%' }
    ]
  }
];
