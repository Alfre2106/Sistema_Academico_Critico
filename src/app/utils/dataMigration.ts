/**
 * Utilidad de migración de datos
 * Actualiza códigos de materias del formato antiguo (BD-501, PA-301)
 * al nuevo formato basado en carrera (SIS-301, SIS-302)
 */

const CODIGO_MIGRATIONS: Record<string, string> = {
  'BD-501': 'SIS-301',
  'PA-301': 'SIS-302',
  'PS-201': 'PSI-201',
  'AN-402': 'MED-401',
};

export function migrateLocalStorageData(): void {
  // Verificar si localStorage está disponible (navegador)
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }

  try {
    const cargaKey = 'academicSystem_cargaAcademica';
    const savedData = localStorage.getItem(cargaKey);

    if (!savedData) return;

    const cargaAcademica = JSON.parse(savedData);
    let hasChanges = false;

    const migratedData = cargaAcademica.map((item: any) => {
      if (CODIGO_MIGRATIONS[item.codigo]) {
        hasChanges = true;
        return {
          ...item,
          codigo: CODIGO_MIGRATIONS[item.codigo],
        };
      }
      return item;
    });

    if (hasChanges) {
      localStorage.setItem(cargaKey, JSON.stringify(migratedData));
      console.log('✓ Códigos de materias actualizados al nuevo formato');
    }
  } catch (error) {
    console.error('Error al migrar datos:', error);
  }
}

export function clearAcademicData(): void {
  const keys = [
    'academicSystem_estudiantes',
    'academicSystem_docentes',
    'academicSystem_calificaciones',
    'academicSystem_asistencia',
    'academicSystem_cargaAcademica',
    'academicSystem_facultades',
    'academicSystem_programas',
  ];

  keys.forEach(key => localStorage.removeItem(key));
  console.log('✓ Datos académicos reiniciados');
}
