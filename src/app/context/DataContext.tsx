import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { estudiantes as initialEstudiantes, asistenciaData as initialAsistenciaData } from '../data/mockData';
import { migrateLocalStorageData } from '../utils/dataMigration';

export interface Estudiante {
  id: number;
  codigo: string;
  nombre: string;
  programa: string;
  email: string;
  telefono?: string;
  semestre?: number;
}

export interface DocenteCredenciales {
  usuario: string;
  passwordTemporal: string;
  rol: 'DOCENTE';
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  ultimoAcceso?: string;
}

export interface DocentePermisos {
  facultad: string;
  carreras: string[];
}

export interface DocenteMateria {
  codigo: string;
  nombre: string;
  carrera: string;
  creditos: number;
  horario: string;
  estudiantes: number;
}

export interface Docente {
  id: number;
  codigo: string;
  nombre: string;
  email: string;
  telefono?: string;
  oficina?: string;
  facultad: string;
  especialidad?: string;
  credenciales?: DocenteCredenciales;
  permisos?: DocentePermisos;
  materias?: DocenteMateria[];
  estado: 'Activo' | 'Licencia' | 'Inactivo';
}

export interface Calificacion {
  id: number;
  codigo: string;
  estudiante: string;
  materia: string;
  parcial1: number;
  parcial2: number;
  proyecto: number;
  talleres: number;
  final: number;
}

export interface AsistenciaRecord {
  id: number;
  estudiante: string;
  codigo: string;
  materia: string;
  fecha: string;
  estado: 'Presente' | 'Ausente' | 'Tarde';
}

export interface CargaAcademica {
  id: number;
  docente: string;
  materia: string;
  codigo: string;
  grupo: string;
  horario: string;
  aula: string;
  creditos: number;
}

export interface Facultad {
  id: number;
  codigo: string;
  nombre: string;
  decano: string;
  programas: number;
}

export interface Programa {
  id: number;
  codigo: string;
  nombre: string;
  facultad: string;
  creditos: number;
  semestres: number;
}

interface DataContextType {
  estudiantes: Estudiante[];
  docentes: Docente[];
  calificaciones: Calificacion[];
  asistencia: AsistenciaRecord[];
  cargaAcademica: CargaAcademica[];
  facultades: Facultad[];
  programas: Programa[];

  addEstudiante: (estudiante: Omit<Estudiante, 'id'>) => void;
  updateEstudiante: (id: number, estudiante: Partial<Estudiante>) => void;
  deleteEstudiante: (id: number) => void;

  addDocente: (docente: Omit<Docente, 'id'>) => void;
  updateDocente: (id: number, docente: Partial<Docente>) => void;
  deleteDocente: (id: number) => void;

  addCalificacion: (calificacion: Omit<Calificacion, 'id'>) => void;
  updateCalificacion: (id: number, calificacion: Partial<Calificacion>) => void;
  deleteCalificacion: (id: number) => void;
  updateCalificaciones: (calificaciones: Calificacion[]) => void;

  addAsistencia: (asistencia: Omit<AsistenciaRecord, 'id'>) => void;
  addMultipleAsistencia: (asistencias: Omit<AsistenciaRecord, 'id'>[]) => void;
  updateAsistencia: (asistencia: AsistenciaRecord[]) => void;

  addCargaAcademica: (carga: Omit<CargaAcademica, 'id'>) => void;
  updateCargaAcademica: (id: number, carga: Partial<CargaAcademica>) => void;
  deleteCargaAcademica: (id: number) => void;

  addFacultad: (facultad: Omit<Facultad, 'id'>) => void;
  updateFacultad: (id: number, facultad: Partial<Facultad>) => void;
  deleteFacultad: (id: number) => void;

  addPrograma: (programa: Omit<Programa, 'id'>) => void;
  updatePrograma: (id: number, programa: Partial<Programa>) => void;
  deletePrograma: (id: number) => void;

