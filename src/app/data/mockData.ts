export const facultades = [
  { id: 1, nombre: 'Ingeniería', programas: 8, docentes: 45, estudiantes: 620 },
  { id: 2, nombre: 'Ciencias Sociales', programas: 5, docentes: 32, estudiantes: 480 },
  { id: 3, nombre: 'Ciencias de la Salud', programas: 6, docentes: 38, estudiantes: 550 },
  { id: 4, nombre: 'Artes y Humanidades', programas: 4, docentes: 28, estudiantes: 380 },
];

export const programas = [
  { id: 1, nombre: 'Ingeniería de Sistemas', codigo: 'ING-SIS', facultad: 'Ingeniería', creditos: 160, semestres: 10 },
  { id: 2, nombre: 'Ingeniería Civil', codigo: 'ING-CIV', facultad: 'Ingeniería', creditos: 165, semestres: 10 },
  { id: 3, nombre: 'Psicología', codigo: 'PSI', facultad: 'Ciencias Sociales', creditos: 152, semestres: 9 },
  { id: 4, nombre: 'Medicina', codigo: 'MED', facultad: 'Ciencias de la Salud', creditos: 180, semestres: 12 },
  { id: 5, nombre: 'Enfermería', codigo: 'ENF', facultad: 'Ciencias de la Salud', creditos: 148, semestres: 8 },
  { id: 6, nombre: 'Diseño Gráfico', codigo: 'DIS-GRA', facultad: 'Artes y Humanidades', creditos: 140, semestres: 8 },
];

export const docentes = [
  { id: 1, nombre: 'Dr. Carlos Méndez', email: 'cmendez@univ.edu', facultad: 'Ingeniería', materias: 3, estado: 'Activo' },
  { id: 2, nombre: 'Dra. Ana García', email: 'agarcia@univ.edu', facultad: 'Ciencias Sociales', materias: 2, estado: 'Activo' },
  { id: 3, nombre: 'Ing. Pedro Rojas', email: 'projas@univ.edu', facultad: 'Ingeniería', materias: 4, estado: 'Activo' },
  { id: 4, nombre: 'Dra. Laura Sánchez', email: 'lsanchez@univ.edu', facultad: 'Ciencias de la Salud', materias: 3, estado: 'Activo' },
  { id: 5, nombre: 'Prof. Miguel Torres', email: 'mtorres@univ.edu', facultad: 'Artes y Humanidades', materias: 2, estado: 'Licencia' },
];

export const estudiantes = [
  { id: 1, codigo: '2023001', nombre: 'Juan Pérez', programa: 'Ingeniería de Sistemas', semestre: 5, promedio: 4.2 },
  { id: 2, codigo: '2023002', nombre: 'María López', programa: 'Psicología', semestre: 3, promedio: 4.5 },
  { id: 3, codigo: '2022015', nombre: 'Carlos Gómez', programa: 'Medicina', semestre: 7, promedio: 4.0 },
  { id: 4, codigo: '2024030', nombre: 'Ana Martínez', programa: 'Ingeniería de Sistemas', semestre: 2, promedio: 4.3 },
  { id: 5, codigo: '2023045', nombre: 'Luis Ramírez', programa: 'Diseño Gráfico', semestre: 4, promedio: 3.8 },
  { id: 6, codigo: '2023067', nombre: 'Sofia Herrera', programa: 'Enfermería', semestre: 6, promedio: 4.4 },
];

export const materias = [
  { id: 1, codigo: 'SIS-301', nombre: 'Base de Datos', creditos: 4, docente: 'Dr. Carlos Méndez', horario: 'Lun-Mie 8:00-10:00' },
  { id: 2, codigo: 'SIS-302', nombre: 'Programación Avanzada', creditos: 4, docente: 'Ing. Pedro Rojas', horario: 'Mar-Jue 10:00-12:00' },
  { id: 3, codigo: 'PSI-201', nombre: 'Psicología Social', creditos: 3, docente: 'Dra. Ana García', horario: 'Lun-Vie 14:00-16:00' },
  { id: 4, codigo: 'MED-401', nombre: 'Anatomía II', creditos: 5, docente: 'Dra. Laura Sánchez', horario: 'Lun-Mie-Vie 7:00-9:00' },
];

export const asistenciaData = [
  { id: 1, estudiante: 'Juan Pérez', codigo: '2023001', materia: 'Base de Datos', fecha: '2026-04-20', estado: 'Presente' },
  { id: 2, estudiante: 'María López', codigo: '2023002', materia: 'Psicología Social', fecha: '2026-04-20', estado: 'Presente' },
  { id: 3, estudiante: 'Carlos Gómez', codigo: '2022015', materia: 'Anatomía II', fecha: '2026-04-20', estado: 'Ausente' },
  { id: 4, estudiante: 'Ana Martínez', codigo: '2024030', materia: 'Base de Datos', fecha: '2026-04-20', estado: 'Tarde' },
  { id: 5, estudiante: 'Juan Pérez', codigo: '2023001', materia: 'Base de Datos', fecha: '2026-04-22', estado: 'Presente' },
];

export const horarioEstudiante = [
  { dia: 'Lunes', hora: '8:00-10:00', materia: 'Base de Datos', salon: 'A-301', docente: 'Dr. Carlos Méndez' },
  { dia: 'Martes', hora: '10:00-12:00', materia: 'Programación Avanzada', salon: 'B-205', docente: 'Ing. Pedro Rojas' },
  { dia: 'Miércoles', hora: '8:00-10:00', materia: 'Base de Datos', salon: 'A-301', docente: 'Dr. Carlos Méndez' },
  { dia: 'Jueves', hora: '10:00-12:00', materia: 'Programación Avanzada', salon: 'B-205', docente: 'Ing. Pedro Rojas' },
  { dia: 'Viernes', hora: '14:00-16:00', materia: 'Ética Profesional', salon: 'C-102', docente: 'Prof. Miguel Torres' },
];

export const statsAdmin = {
  totalEstudiantes: 2030,
  totalDocentes: 143,
  totalProgramas: 23,
  totalFacultades: 4,
  asistenciaPromedio: 87.5,
  cursosActivos: 156,
};

export const statsCoordinador = {
  programasAsignados: 8,
  docentesAsignados: 45,
  estudiantesActivos: 620,
  cursosActivos: 68,
};

export const statsDocente = {
  materiasAsignadas: 3,
  estudiantesTotal: 85,
  proximaClase: 'Base de Datos - Lun 8:00 AM',
  asistenciaPromedio: 92,
};

export const statsEstudiante = {
  materiasInscritas: 5,
  creditosActuales: 18,
  promedioGeneral: 4.2,
  asistenciaPromedio: 95,
};