  getEstadisticas: () => {
    totalEstudiantes: number;
    totalDocentes: number;
    totalFacultades: number;
    totalProgramas: number;
    promedioInstitucional: number;
    porcentajeAsistencia: number;
    cursosActivos: number;
  };

  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  estudiantes: 'academicSystem_estudiantes',
  docentes: 'academicSystem_docentes',
  calificaciones: 'academicSystem_calificaciones',
  asistencia: 'academicSystem_asistencia',
  cargaAcademica: 'academicSystem_cargaAcademica',
  facultades: 'academicSystem_facultades',
  programas: 'academicSystem_programas',
};

const initialDocentes: Docente[] = [
  {
    id: 1,
    codigo: 'DOC001',
    nombre: 'Dr. Carlos Ramírez',
    email: 'carlos.ramirez@univ.edu',
    telefono: '+57 3001234567',
    oficina: 'Edificio A - 301',
    facultad: 'Ingeniería',
    especialidad: 'Ingeniería de Sistemas',
    estado: 'Activo',
    credenciales: {
      usuario: 'cramirez',
      passwordTemporal: 'Temp2026*',
      rol: 'DOCENTE',
      estado: 'ACTIVO',
      ultimoAcceso: '2026-05-12 09:30',
    },
    permisos: {
      facultad: 'Ingeniería',
      carreras: ['Ingeniería de Sistemas', 'Ingeniería Industrial'],
    },
    materias: [
      {
        codigo: 'SIS-301',
        nombre: 'Base de Datos',
        carrera: 'Ingeniería de Sistemas',
        creditos: 4,
        horario: 'Lun-Mié 8:00-10:00',
        estudiantes: 35,
      },
      {
        codigo: 'IND-205',
        nombre: 'Sistemas de Información',
        carrera: 'Ingeniería Industrial',
        creditos: 3,
        horario: 'Vie 14:00-17:00',
        estudiantes: 28,
      },
    ],
  },
  {
    id: 2,
    codigo: 'DOC002',
    nombre: 'Dra. Ana Martínez',
    email: 'ana.martinez@univ.edu',
    telefono: '+57 3109876543',
    oficina: 'Edificio A - 305',
    facultad: 'Ingeniería',
    especialidad: 'Ingeniería de Sistemas',
    estado: 'Activo',
    credenciales: {
      usuario: 'amartinez',
      passwordTemporal: 'Ana2026!',
      rol: 'DOCENTE',
      estado: 'ACTIVO',
      ultimoAcceso: '2026-05-11 16:45',
    },
    permisos: {
      facultad: 'Ingeniería',
      carreras: ['Ingeniería de Sistemas'],
    },
    materias: [
      {
        codigo: 'SIS-302',
        nombre: 'Programación Avanzada',
        carrera: 'Ingeniería de Sistemas',
        creditos: 4,
        horario: 'Mar-Jue 10:00-12:00',
        estudiantes: 30,
      },
    ],
  },
  {
    id: 3,
    codigo: 'DOC003',
    nombre: 'Dr. Luis Gómez',
    email: 'luis.gomez@univ.edu',
    telefono: '+57 3157894561',
    oficina: 'Edificio B - 102',
    facultad: 'Ciencias Sociales',
    especialidad: 'Psicología',
    estado: 'Activo',
    credenciales: {
      usuario: 'lgomez',
      passwordTemporal: 'Luis2026#',
      rol: 'DOCENTE',
      estado: 'ACTIVO',
      ultimoAcceso: '2026-05-10 14:20',
    },
    permisos: {
      facultad: 'Ciencias Sociales',
      carreras: ['Psicología'],
    },
    materias: [
      {
        codigo: 'PSI-201',
        nombre: 'Psicología Social',
        carrera: 'Psicología',
        creditos: 3,
        horario: 'Vie 14:00-18:00',
        estudiantes: 42,
      },
    ],
  },
  {
    id: 4,
    codigo: 'DOC004',
    nombre: 'Dra. María Torres',
    email: 'maria.torres@univ.edu',
    telefono: '+57 3204561237',
    oficina: 'Edificio Lab - 3',
    facultad: 'Ciencias de la Salud',
    especialidad: 'Medicina',
    estado: 'Activo',
    credenciales: {
      usuario: 'mtorres',
      passwordTemporal: 'Maria2026$',
      rol: 'DOCENTE',
      estado: 'ACTIVO',
      ultimoAcceso: '2026-05-12 08:15',
    },
    permisos: {
      facultad: 'Ciencias de la Salud',
      carreras: ['Medicina'],
    },
    materias: [
      {
        codigo: 'MED-401',
        nombre: 'Anatomía II',
        carrera: 'Medicina',
        creditos: 5,
        horario: 'Lun-Mié 14:00-16:00',
        estudiantes: 38,
      },
    ],
  },
];

const initialCalificaciones: Calificacion[] = [
  { id: 1, codigo: '2023001', estudiante: 'Juan Pérez', materia: 'Base de Datos', parcial1: 4.2, parcial2: 4.5, proyecto: 4.8, talleres: 4.3, final: 4.4 },
  { id: 2, codigo: '2023002', estudiante: 'María López', materia: 'Base de Datos', parcial1: 4.8, parcial2: 4.6, proyecto: 5.0, talleres: 4.9, final: 4.8 },
  { id: 3, codigo: '2024030', estudiante: 'Ana Martínez', materia: 'Base de Datos', parcial1: 3.9, parcial2: 4.1, proyecto: 4.2, talleres: 4.0, final: 4.1 },
  { id: 4, codigo: '2023045', estudiante: 'Luis Ramírez', materia: 'Base de Datos', parcial1: 3.5, parcial2: 3.8, proyecto: 3.9, talleres: 3.7, final: 3.7 },
  { id: 5, codigo: '2023001', estudiante: 'Juan Pérez', materia: 'Programación Avanzada', parcial1: 4.0, parcial2: 4.3, proyecto: 4.5, talleres: 4.2, final: 4.2 },
  { id: 6, codigo: '2023002', estudiante: 'María López', materia: 'Programación Avanzada', parcial1: 4.7, parcial2: 4.8, proyecto: 4.9, talleres: 4.8, final: 4.8 },
];

const initialCargaAcademica: CargaAcademica[] = [
  { id: 1, docente: 'Dr. Carlos Ramírez', materia: 'Base de Datos', codigo: 'SIS-301', grupo: 'A', horario: 'Lun-Mié 8:00-10:00', aula: 'A-201', creditos: 4 },
  { id: 2, docente: 'Dra. Ana Martínez', materia: 'Programación Avanzada', codigo: 'SIS-302', grupo: 'B', horario: 'Mar-Jue 10:00-12:00', aula: 'A-305', creditos: 4 },
  { id: 3, docente: 'Dr. Luis Gómez', materia: 'Psicología Social', codigo: 'PSI-201', grupo: 'A', horario: 'Vie 14:00-18:00', aula: 'B-102', creditos: 3 },
  { id: 4, docente: 'Dra. María Torres', materia: 'Anatomía II', codigo: 'MED-401', grupo: 'C', horario: 'Lun-Mié 14:00-16:00', aula: 'Lab 3', creditos: 5 },
];

const initialFacultades: Facultad[] = [
  { id: 1, codigo: 'ING', nombre: 'Facultad de Ingeniería', decano: 'Dr. Roberto Silva', programas: 8 },
  { id: 2, codigo: 'CS', nombre: 'Facultad de Ciencias Sociales', decano: 'Dra. Patricia Ruiz', programas: 6 },
  { id: 3, codigo: 'SAL', nombre: 'Facultad de Ciencias de la Salud', decano: 'Dr. Fernando Vargas', programas: 5 },
  { id: 4, codigo: 'ADM', nombre: 'Facultad de Administración', decano: 'Dra. Carmen Díaz', programas: 4 },
];

const initialProgramas: Programa[] = [
  { id: 1, codigo: 'ING-SIS', nombre: 'Ingeniería de Sistemas', facultad: 'Ingeniería', creditos: 160, semestres: 10 },
  { id: 2, codigo: 'ING-IND', nombre: 'Ingeniería Industrial', facultad: 'Ingeniería', creditos: 158, semestres: 10 },
  { id: 3, codigo: 'PSI', nombre: 'Psicología', facultad: 'Ciencias Sociales', creditos: 152, semestres: 10 },
  { id: 4, codigo: 'MED', nombre: 'Medicina', facultad: 'Ciencias de la Salud', creditos: 220, semestres: 12 },
  { id: 5, codigo: 'ADM-EMP', nombre: 'Administración de Empresas', facultad: 'Administración', creditos: 144, semestres: 9 },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.estudiantes);
    return saved ? JSON.parse(saved) : initialEstudiantes;
  });

  const [docentes, setDocentes] = useState<Docente[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.docentes);
    return saved ? JSON.parse(saved) : initialDocentes;
  });

  const [calificaciones, setCalificaciones] = useState<Calificacion[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.calificaciones);
    return saved ? JSON.parse(saved) : initialCalificaciones;
  });

  const [asistencia, setAsistencia] = useState<AsistenciaRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.asistencia);
    return saved ? JSON.parse(saved) : initialAsistenciaData;
  });

  const [cargaAcademica, setCargaAcademica] = useState<CargaAcademica[]>(() => {
    migrateLocalStorageData();
    const saved = localStorage.getItem(STORAGE_KEYS.cargaAcademica);
    return saved ? JSON.parse(saved) : initialCargaAcademica;
  });

  const [facultades, setFacultades] = useState<Facultad[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.facultades);
    return saved ? JSON.parse(saved) : initialFacultades;
  });

  const [programas, setProgramas] = useState<Programa[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.programas);
    return saved ? JSON.parse(saved) : initialProgramas;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.estudiantes, JSON.stringify(estudiantes));
  }, [estudiantes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.docentes, JSON.stringify(docentes));
  }, [docentes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.calificaciones, JSON.stringify(calificaciones));
  }, [calificaciones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.asistencia, JSON.stringify(asistencia));
  }, [asistencia]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cargaAcademica, JSON.stringify(cargaAcademica));
  }, [cargaAcademica]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.facultades, JSON.stringify(facultades));
  }, [facultades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.programas, JSON.stringify(programas));
  }, [programas]);

  const addEstudiante = (estudiante: Omit<Estudiante, 'id'>) => {
    const newId = Math.max(...estudiantes.map(e => e.id), 0) + 1;
    setEstudiantes([...estudiantes, { ...estudiante, id: newId }]);
  };

  const updateEstudiante = (id: number, estudiante: Partial<Estudiante>) => {
    setEstudiantes(estudiantes.map(e => e.id === id ? { ...e, ...estudiante } : e));
  };

  const deleteEstudiante = (id: number) => {
    setEstudiantes(estudiantes.filter(e => e.id !== id));
  };

  const addDocente = (docente: Omit<Docente, 'id'>) => {
    const newId = Math.max(...docentes.map(d => d.id), 0) + 1;
    setDocentes([...docentes, { ...docente, id: newId }]);
  };

  const updateDocente = (id: number, docente: Partial<Docente>) => {
    setDocentes(docentes.map(d => d.id === id ? { ...d, ...docente } : d));
  };

  const deleteDocente = (id: number) => {
    setDocentes(docentes.filter(d => d.id !== id));
  };

  const addCalificacion = (calificacion: Omit<Calificacion, 'id'>) => {
    const newId = Math.max(...calificaciones.map(c => c.id), 0) + 1;
    setCalificaciones([...calificaciones, { ...calificacion, id: newId }]);
  };

  const updateCalificacion = (id: number, calificacion: Partial<Calificacion>) => {
    setCalificaciones(calificaciones.map(c => c.id === id ? { ...c, ...calificacion } : c));
  };

  const deleteCalificacion = (id: number) => {
    setCalificaciones(calificaciones.filter(c => c.id !== id));
  };

  const updateCalificaciones = (newCalificaciones: Calificacion[]) => {
    setCalificaciones(newCalificaciones);
  };

  const addAsistencia = (asist: Omit<AsistenciaRecord, 'id'>) => {
    const newId = Math.max(...asistencia.map(a => a.id), 0) + 1;
    setAsistencia([...asistencia, { ...asist, id: newId }]);
  };

  const addMultipleAsistencia = (asistencias: Omit<AsistenciaRecord, 'id'>[]) => {
    const newRecords = asistencias.map((asist, index) => ({
      ...asist,
      id: Math.max(...asistencia.map(a => a.id), 0) + index + 1
    }));
    setAsistencia([...asistencia, ...newRecords]);
  };

  const updateAsistencia = (newAsistencia: AsistenciaRecord[]) => {
    setAsistencia(newAsistencia);
  };

  const addCargaAcademica = (carga: Omit<CargaAcademica, 'id'>) => {
    const newId = Math.max(...cargaAcademica.map(c => c.id), 0) + 1;
    setCargaAcademica([...cargaAcademica, { ...carga, id: newId }]);
  };

  const updateCargaAcademica = (id: number, carga: Partial<CargaAcademica>) => {
    setCargaAcademica(cargaAcademica.map(c => c.id === id ? { ...c, ...carga } : c));
  };

  const deleteCargaAcademica = (id: number) => {
    setCargaAcademica(cargaAcademica.filter(c => c.id !== id));
  };

  const addFacultad = (facultad: Omit<Facultad, 'id'>) => {
    const newId = Math.max(...facultades.map(f => f.id), 0) + 1;
    setFacultades([...facultades, { ...facultad, id: newId }]);
  };

  const updateFacultad = (id: number, facultad: Partial<Facultad>) => {
    setFacultades(facultades.map(f => f.id === id ? { ...f, ...facultad } : f));
  };

  const deleteFacultad = (id: number) => {
    setFacultades(facultades.filter(f => f.id !== id));
  };

  const addPrograma = (programa: Omit<Programa, 'id'>) => {
    const newId = Math.max(...programas.map(p => p.id), 0) + 1;
    setProgramas([...programas, { ...programa, id: newId }]);
  };

  const updatePrograma = (id: number, programa: Partial<Programa>) => {
    setProgramas(programas.map(p => p.id === id ? { ...p, ...programa } : p));
  };

  const deletePrograma = (id: number) => {
    setProgramas(programas.filter(p => p.id !== id));
  };

  const getEstadisticas = () => {
    const promedioInstitucional = calificaciones.length > 0
      ? calificaciones.reduce((acc, c) => acc + c.final, 0) / calificaciones.length
      : 0;

    const totalAsistencias = asistencia.length;
    const asistenciasPresentes = asistencia.filter(a => a.estado === 'Presente').length;
    const porcentajeAsistencia = totalAsistencias > 0
      ? (asistenciasPresentes / totalAsistencias) * 100
      : 0;

    return {
      totalEstudiantes: estudiantes.length,
      totalDocentes: docentes.length,
      totalFacultades: facultades.length,
      totalProgramas: programas.length,
      promedioInstitucional,
      porcentajeAsistencia,
      cursosActivos: cargaAcademica.length,
    };
  };

  const refreshData = () => {
    setEstudiantes([...estudiantes]);
    setDocentes([...docentes]);
    setCalificaciones([...calificaciones]);
    setAsistencia([...asistencia]);
    setCargaAcademica([...cargaAcademica]);
    setFacultades([...facultades]);
    setProgramas([...programas]);
  };

  const value: DataContextType = {
    estudiantes,
    docentes,
    calificaciones,
    asistencia,
    cargaAcademica,
    facultades,
    programas,
    addEstudiante,
    updateEstudiante,
    deleteEstudiante,
    addDocente,
    updateDocente,
    deleteDocente,
    addCalificacion,
    updateCalificacion,
    deleteCalificacion,
    updateCalificaciones,
    addAsistencia,
    addMultipleAsistencia,
    updateAsistencia,
    addCargaAcademica,
    updateCargaAcademica,
    deleteCargaAcademica,
    addFacultad,
    updateFacultad,
    deleteFacultad,
    addPrograma,
    updatePrograma,
    deletePrograma,
    getEstadisticas,
    refreshData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
